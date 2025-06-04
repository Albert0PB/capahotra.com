import sys
import os
import tempfile
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'core'))

# Importar tu extractor
from bank_statement_reader import BBVAStatementExtractor

app = Flask(__name__)

# Configuración
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.errorhandler(RequestEntityTooLarge)
def handle_file_too_large(e):
    return jsonify({
        'success': False,
        'error': 'El archivo es demasiado grande. Máximo 16MB permitido.'
    }), 413

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que la API funciona"""
    return jsonify({'status': 'OK', 'service': 'BBVA PDF Extractor'})

@app.route('/extract-movements', methods=['POST'])
def extract_movements():
    """Endpoint principal para extraer movimientos de PDFs"""
    
    # Verificar que se envió un archivo
    if 'file' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No se encontró ningún archivo en la petición'
        }), 400
    
    file = request.files['file']
    
    # Verificar que el archivo tiene nombre
    if file.filename == '':
        return jsonify({
            'success': False,
            'error': 'No se seleccionó ningún archivo'
        }), 400
    
    # Verificar extensión
    if not allowed_file(file.filename):
        return jsonify({
            'success': False,
            'error': 'Tipo de archivo no permitido. Solo se aceptan archivos PDF.'
        }), 400
    
    try:
        # Guardar archivo temporalmente
        filename = secure_filename(file.filename)
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            temp_path = tmp_file.name
        
        try:
            # Procesar archivo
            extractor = BBVAStatementExtractor(temp_path)
            result = extractor.extract_movements()
            
            # Agregar información adicional para Laravel
            result['bank_id'] = 1  # ID de BBVA en tu tabla banks
            result['filename'] = filename
            
            return jsonify(result)
            
        finally:
            # Limpiar archivo temporal
            if os.path.exists(temp_path):
                os.unlink(temp_path)
                
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error procesando archivo: {str(e)}'
        }), 500

@app.route('/extract-movements-debug', methods=['POST'])
def extract_movements_debug():
    """Endpoint de debug que devuelve también datos raw"""
    
    if 'file' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No se encontró ningún archivo en la petición'
        }), 400
    
    file = request.files['file']
    
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({
            'success': False,
            'error': 'Archivo no válido'
        }), 400
    
    try:
        filename = secure_filename(file.filename)
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            temp_path = tmp_file.name
        
        try:
            # Importar tabula para debug
            from tabula import read_pdf
            import json
            
            # Datos raw para debug
            df_list = read_pdf(temp_path, pages="all", multiple_tables=True)
            raw_data = []
            for df in df_list:
                raw_data.append(json.loads(df.to_json(orient="records")))
            
            # Datos procesados
            extractor = BBVAStatementExtractor(temp_path)
            processed_result = extractor.extract_movements()
            
            return jsonify({
                'success': True,
                'filename': filename,
                'raw_data': raw_data,
                'processed_data': processed_result
            })
            
        finally:
            if os.path.exists(temp_path):
                os.unlink(temp_path)
                
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error en debug: {str(e)}'
        }), 500

if __name__ == '__main__':
    # Para desarrollo
    app.run(host='127.0.0.1', port=5000, debug=True)
    
    # Para producción usarías algo como:
    # gunicorn -w 4 -b 127.0.0.1:5000 app:app
