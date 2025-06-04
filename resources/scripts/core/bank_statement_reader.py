import re
import json
from typing import Dict, List, Optional
from tabula import read_pdf
from datetime import datetime

class BBVAExtractorException(Exception):
    """Excepción personalizada para errores del extractor"""
    pass

class BBVAStatementExtractor:
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.column_renames = {
            "Unnamed: 0": "Fecha operacion",
            "Unnamed: 1": "Fecha valor", 
            "Unnamed: 2": "Concepto",
            "Unnamed: 3": "Importe",
            "Unnamed: 4": "Saldo"
        }
    
    def extract_movements(self) -> Dict:
        """Extrae y procesa los movimientos del PDF"""
        try:
            # Leer todas las tablas del PDF
            df_list = read_pdf(self.pdf_path, pages="all", multiple_tables=True)
            
            if len(df_list) < 2:
                raise BBVAExtractorException("No se encontraron suficientes tablas en el PDF")
            
            # La tabla de movimientos suele estar en el índice 1
            movements_df = df_list[1].copy()
            movements_df.rename(columns=self.column_renames, inplace=True)
            
            # Convertir a JSON y procesar
            raw_movements = json.loads(movements_df.to_json(orient="records"))
            processed_movements = self._process_movements(raw_movements)
            
            return {
                "success": True,
                "movements": processed_movements,
                "total_movements": len(processed_movements),
                "errors": []
            }
            
        except Exception as e:
            return {
                "success": False,
                "movements": [],
                "total_movements": 0,
                "errors": [str(e)]
            }
    
    def _process_movements(self, raw_movements: List[Dict]) -> List[Dict]:
        """Procesa y limpia los movimientos extraídos"""
        processed = []
        
        for movement in raw_movements:
            # Filtrar registros vacíos o inválidos
            if not self._is_valid_movement(movement):
                continue
                
            # Ignorar el saldo anterior
            if self._is_balance_record(movement):
                continue
            
            try:
                processed_movement = self._clean_movement(movement)
                if processed_movement:
                    processed.append(processed_movement)
            except Exception as e:
                # Log del error pero continúa procesando
                print(f"Error procesando movimiento: {e}")
                continue
        
        return processed
    
    def _is_valid_movement(self, movement: Dict) -> bool:
        """Verifica si un registro es un movimiento válido"""
        # Debe tener al menos fecha de operación y concepto
        fecha_op = movement.get("Fecha operacion")
        concepto = movement.get("Concepto")
        
        return (fecha_op is not None and 
                concepto is not None and 
                str(fecha_op).strip() != "" and 
                str(concepto).strip() != "")
    
    def _is_balance_record(self, movement: Dict) -> bool:
        """Identifica si es el registro de saldo anterior"""
        concepto = movement.get("Concepto", "")
        return "SALDO ANTERIOR" in str(concepto).upper()
    
    def _clean_movement(self, movement: Dict) -> Optional[Dict]:
        """Limpia y formatea un movimiento individual"""
        try:
            # Limpiar fechas
            fecha_operacion = self._clean_date(movement.get("Fecha operacion"))
            fecha_valor = self._clean_date(movement.get("Fecha valor"))
            
            # Si las fechas no son válidas, saltamos este registro
            if not fecha_operacion or not fecha_valor:
                return None
            
            # Limpiar concepto
            concepto = self._clean_concept(movement.get("Concepto", ""))
            
            # Limpiar importe
            importe = self._clean_amount(movement.get("Importe"))
            
            # Limpiar saldo (opcional)
            saldo = self._clean_amount(movement.get("Saldo"))
            
            return {
                "transaction_date": fecha_operacion,  # DD/MM format
                "value_date": fecha_valor,           # DD/MM format
                "concept": concepto,
                "amount": importe,
                "balance": saldo,
                "movement_type": "I" if importe and float(importe) > 0 else "E"  # Ingreso/Egreso
            }
            
        except Exception as e:
            print(f"Error limpiando movimiento: {e}")
            return None
    
    def _clean_date(self, date_str) -> Optional[str]:
        """Limpia y valida formato de fecha DD/MM"""
        if not date_str:
            return None
            
        date_str = str(date_str).strip()
        
        # Patrón para DD/MM
        pattern = r'^(\d{1,2})/(\d{1,2})$'
        match = re.match(pattern, date_str)
        
        if not match:
            return None
            
        day, month = match.groups()
        day, month = int(day), int(month)
        
        # Validar rangos
        if day == 0 or day > 31 or month == 0 or month > 12:
            return None
            
        # Formatear con ceros a la izquierda
        return f"{day:02d}/{month:02d}"
    
    def _clean_concept(self, concept_str) -> str:
        """Limpia el concepto eliminando caracteres especiales"""
        if not concept_str:
            return ""
            
        # Reemplazar saltos de línea por espacios
        concept = str(concept_str).replace('\r', ' ').replace('\n', ' ')
        
        # Limpiar espacios múltiples
        concept = re.sub(r'\s+', ' ', concept).strip()
        
        return concept
    
    def _clean_amount(self, amount_str) -> Optional[str]:
        """Limpia el formato de importe español (1.234,56)"""
        if not amount_str:
            return None
            
        amount_str = str(amount_str).strip()
        
        # Remover espacios
        amount_str = amount_str.replace(' ', '')
        
        # Patrón para importes españoles: 1.234,56 o -1.234,56 o 1234,56
        pattern = r'^(-?)(\d{1,3}(?:\.\d{3})*),(\d{2})$'
        match = re.match(pattern, amount_str)
        
        if match:
            sign, integer_part, decimal_part = match.groups()
            # Remover puntos de millares y usar punto decimal
            clean_integer = integer_part.replace('.', '')
            clean_amount = f"{sign}{clean_integer}.{decimal_part}"
            return clean_amount
            
        return None

def main():
    """Función principal para testing"""
    extractor = BBVAStatementExtractor("/var/www/pruebas-capahotra.com/recursos-diseño/extracto.pdf")
    result = extractor.extract_movements()
    
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
