import React from "react";

import IncomeExpenseChart from "../Components/Dashboard/IncomeExpenseChart";
import CurrentMonthDisplayer from "../Components/Dashboard/CurrentMonthDisplayer";
import RecentMovementsTable from "../Components/Dashboard/RecentMovementsTable";
import FinancialNewsDisplayer from "../Components/Dashboard/FinancialNewsDisplayer";
import NavSidebar from "../Components/NavSidebar";

import { format } from "date-fns";
import { format as formatWithSuffix } from "date-fns/format";
import { enUS } from "date-fns/locale";

import "../../css/Pages/dashboard.css";

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
        <div className="min-h-screen w-full bg-[var(--color-neutral-dark)] page-dashboard">
            <div className="dashboard-content">
                <div className="dashboard-fr">
                    <div className="dashboard-header-left">
                        <h1 className="dashboard-title">
                            Your global position
                        </h1>
                        <div className="dashboard-date">{date}</div>
                        <h2 className="dashboard-subtitle">This month:</h2>
                    </div>
                    <div className="dashboard-header-right">
                        <NavSidebar />
                    </div>
                </div>
                <div className="dashboard-sr">
                    <div className="dashboard-sr-lh">
                        <CurrentMonthDisplayer
                            currentMonthData={currentMonthData}
                        />
                        <IncomeExpenseChart dataPoints={lastFourMonthsData} />
                    </div>
                    <div className="dashboard-sr-rh">
                        <RecentMovementsTable
                            recentMovements={recentMovements}
                        />
                    </div>
                </div>
                <div className="dashboard-tr">
                    <FinancialNewsDisplayer news={financialNews} />
                </div>
            </div>
        </div>
    );
}
