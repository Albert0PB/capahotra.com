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
      className="bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {label ? "Edit Label" : "Create New Label"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Label name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full p-2 border border-gray-300 rounded"
          required
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : label ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
