import React from "react";
import { useForm, Link } from "@inertiajs/react";
import { Mail } from "lucide-react";

import Logo from "../../Components/Logo";

export default function ForgotPassword() {
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            email: "",
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/forgot-password");
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-secondary)] flex justify-center items-center p-4">
            <form 
                onSubmit={handleSubmit} 
                className="flex flex-col items-center justify-center bg-[var(--color-neutral-bright)] rounded-xl sm:rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-3xl p-6 sm:p-8 lg:p-12 space-y-6 sm:space-y-8"
            >
                {/* Header with Logo and Title */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8">
                    <Logo />
                    <h2 className="text-[var(--color-neutral-dark)] text-lg sm:text-xl lg:text-2xl xl:text-[2rem] font-semibold text-center sm:text-left whitespace-nowrap">
                        ¿Olvidaste tu contraseña?
                    </h2>
                </div>

                {/* Description */}
                <p className="text-[var(--color-neutral-dark)]/80 text-sm sm:text-base lg:text-lg text-center max-w-md">
                    Introduce tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>

                {/* Email Input */}
                <div className="w-full max-w-sm sm:max-w-md">
                    <div className="flex items-center border-b-2 border-[var(--color-neutral-dark-2)] pb-2 mb-4 w-full">
                        <Mail className="mr-3 text-[var(--color-neutral-dark-2)] flex-shrink-0" size={20} />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="Correo electrónico"
                            maxLength={100}
                            className="flex-1 bg-transparent border-0 outline-none text-[var(--color-neutral-dark)] placeholder:text-[var(--color-neutral-dark)]/60 text-sm sm:text-base"
                            required
                        />
                    </div>
                    {errors.email && (
                        <span className="text-[var(--color-error)] text-xs sm:text-sm block">
                            {errors.email}
                        </span>
                    )}
                </div>

                {/* Success Message */}
                {recentlySuccessful && (
                    <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)] rounded-lg p-3 sm:p-4 w-full max-w-sm sm:max-w-md">
                        <p className="text-[var(--color-success)] text-sm sm:text-base text-center">
                            Se ha enviado un enlace para restablecer la contraseña a tu correo electrónico.
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit"
                    disabled={processing}
                    className="w-full max-w-sm sm:max-w-md bg-[var(--color-neutral-dark-2)] text-[var(--color-neutral-bright)] py-3 px-6 rounded-full font-medium text-sm sm:text-base lg:text-[1.5rem] hover:bg-[var(--color-neutral-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {processing ? "Enviando..." : "Enviar enlace de restablecimiento"}
                </button>

                {/* Links */}
                <div className="text-center">
                    <Link 
                        href="/login"
                        className="text-[var(--color-neutral-dark-2)]/70 hover:text-[var(--color-neutral-dark-2)] text-sm sm:text-base transition-colors duration-200"
                    >
                        ¿Recordaste tu contraseña? <span className="underline">Iniciar sesión</span>
                    </Link>
                </div>
            </form>
        </div>
    );
}