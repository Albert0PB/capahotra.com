import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { FaLock, FaEye, FaEyeSlash, FaKey, FaCheck, FaExclamationTriangle, FaShieldAlt } from "react-icons/fa";

export default function UpdatePasswordForm({ errors }) {
  const { data, setData, put, processing, recentlySuccessful, reset } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors({});

    put('/user/password', {
      preserveScroll: true,
      onSuccess: () => {
        reset();
      },
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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: 'Enter a password', color: 'text-[var(--color-neutral-bright)]/50' };
    return { strength: 3, label: 'Valid', color: 'text-[var(--color-success)]' };
  };

  const passwordStrength = getPasswordStrength(data.password);

  return (
    <div className="bg-[var(--color-neutral-dark-2)] rounded-lg shadow-lg">
      <div className="p-6 border-b border-[var(--color-neutral-dark-3)]">
        <div className="flex items-center gap-3">
          <FaLock className="text-[var(--color-warning)] text-xl" />
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-neutral-bright)]">
              Update Password
            </h2>
            <p className="text-sm text-[var(--color-neutral-bright)]/70 mt-1">
              Ensure your account is using a long, random password to stay secure.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {recentlySuccessful && (
          <div className="mb-6 p-4 bg-[var(--color-success)]/20 border border-[var(--color-success)]/30 rounded-lg flex items-center gap-3">
            <FaCheck className="text-[var(--color-success)]" />
            <span className="text-[var(--color-success)] text-sm font-medium">
              Password updated successfully!
            </span>
          </div>
        )}

        {(formErrors.updatePassword || Object.keys(formErrors).length > 0) && (
          <div className="mb-6 p-4 bg-[var(--color-error)]/20 border border-[var(--color-error)]/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <FaExclamationTriangle className="text-[var(--color-error)]" />
              <span className="text-[var(--color-error)] text-sm font-medium">
                Please correct the following errors:
              </span>
            </div>
            <ul className="text-sm text-[var(--color-error)] space-y-1 ml-6">
              {Object.entries(formErrors).map(([key, value]) => 
                Array.isArray(value) 
                  ? value.map((error, index) => (
                      <li key={`${key}-${index}`}>• {error}</li>
                    ))
                  : <li key={key}>• {value}</li>
              ).flat()}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
              Current Password *
            </label>
            <div className="relative">
              <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60" />
              <input
                type={showPasswords.current ? "text" : "password"}
                value={data.current_password}
                onChange={(e) => setData('current_password', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                  formErrors.current_password 
                    ? 'border-[var(--color-error)]' 
                    : 'border-[var(--color-neutral-dark-3)]'
                }`}
                placeholder="Enter your current password"
                required
                disabled={processing}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60 hover:text-[var(--color-neutral-bright)] transition-colors"
              >
                {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formErrors.current_password && (
              <p className="text-[var(--color-error)] text-sm mt-1">
                {renderError(formErrors.current_password)}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
              New Password *
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60" />
              <input
                type={showPasswords.new ? "text" : "password"}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                  formErrors.password 
                    ? 'border-[var(--color-error)]' 
                    : 'border-[var(--color-neutral-dark-3)]'
                }`}
                placeholder="Enter your new password"
                required
                disabled={processing}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60 hover:text-[var(--color-neutral-bright)] transition-colors"
              >
                {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {data.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[var(--color-neutral-bright)]/70">Password Strength:</span>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded ${
                        level <= passwordStrength.strength
                          ? passwordStrength.strength <= 2
                            ? 'bg-[var(--color-error)]'
                            : passwordStrength.strength <= 3
                            ? 'bg-[var(--color-warning)]'
                            : 'bg-[var(--color-success)]'
                          : 'bg-[var(--color-neutral-dark-3)]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {formErrors.password && (
              <p className="text-[var(--color-error)] text-sm mt-1">
                {renderError(formErrors.password)}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60" />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 bg-[var(--color-neutral-dark-3)] text-[var(--color-neutral-bright)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                  formErrors.password_confirmation 
                    ? 'border-[var(--color-error)]' 
                    : 'border-[var(--color-neutral-dark-3)]'
                }`}
                placeholder="Confirm your new password"
                required
                disabled={processing}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-bright)]/60 hover:text-[var(--color-neutral-bright)] transition-colors"
              >
                {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formErrors.password_confirmation && (
              <p className="text-[var(--color-error)] text-sm mt-1">
                {renderError(formErrors.password_confirmation)}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="p-4 bg-[var(--color-neutral-dark-3)] rounded-lg">
            <h4 className="text-sm font-medium text-[var(--color-neutral-bright)] mb-2">
              Password Requirements:
            </h4>
            <ul className="text-xs text-[var(--color-neutral-bright)]/70 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains lowercase letters (a-z)</li>
              <li>• Contains uppercase letters (A-Z)</li>
              <li>• Contains numbers (0-9)</li>
              <li>• Contains special characters (!@#$%^&*)</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={processing}
              className="cursor-pointer px-6 py-3 bg-[var(--color-warning)] text-[var(--color-neutral-bright)] rounded-lg hover:bg-[var(--color-warning)]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaLock />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}