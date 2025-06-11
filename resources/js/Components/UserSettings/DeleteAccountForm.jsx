import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { FaTrash, FaExclamationTriangle, FaLock, FaTimes, FaSkull } from "react-icons/fa";

export default function DeleteAccountForm({ user }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const { delete: destroy, processing } = useForm();

  const handleDeleteAccount = () => {
    if (confirmationText !== 'DELETE' || !passwordConfirmation) {
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
        alert('There was an error deleting your account. Please try again.');
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

  const isConfirmationValid = confirmationText === 'DELETE' && passwordConfirmation.length > 0;

  return (
    <>
      <div className="bg-[var(--color-neutral-dark-2)] rounded-lg shadow-lg border border-[var(--color-error)]/30">
        <div className="p-6 border-b border-[var(--color-neutral-dark-3)]">
          <div className="flex items-center gap-3">
            <FaTrash className="text-[var(--color-error)] text-xl" />
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-neutral-bright)]">
                Delete Account
              </h2>
              <p className="text-sm text-[var(--color-neutral-bright)]/70 mt-1">
                Permanently delete your account and all associated data.
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
                  Warning: This action cannot be undone!
                </h3>
                <ul className="text-sm text-[var(--color-error)]/90 space-y-1">
                  <li>• Your account will be permanently deleted</li>
                  <li>• All your movements and financial data will be lost</li>
                  <li>• All your labels and forecasts will be removed</li>
                  <li>• You will lose access to all financial tools and reports</li>
                  <li>• This action is irreversible</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-[var(--color-neutral-dark-3)] rounded-lg">
            <h3 className="text-sm font-medium text-[var(--color-neutral-bright)] mb-3">
              Account Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--color-neutral-bright)]/70">Account:</span>
                <p className="text-[var(--color-neutral-bright)] font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-[var(--color-neutral-bright)]/70">Member Since:</span>
                <p className="text-[var(--color-neutral-bright)] font-medium">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
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
              Consider These Alternatives
            </h3>
            <ul className="text-sm text-[var(--color-neutral-bright)]/80 space-y-1">
              <li>• Export your financial data before deletion</li>
              <li>• Change your password if security is a concern</li>
              <li>• Update your email address to a different one</li>
              <li>• Contact support if you're having issues with the application</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <button
              onClick={openConfirmModal}
              className="cursor-pointer px-6 py-3 bg-[var(--color-error)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-error)]/80 transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              <FaTrash />
              Delete Account
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
                    Confirm Account Deletion
                  </h3>
                  <p className="text-sm text-[var(--color-neutral-bright)]/70">
                    This action is permanent and cannot be undone.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-[var(--color-error)]/20 border border-[var(--color-error)]/30 rounded text-[var(--color-error)] text-sm">
                  <strong>Final Warning:</strong> You are about to permanently delete your account and all associated data.
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
                    Type "DELETE" to confirm *
                  </label>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="w-full p-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] focus:border-transparent"
                    placeholder="Type DELETE here"
                    disabled={processing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
                    Enter your password to confirm *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60" />
                    <input
                      type="password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border border-[var(--color-neutral-dark-3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-error)] focus:border-transparent"
                      placeholder="Enter your password"
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
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={processing || !isConfirmationValid}
                  className="cursor-pointer flex-1 px-4 py-3 bg-[var(--color-error)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-error)]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      Delete Forever
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