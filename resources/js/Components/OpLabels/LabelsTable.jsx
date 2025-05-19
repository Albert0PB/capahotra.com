import React, { useState } from "react";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";

export default function LabelsTable({ labels, onDelete, onSuccess }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const handleEditClick = (label) => {
    setEditingId(label.id);
    setEditName(label.name);
  };

  const handleConfirmEdit = async () => {
    try {
      await axios.put(`/api/labels/${editingId}`, { name: editName });
      setEditingId(null);
      onSuccess?.();
    } catch (error) {
      console.error("Error updating label", error);
    }
  };

    return (
    <div className="overflow-x-auto rounded">
      <table className="min-w-full table-auto border-[var(--color-neutral-bright)]">
        <thead className="bg-[var(--color-neutral-dark)] text-left">
          <tr>
            <th className="px-4 py-2 text-[var(--color-neutral-bright)]">ID</th>
            <th className="px-4 py-2 text-[var(--color-neutral-bright)]">Name</th>
            <th className="px-4 py-2 text-[var(--color-neutral-bright)]">Created</th>
            <th className="px-4 py-2 text-center text-[var(--color-neutral-bright)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label) => (
            <tr key={label.id} className="border-b border-[var(--color-neutral-bright)] hover:bg-[var(--color-neutral-dark-3)]">
              <td className="px-4 py-2">{label.id}</td>
              <td className="px-4 py-2">
                {editingId === label.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                ) : (
                  <span className="font-medium">{label.name}</span>
                )}
              </td>
              <td className="px-4 py-2 text-sm text-gray-500">
                {new Date(label.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-center">
                {editingId === label.id ? (
                  <button
                    onClick={handleConfirmEdit}
                    className="text-green-600 hover:text-green-800 cursor-pointer"
                    title="Confirm"
                  >
                    <FaCheck />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(label)}
                      className="text-blue-600 hover:text-blue-800 mr-3 cursor-pointer"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(label)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                      title="Erase"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

