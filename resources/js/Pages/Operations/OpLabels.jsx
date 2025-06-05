import React, { useState, useEffect } from "react";
import LabelsSummary from "../../Components/OpLabels/LabelsSummary";
import LabelsTable from "../../Components/OpLabels/LabelsTable";
import LabelsForm from "../../Components/OpLabels/LabelsForm";
import NavSidebar from "../../Components/NavSidebar";
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

    return (
        <div className="min-h-screen w-full bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)]">
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 overflow-x-hidden w-full">
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 w-full">
                    <div className="flex flex-col">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[3rem] font-extrabold text-[var(--color-neutral-bright)]">
                            Labels Management
                        </h1>
                    </div>
                    <div className="flex items-start">
                        <NavSidebar />
                    </div>
                </div>

                <div className="flex justify-center w-full">
                    <div className="w-full lg:w-3/4 xl:w-1/2">
                        <LabelsSummary labelsData={labelsData} />
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                    
                    <div className="xl:col-span-2">
                        <LabelsTable 
                            labels={userLabels} 
                            loading={loading} 
                            onDelete={handleDelete} 
                            onEdit={handleEdit}
                            onSuccess={handleSuccess}
                        />
                    </div>
                    
                    <div className="xl:col-span-1">
                        <LabelsForm 
                            label={editingLabel}
                            onSuccess={handleSuccess} 
                            onCancel={() => setEditingLabel(null)}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}