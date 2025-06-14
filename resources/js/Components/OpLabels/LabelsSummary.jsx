import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

export default function LabelsSummary({ labelsData }) {
  const [colors, setColors] = useState({
    bright: '#F8F8F2',
    primary: '#6272A4',
    success: '#50FA7B',
    warning: '#F1FA8C',
    error: '#FF5555',
    secondary: '#8BE9FD'
  });

  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    setColors({
      bright: rootStyles.getPropertyValue('--color-neutral-bright').trim(),
      primary: rootStyles.getPropertyValue('--color-primary').trim(),
      success: rootStyles.getPropertyValue('--color-success').trim(),
      warning: rootStyles.getPropertyValue('--color-warning').trim(),
      error: rootStyles.getPropertyValue('--color-error').trim(),
      secondary: rootStyles.getPropertyValue('--color-secondary').trim(),
    });
  }, []);

  const generateColors = (count) => {
    const baseColors = [colors.primary, colors.success, colors.warning, colors.error, colors.secondary];
    const generatedColors = [];
    
    for (let i = 0; i < count; i++) {
      if (i < baseColors.length) {
        generatedColors.push(baseColors[i]);
      } else {
        const baseColor = baseColors[i % baseColors.length];
        const alpha = 0.7 - (Math.floor(i / baseColors.length) * 0.2);
        generatedColors.push(baseColor + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
      }
    }
    
    return generatedColors;
  };

  const sortedData = [...labelsData]
    .sort((a, b) => Math.abs(b.movements_sum_amount || 0) - Math.abs(a.movements_sum_amount || 0))
    .slice(0, 10);

  const chartColors = generateColors(sortedData.length);

  const barChartData = {
    labels: sortedData.map((item) => item.name),
    datasets: [
      {
        label: "Cantidad Total (€)",
        data: sortedData.map((item) => Math.abs(item.movements_sum_amount || 0)),
        backgroundColor: chartColors,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const doughnutChartData = {
    labels: sortedData.map((item) => item.name),
    datasets: [
      {
        data: sortedData.map((item) => Math.abs(item.movements_sum_amount || 0)),
        backgroundColor: chartColors,
        borderColor: 'var(--color-neutral-dark)',
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: colors.bright,
        bodyColor: colors.bright,
        borderColor: colors.primary,
        borderWidth: 1,
        cornerRadius: 8,
        bodyFont: {
          family: "IBM Plex Sans",
        },
        callbacks: {
          label: (context) => `€${context.parsed.y.toFixed(2)}`
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
          maxRotation: window.innerWidth < 640 ? 45 : 30,
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
          callback: (value) => `€${value}`,
        },
        grid: {
          color: colors.bright + '20',
          drawBorder: false,
        },
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: colors.bright,
        bodyColor: colors.bright,
        borderColor: colors.primary,
        borderWidth: 1,
        cornerRadius: 8,
        bodyFont: {
          family: "IBM Plex Sans",
        },
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: €${context.parsed.toFixed(2)} (${percentage}%)`;
          }
        }
      },
    },
    cutout: '50%',
  };

  const totalAmount = sortedData.reduce((sum, item) => sum + Math.abs(item.movements_sum_amount || 0), 0);

  return (
    <div className="bg-[var(--color-neutral-dark-2)] p-4 sm:p-6 rounded-lg shadow-lg">
      
      {/* Header with Chart Type Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[var(--color-neutral-bright)]">
            Análisis de Categorías
          </h2>
          <p className="text-sm text-[var(--color-neutral-bright)]/70 mt-1">
            {sortedData.length > 10 ? 'Top 10 categorías por volumen' : 'Todas las categorías por volumen'}
          </p>
        </div>
        
        <div className="flex bg-[var(--color-neutral-dark-3)] rounded-lg p-1">
          <button
            onClick={() => setChartType('bar')}
            className={`cursor-pointer px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
              chartType === 'bar'
                ? 'bg-[var(--color-primary)] text-[var(--color-neutral-bright)]'
                : 'text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-neutral-bright)]'
            }`}
          >
            Gráfico de Barras
          </button>
          <button
            onClick={() => setChartType('doughnut')}
            className={`cursor-pointer px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
              chartType === 'doughnut'
                ? 'bg-[var(--color-primary)] text-[var(--color-neutral-bright)]'
                : 'text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-neutral-bright)]'
            }`}
          >
            Gráfico Circular
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 sm:h-72 lg:h-80 mb-4">
        {sortedData.length > 0 ? (
          chartType === 'bar' ? (
            <Bar data={barChartData} options={barOptions} />
          ) : (
            <Doughnut data={doughnutChartData} options={doughnutOptions} />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--color-neutral-bright)]/50">
            <div className="text-center">
              <p className="text-lg mb-2">No hay datos disponibles</p>
              <p className="text-sm">Crea algunas etiquetas y movimientos para ver el análisis</p>
            </div>
          </div>
        )}
      </div>

      {/* Top Categories List */}
      {sortedData.length > 0 && (
        <div className="border-t border-[var(--color-neutral-dark-3)] pt-4">
          <h4 className="text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
            Principales Categorías
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sortedData.slice(0, 6).map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-[var(--color-neutral-dark-3)] rounded">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: chartColors[index] }}
                  ></div>
                  <span className="text-sm text-[var(--color-neutral-bright)] truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-[var(--color-neutral-bright)]">
                  €{Math.abs(item.movements_sum_amount || 0).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}