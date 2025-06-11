import React from "react";
import { useForm, Link } from "@inertiajs/react";
import { Mail, Lock, User } from "lucide-react";

import Logo from "../../Components/Logo";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/register", {
            onSuccess: () => {
                window.location.href = "/dashboard";
            },
        });
    };

    return (
        <div className="h-screen w-screen flex flex-col lg:flex-row">
            {/* Form Section */}
            <div className="w-full lg:w-2/5 h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 sm:space-y-6">
                    
                    {/* Logo and Title in same line */}
                    <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
                        <Logo />
                        <h2 className="text-[var(--color-neutral-dark)] text-lg sm:text-xl lg:text-2xl xl:text-[2rem] font-semibold text-center sm:text-left whitespace-nowrap">
                            Crear una Cuenta
                        </h2>
                    </div>

                    {/* Name Input */}
                    <div className="w-full">
                        <div className="flex items-center border-b-2 border-[var(--color-neutral-dark-2)] pb-2 mb-2">
                            <User className="mr-3 text-[var(--color-neutral-dark-2)] flex-shrink-0" size={20} />
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Nombre Completo"
                                className="flex-1 bg-transparent border-0 outline-none text-[var(--color-neutral-dark)] placeholder:text-[var(--color-neutral-dark)]/60 text-sm sm:text-base"
                                required
                            />
                        </div>
                        {errors.name && (
                            <span className="text-[var(--color-error)] text-xs sm:text-sm block mb-2">
                                {errors.name}
                            </span>
                        )}
                    </div>

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

                    {/* Password Input */}
                    <div className="w-full">
                        <div className="flex items-center border-b-2 border-[var(--color-neutral-dark-2)] pb-2 mb-2">
                            <Lock className="mr-3 text-[var(--color-neutral-dark-2)] flex-shrink-0" size={20} />
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                placeholder="Contraseña"
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
                                placeholder="Confirmar Contraseña"
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
                        className="w-full bg-[var(--color-neutral-dark-2)] text-[var(--color-neutral-bright)] py-3 px-6 rounded-full font-medium text-sm sm:text-base lg:text-[1.5rem] hover:bg-[var(--color-neutral-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 mt-4 sm:mt-6"
                    >
                        {processing ? "Creando cuenta..." : "Registrarse"}
                    </button>

                    {/* Links */}
                    <div className="text-center mt-4 sm:mt-6">
                        <Link 
                            href="/login"
                            className="text-[var(--color-neutral-dark-2)]/70 hover:text-[var(--color-neutral-dark-2)] text-sm sm:text-base transition-colors duration-200"
                        >
                            ¿Ya tienes una cuenta? <span className="underline">Inicia sesión aquí</span>
                        </Link>
                    </div>
                </form>
            </div>

            {/* Image Section - Desktop only */}
            <div className="hidden lg:flex w-3/5 h-full relative items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] opacity-40 z-10"></div>
                <img 
                    src="/images/cat-yawn.jpg" 
                    alt="gato bostezando" 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Mobile Image Background */}
            <div className="lg:hidden absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] opacity-10"></div>
                <img 
                    src="/images/cat-yawn.jpg" 
                    alt="gato bostezando" 
                    className="w-full h-full object-cover opacity-10"
                />
            </div>
        </div>
    );
}