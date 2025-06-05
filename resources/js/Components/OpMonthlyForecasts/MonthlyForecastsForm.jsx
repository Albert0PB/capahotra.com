import React, { useState, useEffect } from "react";
import axios from "axios";

const MONTHS = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
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
        setErrors({ general: "Error saving forecast. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--color-neutral-dark-2)] p-4 sm:p-6 rounded-lg shadow-lg space-y-4"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-neutral-bright)]">
        {editingForecast ? "Edit Forecast" : "Create New Forecast"}
      </h2>

      {errors.general && (
        <div className="p-3 bg-[var(--color-error)]/20 border border-[var(--color-error)] rounded text-[var(--color-error)] text-sm">
          {errors.general}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
          Label *
        </label>
        <select
          name="label_id"
          value={formData.label_id}
          onChange={handleChange}
          className="cursor-pointer w-full p-2 sm:p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
            Year *
          </label>
          <input
            type="number"
            name="year"
            min="2020"
            max="2030"
            value={formData.year}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            required
          />
          {errors.year && (
            <p className="text-[var(--color-error)] text-sm mt-1">{errors.year[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
            Month *
          </label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="cursor-pointer w-full p-2 sm:p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
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
          Comment
        </label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          rows="3"
          placeholder="Optional comment about this forecast..."
          className="w-full p-2 sm:p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-vertical"
        />
        {errors.comment && (
          <p className="text-[var(--color-error)] text-sm mt-1">{errors.comment[0]}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer px-4 py-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-neutral-dark)] transition-colors duration-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer px-4 py-2 bg-[var(--color-primary)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? "Saving..." : editingForecast ? "Update Forecast" : "Create Forecast"}
        </button>
      </div>
    </form>
  );
}