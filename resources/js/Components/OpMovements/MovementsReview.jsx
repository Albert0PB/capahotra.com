import React, { useState } from "react";
import { FaCheck, FaTimes, FaEdit, FaTrash, FaExclamationTriangle, FaInfoCircle, FaMoneyBillWave, FaUniversity, FaEye, FaEyeSlash, FaChartLine } from "react-icons/fa";
import axios from "axios";

const MOVEMENT_TYPES = {
  1: { name: 'Ingreso', color: 'text-[var(--color-success)]', bgColor: 'bg-[var(--color-success)]/20' },
  2: { name: 'Gasto', color: 'text-[var(--color-error)]', bgColor: 'bg-[var(--color-error)]/20' },
};

export default function MovementsReview({ 
  extractedMovements, 
  userLabels, 
  banks,
  onSave, 
  onCancel 
}) {
  const [movements, setMovements] = useState(extractedMovements);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [expandedMovements, setExpandedMovements] = useState(new Set());
  const [showAdvancedView, setShowAdvancedView] = useState(false);

  const validateMovement = (movement, index) => {
    const errors = {};
    
    if (!movement.label_id) {
      errors.label_id = 'La etiqueta es obligatoria';
    }
    
    if (!movement.amount || movement.amount <= 0) {
      errors.amount = 'La cantidad debe ser mayor que 0';
    }
    
    if (!movement.transaction_date) {
      errors.transaction_date = 'La fecha de transacción es obligatoria';
    }

    // Validate balance is required for bank movements but not for cash
    if (movement.bank_id && (!movement.balance || movement.balance === "")) {
      errors.balance = 'El saldo es obligatorio para movimientos bancarios';
    }

    // Validate value_date is not before transaction_date
    if (movement.value_date && movement.transaction_date && movement.value_date < movement.transaction_date) {
      errors.value_date = 'La fecha valor no puede ser anterior a la fecha de transacción';
    }
    
    return errors;
  };

  const handleMovementChange = (index, field, value) => {
    const updated = [...movements];
    updated[index] = {
      ...updated[index],
      [field]: ['movement_type_id', 'label_id', 'bank_id'].includes(field) 
        ? (value === "" ? "" : parseInt(value) || "")
        : value
    };

    // Clear balance when bank is changed to cash (empty)
    if (field === 'bank_id' && value === "") {
      updated[index].balance = "";
    }

    // Auto-update value_date when transaction_date changes
    if (field === 'transaction_date' && value) {
      updated[index].value_date = value;
    }

    setMovements(updated);

    // Clear validation errors for this field
    if (validationErrors[index] && validationErrors[index][field]) {
      const newValidationErrors = { ...validationErrors };
      delete newValidationErrors[index][field];
      if (Object.keys(newValidationErrors[index] || {}).length === 0) {
        delete newValidationErrors[index];
      }
      setValidationErrors(newValidationErrors);
    }
  };

  const handleSaveAll = async () => {
    const newValidationErrors = {};
    let hasErrors = false;

    movements.forEach((movement, index) => {
      const errors = validateMovement(movement, index);
      if (Object.keys(errors).length > 0) {
        newValidationErrors[index] = errors;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setValidationErrors(newValidationErrors);
      setErrors({ general: "Por favor, corrige los errores de validación antes de guardar." });
      return;
    }

    setIsSaving(true);
    setErrors({});
    setValidationErrors({});

    try {
      console.log('Saving movements:', movements);

      // Process movements to handle bank_id and balance correctly
      const processedMovements = movements.map(movement => ({
        ...movement,
        bank_id: movement.bank_id === "" ? null : movement.bank_id,
        balance: (movement.bank_id === "" || movement.balance === "") ? null : movement.balance
      }));

      const response = await axios.post('/api/bank-statements/save', {
        movements: processedMovements
      });

      console.log('Save response:', response.data);

      if (response.data.success) {
        onSave(response.data.saved_movements);
      } else {
        setErrors({ general: response.data.message || "Error al guardar los movimientos" });
      }
    } catch (error) {
      console.error("Error saving movements:", error);
      setErrors({ 
        general: error.response?.data?.message || "Error al guardar los movimientos. Por favor, inténtalo de nuevo." 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const removeMovement = (index) => {
    const updated = movements.filter((_, i) => i !== index);
    setMovements(updated);
    
    if (validationErrors[index]) {
      const newValidationErrors = { ...validationErrors };
      delete newValidationErrors[index];
      
      const reindexedErrors = {};
      Object.keys(newValidationErrors).forEach(key => {
        const oldIndex = parseInt(key);
        if (oldIndex > index) {
          reindexedErrors[oldIndex - 1] = newValidationErrors[key];
        } else {
          reindexedErrors[key] = newValidationErrors[key];
        }
      });
      
      setValidationErrors(reindexedErrors);
    }

    const newExpanded = new Set();
    expandedMovements.forEach(idx => {
      if (idx < index) {
        newExpanded.add(idx);
      } else if (idx > index) {
        newExpanded.add(idx - 1);
      }
    });
    setExpandedMovements(newExpanded);
  };

  const toggleMovementExpansion = (index) => {
    const newExpanded = new Set(expandedMovements);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedMovements(newExpanded);
  };

  const getBankName = (bankId) => {
    if (!bankId) return 'Efectivo';
    const bank = banks.find(b => b.id === bankId);
    return bank ? bank.name : 'Desconocido';
  };

  const getLabelName = (labelId) => {
    const label = userLabels.find(l => l.id === labelId);
    return label ? label.name : 'Seleccionar Etiqueta';
  };

  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  const totalIncome = movements
    .filter(m => m.movement_type_id === 1)
    .reduce((sum, m) => sum + parseFloat(m.amount || 0), 0);
  
  const totalExpenses = movements
    .filter(m => m.movement_type_id === 2)
    .reduce((sum, m) => sum + parseFloat(m.amount || 0), 0);

  const totalCorrections = movements
    .filter(m => m.movement_type_id === 3)
    .reduce((sum, m) => sum + parseFloat(m.amount || 0), 0);

  const netAmount = totalIncome - totalExpenses;

  const cashMovements = movements.filter(m => !m.bank_id || m.bank_id === "");
  const bankMovements = movements.filter(m => m.bank_id && m.bank_id !== "");

return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--color-neutral-dark-2)] rounded-lg shadow-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-neutral-dark-3)]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-neutral-bright)]">
                Revisar Movimientos Extraídos
              </h2>
              <p className="text-sm text-[var(--color-neutral-bright)]/70 mt-1">
                {movements.length} movimientos encontrados. Revisa y edita antes de guardar.
              </p>
              {hasValidationErrors && (
                <div className="flex items-center gap-2 mt-2">
                  <FaExclamationTriangle className="text-[var(--color-warning)]" />
                  <span className="text-sm text-[var(--color-warning)]">
                    Algunos movimientos tienen errores de validación
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAdvancedView(!showAdvancedView)}
                className={`cursor-pointer p-2 rounded-lg transition-colors ${
                  showAdvancedView 
                    ? 'bg-[var(--color-primary)] text-[var(--color-neutral-bright)]'
                    : 'bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-neutral-bright)]'
                }`}
                title={showAdvancedView ? "Vista simple" : "Vista avanzada"}
              >
                {showAdvancedView ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
              <button
                onClick={onCancel}
                className="cursor-pointer text-[var(--color-neutral-bright)]/60 hover:text-[var(--color-neutral-bright)] transition-colors p-2"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-[var(--color-neutral-dark-3)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-neutral-bright)]/70 uppercase tracking-wider">Total</div>
              <div className="text-lg font-semibold text-[var(--color-primary)]">
                {movements.length} movimientos
              </div>
            </div>
            <div className="bg-[var(--color-neutral-dark-3)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-neutral-bright)]/70 uppercase tracking-wider">Ingresos</div>
              <div className="text-lg font-semibold text-[var(--color-success)]">
                €{totalIncome.toFixed(2)}
              </div>
            </div>
            <div className="bg-[var(--color-neutral-dark-3)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-neutral-bright)]/70 uppercase tracking-wider">Gastos</div>
              <div className="text-lg font-semibold text-[var(--color-error)]">
                €{totalExpenses.toFixed(2)}
              </div>
            </div>
            <div className="bg-[var(--color-neutral-dark-3)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-neutral-bright)]/70 uppercase tracking-wider">Neto</div>
              <div className={`text-lg font-semibold ${
                netAmount >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
              }`}>
                €{netAmount.toFixed(2)}
              </div>
            </div>
            <div className="bg-[var(--color-neutral-dark-3)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-neutral-bright)]/70 uppercase tracking-wider">Efectivo</div>
              <div className="text-lg font-semibold text-[var(--color-warning)]">
                {cashMovements.length} mov.
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {errors.general && (
            <div className="mb-4 p-3 bg-[var(--color-error)]/20 border border-[var(--color-error)] rounded text-[var(--color-error)] text-sm flex items-center gap-2">
              <FaExclamationTriangle />
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {movements.map((movement, index) => {
              const movementErrors = validationErrors[index] || {};
              const hasErrors = Object.keys(movementErrors).length > 0;
              const isCashMovement = !movement.bank_id || movement.bank_id === "";
              const isExpanded = expandedMovements.has(index);
              
              return (
                <div 
                  key={index} 
                  className={`rounded-lg border transition-all duration-200 ${
                    hasErrors 
                      ? 'bg-[var(--color-error)]/10 border-[var(--color-error)]/30' 
                      : 'bg-[var(--color-neutral-dark-3)] border-transparent hover:border-[var(--color-neutral-dark)]/50'
                  }`}
                >
                  {/* Movement Header */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleMovementExpansion(index)}
                          className="cursor-pointer p-1 rounded hover:bg-[var(--color-neutral-dark-2)] transition-colors"
                          title={isExpanded ? "Contraer" : "Expandir"}
                        >
                          {isExpanded ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                        </button>
                        
                        <h3 className="text-sm font-medium text-[var(--color-neutral-bright)]">
                          Movimiento #{index + 1}
                        </h3>
                        
                        {hasErrors && (
                          <FaExclamationTriangle className="text-[var(--color-warning)]" size={14} />
                        )}
                        
                        <span className={`text-xs px-2 py-1 rounded ${
                          movement.movement_type_id === 1 
                            ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                            : movement.movement_type_id === 2
                            ? 'bg-[var(--color-error)]/20 text-[var(--color-error)]'
                            : 'bg-[var(--color-warning)]/20 text-[var(--color-warning)]'
                        }`}>
                          {MOVEMENT_TYPES[movement.movement_type_id]?.name}
                        </span>
                        
                        {isCashMovement && (
                          <span className="text-xs px-2 py-1 rounded bg-[var(--color-success)]/20 text-[var(--color-success)] flex items-center gap-1">
                            <FaMoneyBillWave size={10} />
                            Efectivo
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => removeMovement(index)}
                        className="cursor-pointer text-[var(--color-error)] hover:text-[var(--color-error)]/80 p-1 rounded hover:bg-[var(--color-neutral-dark-2)] transition-colors"
                        title="Eliminar movimiento"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    {/* Quick Preview */}
                    <div className="bg-[var(--color-neutral-dark)] p-3 rounded text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={MOVEMENT_TYPES[movement.movement_type_id]?.color}>
                            {MOVEMENT_TYPES[movement.movement_type_id]?.name}
                          </span>
                          <span className="text-[var(--color-neutral-bright)]">de</span>
                          <span className="font-medium text-[var(--color-primary)]">
                            €{movement.amount || '0'}
                          </span>
                          <span className="text-[var(--color-neutral-bright)]">→</span>
                          <span className="text-[var(--color-secondary)]">
                            {getLabelName(movement.label_id)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-[var(--color-neutral-bright)]/70">
                          {isCashMovement ? (
                            <>
                              <FaMoneyBillWave className="text-[var(--color-success)]" />
                              <span>Efectivo</span>
                            </>
                          ) : (
                            <>
                              <FaUniversity className="text-[var(--color-warning)]" />
                              <span>{getBankName(movement.bank_id)}</span>
                            </>
                          )}
                          {movement.transaction_date && (
                            <>
                              <span>•</span>
                              <span>{new Date(movement.transaction_date).toLocaleDateString('es-ES')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {(isExpanded || showAdvancedView) && (
                    <div className="px-4 pb-4 border-t border-[var(--color-neutral-dark)]">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        
                        {/* Transaction Date */}
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                            Fecha de Transacción *
                          </label>
                          <input
                            type="date"
                            value={movement.transaction_date}
                            onChange={(e) => handleMovementChange(index, 'transaction_date', e.target.value)}
                            className={`w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                              movementErrors.transaction_date 
                                ? 'border-[var(--color-error)]' 
                                : 'border-[var(--color-neutral-dark)]'
                            }`}
                          />
                          {movementErrors.transaction_date && (
                            <p className="text-xs text-[var(--color-error)] mt-1">
                              {movementErrors.transaction_date}
                            </p>
                          )}
                        </div>

                        {/* Value Date */}
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                            Fecha Valor
                          </label>
                          <input
                            type="date"
                            value={movement.value_date}
                            onChange={(e) => handleMovementChange(index, 'value_date', e.target.value)}
                            className={`w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                              movementErrors.value_date 
                                ? 'border-[var(--color-error)]' 
                                : 'border-[var(--color-neutral-dark)]'
                            }`}
                          />
                          {movementErrors.value_date && (
                            <p className="text-xs text-[var(--color-error)] mt-1">
                              {movementErrors.value_date}
                            </p>
                          )}
                        </div>

                        {/* Type */}
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                            Tipo *
                          </label>
                          <select
                            value={movement.movement_type_id}
                            onChange={(e) => handleMovementChange(index, 'movement_type_id', e.target.value)}
                            className="cursor-pointer w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                          >
                            <option value={1}>Ingreso</option>
                            <option value={2}>Gasto</option>
                          </select>
                        </div>

                        {/* Amount */}
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                            Cantidad (€) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={movement.amount}
                            onChange={(e) => handleMovementChange(index, 'amount', e.target.value)}
                            className={`w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                              movementErrors.amount 
                                ? 'border-[var(--color-error)]' 
                                : 'border-[var(--color-neutral-dark)]'
                            }`}
                          />
                          {movementErrors.amount && (
                            <p className="text-xs text-[var(--color-error)] mt-1">
                              {movementErrors.amount}
                            </p>
                          )}
                        </div>

                        {/* Bank */}
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                            Banco (Opcional)
                          </label>
                          <select
                            value={movement.bank_id || ""}
                            onChange={(e) => handleMovementChange(index, 'bank_id', e.target.value)}
                            className="cursor-pointer w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                          >
                            <option value="">💰 Efectivo</option>
                            {banks.map((bank) => (
                              <option key={bank.id} value={bank.id}>
                                🏦 {bank.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Label */}
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                            Etiqueta *
                          </label>
                          <select
                            value={movement.label_id || ""}
                            onChange={(e) => handleMovementChange(index, 'label_id', e.target.value)}
                            className={`cursor-pointer w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                              movementErrors.label_id 
                                ? 'border-[var(--color-error)]' 
                                : 'border-[var(--color-neutral-dark)]'
                            }`}
                          >
                            <option value="">Seleccionar Etiqueta</option>
                            {userLabels.map((label) => (
                              <option key={label.id} value={label.id}>
                                {label.name}
                              </option>
                            ))}
                          </select>
                          {movementErrors.label_id && (
                            <p className="text-xs text-[var(--color-error)] mt-1">
                              {movementErrors.label_id}
                            </p>
                          )}
                        </div>

                        {/* Balance */}
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                            Saldo (€) {isCashMovement ? "(N/A para efectivo)" : "*"}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={movement.balance || ""}
                            onChange={(e) => handleMovementChange(index, 'balance', e.target.value)}
                            placeholder={isCashMovement ? "No aplica" : "0.00"}
                            disabled={isCashMovement}
                            className={`w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                              isCashMovement ? 'opacity-50 cursor-not-allowed' : ''
                            } ${
                              movementErrors.balance 
                                ? 'border-[var(--color-error)]' 
                                : 'border-[var(--color-neutral-dark)]'
                            }`}
                          />
                          {movementErrors.balance && (
                            <p className="text-xs text-[var(--color-error)] mt-1">
                              {movementErrors.balance}
                            </p>
                          )}
                        </div>

                        {/* Original Amount Display */}
                        <div>
                          <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                            Cantidad Original
                          </label>
                          <div className="p-2 bg-[var(--color-neutral-dark)]/50 border border-[var(--color-neutral-dark)] rounded text-sm">
                            <span className={MOVEMENT_TYPES[movement.movement_type_id]?.color || 'text-[var(--color-neutral-bright)]'}>
                              €{movement.original_amount ? parseFloat(movement.original_amount).toFixed(2) : '0.00'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Comment */}
                      <div className="mt-4">
                        <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                          Comentario
                        </label>
                        <textarea
                          value={movement.comment || ""}
                          onChange={(e) => handleMovementChange(index, 'comment', e.target.value)}
                          placeholder="Comentario opcional..."
                          rows="2"
                          className="w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {movements.length === 0 && (
            <div className="text-center py-8">
              <FaInfoCircle className="mx-auto h-12 w-12 text-[var(--color-neutral-bright)]/30 mb-4" />
              <p className="text-[var(--color-neutral-bright)]/70">
                No hay movimientos para revisar. Todos los movimientos han sido eliminados.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--color-neutral-dark-3)] bg-[var(--color-neutral-dark-2)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-[var(--color-neutral-bright)]/70">
              <div className="flex items-center gap-2">
                <FaChartLine className="text-[var(--color-primary)]" />
                <span>{movements.length} movimientos listos para guardar</span>
              </div>
              {cashMovements.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-[var(--color-success)]" />
                  <span>{cashMovements.length} en efectivo</span>
                </div>
              )}
              {bankMovements.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaUniversity className="text-[var(--color-warning)]" />
                  <span>{bankMovements.length} bancarios</span>
                </div>
              )}
              {hasValidationErrors && (
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle className="text-[var(--color-warning)]" />
                  <span className="text-[var(--color-warning)]">
                    Por favor, corrige los errores primero
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={isSaving}
                className="cursor-pointer px-6 py-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-neutral-dark)] disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <FaTimes size={14} />
                Cancelar
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSaving || movements.length === 0 || hasValidationErrors}
                className="cursor-pointer px-6 py-2 bg-[var(--color-primary)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaCheck size={14} />
                    Guardar Todos los Movimientos ({movements.length})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}