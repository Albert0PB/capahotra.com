import React from "react";
import { Link } from "@inertiajs/react";
import { 
    Code, 
    Database, 
    Globe, 
    Lightbulb, 
    Target, 
    Users, 
    ChevronRight, 
    Github,
    BookOpen,
    Rocket
} from "lucide-react";

import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function AboutUs() {
    const techStack = [
        {
            icon: <Code className="w-6 h-6" />,
            name: "React + Inertia.js",
            description: "Frontend moderno y dinámico"
        },
        {
            icon: <Database className="w-6 h-6" />,
            name: "Laravel + MySQL",
            description: "Backend robusto y base de datos"
        },
        {
            icon: <Globe className="w-6 h-6" />,
            name: "Tailwind CSS",
            description: "Diseño responsive y elegante"
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            name: "Flask API",
            description: "Procesamiento inteligente de PDFs"
        }
    ];

    const objectives = [
        {
            icon: <Target className="w-8 h-8" />,
            title: "Simplificar las finanzas personales",
            description: "Crear una herramienta intuitiva que haga que gestionar el dinero sea tan fácil como acariciar a un gato."
        },
        {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "Innovar en automatización",
            description: "Implementar tecnología de vanguardia para automatizar la entrada de datos financieros mediante PDFs."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Accesibilidad para todos",
            description: "Diseñar una interfaz que sea útil tanto para principiantes como para usuarios avanzados en finanzas."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-[var(--color-neutral-dark)] to-[var(--color-primary)] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold text-[var(--color-neutral-bright)] leading-tight mb-6">
                        La historia detrás de{" "}
                        <span className="text-[var(--color-secondary)] font-extrabold">
                            <em>Capahotra</em>
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-[var(--color-neutral-bright)]/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Un proyecto de fin de grado que nació con la misión de revolucionar 
                        la gestión de finanzas personales con tecnología moderna y un toque felino.
                    </p>
                </div>
            </section>

            {/* Project Context */}
            <section className="bg-[var(--color-neutral-bright)] px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] px-4 py-2 rounded-full text-sm font-semibold mb-6 inline-block">
                                Proyecto Académico 2025
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-neutral-dark)] mb-6">
                                Un proyecto con propósito
                            </h2>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                Capahotra nació como proyecto de fin de <strong>Grado Superior en Desarrollo de Aplicaciones Web</strong>, 
                                con el objetivo de demostrar las competencias adquiridas y crear una solución real 
                                para un problema cotidiano: la gestión eficiente de las finanzas personales.
                            </p>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                Esta es una <strong>versión de desarrollo</strong> que integra tecnologías modernas 
                                como React, Laravel, y procesamiento inteligente de documentos para ofrecer 
                                una experiencia única en el manejo del dinero personal.
                            </p>
                            <Link 
                                href="https://github.com/iesgrancapitan-proyectos/202425daw-junio-nombreproyecto-Albert0PB/wiki"
                                className="inline-flex items-center bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] px-6 py-3 rounded-full font-semibold hover:bg-[var(--color-primary)] transition-colors duration-200 group"
                            >
                                <Github className="w-5 h-5 mr-2" />
                                Ver Documentación
                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                        </div>
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <h3 className="text-xl font-bold text-[var(--color-neutral-dark)] mb-6">
                                Stack Tecnológico (RILT)
                            </h3>
                            <div className="space-y-4">
                                {techStack.map((tech, index) => (
                                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center text-[var(--color-neutral-bright)] mr-4">
                                            {tech.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[var(--color-neutral-dark)]">
                                                {tech.name}
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                {tech.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Objectives Section */}
            <section className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-neutral-dark)] mb-6">
                            Objetivos del proyecto
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Cada línea de código ha sido escrita con estos objetivos en mente, 
                            buscando crear una solución que realmente marque la diferencia.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {objectives.map((objective, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center text-[var(--color-neutral-bright)] mx-auto mb-4">
                                    {objective.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[var(--color-neutral-dark)] mb-3">
                                    {objective.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {objective.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-neutral-bright)] mb-6">
                        ¿Te gustaría probar Capahotra?
                    </h2>
                    <p className="text-lg sm:text-xl text-[var(--color-neutral-bright)]/90 mb-8 max-w-2xl mx-auto">
                        Aunque está en desarrollo, puedes explorar todas las funcionalidades actuales 
                        y ser parte de esta evolución financiera felina.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                        <Link
                            href="/register"
                            className="w-full sm:w-auto bg-[var(--color-neutral-bright)] text-[var(--color-primary)] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                        >
                            Probar la Demo
                        </Link>
                        <Link
                            href="/services"
                            className="w-full sm:w-auto border-2 border-[var(--color-neutral-bright)] text-[var(--color-neutral-bright)] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[var(--color-neutral-bright)] hover:text-[var(--color-primary)] transition-all duration-200"
                        >
                            Ver Servicios
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}