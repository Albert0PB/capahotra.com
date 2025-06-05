import React from "react";

import IncomeExpenseChart from "../Components/Dashboard/IncomeExpenseChart";
import CurrentMonthDisplayer from "../Components/Dashboard/CurrentMonthDisplayer";
import RecentMovementsTable from "../Components/Dashboard/RecentMovementsTable";
import FinancialNewsDisplayer from "../Components/Dashboard/FinancialNewsDisplayer";
import NavSidebar from "../Components/NavSidebar";

import { format } from "date-fns";
import { enUS } from "date-fns/locale";

function getFormattedDate() {
    return format(new Date(), "do MMMM yyyy", { locale: enUS });
}

export default function Dashboard({
    lastFourMonthsData,
    currentMonthData,
    recentMovements,
    financialNews,
}) {
    const date = getFormattedDate();

    return (
        <div className="min-h-screen w-full bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)]">
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6 lg:gap-8 overflow-x-hidden">
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 w-full">
                    <div className="flex flex-col">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[3rem] font-extrabold text-[var(--color-neutral-bright)] mb-2">
                            Your global position
                        </h1>
                        <div className="text-lg sm:text-xl lg:text-2xl xl:text-[2rem] font-light text-[var(--color-neutral-bright)] mb-4 sm:mb-8">
                            {date}
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[2.25rem] font-extrabold text-[var(--color-neutral-bright)]">
                            This month:
                        </h2>
                    </div>
                    <div className="flex items-start">
                        <NavSidebar />
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row w-full gap-6 lg:gap-8">
                    
                    <div className="flex-1 flex flex-col gap-4 sm:gap-6 xl:max-w-none">
                        <CurrentMonthDisplayer currentMonthData={currentMonthData} />
                        <IncomeExpenseChart dataPoints={lastFourMonthsData} />
                    </div>
                    
                    <div className="w-full xl:w-2/5 xl:max-w-[45%]">
                        <RecentMovementsTable recentMovements={recentMovements} />
                    </div>
                </div>

                <div className="w-full">
                    <FinancialNewsDisplayer news={financialNews} />
                </div>

            </div>
        </div>
    );
}