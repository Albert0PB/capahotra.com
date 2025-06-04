import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function MovementsSummary({ movements }) {
  const [colors, setColors] = useState({
    bright: '#F8F8F2',
    primary: '#6272A4',
    success: '#48E16F',
    error: '#E64D4D'
  });

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    setColors({
      bright: rootStyles.getPropertyValue('--color-neutral-bright').trim(),
      primary: rootStyles.getPropertyValue('--color-primary').trim(),
      success: rootStyles.getPropertyValue('--color-success').trim(),
      error: rootStyles.getPropertyValue('--color-error').trim(),
    });
  }, []);

  // Helper function to safely convert to number
  const safeNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const chartData = useMemo(() => {
    // Ensure movements is an array and has data
    if (!Array.isArray(movements) || movements.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: "Account Balance",
          data: [],
          borderColor: colors.primary,
          backgroundColor: colors.primary + '20',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: colors.primary,
          pointBorderColor: colors.bright,
          pointBorderWidth: 2,
          pointRadius: 4,
        }],
      };
    }

    // Group movements by date and calculate running balance with safe number conversion
    const sortedMovements = [...movements]
      .map(movement => ({
        ...movement,
        transaction_date: movement.transaction_date,
        balance: safeNumber(movement.balance) // Convert to safe number
      }))
      .sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date))
      .slice(-20); // Last 20 movements for performance

    const labels = sortedMovements.map(movement => {
      const date = new Date(movement.transaction_date);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    });

    const balanceData = sortedMovements.map(movement => movement.balance);

    return {
      labels,
      datasets: [
        {
          label: "Account Balance",
          data: balanceData,
          borderColor: colors.primary,
          backgroundColor: colors.primary + '20',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: colors.primary,
          pointBorderColor: colors.bright,
          pointBorderWidth: 2,
          pointRadius: 4,
        },
      ],
    };
  }, [movements, colors]);

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
          label: (context) => `Balance: € ${safeNumber(context.parsed.y).toFixed(2)}`
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
          color: colors.bright + '20',
        },
      },
      y: {
        ticks: {
          color: colors.bright,
          font: {
            family: "IBM Plex Sans",
            size: window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14,
          },
          callback: (value) => `€ ${safeNumber(value).toFixed(2)}`,
        },
        grid: {
          color: colors.bright + '20',
        },
      },
    },
  };

  // Handle empty state
  if (!Array.isArray(movements) || movements.length === 0) {
    return (
      <div className="bg-[var(--color-neutral-dark)] p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-[var(--color-neutral-bright)] text-center">
          Balance Evolution
        </h2>
        <div className="h-64 sm:h-72 lg:h-80 flex items-center justify-center">
          <div className="text-center text-[var(--color-neutral-bright)]/70">
            <p className="text-lg mb-2">No movement data available</p>
            <p className="text-sm">Create some movements to see the balance evolution chart</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-neutral-dark)] p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-[var(--color-neutral-bright)] text-center">
        Balance Evolution (Last 20 Movements)
      </h2>
      <div className="h-64 sm:h-72 lg:h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}