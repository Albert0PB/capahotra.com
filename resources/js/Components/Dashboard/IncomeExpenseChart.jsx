import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const IncomeExpenseChart = ({ dataPoints }) => {
    const [colors, setColors] = useState({
        income: '#48E16F',
        expenses: '#ff0000',
        bright: '#cccccc',
    });

    useEffect(() => {
        const rootStyles = getComputedStyle(document.documentElement);
        setColors({
            income: rootStyles.getPropertyValue('--color-success').trim(),
            expenses: rootStyles.getPropertyValue('--color-error').trim(),
            bright: rootStyles.getPropertyValue('--color-neutral-bright').trim(),
        });
    }, []);

    const labels = dataPoints.map((item) => item.date);
    const incomeData = dataPoints.map((item) => item.Income);
    const expensesData = dataPoints.map((item) => item.Expenses);

    const data = {
        labels,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: colors.income,
            },
            {
                label: 'Expenses',
                data: expensesData,
                backgroundColor: colors.expenses,
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
                    color: colors.bright,
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
                    color: colors.bright,
                    font: {
                        family: 'IBM Plex Sans',
                        size: 14,
                    },
                    callback: (value) => `€ ${value}`,
                },
                grid: {
                    color: colors.bright,
                },
            },
        },
    };

    return (
        <div className="income-expense-chart">
            <Bar data={data} options={options} />
        </div>
    );
};

export default IncomeExpenseChart;
