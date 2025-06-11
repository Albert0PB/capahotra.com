import React from "react";
import { Link } from "@inertiajs/react";

export default function Footer() {
    return (
        <footer className="bg-[var(--color-neutral-dark)] py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-4">
                            <img 
                                src="/images/white-logo-00.png"
                                alt="Logo de Capahotra"
                                className="w-8 h-8 mr-3"
                            />
                            <span className="text-[var(--color-neutral-bright)] text-xl font-semibold">
                                Capahotra
                            </span>
                        </div>
                        <p className="text-[var(--color-neutral-bright)]/70 text-sm sm:text-base max-w-md">
                            Tus finanzas: a la manera <em>felina</em>. 
                            Gestiona tu dinero con el equilibrio purr-fecto entre simplicidad y potencia.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-[var(--color-neutral-bright)] font-semibold mb-4">
                            Enlaces Rápidos
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    href="/services"
                                    className="text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-primary)] transition-colors duration-200 text-sm sm:text-base"
                                >
                                    Servicios
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/about-us"
                                    className="text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-primary)] transition-colors duration-200 text-sm sm:text-base"
                                >
                                    Sobre Nosotros
                                </Link>
                            </li>
                            <li>
                                <a 
                                    href="https://github.com/iesgrancapitan-proyectos/202425daw-junio-nombreproyecto-Albert0PB/wiki"
                                    className="text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-primary)] transition-colors duration-200 text-sm sm:text-base"
                                >
                                    Documentación
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="text-[var(--color-neutral-bright)] font-semibold mb-4">
                            Cuenta
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    href="/login"
                                    className="text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-primary)] transition-colors duration-200 text-sm sm:text-base"
                                >
                                    Iniciar Sesión
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/register"
                                    className="text-[var(--color-neutral-bright)]/70 hover:text-[var(--color-primary)] transition-colors duration-200 text-sm sm:text-base"
                                >
                                    Registrarse
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 pt-6 border-t border-[var(--color-neutral-dark-3)] flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-[var(--color-neutral-bright)]/60 text-sm">
                        © 2025 Capahotra. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}