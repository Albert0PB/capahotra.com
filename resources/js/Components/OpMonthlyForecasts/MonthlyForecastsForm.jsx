import React, { useState } from "react";
import axios from "axios";

export default function MonthlyForecastsForm({ onForecastCreated }) {
    const [formData, setFormData] = useState({
        label_id: "",
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        amount: "",
        comment: "",
    });

    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await axios.post("/api/monthly-forecasts", formData);
            setFormData({
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                amount: "",
                comment: "",
            });
            onForecastCreated();
        } catch (err) {
            setError("Error saving forecast.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}

            <div>
                <label>Year:</label>
                <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="input"
                />
            </div>

            <div>
                <label>Month:</label>
                <input
                    type="number"
                    name="month"
                    min="1"
                    max="12"
                    value={formData.month}
                    onChange={handleChange}
                    required
                    className="input"
                />
            </div>

            <div>
                <label>Amount (€):</label>
                <input
                    type="number"
                    step="0.01"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="input"
                />
            </div>

            <div>
                <label>Comment:</label>
                <input
                    type="text"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    className="input"
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={submitting}
            >
                {submitting ? "Saving..." : "New forecast"}
            </button>
        </form>
    );
}
