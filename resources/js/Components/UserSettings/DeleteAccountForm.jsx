import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { FaTrash, FaExclamationTriangle, FaLock, FaTimes, FaSkull } from "react-icons/fa";

export default function DeleteAccountForm({ user }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const { delete: destroy, processing } = useForm();

  const handleDeleteAccount = () => {
    if (confirmationText !== 'ELIMINAR' || !passwordConfirmation) {
      return;
    }

    destroy('/user', {
      data: {
        password: passwordConfirmation,
      },
      onSuccess: () => {
        setShowConfirmModal(false);
      },
      onError: () => {
        alert('Hubo un error al eliminar tu cuenta. Por favor, inténtalo de nuevo.');
      }
    });
  };

  const openConfirmModal = () => {
    setShowConfirmModal(true);
    setConfirmationText('');
    setPasswordConfirmation('');
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmationText('');
    setPasswordConfirmation('');
  };

  const isConfirmationValid = confirmationText === 'ELIMINAR' && passwordConfirmation.length > 0;

  return (
    <>
      <div className="bg-[var(--color-neutral-dark-2)] rounded-lg shadow-lg border border-[var(--color-error)]/30">
        <div className="p-6 border-b border-[var(--color-neutral-dark-3)]">
          <div className="flex items-center gap-3">
            <FaTrash className="text-[var(--color-error)] text-xl" />
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-neutral-bright)]">
                Eliminar Cuenta
              </h2>
              <p className="text-sm text-[var(--color-neutral-bright)]/70 mt-1">
                Eliminar permanentemente tu cuenta y todos los datos asociados.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-[var(--color-error)]/20 border border-[var(--color-error)]/30 rounded-lg">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-[var(--color-error)] mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-[var(--color-error)] font-medium text-sm mb-2">
                  ¡Advertencia: Esta acción no se puede deshacer!
                </h3>
                <ul className="text-sm text-[var(--color-error)]/90 space-y-1">
                  <li>• Tu cuenta será eliminada permanentemente</li>
                  <li>• Todos tus movimientos y datos financieros se perderán</li>
                  <li>• Todas tus etiquetas y previsiones serán eliminadas</li>
                  <li>• Perderás acceso a todas las herramientas financieras e informes</li>
                  <li>• Esta acción es irreversible</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-[var(--color-neutral-dark-3)] rounded-lg">
            <h3 className="text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
              Resumen de la Cuenta
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--color-neutral-bright)]/70">Cuenta:</span>
                <p className="text-[var(--color-neutral-bright)] font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-[var(--color-neutral-bright)]/70">Miembro Desde:</span>
                <p className="text-[var(--color-neutral-bright)] font-medium">
                  {new Date(user.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-lg">
            <h3 className="text-[var(--color-primary)] font-medium text-sm mb-2">
              Considera Estas Alternativas
            </h3>
            <ul className="text-sm text-[var(--color-neutral-bright)]/80 space-y-1">
              <li>• Exporta tus datos financieros antes de eliminar</li>
              <li>• Cambia tu contraseña si la seguridad es una preocupación</li>
              <li>• Actualiza tu dirección de correo a una diferente</li>
              <li>• Contacta con soporte si tienes problemas con la aplicación</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <button
              onClick={openConfirmModal}
              className="cursor-pointer px-6 py-3 bg-[var(--color-error)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-error)]/80 transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              <FaTrash />
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--color-neutral-dark-2)] rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[var(--color-error)]/20 rounded-full flex items-center justify-center">
                  <FaSkull className="text-[var(--color-error)] text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-neutral-bright)]">
                    Confirmar Eliminación de Cuenta
                  </h3>
                  <p className="text-sm text-[var(--color-neutral-bright)]/70">
                    Esta acción es permanente y no se puede deshacer.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-[var(--color-error)]/20 border border-[var(--color-error)]/30 rounded text-[var(--color-error)] text-sm">
                  <strong>Advertencia Final:</strong> Estás a punto de eliminar permanentemente tu cuenta y todos los datos asociados.
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
                    Escribe "ELIMINAR" para confirmar *
                  </label>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="w-full p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] focus:border-transparent"
                    placeholder="Escribe ELIMINAR aquí"
                    disabled={processing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
                    Introduce tu contraseña para confirmar *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60" />
                    <input
                      type="password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] focus:border-transparent"
                      placeholder="Introduce tu contraseña"
                      disabled={processing}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeConfirmModal}
                  disabled={processing}
                  className="cursor-pointer flex-1 px-4 py-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-neutral-dark)] disabled:opacity-50 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FaTimes />
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={processing || !isConfirmationValid}
                  className="cursor-pointer flex-1 px-4 py-3 bg-[var(--color-error)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-error)]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      Eliminar Para Siempre
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}