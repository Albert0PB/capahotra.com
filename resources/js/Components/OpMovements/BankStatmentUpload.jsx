import React, { useState } from "react";
import { FaUpload, FaSpinner, FaFileAlt, FaTimes, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

export default function BankStatementUpload({ 
  banks, 
  userLabels, 
  onMovementsExtracted, 
  onClose 
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBank, setSelectedBank] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.type !== 'application/pdf') {
        setError("Please select a PDF file");
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setError("File size must be less than 10MB");
        return;
      }
      
      setSelectedFile(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError("Please select a PDF file");
      return;
    }
    
    if (!selectedBank) {
      setError("Please select a bank");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('pdf_file', selectedFile);
      formData.append('bank_id', selectedBank);

      console.log('Uploading file:', selectedFile.name, 'to bank:', selectedBank);

      const response = await axios.post('/api/bank-statements/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds timeout
      });

      console.log('Response:', response.data);

      if (response.data.success) {
        onMovementsExtracted(response.data.movements);
      } else {
        setError(response.data.message || "Error processing PDF");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      
      if (error.code === 'ECONNABORTED') {
        setError("Processing timeout. Please try again or use a smaller PDF.");
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors?.pdf_file) {
          setError(errors.pdf_file[0]);
        } else {
          setError("Invalid file. Please check that you've selected a valid PDF.");
        }
      } else if (error.response?.status === 419) {
        setError("Session expired. Please refresh the page and try again.");
      } else {
        setError(
          error.response?.data?.message || 
          "Error processing the PDF. Please verify the file is a valid BBVA statement and try again."
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setSelectedBank("");
    setError("");
    const fileInput = document.getElementById('pdf-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--color-neutral-dark-2)] rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[var(--color-neutral-bright)]">
              Upload Bank Statement
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--color-neutral-bright)]/60 hover:text-[var(--color-neutral-bright)] transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
                Bank *
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                required
                disabled={isProcessing}
              >
                <option value="">Select your bank</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
                PDF Statement *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="sr-only"
                  id="pdf-upload"
                  required
                  disabled={isProcessing}
                />
                <label
                  htmlFor="pdf-upload"
                  className={`flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                    isProcessing 
                      ? 'border-[var(--color-neutral-dark-3)] cursor-not-allowed' 
                      : 'border-[var(--color-neutral-dark-3)] hover:border-[var(--color-primary)]'
                  }`}
                >
                  <div className="text-center w-full">
                    {selectedFile ? (
                      <>
                        <FaFileAlt className="mx-auto h-8 w-8 text-[var(--color-primary)] mb-2" />
                        <p className="text-sm text-[var(--color-neutral-bright)] font-medium">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-[var(--color-neutral-bright)]/60 mt-1">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <FaUpload className="mx-auto h-8 w-8 text-[var(--color-neutral-bright)]/60 mb-2" />
                        <p className="text-sm text-[var(--color-neutral-bright)]">
                          Click to upload PDF
                        </p>
                        <p className="text-xs text-[var(--color-neutral-bright)]/60 mt-1">
                          Max 10MB • BBVA statements only
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-[var(--color-error)]/20 border border-[var(--color-error)] rounded text-[var(--color-error)] text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-neutral-dark)] transition-colors disabled:opacity-50"
                disabled={isProcessing}
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isProcessing || !selectedFile || !selectedBank}
                className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Process PDF"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-[var(--color-neutral-dark-3)] rounded-lg">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
              <div className="text-xs text-[var(--color-neutral-bright)]/70">
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-[var(--color-success)]" />
                  <span className="font-medium">Powered by Advanced Python Processing</span>
                </div>
                <ul className="space-y-1 mb-3">
                  <li>• Supports BBVA PDF bank statements</li>
                  <li>• Handles password-protected PDFs</li>
                  <li>• Automatic movement categorization</li>
                  <li>• Text-based and table extraction</li>
                </ul>
                <p className="font-medium mb-1 text-[var(--color-warning)]">Tips:</p>
                <ul className="space-y-1">
                  <li>• Download PDF directly from BBVA online banking</li>
                  <li>• Ensure PDF contains transaction details</li>
                  <li>• Processing may take 10-30 seconds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}