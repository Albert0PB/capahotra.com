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
                label: 'Ingresos',
                data: incomeData,
                backgroundColor: colors.income,
                borderRadius: 4,
                borderSkipped: false,
            },
            {
                label: 'Gastos',
                data: expensesData,
                backgroundColor: colors.expenses,
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: colors.bright,
                    font: {
                        family: 'Inter',
                        size: 14,
                    },
                    usePointStyle: true,
                    pointStyle: 'rect',
                    padding: 20,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: colors.bright,
                bodyColor: colors.bright,
                borderColor: colors.bright,
                borderWidth: 1,
                cornerRadius: 8,
                bodyFont: {
                    family: 'IBM Plex Sans',
                },
                titleFont: {
                    family: 'Inter',
                },
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: €${context.parsed.y.toFixed(2)}`;
                    }
                }
            },
        },
        scales: {
            x: {
                ticks: {
                    color: colors.bright,
                    font: {
                        family: 'Inter',
                        size: window.innerWidth < 640 ? 11 : window.innerWidth < 1024 ? 12 : 14,
                    },
                    maxRotation: 0,
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
                        size: window.innerWidth < 640 ? 11 : window.innerWidth < 1024 ? 12 : 14,
                    },
                    callback: (value) => `€${value}`,
                },
                grid: {
                    color: `${colors.bright}20`,
                    drawBorder: false,
                },
                beginAtZero: true,
            },
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10,
            }
        }
    };

    return (
        <div className="bg-[var(--color-neutral-dark)] rounded-none w-full">
            {/* Altura fija más consistente que se adapta mejor al contenido de la tabla */}
            <div className="h-72 sm:h-80 lg:h-96">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default IncomeExpenseChart;