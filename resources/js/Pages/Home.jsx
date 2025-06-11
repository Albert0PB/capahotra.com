import React from "react";
import { Link } from "@inertiajs/react";

import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            
            {/* Main Content */}
            <main className="flex-1 bg-gradient-to-b from-[var(--color-neutral-dark)] to-[var(--color-primary)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-24">
                <div className="max-w-4xl mx-auto text-center">
                    
                    {/* Main Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[4rem] font-bold text-[var(--color-neutral-bright)] leading-tight mb-8 sm:mb-12">
                        Tus finanzas: a la manera{" "}
                        <span className="text-[var(--color-secondary)] font-extrabold">
                            <em>felina</em>
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl lg:text-2xl text-[var(--color-neutral-bright)]/90 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
                        Gestiona tu dinero con el equilibrio purr-fecto entre simplicidad y potencia. 
                        Rastrea gastos, planifica presupuestos y alcanza tus objetivos financieros.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                        <Link
                            href="/register"
                            className="w-full sm:w-auto bg-[var(--color-secondary)] text-[var(--color-neutral-bright)] px-8 py-4 rounded-full text-lg lg:text-xl font-semibold hover:bg-[var(--color-secondary)]/90 transition-all duration-200 transform hover:scale-105"
                        >
                            Empezar Gratis
                        </Link>
                        <Link
                            href="/login"
                            className="w-full sm:w-auto border-2 border-[var(--color-neutral-bright)] text-[var(--color-neutral-bright)] px-8 py-4 rounded-full text-lg lg:text-xl font-semibold hover:bg-[var(--color-neutral-bright)] hover:text-[var(--color-neutral-dark)] transition-all duration-200"
                        >
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}