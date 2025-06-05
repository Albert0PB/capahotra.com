import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function LabelsSummary({ labelsData }) {
  const [colors, setColors] = useState({
    bright: '#F8F8F2',
    primary: '#6272A4'
  });

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    setColors({
      bright: rootStyles.getPropertyValue('--color-neutral-bright').trim(),
      primary: rootStyles.getPropertyValue('--color-primary').trim(),
    });
  }, []);

  const chartData = {
    labels: labelsData.map((item) => item.name),
    datasets: [
      {
        label: "Total Amount (€)",
        data: labelsData.map((item) => item.movements_sum_amount || 0),
        backgroundColor: colors.primary,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        bodyFont: {
          family: "IBM Plex Sans",
        },
        callbacks: {
          label: (context) => `€ ${context.parsed.y.toFixed(2)}`
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: colors.bright,
          font: {
            family: "Inter",
            size: window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14,
          },
          maxRotation: window.innerWidth < 640 ? 45 : 0,
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
            size: window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14,
          },
          callback: (value) => `€ ${value}`,
        },
        grid: {
          color: colors.bright + '20',
        },
      },
    },
  };

  return (
    <div className="bg-[var(--color-neutral-dark)] p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-[var(--color-neutral-bright)] text-center">
        Amount Distribution by Category
      </h2>
      <div className="h-64 sm:h-72 lg:h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}