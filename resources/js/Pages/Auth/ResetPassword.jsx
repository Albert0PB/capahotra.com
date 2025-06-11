import React from "react";
import { useForm } from "@inertiajs/react";
import { Mail, Lock } from "lucide-react";
import Logo from "../../Components/Logo";

export default function ResetPassword({ token, email: defaultEmail }) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email: defaultEmail || "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/reset-password");
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex justify-center items-center p-4">
            <form 
                onSubmit={handleSubmit} 
                className="flex flex-col items-center justify-center bg-[var(--color-neutral-bright)] rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg p-6 sm:p-8 lg:p-10 space-y-6"
            >
                {/* Logo */}
                <Logo />
                
                {/* Title */}
                <h2 className="text-[var(--color-neutral-dark)] text-xl sm:text-2xl lg:text-[2rem] font-semibold text-center">
                    Restablecer tu contraseña
                </h2>

                {/* Email Input */}
                <div className="w-full">
                    <div className="flex items-center border-b-2 border-[var(--color-neutral-dark-2)] pb-2 mb-2">
                        <Mail className="mr-3 text-[var(--color-neutral-dark-2)] flex-shrink-0" size={20} />
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="Correo electrónico"
                            className="flex-1 bg-transparent border-0 outline-none text-[var(--color-neutral-dark)] placeholder:text-[var(--color-neutral-dark)]/60 text-sm sm:text-base"
                            required
                        />
                    </div>
                    {errors.email && (
                        <span className="text-[var(--color-error)] text-xs sm:text-sm block mb-2">
                            {errors.email}
                        </span>
                    )}
                </div>

                {/* New Password Input */}
                <div className="w-full">
                    <div className="flex items-center border-b-2 border-[var(--color-neutral-dark-2)] pb-2 mb-2">
                        <Lock className="mr-3 text-[var(--color-neutral-dark-2)] flex-shrink-0" size={20} />
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="Nueva contraseña"
                            className="flex-1 bg-transparent border-0 outline-none text-[var(--color-neutral-dark)] placeholder:text-[var(--color-neutral-dark)]/60 text-sm sm:text-base"
                            required
                        />
                    </div>
                    {errors.password && (
                        <span className="text-[var(--color-error)] text-xs sm:text-sm block mb-2">
                            {errors.password}
                        </span>
                    )}
                </div>

                {/* Confirm Password Input */}
                <div className="w-full">
                    <div className="flex items-center border-b-2 border-[var(--color-neutral-dark-2)] pb-2 mb-2">
                        <Lock className="mr-3 text-[var(--color-neutral-dark-2)] flex-shrink-0" size={20} />
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            placeholder="Confirmar contraseña"
                            className="flex-1 bg-transparent border-0 outline-none text-[var(--color-neutral-dark)] placeholder:text-[var(--color-neutral-dark)]/60 text-sm sm:text-base"
                            required
                        />
                    </div>
                    {errors.password_confirmation && (
                        <span className="text-[var(--color-error)] text-xs sm:text-sm block mb-2">
                            {errors.password_confirmation}
                        </span>
                    )}
                </div>

                {/* Submit Button */}
                <button 
                    type="submit"
                    disabled={processing}
                    className="w-full bg-[var(--color-neutral-dark-2)] text-[var(--color-neutral-bright)] py-3 px-6 rounded-full font-medium text-sm sm:text-base lg:text-[1.5rem] hover:bg-[var(--color-neutral-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 mt-4"
                >
                    {processing ? "Restableciendo..." : "Enviar nueva contraseña"}
                </button>
            </form>
        </div>
    );
}