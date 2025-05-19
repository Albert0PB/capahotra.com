import React from "react";

import NavSidebar from "../Components/NavSidebar";

export default function DashboardEntityLayout({
    title,
    summaryContent,
    tableContent,
    formContent
}) {
    return (
        <div className="operative-layout flex flex-col gap-6 p-6">
            <div className="operative-layout-header">
                <div className="operative-layout-header-left">
                    <h1 className="text-2xl font-bold text-[var(--color-neutral-bright)] operative-layout-title">
                        {title}
                    </h1>
                </div>
                <div className="operative-layout-header-right">
                    <NavSidebar />
                </div>
            </div>

            <section className="summary-section">
                <div className="summary-section-container">
                    {summaryContent}
                </div>
            </section>

            <div className="main-section grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">{tableContent}</div>
                <div className="lg:col-span-1">{formContent}</div>
            </div>
        </div>
    );
}
