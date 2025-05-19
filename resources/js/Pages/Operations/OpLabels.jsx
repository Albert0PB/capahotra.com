import React, { useState, useEffect } from "react";
import OperativeLayout from "../../Layouts/OperativeLayout";
import LabelsSummary from "../../Components/OpLabels/LabelsSummary";
import LabelsTable from "../../Components/OpLabels/LabelsTable";
import LabelsForm from "../../Components/OpLabels/LabelsForm";
import axios from "axios";
import "../../../css/Pages/op-labels.css";

export default function OpLabels({
    labelsData: initialLabelsData,
    userLabels: initialUserLabels,
}) {
    const [labelsData, setLabelsData] = useState(initialLabelsData || []);
    const [userLabels, setUserLabels] = useState(initialUserLabels || []);
    const [loading, setLoading] = useState(false);

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
        <div className="page-oplabels">
            <div className="oplabels-content">
                <OperativeLayout
                    title="Labels Management"
                    summaryContent={<LabelsSummary labelsData={labelsData} />}
                    tableContent={
                        <LabelsTable labels={userLabels} loading={loading} onDelete={handleDelete} onEdit={handleEdit}/>
                    }
                    formContent={<LabelsForm onSuccess={handleLabelCreated} />}
                />
            </div>
        </div>
    );
}
