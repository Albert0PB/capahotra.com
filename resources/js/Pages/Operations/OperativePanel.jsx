import React, { useState, useEffect } from "react";
import OperativePanelSummaryCard from "../../Components/OperativePanel/OperativePanelSummaryCard";
import OperativePanelRecentActivity from "../../Components/OperativePanel/OperativePanelRecentActivity";
import NavSidebar from "../../Components/NavSidebar";
import { router } from "@inertiajs/react";

export default function OperativePanel({ 
  summaryData = {},
  recentMovements = [],
  upcomingForecasts = [],
  userLabels = []
}) {
  const safeNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const currentBalance = summaryData.currentBalance ? safeNumber(summaryData.currentBalance) : 0;
  const totalMovements = summaryData.totalMovements || 0;
  const totalLabels = summaryData.totalLabels || 0;
  const totalForecasts = summaryData.totalForecasts || 0;
  const thisMonthIncome = summaryData.thisMonthIncome ? safeNumber(summaryData.thisMonthIncome) : 0;
  const thisMonthExpenses = summaryData.thisMonthExpenses ? safeNumber(summaryData.thisMonthExpenses) : 0;
  const thisMonthNet = thisMonthIncome - thisMonthExpenses;

  const navigateToLabels = () => {
    router.visit('/operations/labels');
  };

  const navigateToForecasts = () => {
    router.visit('/operations/monthly-forecasts');
  };

  const navigateToMovements = () => {
    router.visit('/operations/movements');
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)]">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 overflow-x-hidden w-full">
        
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 w-full">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[3rem] font-extrabold text-[var(--color-neutral-bright)]">
              Centro de Operaciones
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-neutral-bright)]/70 mt-2">
              Tu centro de gestión financiera
            </p>
          </div>
          <div className="flex items-start">
            <NavSidebar />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--color-neutral-dark-2)] p-4 rounded-lg">
            <h3 className="text-sm font-medium text-[var(--color-neutral-bright)]/70 mb-1">
              Saldo Actual
            </h3>
            <p className={`text-2xl font-bold font-[var(--font-numeric)] ${
              currentBalance >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
            }`}>
              € {currentBalance.toFixed(2)}
            </p>
          </div>

          <div className="bg-[var(--color-neutral-dark-2)] p-4 rounded-lg">
            <h3 className="text-sm font-medium text-[var(--color-neutral-bright)]/70 mb-1">
              Neto Este Mes
            </h3>
            <p className={`text-2xl font-bold font-[var(--font-numeric)] ${
              thisMonthNet >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
            }`}>
              € {thisMonthNet.toFixed(2)}
            </p>
          </div>

          <div className="bg-[var(--color-neutral-dark-2)] p-4 rounded-lg">
            <h3 className="text-sm font-medium text-[var(--color-neutral-bright)]/70 mb-1">
              Total de Movimientos
            </h3>
            <p className="text-2xl font-bold text-[var(--color-neutral-bright)] font-[var(--font-numeric)]">
              {totalMovements}
            </p>
          </div>

          <div className="bg-[var(--color-neutral-dark-2)] p-4 rounded-lg">
            <h3 className="text-sm font-medium text-[var(--color-neutral-bright)]/70 mb-1">
              Etiquetas Activas
            </h3>
            <p className="text-2xl font-bold text-[var(--color-neutral-bright)] font-[var(--font-numeric)]">
              {totalLabels}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <OperativePanelSummaryCard
            title="Gestión de Etiquetas"
            description="Organiza tus categorías financieras"
            icon="🏷️"
            stats={[
              { label: "Total de Etiquetas", value: totalLabels },
              { label: "Más Usada", value: userLabels[0]?.name || "Ninguna" }
            ]}
            ctaText="Gestionar Etiquetas"
            ctaAction={navigateToLabels}
            accentColor="var(--color-primary)"
          />

          <OperativePanelSummaryCard
            title="Previsiones Mensuales"
            description="Planifica y rastrea tu presupuesto"
            icon="📊"
            stats={[
              { label: "Previsiones Activas", value: totalForecasts },
              { label: "Este Mes", value: upcomingForecasts.length }
            ]}
            ctaText="Ver Previsiones"
            ctaAction={navigateToForecasts}
            accentColor="var(--color-secondary)"
          />

          <OperativePanelSummaryCard
            title="Movimientos"
            description="Rastrea tus ingresos y gastos"
            icon="💰"
            stats={[
              { label: "Ingresos Este Mes", value: `€ ${thisMonthIncome.toFixed(2)}` },
              { label: "Gastos Este Mes", value: `€ ${thisMonthExpenses.toFixed(2)}` }
            ]}
            ctaText="Ver Movimientos"
            ctaAction={navigateToMovements}
            accentColor="var(--color-success)"
          />
        </div>

        <div className="w-full">
          <OperativePanelRecentActivity 
            recentMovements={recentMovements}
            upcomingForecasts={upcomingForecasts}
            onViewAllMovements={navigateToMovements}
            onViewAllForecasts={navigateToForecasts}
          />
        </div>

      </div>
    </div>
  );
}