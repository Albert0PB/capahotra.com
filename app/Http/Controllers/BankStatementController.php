<?php

namespace App\Http\Controllers;

use App\Models\Movement;
use App\Models\Bank;
use App\Models\Label;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class BankStatementController extends Controller
{
    public function processPdf(Request $request)
    {
        // Validación más permisiva para manejar archivos octet-stream
        $validator = Validator::make($request->all(), [
            'pdf_file' => [
                'required',
                'file',
                'max:15360', // 15MB en KB
                function ($attribute, $value, $fail) {
                    if (!$this->isValidPdfFile($value)) {
                        $fail('The file must be a valid PDF document.');
                    }
                },
            ],
            'bank_id' => 'required|exists:banks,id',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('pdf_file');
            $bank = Bank::findOrFail($request->bank_id);

            Log::info("Processing PDF for bank: " . $bank->name);
            Log::info("File details", [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
                'extension' => $file->getClientOriginalExtension(),
                'error' => $file->getError(),
            ]);

            // Llamar a la API de Python
            $extractedData = $this->callPythonApi($file);

            if (!$extractedData['success']) {
                Log::error('Python API failed', $extractedData);
                return response()->json([
                    'success' => false,
                    'message' => 'Error extracting data from PDF: ' . implode(', ', $extractedData['errors'] ?? ['Unknown error'])
                ], 400);
            }

            // Procesar los movimientos para Laravel
            $processedMovements = $this->processExtractedMovements($extractedData['movements'], $bank);

            Log::info("Successfully processed " . count($processedMovements) . " movements");

            return response()->json([
                'success' => true,
                'movements' => $processedMovements,
                'total_count' => count($processedMovements),
                'raw_count' => $extractedData['total_movements']
            ]);

        } catch (\Exception $e) {
            Log::error("Error processing PDF", [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error processing statement: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validación más permisiva para archivos PDF
     */
    private function isValidPdfFile($file)
    {
        // Verificar que es un archivo válido
        if (!$file || !$file->isValid()) {
            Log::error("File validation failed: not a valid file");
            return false;
        }

        // Verificar extensión
        $extension = strtolower($file->getClientOriginalExtension());
        if ($extension !== 'pdf') {
            Log::error("File validation failed: extension is '{$extension}', not 'pdf'");
            return false;
        }

        // Permitir múltiples tipos MIME incluyendo octet-stream
        $mimeType = $file->getMimeType();
        $allowedMimeTypes = [
            'application/pdf',
            'application/octet-stream', // ← Importante para tu caso
            'application/x-pdf',
            'application/acrobat',
            'application/vnd.pdf',
            'text/pdf',
            'text/x-pdf',
            'application/force-download',
            'application/download',
            'binary/octet-stream',
        ];

        if (!in_array($mimeType, $allowedMimeTypes)) {
            Log::error("File validation failed: mime type '{$mimeType}' not in allowed list");
            return false;
        }

        // Verificar que el archivo tiene contenido
        if ($file->getSize() < 100) {
            Log::error("File validation failed: file too small");
            return false;
        }

        // Verificar contenido del archivo (opcional)
        try {
            $handle = fopen($file->getPathname(), 'rb');
            if ($handle) {
                $header = fread($handle, 50);
                fclose($handle);
                
                Log::info("File header analysis", [
                    'header_hex' => bin2hex(substr($header, 0, 10)),
                    'starts_with_pdf' => substr($header, 0, 4) === '%PDF',
                    'contains_mime' => strpos($header, '--uuid:') !== false || strpos($header, 'Content-Type:') !== false
                ]);
            }
        } catch (\Exception $e) {
            Log::warning("Could not analyze file header: " . $e->getMessage());
        }

        return true; // Si llegamos aquí, lo aceptamos
    }

    /**
     * Call Python API to extract movements
     */
    private function callPythonApi($file)
    {
        $pythonApiUrl = config('app.python_api_url', 'http://127.0.0.1:5000');
        
        try {
            Log::info("Calling Python API at: " . $pythonApiUrl);
            
            $response = Http::timeout(60) // Aumentar timeout
                ->attach('file', file_get_contents($file->getPathname()), $file->getClientOriginalName())
                ->post($pythonApiUrl . '/extract-movements');

            Log::info("Python API response", [
                'status' => $response->status(),
                'successful' => $response->successful(),
                'body_preview' => substr($response->body(), 0, 200)
            ]);

            if (!$response->successful()) {
                throw new \Exception('Python API returned error (HTTP ' . $response->status() . '): ' . $response->body());
            }

            return $response->json();
            
        } catch (\Exception $e) {
            Log::error("Error calling Python API", [
                'message' => $e->getMessage(),
                'url' => $pythonApiUrl
            ]);
            throw new \Exception('Failed to communicate with PDF processing service: ' . $e->getMessage());
        }
    }

    /**
     * Process movements from Python API for Laravel
     */
    private function processExtractedMovements($pythonMovements, $bank)
    {
        $processed = [];
        $userLabels = Auth::user()->labels()->get();
        $currentYear = now()->year;

        foreach ($pythonMovements as $movement) {
            try {
                // Convertir fechas de DD/MM a Y-m-d
                $transactionDate = $this->parseDate($movement['transaction_date'], $currentYear);
                $valueDate = $this->parseDate($movement['value_date'], $currentYear);
                
                // Determinar tipo de movimiento
                $amount = floatval($movement['amount']);
                $movementTypeId = $amount >= 0 ? 1 : 2; // 1 = Income, 2 = Expense
                
                // Balance (puede ser null)
                $balance = isset($movement['balance']) ? floatval($movement['balance']) : 0;
                
                // Limpiar concepto
                $comment = $this->cleanComment($movement['concept'] ?? '');
                
                // Sugerir label
                $suggestedLabelId = $this->suggestLabel($comment, $userLabels);

                $processed[] = [
                    'movement_type_id' => $movementTypeId,
                    'label_id' => $suggestedLabelId,
                    'bank_id' => $bank->id,
                    'transaction_date' => $transactionDate,
                    'value_date' => $valueDate,
                    'amount' => abs($amount),
                    'balance' => $balance,
                    'comment' => $comment,
                    // Campos extra para el frontend
                    'original_amount' => $amount,
                    'suggested_type' => $movementTypeId === 1 ? 'Income' : 'Expense',
                ];
            } catch (\Exception $e) {
                Log::error("Error processing movement: " . $e->getMessage());
                continue;
            }
        }

        return $processed;
    }

    // ... resto de métodos (parseDate, cleanComment, suggestLabel, saveMovements) ...
    
    private function parseDate($dateString, $year)
    {
        try {
            if (preg_match('/^(\d{1,2})\/(\d{1,2})$/', $dateString, $matches)) {
                $day = str_pad($matches[1], 2, '0', STR_PAD_LEFT);
                $month = str_pad($matches[2], 2, '0', STR_PAD_LEFT);
                return "{$year}-{$month}-{$day}";
            }
            return now()->format('Y-m-d');
        } catch (\Exception $e) {
            return now()->format('Y-m-d');
        }
    }

    private function cleanComment($comment)
    {
        $comment = trim(preg_replace('/\s+/', ' ', $comment));
        return substr($comment, 0, 255);
    }

    private function suggestLabel($comment, $userLabels)
    {
        if ($userLabels->isEmpty()) {
            return null;
        }

        $comment = strtolower($comment);
        
        $keywords = [
            'alimentación' => ['carref', 'mercado', 'supermercado'],
            'restaurante' => ['restaurante', 'cafe', 'bar'],
            'transporte' => ['transporte', 'taxi', 'metro'],
            'ocio' => ['espectaculos', 'museos', 'deportes'],
            'servicios' => ['bizum', 'transferencia'],
        ];

        foreach ($userLabels as $label) {
            if (strpos($comment, strtolower($label->name)) !== false) {
                return $label->id;
            }
        }

        foreach ($userLabels as $label) {
            $labelName = strtolower($label->name);
            if (isset($keywords[$labelName])) {
                foreach ($keywords[$labelName] as $keyword) {
                    if (strpos($comment, $keyword) !== false) {
                        return $label->id;
                    }
                }
            }
        }

        return $userLabels->first()->id;
    }

    public function saveMovements(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'movements' => 'required|array|min:1',
            'movements.*.movement_type_id' => 'required|exists:movement_types,id',
            'movements.*.label_id' => 'required|exists:labels,id',
            'movements.*.bank_id' => 'required|exists:banks,id',
            'movements.*.transaction_date' => 'required|date',
            'movements.*.value_date' => 'required|date',
            'movements.*.amount' => 'required|numeric',
            'movements.*.balance' => 'nullable|numeric',
            'movements.*.comment' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $userId = Auth::id();
            $savedMovements = [];
            $errors = [];

            foreach ($request->movements as $index => $movementData) {
                try {
                    $label = Label::where('id', $movementData['label_id'])
                                 ->where('user_id', $userId)
                                 ->first();
                    
                    if (!$label) {
                        $errors[] = "Movement {$index}: Label not found";
                        continue;
                    }

                    $movement = Movement::create([
                        'user_id' => $userId,
                        'movement_type_id' => $movementData['movement_type_id'],
                        'label_id' => $movementData['label_id'],
                        'bank_id' => $movementData['bank_id'],
                        'transaction_date' => $movementData['transaction_date'],
                        'value_date' => $movementData['value_date'],
                        'amount' => $movementData['amount'],
                        'balance' => $movementData['balance'] ?? 0,
                        'comment' => $movementData['comment'] ?? '',
                    ]);

                    $savedMovements[] = $movement->load(['label', 'bank', 'movementType']);
                } catch (\Exception $e) {
                    $errors[] = "Movement {$index}: " . $e->getMessage();
                }
            }

            return response()->json([
                'success' => true,
                'saved_movements' => $savedMovements,
                'saved_count' => count($savedMovements),
                'errors' => $errors
            ]);

        } catch (\Exception $e) {
            Log::error("Error saving movements: " . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error saving movements: ' . $e->getMessage()
            ], 500);
        }
    }
}