import React, { useState, useEffect } from "react";
import { FaUpload, FaTags, FaCalendarAlt, FaEuroSign, FaComment, FaSave, FaTimes, FaPlus, FaEdit, FaExclamationTriangle, FaExchangeAlt, FaUniversity, FaWallet } from "react-icons/fa";
import axios from "axios";

const MOVEMENT_TYPES = [
  { id: 1, code: 'I', name: 'Ingreso', icon: FaPlus, color: 'text-[var(--color-success)]' },
  { id: 2, code: 'E', name: 'Gasto', icon: FaTimes, color: 'text-[var(--color-error)]' },
  { id: 3, code: 'C', name: 'Corrección', icon: FaEdit, color: 'text-[var(--color-warning)]' },
];

export default function MovementsForm({ 
  onSuccess, 
  editingMovement, 
  userLabels, 
  banks,
  onCancel,
  onOpenPdfUpload
}) {
  const [formData, setFormData] = useState({
    movement_type_id: "",
    label_id: "",
    bank_id: "",
    transaction_date: new Date().toISOString().split('T')[0],
    value_date: new Date().toISOString().split('T')[0],
    amount: "",
    comment: "",
    balance: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingMovement) {
      setFormData({
        movement_type_id: editingMovement.movement_type_id,
        label_id: editingMovement.label_id,
        bank_id: editingMovement.bank_id,
        transaction_date: editingMovement.transaction_date,
        value_date: editingMovement.value_date,
        amount: Math.abs(editingMovement.amount),
        comment: editingMovement.comment || "",
        balance: editingMovement.balance
      });
    } else {
      setFormData({
        movement_type_id: "",
        label_id: "",
        bank_id: banks.length > 0 ? banks[0].id : "",
        transaction_date: new Date().toISOString().split('T')[0],
        value_date: new Date().toISOString().split('T')[0],
        amount: "",
        comment: "",
        balance: ""
      });
    }
    setErrors({});
  }, [editingMovement, banks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['movement_type_id', 'label_id', 'bank_id'].includes(name) 
        ? parseInt(value) || ""
        : value
    }));

    // Auto-set value_date when transaction_date changes
    if (name === 'transaction_date') {
      setFormData(prev => ({
        ...prev,
        value_date: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingMovement) {
        await axios.put(`/api/movements/${editingMovement.id}`, submitData);
      } else {
        await axios.post("/api/movements", submitData);
        setFormData({
          movement_type_id: "",
          label_id: "",
          bank_id: banks.length > 0 ? banks[0].id : "",
          transaction_date: new Date().toISOString().split('T')[0],
          value_date: new Date().toISOString().split('T')[0],
          amount: "",
          comment: "",
          balance: ""
        });
      }
      onSuccess?.();
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error saving movement", error);
        setErrors({ general: ["Ocurrió un error inesperado. Por favor, inténtalo de nuevo."] });
      }
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!editingMovement;
  const selectedType = MOVEMENT_TYPES.find(type => type.id === formData.movement_type_id);
  const selectedLabel = userLabels.find(label => label.id === formData.label_id);
  const selectedBank = banks.find(bank => bank.id === formData.bank_id);

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
              {isEditing ? "Editar Movimiento" : "Crear Nuevo Movimiento"}
            </h2>
            <p className="text-sm text-[var(--color-neutral-bright)]/70 mt-1">
              {isEditing 
                ? "Actualiza los detalles del movimiento" 
                : "Registra una nueva transacción financiera"
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
          
          {/* Movement Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
              <FaExchangeAlt className="text-[var(--color-primary)]" />
              Tipo de Movimiento *
            </label>
            <select
              name="movement_type_id"
              value={formData.movement_type_id}
              onChange={handleChange}
              className={`cursor-pointer w-full p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                errors.movement_type_id 
                  ? 'border-[var(--color-error)]' 
                  : 'border-[var(--color-neutral-dark-3)]'
              }`}
              required
            >
              <option value="">Selecciona el tipo de movimiento</option>
              {MOVEMENT_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.movement_type_id && (
              <p className="text-[var(--color-error)] text-sm mt-1">{errors.movement_type_id[0]}</p>
            )}
          </div>

          {/* Label */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
              <FaTags className="text-[var(--color-secondary)]" />
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

          {/* Bank */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
              <FaUniversity className="text-[var(--color-warning)]" />
              Banco *
            </label>
            <select
              name="bank_id"
              value={formData.bank_id}
              onChange={handleChange}
              className={`cursor-pointer w-full p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                errors.bank_id 
                  ? 'border-[var(--color-error)]' 
                  : 'border-[var(--color-neutral-dark-3)]'
              }`}
              required
            >
              <option value="">Selecciona un banco</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
            {errors.bank_id && (
              <p className="text-[var(--color-error)] text-sm mt-1">{errors.bank_id[0]}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
                <FaCalendarAlt className="text-[var(--color-primary)]" />
                Fecha de Transacción *
              </label>
              <input
                type="date"
                name="transaction_date"
                value={formData.transaction_date}
                onChange={handleChange}
                className={`w-full p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                  errors.transaction_date 
                    ? 'border-[var(--color-error)]' 
                    : 'border-[var(--color-neutral-dark-3)]'
                }`}
                required
              />
              {errors.transaction_date && (
                <p className="text-[var(--color-error)] text-sm mt-1">{errors.transaction_date[0]}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
                <FaCalendarAlt className="text-[var(--color-secondary)]" />
                Fecha Valor *
              </label>
              <input
                type="date"
                name="value_date"
                value={formData.value_date}
                onChange={handleChange}
                className={`w-full p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                  errors.value_date 
                    ? 'border-[var(--color-error)]' 
                    : 'border-[var(--color-neutral-dark-3)]'
                }`}
                required
              />
              {errors.value_date && (
                <p className="text-[var(--color-error)] text-sm mt-1">{errors.value_date[0]}</p>
              )}
            </div>
          </div>

          {/* Amount and Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
                <FaEuroSign className="text-[var(--color-success)]" />
                Cantidad *
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

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
                <FaWallet className="text-[var(--color-warning)]" />
                Saldo *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60">€</span>
                <input
                  type="number"
                  step="0.01"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full pl-8 pr-3 py-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                    errors.balance 
                      ? 'border-[var(--color-error)]' 
                      : 'border-[var(--color-neutral-dark-3)]'
                  }`}
                  required
                />
              </div>
              {errors.balance && (
                <p className="text-[var(--color-error)] text-sm mt-1">{errors.balance[0]}</p>
              )}
            </div>
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
              placeholder="Añade cualquier nota sobre este movimiento..."
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
          {(selectedType && selectedLabel && formData.amount) && (
            <div className="p-4 bg-[var(--color-neutral-dark-3)] rounded-lg border border-[var(--color-neutral-dark)] border-dashed">
              <p className="text-xs text-[var(--color-neutral-bright)]/70 mb-2 uppercase tracking-wider">Vista Previa</p>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${selectedType.color} bg-current/20`}>
                  <selectedType.icon className={selectedType.color} />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[var(--color-neutral-bright)] font-medium">
                    <span className={selectedType.color}>{selectedType.name}</span>
                    <span className="text-[var(--color-neutral-bright)]/60">•</span>
                    <span>{selectedLabel.name}</span>
                  </div>
                  <div className={`font-bold ${selectedType.color}`}>
                    €{parseFloat(formData.amount || 0).toFixed(2)}
                  </div>
                  {selectedBank && (
                    <div className="text-sm text-[var(--color-neutral-bright)]/70">
                      {selectedBank.name} • {formData.transaction_date}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-[var(--color-neutral-dark-3)]">
            <button
              type="submit"
              disabled={loading || !formData.movement_type_id || !formData.label_id || !formData.amount}
              className="cursor-pointer flex items-center justify-center gap-2 w-full px-4 py-3 bg-[var(--color-primary)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditing ? "Actualizando..." : "Creando..."}
                </>
              ) : (
                <>
                  <FaSave size={14} />
                  {isEditing ? "Actualizar Movimiento" : "Crear Movimiento"}
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--color-neutral-dark-3)]"></div>
              <span className="text-xs text-[var(--color-neutral-bright)]/50">O</span>
              <div className="flex-1 h-px bg-[var(--color-neutral-dark-3)]"></div>
            </div>

            <button
              type="button"
              onClick={onOpenPdfUpload}
              className="cursor-pointer flex items-center justify-center gap-2 w-full px-4 py-3 bg-[var(--color-secondary)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-primary)] transition-colors duration-200 font-medium"
            >
              <FaUpload size={14} />
              Importar desde PDF
            </button>

            {isEditing && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="cursor-pointer flex items-center justify-center gap-2 w-full px-4 py-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-neutral-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <FaTimes size={14} />
                Cancelar Edición
              </button>
            )}
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-6 p-4 bg-[var(--color-neutral-dark-3)] rounded-lg">
          <h4 className="text-sm font-medium text-[var(--color-neutral-bright)] mb-2 flex items-center gap-2">
            <FaExchangeAlt className="text-[var(--color-primary)]" />
            Consejos de Movimientos
          </h4>
          <ul className="text-xs text-[var(--color-neutral-bright)]/70 space-y-1">
            <li>• Usa Ingreso para dinero que entra en tu cuenta</li>
            <li>• Usa Gasto para dinero que sale de tu cuenta</li>
            <li>• El tipo Corrección es para corregir errores o ajustes</li>
            <li>• El saldo debe reflejar el saldo de tu cuenta después de esta transacción</li>
            <li>• La fecha valor es cuando la transacción realmente afecta tu saldo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}