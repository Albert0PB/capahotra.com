import React from "react";
import { Link } from "@inertiajs/react";
import { Tag, Target, TrendingUp, FileText, ChevronRight, Star } from "lucide-react";

import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function Services() {
    const services = [
        {
            icon: <Tag className="w-8 h-8" />,
            title: "Smart Labels",
            subtitle: "Categorías personalizadas",
            description: "Crea y personaliza tus propias categorías de gastos e ingresos. Organiza tu dinero de la manera que más sentido tenga para ti.",
            features: [
                "Categorías ilimitadas",
                "Personalización completa",
                "Subcategorías anidadas",
                "Colores y iconos personalizados"
            ],
            highlight: "Organización felina"
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Forecasts",
            subtitle: "Presupuestos inteligentes",
            description: "Planifica tu futuro financiero con presupuestos basados en tus categorías personalizadas. Establece metas y haz seguimiento automático.",
            features: [
                "Presupuestos por categorías",
                "Alertas automáticas",
                "Análisis de tendencias",
                "Proyecciones futuras"
            ],
            highlight: "Planificación perfecta"
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Movements",
            subtitle: "Seguimiento detallado",
            description: "Registra y monitorea todos tus movimientos financieros. Visualiza patrones, tendencias y toma decisiones informadas.",
            features: [
                "Registro automático",
                "Gráficos y estadísticas",
                "Filtros avanzados",
                "Exportación de datos"
            ],
            highlight: "Control total"
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "PDF Import",
            subtitle: "Carga automática",
            description: "Sube tus extractos bancarios en PDF y deja que Capahotra extraiga automáticamente todos los datos para ti. ¡Ahorrate horas de trabajo manual!",
            features: [
                "Lectura automática de PDFs",
                "Reconocimiento inteligente",
                "Formularios pre-completados",
                "Múltiples formatos compatibles"
            ],
            highlight: "Magia automatizada"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-[var(--color-neutral-dark)] to-[var(--color-primary)] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold text-[var(--color-neutral-bright)] leading-tight mb-6">
                        Servicios que harán{" "}
                        <span className="text-[var(--color-secondary)] font-extrabold">
                            <em>ronronear</em>
                        </span>{" "}
                        tus finanzas
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-[var(--color-neutral-bright)]/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Descubre todas las herramientas que Capahotra tiene para ofrecerte. 
                        Desde organización hasta automatización, todo diseñado para simplificar tu vida financiera.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="bg-[var(--color-neutral-bright)] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {services.map((service, index) => (
                            <div 
                                key={index}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 sm:p-8 border border-gray-100"
                            >
                                {/* Service Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center text-[var(--color-neutral-bright)] mr-4">
                                            {service.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-neutral-dark)] mb-1">
                                                {service.title}
                                            </h3>
                                            <p className="text-[var(--color-primary)] font-semibold text-sm sm:text-base">
                                                {service.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] px-3 py-1 rounded-full text-xs font-semibold">
                                        {service.highlight}
                                    </div>
                                </div>

                                {/* Service Description */}
                                <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Features List */}
                                <ul className="space-y-3 mb-6">
                                    {service.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center text-gray-700">
                                            <Star className="w-4 h-4 text-[var(--color-secondary)] mr-3 flex-shrink-0" />
                                            <span className="text-sm sm:text-base">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Learn More Link */}
                                <div className="pt-4 border-t border-gray-100">
                                    <Link 
                                        href="/register"
                                        className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-semibold text-sm sm:text-base transition-colors duration-200 group"
                                    >
                                        Comenzar ahora
                                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-neutral-bright)] mb-6">
                        ¿Listo para tomar control de tus finanzas?
                    </h2>
                    <p className="text-lg sm:text-xl text-[var(--color-neutral-bright)]/90 mb-8 max-w-2xl mx-auto">
                        Únete a miles de usuarios que ya disfrutan de la simplicidad y el poder de Capahotra. 
                        Comienza gratis hoy mismo.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                        <Link
                            href="/register"
                            className="w-full sm:w-auto bg-[var(--color-neutral-bright)] text-[var(--color-primary)] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                        >
                            Comenzar Gratis
                        </Link>
                        <Link
                            href="/about-us"
                            className="w-full sm:w-auto border-2 border-[var(--color-neutral-bright)] text-[var(--color-neutral-bright)] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[var(--color-neutral-bright)] hover:text-[var(--color-primary)] transition-all duration-200"
                        >
                            Conocer Más
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}