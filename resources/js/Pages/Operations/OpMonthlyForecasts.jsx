import React, { useState, useEffect } from "react";
import MonthlyForecastsForm from "../../Components/OpMonthlyForecasts/MonthlyForecastsForm";
import MonthlyForecastsTable from "../../Components/OpMonthlyForecasts/MonthlyForecastsTable";
import NavSidebar from "../../Components/NavSidebar";
import axios from "axios";

export default function OpMonthlyForecasts({ 
  monthlyForecasts: initialForecasts = [], 
  userLabels: initialLabels = [] 
}) {
  const [forecasts, setForecasts] = useState(initialForecasts);
  const [labels, setLabels] = useState(initialLabels);
  const [editingForecast, setEditingForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchForecasts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/monthly-forecasts");
      setForecasts(data);
    } catch (error) {
      console.error("Error fetching forecasts", error);
    }
    setLoading(false);
  };

  const fetchLabels = async () => {
    try {
      const { data } = await axios.get("/api/labels");
      setLabels(data);
    } catch (error) {
      console.error("Error fetching labels", error);
    }
  };

  useEffect(() => {
    if (initialForecasts.length === 0) {
      fetchForecasts();
    }
    if (initialLabels.length === 0) {
      fetchLabels();
    }
  }, []);

  const handleForecastCreated = () => {
    fetchForecasts();
  };

  const handleEdit = (forecast) => {
    setEditingForecast(forecast);
  };

  const handleDelete = async (forecast) => {
    const monthName = new Intl.DateTimeFormat("en", { month: "long" }).format(
      new Date(forecast.year, forecast.month)
    );
    
    if (!window.confirm(`Are you sure you want to delete the forecast for ${monthName} ${forecast.year}?`)) {
      return;
    }

    try {
      await axios.delete(`/api/monthly-forecasts/${forecast.id}`);
      fetchForecasts();
    } catch (error) {
      console.error("Error deleting forecast", error);
    }
  };

  const handleSuccess = () => {
    setEditingForecast(null);
    fetchForecasts();
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)]">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 overflow-x-hidden w-full">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 w-full">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[3rem] font-extrabold text-[var(--color-neutral-bright)]">
              Monthly Forecasts
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-neutral-bright)]/70 mt-2">
              Manage your monthly budget forecasts and track execution progress
            </p>
          </div>
          <div className="flex items-start">
            <NavSidebar />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--color-neutral-dark-2)] p-4 rounded-lg">
            <h3 className="text-sm font-medium text-[var(--color-neutral-bright)]/70 mb-1">
              Total Forecasts
            </h3>
            <p className="text-2xl font-bold text-[var(--color-neutral-bright)]">
              {forecasts.length}
            </p>
          </div>
          <div className="bg-[var(--color-neutral-dark-2)] p-4 rounded-lg">
            <h3 className="text-sm font-medium text-[var(--color-neutral-bright)]/70 mb-1">
              This Year
            </h3>
            <p className="text-2xl font-bold text-[var(--color-neutral-bright)]">
              {forecasts.filter(f => f.year === new Date().getFullYear()).length}
            </p>
          </div>
          <div className="bg-[var(--color-neutral-dark-2)] p-4 rounded-lg">
            <h3 className="text-sm font-medium text-[var(--color-neutral-bright)]/70 mb-1">
              Active Labels
            </h3>
            <p className="text-2xl font-bold text-[var(--color-neutral-bright)]">
              {new Set(forecasts.map(f => f.label_id)).size}
            </p>
          </div>
          <div className="bg-[var(--color-neutral-dark-2)] p-4 rounded-lg">
            <h3 className="text-sm font-medium text-[var(--color-neutral-bright)]/70 mb-1">
              Total Budgeted
            </h3>
            <p className="text-2xl font-bold text-[var(--color-success)]">
              € {forecasts.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Table Section */}
          <div className="xl:col-span-3">
            <MonthlyForecastsTable 
              forecasts={forecasts}
              userLabels={labels}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSuccess={handleSuccess}
            />
          </div>
          
          {/* Form Section */}
          <div className="xl:col-span-1">
            <MonthlyForecastsForm 
              editingForecast={editingForecast}
              userLabels={labels}
              onSuccess={handleSuccess}
              onCancel={() => setEditingForecast(null)}
            />
          </div>
        </div>

      </div>
    </div>
  );
}