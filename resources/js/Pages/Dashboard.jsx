import React from "react";

import IncomeExpenseChart from "../Components/Dashboard/IncomeExpenseChart";
import CurrentMonthDisplayer from "../Components/Dashboard/CurrentMonthDisplayer";
import RecentMovementsTable from "../Components/Dashboard/RecentMovementsTable";
import FinancialNewsDisplayer from "../Components/Dashboard/FinancialNewsDisplayer";
import NavSidebar from "../Components/NavSidebar";

import { format } from "date-fns";
import { es } from "date-fns/locale";

function getFormattedDate() {
    return format(new Date(), "do 'de' MMMM 'de' yyyy", { locale: es });
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
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 w-full">
                    <div className="flex flex-col">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[3rem] font-extrabold text-[var(--color-neutral-bright)] mb-2">
                            Tu posición global
                        </h1>
                        <div className="text-lg sm:text-xl lg:text-2xl xl:text-[2rem] font-light text-[var(--color-neutral-bright)] mb-4 sm:mb-8">
                            {date}
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-[2.25rem] font-extrabold text-[var(--color-neutral-bright)]">
                            Este mes:
                        </h2>
                    </div>
                    <div className="flex items-start">
                        <NavSidebar />
                    </div>
                </div>

                {/* Current Month Data - Full Width */}
                <div className="w-full">
                    <CurrentMonthDisplayer currentMonthData={currentMonthData} />
                </div>

                {/* Main Content - Chart and Table */}
                <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-8">
                    
                    {/* Chart Section - Adjusted proportions */}
                    <div className="w-full lg:w-3/5 xl:w-1/2">
                        <div className="bg-[var(--color-neutral-dark)] rounded-none w-full">
                            <h3 className="text-[var(--color-neutral-bright)] text-lg sm:text-xl lg:text-2xl xl:text-[2rem] font-semibold mb-4">
                                Ingresos vs Gastos (Últimos 4 Meses)
                            </h3>
                            <IncomeExpenseChart dataPoints={lastFourMonthsData} />
                        </div>
                    </div>
                    
                    {/* Recent Movements Table - More space */}
                    <div className="w-full lg:w-2/5 xl:w-1/2">
                        <RecentMovementsTable recentMovements={recentMovements} />
                    </div>
                </div>

                {/* Financial News - Full Width */}
                <div className="w-full">
                    <h3 className="text-[var(--color-neutral-bright)] text-lg sm:text-xl lg:text-2xl xl:text-[2rem] font-semibold mb-4">
                        Noticias Financieras
                    </h3>
                    <FinancialNewsDisplayer news={financialNews} />
                </div>

            </div>
        </div>
    );
}