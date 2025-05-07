// components/IncomeExpenseChart.jsx
import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { callback } from 'chart.js/helpers';

const rootStyles = getComputedStyle(document.documentElement);

const incomeColor = rootStyles.getPropertyValue('--color-success').trim();
const expensesColor = rootStyles.getPropertyValue('--color-error').trim();
const brightColor = rootStyles.getPropertyValue('--color-neutral-bright').trim();

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const IncomeExpenseChart = ({ dataPoints }) => {
  const labels = dataPoints.map((item) => item.date);
  const incomeData = dataPoints.map((item) => item.Income);
  const expensesData = dataPoints.map((item) => item.Expenses);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: incomeColor, 
      },
      {
        label: 'Expenses',
        data: expensesData,
        backgroundColor: expensesColor,
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
          family: 'IBM Plex Sans',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: brightColor,
          font: {
            family: 'Inter',
            size: 14,
          },
        },
        grid: {
          display: false
        },
      },
      y: {
        ticks: {
          color: brightColor,
          font: {
            family: 'IBM Plex Sans',
            size: 14,
          },
          callback: (value) => `€ ${value}`,
        },
        grid: {
          color: brightColor,
        },
      },
    },
  };
  

  return (
    <div className="w-full max-w-4xl p-4 bg-white rounded-2xl shadow-md income-expense-chart" style={{ backgroundColor: 'var(--color-neutral-dark'}}>
      <Bar data={data} options={options} style={{ backgroundColor: 'var(--color-neutral-dark'}} />
    </div>
  );
};

export default IncomeExpenseChart;
