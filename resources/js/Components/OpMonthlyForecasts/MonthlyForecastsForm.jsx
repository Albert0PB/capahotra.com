import React, { useState, useEffect } from "react";
import { FaTags, FaCalendarAlt, FaEuroSign, FaComment, FaSave, FaTimes, FaPlus, FaEdit, FaExclamationTriangle, FaChartBar } from "react-icons/fa";
import axios from "axios";

const MONTHS = [
  { value: 0, label: "Enero" },
  { value: 1, label: "Febrero" },
  { value: 2, label: "Marzo" },
  { value: 3, label: "Abril" },
  { value: 4, label: "Mayo" },
  { value: 5, label: "Junio" },
  { value: 6, label: "Julio" },
  { value: 7, label: "Agosto" },
  { value: 8, label: "Septiembre" },
  { value: 9, label: "Octubre" },
  { value: 10, label: "Noviembre" },
  { value: 11, label: "Diciembre" },
];

export default function MonthlyForecastsForm({ 
  onSuccess, 
  editingForecast, 
  userLabels, 
  onCancel 
}) {
  const [formData, setFormData] = useState({
    label_id: "",
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    amount: "",
    comment: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingForecast) {
      setFormData({
        label_id: editingForecast.label_id,
        year: editingForecast.year,
        month: editingForecast.month,
        amount: editingForecast.amount,
        comment: editingForecast.comment || "",
      });
    } else {
      setFormData({
        label_id: "",
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        amount: "",
        comment: "",
      });
    }
    setErrors({});
  }, [editingForecast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'label_id' || name === 'year' || name === 'month' 
        ? parseInt(value) || ""
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (editingForecast) {
        await axios.put(`/api/monthly-forecasts/${editingForecast.id}`, formData);
      } else {
        await axios.post("/api/monthly-forecasts", formData);
        setFormData({
          label_id: "",
          year: new Date().getFullYear(),
          month: new Date().getMonth(),
          amount: "",
          comment: "",
        });
      }
      onSuccess?.();
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error saving forecast", error);
        setErrors({ general: ["Ocurrió un error inesperado. Por favor, inténtalo de nuevo."] });
      }
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!editingForecast;
  const selectedLabel = userLabels.find(label => label.id === formData.label_id);
  const selectedMonth = MONTHS.find(month => month.value === formData.month);

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
              {isEditing ? "Editar Previsión" : "Crear Nueva Previsión"}
            </h2>
            <p className="text-sm text-[var(--color-neutral-bright)]/70 mt-1">
              {isEditing 
                ? "Actualiza tu previsión presupuestaria mensual" 
                : "Establece un objetivo presupuestario mensual para una categoría específica"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6">
        
        {/* Error Display */}
        {(errors.general || Object.keys(errors).length > 0) && (
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
              {Object.entries(errors).filter(([key]) => key !== 'general').map(([key, errorArray]) => 
                Array.isArray(errorArray) && errorArray.map((error, index) => (
                  <li key={`${key}-${index}`}>• {error}</li>
                ))
              )}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Label Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
              <FaTags className="text-[var(--color-primary)]" />
              Categoría *
            </label>
            <select
              name="label_id"
              value={formData.label_id}
              onChange={handleChange}
              className={`cursor-pointer w-full p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                errors.label_id 
                  ? 'border-[var(--color-error)]' 
                  : 'border-[var(--color-neutral-dark-3)]'
              }`}
              required
            >
              <option value="">Selecciona una categoría</option>
              {userLabels.map((label) => (
                <option key={label.id} value={label.id}>
                  {label.name}
                </option>
              ))}
            </select>
            {errors.label_id && (
              <p className="text-[var(--color-error)] text-sm mt-1">{errors.label_id[0]}</p>
            )}
          </div>

          {/* Year and Month */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
                <FaCalendarAlt className="text-[var(--color-secondary)]" />
                Año *
              </label>
              <input
                type="number"
                name="year"
                min="2020"
                max="2030"
                value={formData.year}
                onChange={handleChange}
                className={`w-full p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                  errors.year 
                    ? 'border-[var(--color-error)]' 
                    : 'border-[var(--color-neutral-dark-3)]'
                }`}
                required
              />
              {errors.year && (
                <p className="text-[var(--color-error)] text-sm mt-1">{errors.year[0]}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
                <FaCalendarAlt className="text-[var(--color-secondary)]" />
                Mes *
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className={`cursor-pointer w-full p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                  errors.month 
                    ? 'border-[var(--color-error)]' 
                    : 'border-[var(--color-neutral-dark-3)]'
                }`}
                required
              >
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              {errors.month && (
                <p className="text-[var(--color-error)] text-sm mt-1">{errors.month[0]}</p>
              )}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
              <FaEuroSign className="text-[var(--color-success)]" />
              Cantidad Presupuestada *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60">€</span>
              <input
                type="number"
                step="0.01"
                min="0"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full pl-8 pr-3 py-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                  errors.amount 
                    ? 'border-[var(--color-error)]' 
                    : 'border-[var(--color-neutral-dark-3)]'
                }`}
                required
              />
            </div>
            {errors.amount && (
              <p className="text-[var(--color-error)] text-sm mt-1">{errors.amount[0]}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
              <FaComment className="text-[var(--color-warning)]" />
              Notas (Opcional)
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="3"
              placeholder="Añade cualquier nota sobre esta previsión..."
              className={`w-full p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-vertical transition-colors ${
                errors.comment 
                  ? 'border-[var(--color-error)]' 
                  : 'border-[var(--color-neutral-dark-3)]'
              }`}
              maxLength={255}
            />
            <div className="mt-1 flex justify-between items-center">
              {errors.comment && (
                <p className="text-[var(--color-error)] text-sm">{errors.comment[0]}</p>
              )}
              <div className="text-xs text-[var(--color-neutral-bright)]/50 ml-auto">
                {formData.comment.length}/255
              </div>
            </div>
          </div>

          {/* Preview Card */}
          {(selectedLabel && formData.amount && selectedMonth) && (
            <div className="p-4 bg-[var(--color-neutral-dark-3)] rounded-lg border border-[var(--color-neutral-dark)] border-dashed">
              <p className="text-xs text-[var(--color-neutral-bright)]/70 mb-2 uppercase tracking-wider">Vista Previa</p>
              <div className="flex items-center gap-3">
                <FaChartBar className="text-[var(--color-primary)]" />
                <div>
                  <div className="flex items-center gap-2 text-[var(--color-neutral-bright)] font-medium">
                    <span>{selectedLabel.name}</span>
                    <span className="text-[var(--color-neutral-bright)]/60">•</span>
                    <span>{selectedMonth.label} {formData.year}</span>
                  </div>
                  <div className="text-[var(--color-success)] font-bold">
                    €{parseFloat(formData.amount || 0).toFixed(2)}
                  </div>
                  {formData.comment && (
                    <div className="text-sm text-[var(--color-neutral-bright)]/70 italic mt-1">
                      "{formData.comment}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
              disabled={loading || !formData.label_id || !formData.amount}
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
                  {isEditing ? "Actualizar Previsión" : "Crear Previsión"}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-6 p-4 bg-[var(--color-neutral-dark-3)] rounded-lg">
          <h4 className="text-sm font-medium text-[var(--color-neutral-bright)] mb-2 flex items-center gap-2">
            <FaChartBar className="text-[var(--color-primary)]" />
            Consejos de Previsión
          </h4>
          <ul className="text-xs text-[var(--color-neutral-bright)]/70 space-y-1">
            <li>• Sé realista con las cantidades presupuestadas basándote en datos históricos</li>
            <li>• Añade notas para recordar consideraciones específicas de ese mes</li>
            <li>• Revisa y ajusta las previsiones regularmente según el gasto real</li>
            <li>• Considera las variaciones estacionales en tu planificación presupuestaria</li>
          </ul>
        </div>
      </div>
    </div>
  );
}