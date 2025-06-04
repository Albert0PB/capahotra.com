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
        <div className="w-full bg-[var(--color-neutral-dark)] p-0">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <caption className="text-left mb-4">
                        <h3 className="text-[var(--color-neutral-bright)] text-lg sm:text-xl lg:text-2xl xl:text-[2rem] font-semibold mb-0">
                            Recent Movements
                        </h3>
                    </caption>
                    <tbody>
                        {recentMovements.map((movement, key) => {
                            const isPositive =
                                parseFloat(movement.movement_type_id) ===
                                MOVEMENT_TYPE_ID_INCOME;
                            const amountColorClass = isPositive 
                                ? "text-[var(--color-success)]" 
                                : "text-[var(--color-error)]";
                            const label =
                                labelNames[movement.label_id] || movement.label_id;

                            return (
                                <tr
                                    key={key}
                                    className="border-b border-[var(--color-neutral-dark-3)] hover:bg-[var(--color-neutral-dark-3)] transition-colors duration-200"
                                >
                                    <td className="py-2 px-2 pl-0 sm:pl-0 sm:py-3 sm:px-4 text-[var(--color-neutral-bright)] text-sm sm:text-base lg:text-lg xl:text-[1.5rem] w-2/5 truncate">
                                        <span className="block truncate" title={label}>
                                            {label}
                                        </span>
                                    </td>
                                    <td className={`py-2 px-1 sm:py-3 sm:px-2 text-left text-sm sm:text-base lg:text-lg xl:text-[1.5rem] w-auto ${amountColorClass}`}>
                                        €
                                    </td>
                                    <td className={`py-2 px-2 sm:py-3 sm:px-4 font-bold text-right text-sm sm:text-base lg:text-lg xl:text-[1.5rem] w-1/4 ${amountColorClass}`}>
                                        {Math.abs(parseFloat(movement.amount)).toFixed(2)}
                                    </td>
                                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-[var(--color-neutral-bright)] text-right italic text-xs sm:text-sm lg:text-base xl:text-[1.5rem] w-1/4">
                                        <span className="hidden sm:inline">
                                            {movement.transaction_date}
                                        </span>
                                        <span className="sm:hidden">
                                            {new Date(movement.transaction_date).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentMovementsTable;