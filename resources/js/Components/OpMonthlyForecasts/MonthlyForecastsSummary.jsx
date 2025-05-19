import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MonthlyForecastsSummary() {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const { data } = await axios.get(
                    "/api/monthly-forecasts-summary"
                );
                setSummary(data);
            } catch (error) {
                console.error("Error fetching forecast summary", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return <div>Loading summary...</div>;
    }

    const handleClick = (labelId) => {
        window.location.href = `http://capahotra.com/operations/monthly-forecasts/${labelId}`;
    };

    return (
        <div className="summary-section">
            <div className="summary-section-container">
                <h2>Forecast Completion Summary</h2>
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-neutral-dark-2 text-white">
                            <th className="p-2 text-left">Label</th>
                            <th className="p-2 text-center">Year</th>
                            <th className="p-2 text-left">Month</th>
                            <th className="p-2 text-center">Forecasted (€)</th>
                            <th className="p-2 text-center">Executed (€)</th>
                            <th className="p-2">Completion (%)</th>
                            <th className="p-2">Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summary.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b border-neutral-dark-3 hover:bg-[var(--color-neutral-dark-3)] cursor-pointer"
                                onClick={() => handleClick(item.label_id)}
                            >
                                <td className="p-2 text-left">{item.label}</td>
                                <td className="p-2 text-center">{item.year}</td>
                                <td className="p-2 text-left">
                                    {new Intl.DateTimeFormat("en", {
                                        month: "short",
                                    }).format(
                                        new Date(item.year, item.month - 1)
                                    )}
                                </td>
                                <td className="p-2 text-center">
                                    € {item.forecasted_amount.toFixed(2)}
                                </td>
                                <td className="p-2 text-center">
                                    € {item.executed_amount.toFixed(2)}
                                </td>
                                <td
                                    className={`p-2 font-semibold text-center ${
                                        item.completion >= 100
                                            ? "text-[var(--color-success)]"
                                            : item.completion >= 50
                                            ? "text-[var(--color-warning)]"
                                            : "text-[var(--color-error)]"
                                    }`}
                                >
                                    {item.completion.toFixed(2)} %
                                </td>

                                <td className="p-2">{item.comment}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
