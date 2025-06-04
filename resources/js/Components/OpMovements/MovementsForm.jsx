import React, { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import axios from "axios";

const MOVEMENT_TYPES = [
  { id: 1, code: 'I', name: 'Income' },
  { id: 2, code: 'E', name: 'Expense' },
  { id: 3, code: 'C', name: 'Correction' },
];

export default function MovementsForm({ 
  onSuccess, 
  editingMovement, 
  userLabels, 
  banks,
  onCancel,
  onOpenPdfUpload // Nueva prop para abrir el modal de PDF
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
        setErrors({ general: "Error saving movement. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-neutral-dark-2)] p-4 sm:p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-neutral-bright)]">
        {editingMovement ? "Edit Movement" : "Create New Movement"}
      </h2>

      {errors.general && (
        <div className="p-3 bg-[var(--color-error)]/20 border border-[var(--color-error)] rounded text-[var(--color-error)] text-sm">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
            Type *
          </label>
          <select
            name="movement_type_id"
            value={formData.movement_type_id}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            required
          >
            <option value="">Select movement type</option>
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

        <div>
          <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
            Label *
          </label>
          <select
            name="label_id"
            value={formData.label_id}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            required
          >
            <option value="">Select a label</option>
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

        <div>
          <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
            Bank *
          </label>
          <select
            name="bank_id"
            value={formData.bank_id}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            required
          >
            <option value="">Select a bank</option>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
              Transaction Date *
            </label>
            <input
              type="date"
              name="transaction_date"
              value={formData.transaction_date}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
            />
            {errors.transaction_date && (
              <p className="text-[var(--color-error)] text-sm mt-1">{errors.transaction_date[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
              Value Date *
            </label>
            <input
              type="date"
              name="value_date"
              value={formData.value_date}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
            />
            {errors.value_date && (
              <p className="text-[var(--color-error)] text-sm mt-1">{errors.value_date[0]}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
              Amount (€) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full p-2 sm:p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
            />
            {errors.amount && (
              <p className="text-[var(--color-error)] text-sm mt-1">{errors.amount[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
              Balance (€) *
            </label>
            <input
              type="number"
              step="0.01"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full p-2 sm:p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              required
            />
            {errors.balance && (
              <p className="text-[var(--color-error)] text-sm mt-1">{errors.balance[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
            Comment
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows="3"
            placeholder="Optional comment about this movement..."
            className="w-full p-2 sm:p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-vertical"
          />
          {errors.comment && (
            <p className="text-[var(--color-error)] text-sm mt-1">{errors.comment[0]}</p>
          )}
        </div>

        {/* Botones del formulario */}
        <div className="flex flex-col gap-3 pt-2">
          {/* Botón principal del formulario */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-[var(--color-primary)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Saving..." : editingMovement ? "Update Movement" : "Create Movement"}
          </button>

          {/* Divisor */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--color-neutral-dark-3)]"></div>
            <span className="text-xs text-[var(--color-neutral-bright)]/50">OR</span>
            <div className="flex-1 h-px bg-[var(--color-neutral-dark-3)]"></div>
          </div>

          {/* Botón de importar PDF */}
          <button
            type="button"
            onClick={onOpenPdfUpload}
            className="w-full px-4 py-2 bg-[var(--color-secondary)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-primary)] transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FaUpload size={14} />
            Import from PDF
          </button>

          {/* Botón de cancelar solo si está editando */}
          {editingMovement && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full px-4 py-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-neutral-dark)] transition-colors duration-200"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}