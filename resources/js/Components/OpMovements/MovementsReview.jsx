import React, { useState } from "react";
import { FaCheck, FaTimes, FaEdit, FaTrash, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import axios from "axios";

const MOVEMENT_TYPES = {
  1: { name: 'Income', color: 'text-[var(--color-success)]' },
  2: { name: 'Expense', color: 'text-[var(--color-error)]' },
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

  const validateMovement = (movement, index) => {
    const errors = {};
    
    if (!movement.label_id) {
      errors.label_id = 'Label is required';
    }
    
    if (!movement.amount || movement.amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    
    if (!movement.transaction_date) {
      errors.transaction_date = 'Transaction date is required';
    }
    
    return errors;
  };

  const handleMovementChange = (index, field, value) => {
    const updated = [...movements];
    updated[index] = {
      ...updated[index],
      [field]: ['movement_type_id', 'label_id', 'bank_id'].includes(field) 
        ? parseInt(value) || ""
        : value
    };
    setMovements(updated);

    if (validationErrors[index] && validationErrors[index][field]) {
      const newValidationErrors = { ...validationErrors };
      delete newValidationErrors[index][field];
      if (Object.keys(newValidationErrors[index]).length === 0) {
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
      setErrors({ general: "Please fix the validation errors before saving." });
      return;
    }

    setIsSaving(true);
    setErrors({});
    setValidationErrors({});

    try {
      console.log('Saving movements:', movements);

      const response = await axios.post('/api/bank-statements/save', {
        movements: movements
      });

      console.log('Save response:', response.data);

      if (response.data.success) {
        onSave(response.data.saved_movements);
      } else {
        setErrors({ general: response.data.message || "Error saving movements" });
      }
    } catch (error) {
      console.error("Error saving movements:", error);
      setErrors({ 
        general: error.response?.data?.message || "Error saving movements. Please try again." 
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
  };

  const getBankName = (bankId) => {
    const bank = banks.find(b => b.id === bankId);
    return bank ? bank.name : 'Unknown';
  };

  const getLabelName = (labelId) => {
    const label = userLabels.find(l => l.id === labelId);
    return label ? label.name : 'Select Label';
  };

  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  const totalIncome = movements
    .filter(m => m.movement_type_id === 1)
    .reduce((sum, m) => sum + parseFloat(m.amount || 0), 0);
  
  const totalExpenses = movements
    .filter(m => m.movement_type_id === 2)
    .reduce((sum, m) => sum + parseFloat(m.amount || 0), 0);

  const netAmount = totalIncome - totalExpenses;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--color-neutral-dark-2)] rounded-lg shadow-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-neutral-dark-3)]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-neutral-bright)]">
                Review Extracted Movements
              </h2>
              <p className="text-sm text-[var(--color-neutral-bright)]/70 mt-1">
                {movements.length} movements found. Review and edit before saving.
              </p>
              {hasValidationErrors && (
                <div className="flex items-center gap-2 mt-2">
                  <FaExclamationTriangle className="text-[var(--color-warning)]" />
                  <span className="text-sm text-[var(--color-warning)]">
                    Some movements have validation errors
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onCancel}
              className="cursor-pointer text-[var(--color-neutral-bright)]/60 hover:text-[var(--color-neutral-bright)] transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Summary */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--color-neutral-dark-3)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-neutral-bright)]/70">Income</div>
              <div className="text-lg font-semibold text-[var(--color-success)]">
                € {totalIncome.toFixed(2)}
              </div>
            </div>
            <div className="bg-[var(--color-neutral-dark-3)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-neutral-bright)]/70">Expenses</div>
              <div className="text-lg font-semibold text-[var(--color-error)]">
                € {totalExpenses.toFixed(2)}
              </div>
            </div>
            <div className="bg-[var(--color-neutral-dark-3)] p-3 rounded-lg">
              <div className="text-xs text-[var(--color-neutral-bright)]/70">Net Amount</div>
              <div className={`text-lg font-semibold ${
                netAmount >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
              }`}>
                € {netAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {errors.general && (
            <div className="mb-4 p-3 bg-[var(--color-error)]/20 border border-[var(--color-error)] rounded text-[var(--color-error)] text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {movements.map((movement, index) => {
              const movementErrors = validationErrors[index] || {};
              const hasErrors = Object.keys(movementErrors).length > 0;
              
              return (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border transition-colors ${
                    hasErrors 
                      ? 'bg-[var(--color-error)]/10 border-[var(--color-error)]/30' 
                      : 'bg-[var(--color-neutral-dark-3)] border-transparent hover:border-[var(--color-neutral-dark)]/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-[var(--color-neutral-bright)]">
                        Movement #{index + 1}
                      </h3>
                      {hasErrors && (
                        <FaExclamationTriangle className="text-[var(--color-warning)]" size={14} />
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${
                        movement.movement_type_id === 1 
                          ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                          : 'bg-[var(--color-error)]/20 text-[var(--color-error)]'
                      }`}>
                        {MOVEMENT_TYPES[movement.movement_type_id]?.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeMovement(index)}
                      className="cursor-pointer text-[var(--color-error)] hover:text-[var(--color-error)]/80 p-1"
                      title="Remove movement"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Transaction Date */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                        Transaction Date *
                      </label>
                      <input
                        type="date"
                        value={movement.transaction_date}
                        onChange={(e) => handleMovementChange(index, 'transaction_date', e.target.value)}
                        className={`w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border rounded text-sm ${
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
                        Value Date
                      </label>
                      <input
                        type="date"
                        value={movement.value_date}
                        onChange={(e) => handleMovementChange(index, 'value_date', e.target.value)}
                        className="w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm"
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                        Type *
                      </label>
                      <select
                        value={movement.movement_type_id}
                        onChange={(e) => handleMovementChange(index, 'movement_type_id', e.target.value)}
                        className="cursor-pointer w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm"
                      >
                        <option value={1}>Income</option>
                        <option value={2}>Expense</option>
                      </select>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                        Amount (€) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={movement.amount}
                        onChange={(e) => handleMovementChange(index, 'amount', e.target.value)}
                        className={`w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border rounded text-sm ${
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

                    {/* Label */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                        Label *
                      </label>
                      <select
                        value={movement.label_id || ""}
                        onChange={(e) => handleMovementChange(index, 'label_id', e.target.value)}
                        className={`cursor-pointer w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border rounded text-sm ${
                          movementErrors.label_id 
                            ? 'border-[var(--color-error)]' 
                            : 'border-[var(--color-neutral-dark)]'
                        }`}
                      >
                        <option value="">Select Label</option>
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
                        Balance (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={movement.balance || ""}
                        onChange={(e) => handleMovementChange(index, 'balance', e.target.value)}
                        className="w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm"
                      />
                    </div>

                    {/* Bank (readonly) */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                        Bank
                      </label>
                      <input
                        type="text"
                        value={getBankName(movement.bank_id)}
                        readOnly
                        className="w-full p-2 bg-[var(--color-neutral-dark)]/50 text-[var(--color-neutral-bright)]/70 border border-[var(--color-neutral-dark)] rounded text-sm cursor-not-allowed"
                      />
                    </div>

                    {/* Original Amount Display */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                        Original Amount
                      </label>
                      <div className="p-2 bg-[var(--color-neutral-dark)]/50 border border-[var(--color-neutral-dark)] rounded text-sm">
                        <span className={MOVEMENT_TYPES[movement.movement_type_id]?.color || 'text-[var(--color-neutral-bright)]'}>
                          €{movement.original_amount ? parseFloat(movement.original_amount).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-[var(--color-neutral-bright)]/70 mb-1">
                      Comment
                    </label>
                    <textarea
                      value={movement.comment || ""}
                      onChange={(e) => handleMovementChange(index, 'comment', e.target.value)}
                      placeholder="Optional comment..."
                      rows="2"
                      className="w-full p-2 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark)] rounded text-sm resize-vertical"
                    />
                  </div>

                  {/* Movement preview */}
                  <div className="mt-3 p-2 bg-[var(--color-neutral-dark)] rounded text-xs">
                    <span className="text-[var(--color-neutral-bright)]/70">Preview: </span>
                    <span className={MOVEMENT_TYPES[movement.movement_type_id]?.color}>
                      {MOVEMENT_TYPES[movement.movement_type_id]?.name}
                    </span>
                    <span className="text-[var(--color-neutral-bright)]"> of </span>
                    <span className="font-medium">€{movement.amount || '0'}</span>
                    <span className="text-[var(--color-neutral-bright)]"> → </span>
                    <span className="text-[var(--color-primary)]">
                      {getLabelName(movement.label_id)}
                    </span>
                    {movement.transaction_date && (
                      <>
                        <span className="text-[var(--color-neutral-bright)]"> on </span>
                        <span className="text-[var(--color-neutral-bright)]">
                          {new Date(movement.transaction_date).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {movements.length === 0 && (
            <div className="text-center py-8">
              <FaInfoCircle className="mx-auto h-12 w-12 text-[var(--color-neutral-bright)]/30 mb-4" />
              <p className="text-[var(--color-neutral-bright)]/70">
                No movements to review. All movements have been removed.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--color-neutral-dark-3)] bg-[var(--color-neutral-dark-2)]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-[var(--color-neutral-bright)]/70">
              {movements.length} movements ready to save
              {hasValidationErrors && (
                <span className="text-[var(--color-warning)] ml-2">
                  • Please fix errors first
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={isSaving}
                className="cursor-pointer px-6 py-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-neutral-dark)] disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSaving || movements.length === 0 || hasValidationErrors}
                className="cursor-pointer px-6 py-2 bg-[var(--color-primary)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Save All Movements ({movements.length})
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