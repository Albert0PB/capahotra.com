import React from "react";

export default function OperativePanelSummaryCard({ 
  title, 
  description, 
  icon, 
  stats, 
  ctaText, 
  ctaAction,
  accentColor = "var(--color-primary)"
}) {
  return (
    <div className="bg-[var(--color-neutral-dark-2)] rounded-lg p-6 hover:bg-[var(--color-neutral-dark-3)] transition-all duration-300 group">
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-neutral-bright)]">
              {title}
            </h3>
            <p className="text-sm text-[var(--color-neutral-bright)]/70">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-[var(--color-neutral-bright)]/70">
              {stat.label}
            </span>
            <span className="text-sm font-medium text-[var(--color-neutral-bright)]">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={ctaAction}
        className="cursor-pointer w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 group-hover:transform group-hover:translate-y-[-2px]"
        style={{
          backgroundColor: accentColor,
          color: 'var(--color-neutral-bright)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = accentColor + 'dd';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = accentColor;
        }}
      >
        {ctaText} →
      </button>
    </div>
  );
}