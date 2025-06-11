import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-[var(--color-neutral-dark)] px-4 sm:px-6 lg:px-12 xl:px-16 py-4 lg:py-8">
            <div className="flex justify-between items-center">
                
                {/* Logo */}
                <div className="flex-shrink-0">
                    <img 
                        src="/images/white-logo-00.png"
                        alt="Logo blanco de Capahotra"
                        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                    />
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center justify-between flex-1 ml-8">
                    <div className="flex space-x-8 xl:space-x-12">
                        <Link 
                            href="/services"
                            className="text-[var(--color-neutral-bright)] text-base xl:text-[1.5rem] hover:text-[var(--color-primary)] transition-colors duration-200"
                        >
                            Servicios
                        </Link>
                        <Link 
                            href="/about-us"
                            className="text-[var(--color-neutral-bright)] text-base xl:text-[1.5rem] hover:text-[var(--color-primary)] transition-colors duration-200"
                        >
                            Sobre Nosotros
                        </Link>
                        <a 
                            href="https://github.com/iesgrancapitan-proyectos/202425daw-junio-nombreproyecto-Albert0PB/wiki"
                            className="text-[var(--color-neutral-bright)] text-base xl:text-[1.5rem] hover:text-[var(--color-primary)] transition-colors duration-200"
                        >
                            Docs
                        </a>
                    </div>
                    
                    <div className="flex items-center space-x-6 xl:space-x-8">
                        <Link 
                            href="/login"
                            className="text-[var(--color-neutral-bright)] text-base xl:text-[1.5rem] hover:text-[var(--color-primary)] transition-colors duration-200"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link 
                            href="/register"
                            className="bg-[var(--color-primary)] text-[var(--color-neutral-bright)] px-4 py-2 xl:px-6 xl:py-3 rounded-full text-base xl:text-[1.5rem] hover:bg-[var(--color-secondary)] transition-colors duration-200"
                        >
                            Registrarse
                        </Link>
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMobileMenu}
                    className="lg:hidden text-[var(--color-neutral-bright)] p-2"
                    aria-label="Alternar menú móvil"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <nav className="lg:hidden mt-4 pb-4 border-t border-[var(--color-neutral-dark-3)] pt-4">
                    <div className="flex flex-col space-y-4">
                        <Link 
                            href="/services"
                            className="text-[var(--color-neutral-bright)] text-base hover:text-[var(--color-primary)] transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Servicios
                        </Link>
                        <Link 
                            href="/about-us"
                            className="text-[var(--color-neutral-bright)] text-base hover:text-[var(--color-primary)] transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Sobre Nosotros
                        </Link>
                        <Link 
                            href="/docs"
                            className="text-[var(--color-neutral-bright)] text-base hover:text-[var(--color-primary)] transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Docs
                        </Link>
                        <hr className="border-[var(--color-neutral-dark-3)]" />
                        <Link 
                            href="/login"
                            className="text-[var(--color-neutral-bright)] text-base hover:text-[var(--color-primary)] transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Iniciar Sesión
                        </Link>
                        <Link 
                            href="/register"
                            className="bg-[var(--color-primary)] text-[var(--color-neutral-bright)] px-4 py-2 rounded-full text-base hover:bg-[var(--color-secondary)] transition-colors duration-200 text-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Registrarse
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
}