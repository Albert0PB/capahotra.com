import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function MonthlyForecastsTable({
  forecasts,
  loading,
  userLabels,
  onSuccess,
  onDelete,
}) {
  const [labelNames, setLabelNames] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editLabelId, setEditLabelId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editMonth, setEditMonth] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchLabelNames = async () => {
      const names = { ...labelNames };

      for (const f of forecasts) {
        const id = f.label_id;
        if (!names[id]) {
          try {
            const res = await fetch(`/api/labels/${id}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            names[id] = data.name || "Unknown";
          } catch {
            names[id] = "Unknown";
          }
        }
      }

      if (isMounted) setLabelNames(names);
    };

    if (forecasts.length) {
      fetchLabelNames();
    }

    return () => {
      isMounted = false;
    };
  }, [forecasts]);

  const startEditing = (forecast) => {
    setEditingId(forecast.id);
    setEditLabelId(forecast.label_id);
    setEditAmount(forecast.amount);
    setEditComment(forecast.comment || "");
    setEditYear(forecast.year);
    setEditMonth(forecast.month);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditLabelId(null);
    setEditAmount("");
    setEditComment("");
    setEditYear("");
    setEditMonth("");
  };

  const confirmEdit = async () => {
    const yearNum = parseInt(editYear, 10);
    const monthNum = parseInt(editMonth, 10);
    if (isNaN(yearNum) || yearNum < 1970) {
      alert("Year must be a number and at least 1970");
      return;
    }
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      alert("Month must be a number between 1 and 12");
      return;
    }
    if (!editLabelId) {
      alert("Please select a label");
      return;
    }

    try {
      await axios.put(`/api/monthly-forecasts/${editingId}`, {
        label_id: editLabelId,
        amount: parseFloat(editAmount),
        comment: editComment,
        year: yearNum,
        month: monthNum,
      })
      .then(() => {
        router.visit(window.location.pathname, { preserveScroll: true });
      });
      setEditingId(null);
      onSuccess?.();
    } catch (error) {
      console.error("Error updating forecast", error);
    }
  };

  const handleDelete = async (forecast) => {
    if (!window.confirm(`Delete forecast #${forecast.id}?`)) return;

    try {
      await axios.delete(`/api/monthly-forecasts/${forecast.id}`);
      onDelete?.(forecast);
    } catch (error) {
      console.error("Error deleting forecast", error);
    }
  };

  if (loading) return <p>Loading forecasts...</p>;

  if (!forecasts.length) {
    return <p className="text-gray-500">No forecasts available.</p>;
  }

  return (
    <div className="overflow-x-auto rounded">
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Label</th>
            <th className="px-4 py-2">Year</th>
            <th className="px-4 py-2">Month</th>
            <th className="px-4 py-2">Amount (€)</th>
            <th className="px-4 py-2">Comment</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map((f) => (
            <tr
              key={f.id}
              className="border-b hover:bg-[var(--color-neutral-dark-3)]"
            >
              <td className="px-4 py-2">{f.id}</td>
              <td className="px-4 py-2">
                {editingId === f.id ? (
                  <select
                    value={editLabelId}
                    onChange={(e) => setEditLabelId(Number(e.target.value))}
                    className="w-full p-1 border border-gray-300 rounded"
                  >
                    <option value="">-- Select label --</option>
                    {userLabels.map((label) => (
                      <option key={label.id} value={label.id}>
                        {label.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  labelNames[f.label_id] || "Loading..."
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === f.id ? (
                  <input
                    type="number"
                    min="1970"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                ) : (
                  f.year
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === f.id ? (
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={editMonth}
                    onChange={(e) => setEditMonth(e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                ) : (
                  f.month
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === f.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                ) : (
                  f.amount
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === f.id ? (
                  <input
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                ) : (
                  f.comment
                )}
              </td>
              <td className="px-4 py-2 text-center">
                {editingId === f.id ? (
                  <>
                    <button
                      onClick={confirmEdit}
                      className="text-green-600 hover:text-green-800 mr-2 cursor-pointer"
                      title="Confirm"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-gray-600 hover:text-gray-800 cursor-pointer"
                      title="Cancel"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(f)}
                      className="text-blue-600 hover:text-blue-800 mr-3 cursor-pointer"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(f)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                      title="Delete"
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
