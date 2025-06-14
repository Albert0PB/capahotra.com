import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { FaChartLine, FaArrowUp, FaArrowDown } from "react-icons/fa";
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
    error: '#E64D4D',
    warning: '#F1FA8C'
  });

  const [timeRange, setTimeRange] = useState(20); // Default to last 20 movements

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    setColors({
      bright: rootStyles.getPropertyValue('--color-neutral-bright').trim(),
      primary: rootStyles.getPropertyValue('--color-primary').trim(),
      success: rootStyles.getPropertyValue('--color-success').trim(),
      error: rootStyles.getPropertyValue('--color-error').trim(),
      warning: rootStyles.getPropertyValue('--color-warning').trim(),
    });
  }, []);

  const safeNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const { chartData, stats } = useMemo(() => {
    if (!Array.isArray(movements) || movements.length === 0) {
      return {
        chartData: {
          labels: [],
          datasets: [{
            label: "Saldo de la Cuenta",
            data: [],
            borderColor: colors.primary,
            backgroundColor: colors.primary + '20',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: colors.primary,
            pointBorderColor: colors.bright,
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          }],
        },
        stats: {
          currentBalance: 0,
          trend: 'neutral',
          minBalance: 0,
          maxBalance: 0,
          averageBalance: 0
        }
      };
    }

    // Ordenar movimientos por fecha y tomar los últimos según timeRange
    const sortedMovements = [...movements]
      .sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date))
      .slice(-timeRange);

    // Calcular saldo acumulativo para cada movimiento
    const movementsWithBalance = [];
    let runningBalance = 0;

    // Primero necesitamos calcular el saldo base hasta el primer movimiento que vamos a mostrar
    if (timeRange < movements.length) {
      const allSorted = [...movements].sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date));
      const movementsBeforeRange = allSorted.slice(0, -timeRange);
      
      runningBalance = movementsBeforeRange.reduce((balance, movement) => {
        if (movement.movement_type_id === 1) {
          // Ingreso - sumar
          return balance + safeNumber(movement.amount);
        } else if (movement.movement_type_id === 2) {
          // Gasto - restar
          return balance - safeNumber(movement.amount);
        }
        return balance;
      }, 0);
    }

    // Ahora calcular el saldo para cada movimiento en el rango
    for (const movement of sortedMovements) {
      if (movement.movement_type_id === 1) {
        // Ingreso - sumar
        runningBalance += safeNumber(movement.amount);
      } else if (movement.movement_type_id === 2) {
        // Gasto - restar
        runningBalance -= safeNumber(movement.amount);
      }
      
      movementsWithBalance.push({
        ...movement,
        calculatedBalance: runningBalance
      });
    }

    const labels = movementsWithBalance.map(movement => {
      const date = new Date(movement.transaction_date);
      return date.toLocaleDateString('es-ES', { 
        month: 'short', 
        day: 'numeric',
        year: movementsWithBalance.length > 30 ? '2-digit' : undefined
      });
    });

    const balanceData = movementsWithBalance.map(movement => movement.calculatedBalance);

    const currentBalance = balanceData[balanceData.length - 1] || 0;
    const previousBalance = balanceData[balanceData.length - 2] || currentBalance;
    const trend = currentBalance > previousBalance ? 'up' : currentBalance < previousBalance ? 'down' : 'neutral';
    const minBalance = Math.min(...balanceData);
    const maxBalance = Math.max(...balanceData);
    const averageBalance = balanceData.reduce((sum, val) => sum + val, 0) / balanceData.length;

    return {
      chartData: {
        labels,
        datasets: [
          {
            label: "Saldo de la Cuenta",
            data: balanceData,
            borderColor: colors.primary,
            backgroundColor: colors.primary + '20',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: colors.primary,
            pointBorderColor: colors.bright,
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      stats: {
        currentBalance,
        trend,
        minBalance,
        maxBalance,
        averageBalance
      }
    };
  }, [movements, colors, timeRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
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
        titleFont: {
          family: "Inter",
        },
        callbacks: {
          label: (context) => `Saldo: €${safeNumber(context.parsed.y).toFixed(2)}`
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
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: colors.bright,
          font: {
            family: "IBM Plex Sans",
            size: window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 12 : 14,
          },
          callback: (value) => `€${safeNumber(value).toFixed(0)}`,
        },
        grid: {
          color: colors.bright + '20',
          drawBorder: false,
        },
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      }
    }
  };

  const getTrendIcon = () => {
    if (stats.trend === 'up') return <FaArrowUp className="text-[var(--color-success)]" />;
    if (stats.trend === 'down') return <FaArrowDown className="text-[var(--color-error)]" />;
    return <FaChartLine className="text-[var(--color-neutral-bright)]/50" />;
  };

  const getTrendColor = () => {
    if (stats.trend === 'up') return 'text-[var(--color-success)]';
    if (stats.trend === 'down') return 'text-[var(--color-error)]';
    return 'text-[var(--color-neutral-bright)]/70';
  };

  // Handle empty state
  if (!Array.isArray(movements) || movements.length === 0) {
    return (
      <div className="bg-[var(--color-neutral-dark-2)] p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-[var(--color-neutral-bright)] flex items-center gap-2">
          <FaChartLine className="text-[var(--color-primary)]" />
          Evolución del Saldo
        </h2>
        <div className="h-64 sm:h-72 lg:h-80 flex items-center justify-center">
          <div className="text-center text-[var(--color-neutral-bright)]/70">
            <FaChartLine className="mx-auto h-12 w-12 text-[var(--color-neutral-bright)]/30 mb-4" />
            <p className="text-lg mb-2">No hay datos de movimientos disponibles</p>
            <p className="text-sm">Crea algunos movimientos para ver el gráfico de evolución del saldo</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-neutral-dark-2)] p-4 sm:p-6 rounded-lg shadow-lg">
      
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[var(--color-neutral-bright)] flex items-center gap-2">
            <FaChartLine className="text-[var(--color-primary)]" />
            Evolución del Saldo
          </h2>
          <p className="text-sm text-[var(--color-neutral-bright)]/70 mt-1">
            Rastrea el saldo de tu cuenta a lo largo del tiempo
          </p>
        </div>
        
        <div className="flex bg-[var(--color-neutral-dark-3)] rounded-lg p-1">
          <button
            onClick={() => setTimeRange(10)}
            className={`cursor-pointer px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
              timeRange === 10
                ? 'bg-[var(--color-primary)] text-[var(--color-neutral-bright)]'
                : 'text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-neutral-bright)]'
            }`}
          >
            Últimos 10
          </button>
          <button
            onClick={() => setTimeRange(20)}
            className={`cursor-pointer px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
              timeRange === 20
                ? 'bg-[var(--color-primary)] text-[var(--color-neutral-bright)]'
                : 'text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-neutral-bright)]'
            }`}
          >
            Últimos 20
          </button>
          <button
            onClick={() => setTimeRange(50)}
            className={`cursor-pointer px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
              timeRange === 50
                ? 'bg-[var(--color-primary)] text-[var(--color-neutral-bright)]'
                : 'text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-neutral-bright)]'
            }`}
          >
            Últimos 50
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[var(--color-neutral-dark-3)] p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-neutral-bright)]/70 uppercase tracking-wider">Actual</p>
              <p className={`text-lg font-bold ${
                stats.currentBalance >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
              }`}>
                €{stats.currentBalance.toFixed(2)}
              </p>
            </div>
            {getTrendIcon()}
          </div>
        </div>
        
        <div className="bg-[var(--color-neutral-dark-3)] p-3 rounded-lg">
          <p className="text-xs text-[var(--color-neutral-bright)]/70 uppercase tracking-wider">Mínimo</p>
          <p className="text-lg font-bold text-[var(--color-error)]">
            €{stats.minBalance.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-[var(--color-neutral-dark-3)] p-3 rounded-lg">
          <p className="text-xs text-[var(--color-neutral-bright)]/70 uppercase tracking-wider">Máximo</p>
          <p className="text-lg font-bold text-[var(--color-success)]">
            €{stats.maxBalance.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-[var(--color-neutral-dark-3)] p-3 rounded-lg">
          <p className="text-xs text-[var(--color-neutral-bright)]/70 uppercase tracking-wider">Promedio</p>
          <p className="text-lg font-bold text-[var(--color-primary)]">
            €{stats.averageBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-72 lg:h-80">
        <Line data={chartData} options={options} />
      </div>

      {/* Trend Information */}
      <div className="mt-4 p-3 bg-[var(--color-neutral-dark-3)] rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {stats.trend === 'up' && 'El saldo tiene tendencia al alza'}
              {stats.trend === 'down' && 'El saldo tiene tendencia a la baja'}
              {stats.trend === 'neutral' && 'El saldo está estable'}
            </span>
          </div>
          <div className="text-xs text-[var(--color-neutral-bright)]/50">
            Mostrando los últimos {timeRange} movimientos
          </div>
        </div>
      </div>
    </div>
  );
}