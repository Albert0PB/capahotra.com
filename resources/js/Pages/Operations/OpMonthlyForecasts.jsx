import React, { useState, useEffect } from "react";
import MonthlyForecastsForm from "../../Components/OpMonthlyForecasts/MonthlyForecastsForm";
import MonthlyForecastsTable from "../../Components/OpMonthlyForecasts/MonthlyForecastsTable";
import NavSidebar from "../../Components/NavSidebar";
import { FaCalendarAlt, FaChartLine, FaTags, FaEuroSign, FaCalendarCheck, FaChartBar } from "react-icons/fa";
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

  // Calculate metrics
  const totalForecasts = forecasts.length;
  const currentYear = new Date().getFullYear();
  const thisYearForecasts = forecasts.filter(f => f.year === currentYear).length;
  const activeLabels = new Set(forecasts.map(f => f.label_id)).size;
  const totalBudgeted = forecasts.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);

  return (
    <div className="min-h-screen w-full bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)]">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 overflow-x-hidden w-full">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 w-full">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[3rem] font-extrabold text-[var(--color-neutral-bright)] mb-2">
              Monthly Forecasts
            </h1>
            <p className="text-base sm:text-lg text-[var(--color-neutral-bright)]/70">
              Plan, track and analyze your monthly budget forecasts
            </p>
          </div>
          <div className="flex items-start">
            <NavSidebar />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-[var(--color-neutral-dark-2)] p-4 lg:p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-neutral-bright)]/70">Total Forecasts</p>
                <p className="text-2xl lg:text-3xl font-bold text-[var(--color-neutral-bright)]">
                  {totalForecasts}
                </p>
              </div>
              <FaCalendarAlt className="text-[var(--color-primary)] text-2xl lg:text-3xl" />
            </div>
          </div>

          <div className="bg-[var(--color-neutral-dark-2)] p-4 lg:p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-neutral-bright)]/70">This Year</p>
                <p className="text-2xl lg:text-3xl font-bold text-[var(--color-warning)]">
                  {thisYearForecasts}
                </p>
                <p className="text-xs text-[var(--color-neutral-bright)]/50">
                  forecasts for {currentYear}
                </p>
              </div>
              <FaChartLine className="text-[var(--color-warning)] text-2xl lg:text-3xl" />
            </div>
          </div>

          <div className="bg-[var(--color-neutral-dark-2)] p-4 lg:p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-neutral-bright)]/70">Active Labels</p>
                <p className="text-2xl lg:text-3xl font-bold text-[var(--color-secondary)]">
                  {activeLabels}
                </p>
                <p className="text-xs text-[var(--color-neutral-bright)]/50">
                  categories in use
                </p>
              </div>
              <FaTags className="text-[var(--color-secondary)] text-2xl lg:text-3xl" />
            </div>
          </div>

          <div className="bg-[var(--color-neutral-dark-2)] p-4 lg:p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-neutral-bright)]/70">Total Budgeted</p>
                <p className="text-xl lg:text-2xl font-bold text-[var(--color-success)]">
                  €{totalBudgeted.toFixed(0)}
                </p>
                <p className="text-xs text-[var(--color-neutral-bright)]/50">
                  across all forecasts
                </p>
              </div>
              <FaEuroSign className="text-[var(--color-success)] text-2xl lg:text-3xl" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Table Section */}
          <div className="xl:col-span-3">
            <div className="bg-[var(--color-neutral-dark-2)] rounded-lg shadow-lg">
              <div className="p-4 border-b border-[var(--color-neutral-dark-3)]">
                <div className="flex items-center gap-3">
                  <FaCalendarCheck className="text-[var(--color-primary)] text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-neutral-bright)]">
                      Your Forecasts ({forecasts.length})
                    </h3>
                    <p className="text-sm text-[var(--color-neutral-bright)]/70">
                      Monitor and manage your monthly budget targets
                    </p>
                  </div>
                </div>
              </div>
              <MonthlyForecastsTable 
                forecasts={forecasts}
                userLabels={labels}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSuccess={handleSuccess}
              />
            </div>
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

        {/* Empty State Help */}
        {totalForecasts === 0 && (
          <div className="bg-[var(--color-neutral-dark-2)] p-8 rounded-lg shadow-lg text-center">
            <FaChartBar className="text-[var(--color-neutral-bright)]/30 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--color-neutral-bright)] mb-2">
              No forecasts yet
            </h3>
            <p className="text-[var(--color-neutral-bright)]/70">
              Start planning your finances by creating your first monthly forecast using the form below
            </p>
          </div>
        )}

      </div>
    </div>
  );
}