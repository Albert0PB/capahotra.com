import React from "react";

export default function OperativePanelRecentActivity({ 
  recentMovements = [], 
  upcomingForecasts = [],
  onViewAllMovements,
  onViewAllForecasts
}) {
  const safeNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const getMovementTypeColor = (typeId) => {
    switch(typeId) {
      case 1: return 'text-[var(--color-success)]';
      case 2: return 'text-[var(--color-error)]';
      case 3: return 'text-[var(--color-warning)]';
      default: return 'text-[var(--color-neutral-bright)]';
    }
  };

  const getMovementTypeIcon = (typeId) => {
    switch(typeId) {
      case 1: return '↗️';
      case 2: return '↘️';  
      case 3: return '🔄';
      default: return '💰';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div className="bg-[var(--color-neutral-dark-2)] rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--color-neutral-bright)]">
            Movimientos Recientes
          </h2>
          <button
            onClick={onViewAllMovements}
            className="cursor-pointer text-[var(--color-primary)] hover:text-[var(--color-secondary)] text-sm font-medium transition-colors duration-200"
          >
            Ver Todos →
          </button>
        </div>

        <div className="space-y-3">
          {recentMovements.length > 0 ? (
            recentMovements.slice(0, 5).map((movement, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-[var(--color-neutral-dark-3)] rounded-lg hover:bg-[var(--color-neutral-dark)] transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {getMovementTypeIcon(movement.movement_type_id)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-neutral-bright)]">
                      {movement.label?.name || 'Etiqueta Desconocida'}
                    </p>
                    <p className="text-xs text-[var(--color-neutral-bright)]/70">
                      {new Date(movement.transaction_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${getMovementTypeColor(movement.movement_type_id)}`}>
                    € {Math.abs(safeNumber(movement.amount)).toFixed(2)}
                  </p>
                  <p className="text-xs text-[var(--color-neutral-bright)]/70">
                    Saldo: € {safeNumber(movement.balance).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[var(--color-neutral-bright)]/70">
              <p className="text-lg mb-2">No hay movimientos recientes</p>
              <p className="text-sm">Comienza a registrar tus actividades financieras</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[var(--color-neutral-dark-2)] rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--color-neutral-bright)]">
            Previsiones del Mes
          </h2>
          <button
            onClick={onViewAllForecasts}
            className="cursor-pointer text-[var(--color-secondary)] hover:text-[var(--color-primary)] text-sm font-medium transition-colors duration-200"
          >
            Ver Todas →
          </button>
        </div>

        <div className="space-y-3">
          {upcomingForecasts.length > 0 ? (
            upcomingForecasts.slice(0, 5).map((forecast, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-[var(--color-neutral-dark-3)] rounded-lg hover:bg-[var(--color-neutral-dark)] transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📊</span>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-neutral-bright)]">
                      {forecast.label?.name || 'Etiqueta Desconocida'}
                    </p>
                    <p className="text-xs text-[var(--color-neutral-bright)]/70">
                      {forecast.comment || 'Sin comentario'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--color-warning)]">
                    € {safeNumber(forecast.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-[var(--color-neutral-bright)]/70">
                    Previsión
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[var(--color-neutral-bright)]/70">
              <p className="text-lg mb-2">No hay previsiones este mes</p>
              <p className="text-sm">Crea previsiones para planificar tu presupuesto</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}