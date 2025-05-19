import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { MdBorderColor } from "react-icons/md";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const colors = {
  bright: "#F8F8F2",
};

export default function LabelsSummary({ labelsData }) {
  const chartData = {
    labels: labelsData.map((item) => item.name),
    datasets: [
      {
        label: "Total Amount (€)",
        data: labelsData.map((item) => item.movements_sum_amount),
        backgroundColor: "#36A2EB",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        bodyFont: {
          family: "IBM Plex Sans",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: colors.bright,
          font: {
            family: "Inter",
            size: 14,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: colors.bright,
          font: {
            family: "IBM Plex Sans",
            size: 14,
          },
          callback: (value) => `€ ${value}`,
        },
        grid: {
          color: colors.bright
        },
      },
    },
  };

  return (
    <div className="bg-neutral-dark p-4">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Amount Distribution by Category
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
