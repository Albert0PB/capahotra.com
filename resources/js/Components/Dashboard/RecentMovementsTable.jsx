import React, { useEffect, useState } from "react";

const MOVEMENT_TYPE_ID_INCOME = 1;

const RecentMovementsTable = ({ recentMovements }) => {
    const [labelNames, setLabelNames] = useState({});

    useEffect(() => {
        let isMounted = true;
        const fetchLabelNames = async () => {
            const names = {};
            for (const { label_id } of recentMovements) {
                if (!names[label_id]) {
                    try {
                        const res = await fetch(`/api/labels/${label_id}`);
                        const data = await res.json();
                        names[label_id] = data.name || "Unknown";
                    } catch {
                        names[label_id] = "Unknown";
                    }
                }
            }
            if (isMounted) setLabelNames(names);
        };

        fetchLabelNames();
        return () => {
            isMounted = false;
        };
    }, [recentMovements]);

    return (
        <div className="recent-movements-table-container">
            <table className="recent-movements-table">
                <caption>
                    <h3 className="recent-movements-table-title">
                        Recent Movements
                    </h3>
                </caption>
                <tbody className="recent-movements-table-body">
                    {recentMovements.map((movement, key) => {
                        const isPositive =
                            parseFloat(movement.movement_type_id) ===
                            MOVEMENT_TYPE_ID_INCOME;
                        const amountClass = `recent-movements-table-element-amount ${
                            isPositive ? "positive" : "negative"
                        }`;
                        const currencyClass = `recent-movements-table-element-currency ${
                            isPositive ? "positive" : "negative"
                        }`;
                        const label =
                            labelNames[movement.label_id] || movement.label_id;

                        return (
                            <tr
                                key={key}
                                className="recent-movements-table-element"
                            >
                                <td className="recent-movements-table-element-labelid">
                                    {label}
                                </td>
                                <td className={currencyClass}>€</td>
                                <td className={amountClass}>
                                    {Math.abs(
                                        parseFloat(movement.amount)
                                    ).toFixed(2)}
                                </td>
                                <td className="recent-movements-table-element-date">
                                    {movement.transaction_date}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default RecentMovementsTable;
