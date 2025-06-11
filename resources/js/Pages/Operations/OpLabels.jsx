import React, { useState, useEffect } from "react";
import LabelsSummary from "../../Components/OpLabels/LabelsSummary";
import LabelsTable from "../../Components/OpLabels/LabelsTable";
import LabelsForm from "../../Components/OpLabels/LabelsForm";
import NavSidebar from "../../Components/NavSidebar";
import { FaTags, FaChartBar, FaExchangeAlt } from "react-icons/fa";
import axios from "axios";

export default function OpLabels({
    labelsData: initialLabelsData,
    userLabels: initialUserLabels,
}) {
    const [labelsData, setLabelsData] = useState(initialLabelsData || []);
    const [userLabels, setUserLabels] = useState(initialUserLabels || []);
    const [loading, setLoading] = useState(false);
    const [editingLabel, setEditingLabel] = useState(null);


    const fetchLabels = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/labels");
            setUserLabels(data);
            setLabelsData(data);
        } catch (error) {
            console.error("Error fetching labels", error);
        }
        setLoading(false);
    };

    const handleLabelCreated = () => {
        fetchLabels();
    };

    const handleEdit = (label) => {
        setEditingLabel(label);
    };

    const handleDelete = async (label) => {
        if (!window.confirm(`Are you sure you want to delete "${label.name}"?`))
            return;

        try {
            await axios.delete(`/api/labels/${label.id}`);
            fetchLabels();
        } catch (error) {
            console.error("Error deleting label", error);
        }
    };

    const handleSuccess = () => {
        setEditingLabel(null);
        fetchLabels();
    };

    const handleCancel = () => {
        setEditingLabel(null);
    };

    // Calculate metrics
    const totalLabels = userLabels.length;
    const totalMovements = labelsData.reduce((sum, label) => sum + (label.movements_count || 0), 0);
    const mostUsedLabel = labelsData.reduce((max, label) => 
        (label.movements_count || 0) > (max.movements_count || 0) ? label : max, 
        labelsData[0] || {}
    );

    return (
        <div className="min-h-screen w-full bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)]">
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 overflow-x-hidden w-full">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 w-full">
                    <div className="flex flex-col">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[3rem] font-extrabold text-[var(--color-neutral-bright)] mb-2">
                            Labels Management
                        </h1>
                        <p className="text-base sm:text-lg text-[var(--color-neutral-bright)]/70">
                            Organize and track your financial categories
                        </p>
                    </div>
                    <div className="flex items-start">
                        <NavSidebar />
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    <div className="bg-[var(--color-neutral-dark-2)] p-4 lg:p-6 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--color-neutral-bright)]/70">Total Labels</p>
                                <p className="text-2xl lg:text-3xl font-bold text-[var(--color-neutral-bright)]">
                                    {totalLabels}
                                </p>
                            </div>
                            <FaTags className="text-[var(--color-primary)] text-2xl lg:text-3xl" />
                        </div>
                    </div>

                    <div className="bg-[var(--color-neutral-dark-2)] p-4 lg:p-6 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--color-neutral-bright)]/70">Total Movements</p>
                                <p className="text-2xl lg:text-3xl font-bold text-[var(--color-neutral-bright)]">
                                    {totalMovements}
                                </p>
                            </div>
                            <FaExchangeAlt className="text-[var(--color-warning)] text-2xl lg:text-3xl" />
                        </div>
                    </div>

                    <div className="bg-[var(--color-neutral-dark-2)] p-4 lg:p-6 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--color-neutral-bright)]/70">Most Used</p>
                                <p className="text-lg lg:text-xl font-bold text-[var(--color-primary)] truncate" title={mostUsedLabel.name}>
                                    {mostUsedLabel.name || 'N/A'}
                                </p>
                                <p className="text-xs text-[var(--color-neutral-bright)]/50">
                                    {mostUsedLabel.movements_count || 0} movements
                                </p>
                            </div>
                            <FaChartBar className="text-[var(--color-primary)] text-2xl lg:text-3xl" />
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="w-full">
                    <LabelsSummary labelsData={labelsData} />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                    
                    {/* Table Section */}
                    <div className="xl:col-span-2">
                        <div className="bg-[var(--color-neutral-dark-2)] rounded-lg shadow-lg">
                            <div className="p-4 border-b border-[var(--color-neutral-dark-3)]">
                                <h3 className="text-lg font-semibold text-[var(--color-neutral-bright)]">
                                    Your Labels ({userLabels.length})
                                </h3>
                            </div>
                            <LabelsTable 
                                labels={userLabels} 
                                loading={loading} 
                                onDelete={handleDelete} 
                                onEdit={handleEdit}
                                onSuccess={handleSuccess}
                            />
                        </div>
                    </div>
                    
                    {/* Form Section */}
                    <div className="xl:col-span-1">
                        <LabelsForm 
                            label={editingLabel}
                            onSuccess={handleSuccess} 
                            onCancel={handleCancel}
                        />
                    </div>
                </div>

                {/* Empty State Help */}
                {totalLabels === 0 && (
                    <div className="bg-[var(--color-neutral-dark-2)] p-8 rounded-lg shadow-lg text-center">
                        <FaTags className="text-[var(--color-neutral-bright)]/30 text-6xl mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-[var(--color-neutral-bright)] mb-2">
                            No labels yet
                        </h3>
                        <p className="text-[var(--color-neutral-bright)]/70">
                            Start organizing your finances by creating your first label using the form below
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}