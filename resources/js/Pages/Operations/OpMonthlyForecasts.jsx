import React, { useState, useEffect } from "react";
import OperativeLayout from "../../Layouts/OperativeLayout";
import MonthlyForecastsForm from "../../Components/OpMonthlyForecasts/MonthlyForecastsForm";
import MonthlyForecastsTable from "../../Components/OpMonthlyForecasts/MonthlyForecastsTable";
import MonthlyForecastsSummary from "../../Components/OpMonthlyForecasts/MonthlyForecastsSummary";
import axios from "axios";
import "../../../css/Pages/op-monthlyforecasts.css";

export default function OpMonthlyForecasts({ initialForecasts = [], initialLabels = [] }) {
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
        setLoading(true);
        try {
            const { data } = await axios.get("/api/labels");
            setLabels(data);
        } catch (error) {
            console.error("Error fetching labels", error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchForecasts();
        fetchLabels();
    }, []);

    const handleForecastCreated = () => {
        fetchForecasts();
    };

    const handleEdit = (forecast) => {
        setEditingForecast(forecast);
    };

    const handleDelete = async (forecast) => {
        if (!window.confirm(`Delete forecast for ${forecast.month}/${forecast.year}?`)) return;

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
        <div className="page-opmonthlyforecasts">
            <div className="opmonthlyforecasts-content">
                <OperativeLayout
                    title="Monthly Forecasts"
                    summaryContent={<MonthlyForecastsSummary forecasts={forecasts} />}
                    tableContent={
                        <MonthlyForecastsTable
                            forecasts={forecasts}
                            userLabels={labels}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    }
                    formContent={
                        <MonthlyForecastsForm
                            onSuccess={handleForecastCreated}
                            editingForecast={editingForecast}
                        />
                    }
                />
            </div>
        </div>
    );
}
