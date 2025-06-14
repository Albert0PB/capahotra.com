import React, { useState, useEffect } from "react";
import MovementsForm from "../../Components/OpMovements/MovementsForm";
import MovementsTable from "../../Components/OpMovements/MovementsTable";
import MovementsSummary from "../../Components/OpMovements/MovementsSummary";
import BankStatementUpload from "../../Components/OpMovements/BankStatmentUpload";
import MovementsReview from "../../Components/OpMovements/MovementsReview";
import NavSidebar from "../../Components/NavSidebar";
import { FaExchangeAlt, FaWallet, FaChartLine, FaBalanceScale, FaCalendarCheck } from "react-icons/fa";
import axios from "axios";

export default function OpMovements({ 
  movements: initialMovements = [], 
  userLabels: initialLabels = [],
  banks: initialBanks = []
}) {
  const [movements, setMovements] = useState(initialMovements);
  const [labels, setLabels] = useState(initialLabels);
  const [banks, setBanks] = useState(initialBanks);
  const [editingMovement, setEditingMovement] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [extractedMovements, setExtractedMovements] = useState(null);

  const safeNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const fetchMovements = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/movements");
      setMovements(data);
    } catch (error) {
      console.error("Error fetching movements", error);
    }
    setLoading(false);
  };

  const fetchLabels = async () => {
    try {
      const { data } = await axios.get("/api/labels");
      setLabels(data);
    } catch (error) {
      console.error("Error fetching labels", error);
    }
  };

  useEffect(() => {
    if (initialMovements.length === 0) {
      fetchMovements();
    }
    if (initialLabels.length === 0) {
      fetchLabels();
    }
  }, []);

  const handleMovementCreated = () => {
    fetchMovements();
  };

  const handleEdit = (movement) => {
    setEditingMovement(movement);
  };

  const handleDelete = async (movement) => {
    const labelName = labels.find(l => l.id === movement.label_id)?.name || 'Desconocido';
    const confirmMessage = `¿Estás seguro de que quieres eliminar el movimiento #${movement.id}?\n\nDetalles:\n• Cantidad: € ${Math.abs(safeNumber(movement.amount)).toFixed(2)}\n• Fecha: ${movement.transaction_date}\n• Etiqueta: ${labelName}\n\nEsta acción no se puede deshacer.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await axios.delete(`/api/movements/${movement.id}`);
      fetchMovements();
    } catch (error) {
      console.error("Error deleting movement", error);
      alert("Error al eliminar el movimiento. Por favor, inténtalo de nuevo.");
    }
  };

  const handleSuccess = () => {
    setEditingMovement(null);
    fetchMovements();
  };

  const handleUploadSuccess = (movements) => {
    setExtractedMovements(movements);
    setShowUploadModal(false);
  };

  const handleReviewSave = (savedMovements) => {
    setExtractedMovements(null);
    fetchMovements();
  };

  const handleReviewCancel = () => {
    setExtractedMovements(null);
  };

  const totalMovements = movements.length;
  
  // Calcular el saldo actual igual que en Dashboard
  const totalIncome = movements
    .filter(m => m.movement_type_id === 1)
    .reduce((sum, m) => sum + safeNumber(m.amount), 0);

  const totalExpenses = movements
    .filter(m => m.movement_type_id === 2)
    .reduce((sum, m) => sum + safeNumber(m.amount), 0);

  const currentBalance = totalIncome - totalExpenses;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthMovements = movements.filter(m => {
    const date = new Date(m.transaction_date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const thisMonthIncome = thisMonthMovements
    .filter(m => m.movement_type_id === 1)
    .reduce((sum, m) => sum + Math.abs(safeNumber(m.amount)), 0);

  const thisMonthExpenses = thisMonthMovements
    .filter(m => m.movement_type_id === 2)
    .reduce((sum, m) => sum + Math.abs(safeNumber(m.amount)), 0);

  const thisMonthNet = thisMonthIncome - thisMonthExpenses;

  return (
    <div className="min-h-screen w-full bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)]">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 overflow-x-hidden w-full">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 w-full">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[3rem] font-extrabold text-[var(--color-neutral-bright)] mb-2">
              Gestión de Movimientos
            </h1>
            <p className="text-base sm:text-lg text-[var(--color-neutral-bright)]/70">
              Rastrea, analiza y gestiona todos tus movimientos financieros
            </p>
          </div>
          <div className="flex items-start">
            <NavSidebar />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-[var(--color-neutral-dark-2)] p-4 lg:p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-neutral-bright)]/70">Saldo Actual</p>
                <p className={`text-2xl lg:text-3xl font-bold font-[var(--font-numeric)] ${
                  currentBalance >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
                }`}>
                  €{currentBalance.toFixed(2)}
                </p>
              </div>
              <FaWallet className={`text-2xl lg:text-3xl ${
                currentBalance >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
              }`} />
            </div>
          </div>

          <div className="bg-[var(--color-neutral-dark-2)] p-4 lg:p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-neutral-bright)]/70">Total de Movimientos</p>
                <p className="text-2xl lg:text-3xl font-bold text-[var(--color-neutral-bright)] font-[var(--font-numeric)]">
                  {totalMovements}
                </p>
                <p className="text-xs text-[var(--color-neutral-bright)]/50">
                  transacciones registradas
                </p>
              </div>
              <FaExchangeAlt className="text-[var(--color-primary)] text-2xl lg:text-3xl" />
            </div>
          </div>

          <div className="bg-[var(--color-neutral-dark-2)] p-4 lg:p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-neutral-bright)]/70">Ingresos Este Mes</p>
                <p className="text-2xl lg:text-3xl font-bold text-[var(--color-success)] font-[var(--font-numeric)]">
                  €{thisMonthIncome.toFixed(2)}
                </p>
                <p className="text-xs text-[var(--color-neutral-bright)]/50">
                  {thisMonthMovements.filter(m => m.movement_type_id === 1).length} transacciones
                </p>
              </div>
              <FaChartLine className="text-[var(--color-success)] text-2xl lg:text-3xl" />
            </div>
          </div>

          <div className="bg-[var(--color-neutral-dark-2)] p-4 lg:p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-neutral-bright)]/70">Neto Este Mes</p>
                <p className={`text-2xl lg:text-3xl font-bold font-[var(--font-numeric)] ${
                  thisMonthNet >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
                }`}>
                  €{thisMonthNet.toFixed(2)}
                </p>
                <p className="text-xs text-[var(--color-neutral-bright)]/50">
                  ingresos - gastos
                </p>
              </div>
              <FaBalanceScale className={`text-2xl lg:text-3xl ${
                thisMonthNet >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
              }`} />
            </div>
          </div>
        </div>

        {/* Chart Section */}
        {movements.length > 0 && (
          <div className="w-full">
            <MovementsSummary movements={movements} />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Table Section */}
          <div className="xl:col-span-3">
            <div className="bg-[var(--color-neutral-dark-2)] rounded-lg shadow-lg">
              <div className="p-4 border-b border-[var(--color-neutral-dark-3)]">
                <div className="flex items-center gap-3">
                  <FaCalendarCheck className="text-[var(--color-primary)] text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-neutral-bright)]">
                      Tus Movimientos ({movements.length})
                    </h3>
                    <p className="text-sm text-[var(--color-neutral-bright)]/70">
                      Rastrea y gestiona todas tus transacciones financieras
                    </p>
                  </div>
                </div>
              </div>
              <MovementsTable 
                movements={movements}
                userLabels={labels}
                banks={banks}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
          
          {/* Form Section */}
          <div className="xl:col-span-1">
            <MovementsForm 
              editingMovement={editingMovement}
              userLabels={labels}
              banks={banks}
              onSuccess={handleSuccess}
              onCancel={() => setEditingMovement(null)}
              onOpenPdfUpload={() => setShowUploadModal(true)}
            />
          </div>
        </div>

        {/* Empty State Help */}
        {totalMovements === 0 && !loading && (
          <div className="bg-[var(--color-neutral-dark-2)] p-8 rounded-lg shadow-lg text-center">
            <FaExchangeAlt className="text-[var(--color-neutral-bright)]/30 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[var(--color-neutral-bright)] mb-2">
              Aún no hay movimientos
            </h3>
            <p className="text-[var(--color-neutral-bright)]/70 mb-6">
              Comienza a rastrear tus finanzas subiendo un extracto bancario o creando tu primer movimiento manualmente
            </p>
            <div className="bg-[var(--color-neutral-dark-3)] p-4 rounded-lg">
              <h4 className="font-medium text-[var(--color-neutral-bright)] mb-2 flex items-center justify-center gap-2">
                <FaChartLine className="text-[var(--color-primary)]" />
                Consejos de Inicio Rápido
              </h4>
              <ul className="text-sm text-[var(--color-neutral-bright)]/70 text-left space-y-1">
                <li>• Sube extractos bancarios PDF para procesamiento automático</li>
                <li>• Usa el formulario de la derecha para añadir movimientos individuales</li>
                <li>• Categoriza movimientos con etiquetas para mejor seguimiento</li>
                <li>• Monitorea tanto ingresos como gastos regularmente</li>
              </ul>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-[var(--color-neutral-dark-2)] p-8 rounded-lg shadow-lg text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-primary)]"></div>
              <span className="text-[var(--color-neutral-bright)]">Cargando movimientos...</span>
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      {showUploadModal && (
        <BankStatementUpload
          banks={banks}
          userLabels={labels}
          onMovementsExtracted={handleUploadSuccess}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {extractedMovements && (
        <MovementsReview
          extractedMovements={extractedMovements}
          userLabels={labels}
          banks={banks}
          onSave={handleReviewSave}
          onCancel={handleReviewCancel}
        />
      )}
    </div>
  );
}