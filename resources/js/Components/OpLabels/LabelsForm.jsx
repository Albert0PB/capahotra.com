import React, { useState, useEffect } from "react";
import { FaTags, FaSave, FaTimes, FaPlus, FaEdit, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";

export default function LabelsForm({ label, onSuccess, onCancel }) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (label) {
      setName(label.name);
    } else {
      setName("");
    }
    setErrors({});
  }, [label]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (label) {
        await axios.put(`/api/labels/${label.id}`, { name });
      } else {
        await axios.post("/api/labels", { name });
      }

      onSuccess?.();
      if (!label) setName(""); // Clear form only for new labels
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error while saving the label", error);
        setErrors({ general: ["Ocurrió un error inesperado. Por favor, inténtalo de nuevo."] });
      }
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!label;

  return (
    <div className="bg-[var(--color-neutral-dark-2)] rounded-lg shadow-lg overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[var(--color-neutral-dark-3)] bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10">
        <div className="flex items-center gap-3">
          {isEditing ? (
            <FaEdit className="text-[var(--color-warning)] text-xl" />
          ) : (
            <FaPlus className="text-[var(--color-success)] text-xl" />
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-neutral-bright)]">
              {isEditing ? "Editar Etiqueta" : "Crear Nueva Etiqueta"}
            </h2>
            <p className="text-sm text-[var(--color-neutral-bright)]/70 mt-1">
              {isEditing 
                ? "Actualiza la información de la etiqueta" 
                : "Añade una nueva categoría para organizar tus transacciones"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6">
        
        {/* Error Display */}
        {(errors.general || errors.name) && (
          <div className="mb-4 p-3 bg-[var(--color-error)]/20 border border-[var(--color-error)]/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <FaExclamationTriangle className="text-[var(--color-error)] flex-shrink-0" />
              <span className="text-[var(--color-error)] text-sm font-medium">
                Por favor, corrige los siguientes errores:
              </span>
            </div>
            <ul className="text-sm text-[var(--color-error)] ml-6">
              {errors.general && errors.general.map((error, index) => (
                <li key={`general-${index}`}>• {error}</li>
              ))}
              {errors.name && errors.name.map((error, index) => (
                <li key={`name-${index}`}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Label Name Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
              <FaTags className="text-[var(--color-primary)]" />
              Nombre de la Etiqueta *
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                  errors.name 
                    ? 'border-[var(--color-error)]' 
                    : 'border-[var(--color-neutral-dark-3)]'
                }`}
                placeholder="Introduce un nombre descriptivo..."
                required
                disabled={loading}
                maxLength={50}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-[var(--color-neutral-bright)]/50">
                {name.length}/50
              </div>
            </div>
            
            {/* Helper Text */}
            <div className="mt-2">
              <p className="text-xs text-[var(--color-neutral-bright)]/60">
                Elige un nombre claro y descriptivo para fácil identificación (ej. "Alimentación", "Entretenimiento", "Servicios")
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[var(--color-neutral-dark-3)]">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-neutral-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <FaTimes size={14} />
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="cursor-pointer flex items-center justify-center gap-2 px-6 py-2 bg-[var(--color-primary)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditing ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <FaSave size={14} />
                  {isEditing ? "Actualizar Etiqueta" : "Crear Etiqueta"}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-6 p-4 bg-[var(--color-neutral-dark-3)] rounded-lg">
          <h4 className="text-sm font-medium text-[var(--color-neutral-bright)] mb-2 flex items-center gap-2">
            <FaTags className="text-[var(--color-primary)]" />
            Consejos para Etiquetas
          </h4>
          <ul className="text-xs text-[var(--color-neutral-bright)]/70 space-y-1">
            <li>• Usa nombres específicos como "Comidas en Restaurantes" en lugar de solo "Comida"</li>
            <li>• Mantén los nombres consistentes para un mejor seguimiento</li>
            <li>• Evita caracteres especiales que puedan causar problemas</li>
            <li>• Considera crear categorías tanto para ingresos como para gastos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}