import React, { useState, useEffect } from "react";
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
        {label ? "Edit Label" : "Create New Label"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
          Label name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 sm:p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          placeholder="Enter label name..."
          required
        />
        {errors.name && (
          <p className="text-[var(--color-error)] text-sm mt-1">{errors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-neutral-dark)] transition-colors duration-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? "Saving..." : label ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}