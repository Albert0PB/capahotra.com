import React from "react";

export default function FinancialNewsDisplayer({ news }) {
    return (
        <div className="p-4 sm:p-6 bg-[var(--color-neutral-dark)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {news.map((item, index) => (
                    <div
                        className="bg-[var(--color-neutral-dark-3)] border border-[var(--color-neutral-dark-3)] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        key={index}
                    >
                        {item.image && (
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                            />
                        )}
                        <div className="p-3 sm:p-4 flex flex-col justify-between h-full">
                            <div className="mb-3">
                                <h3 className="text-[var(--color-neutral-bright)] text-sm sm:text-base lg:text-lg font-semibold mb-2 line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-[var(--color-neutral-bright)]/80 text-xs sm:text-sm line-clamp-3">
                                    {item.description}
                                </p>
                            </div>
                            <div className="text-xs sm:text-sm text-[var(--color-neutral-bright)]/60 flex justify-between items-center mb-2">
                                <span>{new Date(item.date).toLocaleDateString()}</span>
                                <span className="italic">{item.source}</span>
                            </div>
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] hover:underline text-xs sm:text-sm font-medium transition-colors duration-200"
                            >
                                Read more →
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}