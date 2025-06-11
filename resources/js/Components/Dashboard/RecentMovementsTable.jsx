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

    // Helper function to format date responsively
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const isSmallScreen = window.innerWidth < 768; // md breakpoint
        
        if (isSmallScreen) {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: '2-digit'
            });
        }
    };

    return (
        <div className="w-full bg-[var(--color-neutral-dark)] p-0">
            <div className="overflow-hidden"> {/* Cambiado de overflow-x-auto */}
                <table className="w-full border-collapse table-fixed"> {/* Añadido table-fixed */}
                    <caption className="text-left mb-4">
                        <h3 className="text-[var(--color-neutral-bright)] text-lg sm:text-xl lg:text-2xl xl:text-[2rem] font-semibold mb-0">
                            Recent Movements
                        </h3>
                    </caption>
                    <thead>
                        <tr className="border-b-2 border-[var(--color-neutral-dark-3)]">
                            <th className="py-2 px-2 text-left text-[var(--color-neutral-bright)]/80 text-xs sm:text-sm font-medium uppercase tracking-wider w-[45%]">
                                Description
                            </th>
                            <th className="py-2 px-1 text-right text-[var(--color-neutral-bright)]/80 text-xs sm:text-sm font-medium uppercase tracking-wider w-[30%]">
                                Amount
                            </th>
                            <th className="py-2 px-2 text-right text-[var(--color-neutral-bright)]/80 text-xs sm:text-sm font-medium uppercase tracking-wider w-[25%]">
                                Date
                            </th>
                        </tr>
                    </thead>
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
                                    {/* Description column */}
                                    <td className="py-3 px-2 text-[var(--color-neutral-bright)] text-sm sm:text-base lg:text-lg w-[45%]">
                                        <div className="truncate" title={label}>
                                            {label}
                                        </div>
                                    </td>
                                    
                                    {/* Amount column */}
                                    <td className={`py-3 px-1 text-right text-sm sm:text-base lg:text-lg font-bold w-[30%] ${amountColorClass}`}>
                                        <div className="flex items-center justify-end">
                                            <span className="mr-1">€</span>
                                            <span className="whitespace-nowrap">
                                                {Math.abs(parseFloat(movement.amount)).toFixed(2)}
                                            </span>
                                        </div>
                                    </td>
                                    
                                    {/* Date column */}
                                    <td className="py-3 px-2 text-[var(--color-neutral-bright)] text-right italic text-xs sm:text-sm lg:text-base w-[25%]">
                                        <span className="whitespace-nowrap">
                                            {formatDate(movement.transaction_date)}
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