import React from "react";

export default function FinancialNewsDisplayer({ news }) {
    return (
        <div className="financial-news-displayer p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20">
            {news.map((item, index) => (
                <div
                    className="news-card border rounded-lg shadow-md overflow-hidden bg-white"
                    key={index}
                >
                    {item.image && (
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                        />
                    )}
                    <div className="p-4 flex flex-col justify-between h-full">
                        <div className="mb-3">
                            <h3 className="news-title text-lg font-semibold mb-1">
                                {item.title}
                            </h3>
                            <p className="news-description text-sm text-[var(--color-neutral-bright)]/80 line-clamp-3">
                                {item.description}
                            </p>
                        </div>
                        <div className="text-sm text-gray-500 flex justify-between items-center">
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                            <span className="italic">{item.source}</span>
                        </div>
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 text-blue-600 hover:underline text-sm"
                        >
                            Read more →
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}
