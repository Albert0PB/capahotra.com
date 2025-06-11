import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { FaUser, FaEnvelope, FaSave, FaCheck, FaExclamationTriangle } from "react-icons/fa";

export default function ProfileInformationForm({ user, errors }) {
  const { data, setData, put, processing, recentlySuccessful } = useForm({
    name: user.name,
    email: user.email,
  });

  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors({});

    put('/user/profile-information', {
      preserveScroll: true,
      onError: (errors) => {
        console.log('Received errors:', errors); // Para debugging
        setFormErrors(errors || {});
      },
    });
  };

  // Función helper para renderizar errores de forma segura
  const renderError = (error) => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (Array.isArray(error)) return error[0] || '';
    if (typeof error === 'object') return JSON.stringify(error);
    return String(error);
  };

  // Función helper para obtener todos los errores como array de strings
  const getAllErrors = (errors) => {
    const allErrors = [];
    
    Object.entries(errors).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        allErrors.push(...value);
      } else if (typeof value === 'string') {
        allErrors.push(value);
      } else if (typeof value === 'object' && value !== null) {
        // Si es un objeto, intentar extraer valores
        Object.values(value).forEach(subValue => {
          if (Array.isArray(subValue)) {
            allErrors.push(...subValue);
          } else if (typeof subValue === 'string') {
            allErrors.push(subValue);
          }
        });
      }
    });
    
    return allErrors;
  };

  return (
    <div className="bg-[var(--color-neutral-dark-2)] rounded-lg shadow-lg">
      <div className="p-6 border-b border-[var(--color-neutral-dark-3)]">
        <div className="flex items-center gap-3">
          <FaUser className="text-[var(--color-primary)] text-xl" />
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-neutral-bright)]">
              Profile Information
            </h2>
            <p className="text-sm text-[var(--color-neutral-bright)]/70 mt-1">
              Update your account's profile information and email address.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {recentlySuccessful && (
          <div className="mb-6 p-4 bg-[var(--color-success)]/20 border border-[var(--color-success)]/30 rounded-lg flex items-center gap-3">
            <FaCheck className="text-[var(--color-success)]" />
            <span className="text-[var(--color-success)] text-sm font-medium">
              Profile information updated successfully!
            </span>
          </div>
        )}

        {Object.keys(formErrors).length > 0 && (
          <div className="mb-6 p-4 bg-[var(--color-error)]/20 border border-[var(--color-error)]/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <FaExclamationTriangle className="text-[var(--color-error)]" />
              <span className="text-[var(--color-error)] text-sm font-medium">
                Please correct the following errors:
              </span>
            </div>
            <ul className="text-sm text-[var(--color-error)] space-y-1 ml-6">
              {getAllErrors(formErrors).map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
              Full Name *
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60" />
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                  formErrors.name 
                    ? 'border-[var(--color-error)]' 
                    : 'border-[var(--color-neutral-dark-3)]'
                }`}
                placeholder="Enter your full name"
                required
                disabled={processing}
              />
            </div>
            {formErrors.name && (
              <p className="text-[var(--color-error)] text-sm mt-1">
                {renderError(formErrors.name)}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
              Email Address *
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60" />
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                  formErrors.email 
                    ? 'border-[var(--color-error)]' 
                    : 'border-[var(--color-neutral-dark-3)]'
                }`}
                placeholder="Enter your email address"
                required
                disabled={processing}
              />
            </div>
            {formErrors.email && (
              <p className="text-[var(--color-error)] text-sm mt-1">
                {renderError(formErrors.email)}
              </p>
            )}
          </div>

          {/* Email Verification Notice */}
          {user.email_verified_at === null && (
            <div className="p-4 bg-[var(--color-warning)]/20 border border-[var(--color-warning)]/30 rounded-lg">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-[var(--color-warning)]" />
                <div className="flex-1">
                  <p className="text-[var(--color-warning)] text-sm font-medium">
                    Your email address is unverified.
                  </p>
                  <p className="text-[var(--color-warning)]/80 text-xs mt-1">
                    Please check your email for a verification link.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={processing}
              className="cursor-pointer px-6 py-3 bg-[var(--color-primary)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave />
                  Update Profile
                </>
              )}
            </button>
          </div>
        </form>

        {/* Account Info */}
        <div className="mt-8 pt-6 border-t border-[var(--color-neutral-dark-3)]">
          <h3 className="text-sm font-medium text-[var(--color-neutral-bright)] mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[var(--color-neutral-bright)]/70">Account Created:</span>
              <p className="text-[var(--color-neutral-bright)] font-medium">
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <span className="text-[var(--color-neutral-bright)]/70">Email Status:</span>
              <p className={`font-medium ${
                user.email_verified_at 
                  ? 'text-[var(--color-success)]' 
                  : 'text-[var(--color-warning)]'
              }`}>
                {user.email_verified_at ? 'Verified' : 'Unverified'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}