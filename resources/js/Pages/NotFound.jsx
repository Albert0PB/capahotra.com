import React from "react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center relative overflow-hidden">
            
            <div className="text-center z-10 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between h-48 sm:h-56 lg:h-72 mb-16 sm:mb-20 lg:mb-32">
                    
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[5rem] font-extrabold text-[var(--color-neutral-bright)] mb-8 sm:mb-12">
                        404 - No Encontrado
                    </h2>
                    
                    <div className="flex flex-col justify-between items-center gap-8 sm:gap-12 lg:gap-16">
                        <p className="text-lg sm:text-xl lg:text-2xl xl:text-[2rem] text-[var(--color-neutral-bright)] max-w-md sm:max-w-lg lg:max-w-xl leading-relaxed">
                            Parece que te has perdido... ¡Intenta empezar de nuevo desde Inicio!
                        </p>
                        
                        <a 
                            href="/"
                            className="inline-block px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-4 bg-[var(--color-neutral-dark)] text-[var(--color-neutral-bright)] rounded-full text-base sm:text-lg lg:text-xl xl:text-[1.5rem] font-medium hover:bg-[var(--color-neutral-dark-2)] transition-colors duration-200 no-underline"
                        >
                            Regresar
                        </a>
                    </div>
                </div>
            </div>

            <img
                src="/images/cat-wow-nobg.png"
                alt="imagen de gato sorprendido"
                className="absolute bottom-0 left-0 w-2/5 sm:w-1/3 lg:w-2/5 xl:w-2/5 h-auto z-[5] hidden sm:block"
            />

            <img
                src="/images/little-tiger-nobg.png"
                alt="imagen de tigre pequeño"
                className="absolute bottom-0 right-0 w-1/3 sm:w-1/4 lg:w-1/3 xl:w-1/3 h-auto z-[5] transform scale-x-[-1] hidden sm:block"
            />

            <img
                src="/images/cat-wow-nobg.png"
                alt="imagen de gato sorprendido"
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/5 h-auto z-[5] sm:hidden opacity-20"
            />
        </div>
    );
}