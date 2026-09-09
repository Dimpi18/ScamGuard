import type { ThreatIndicator } from "@/lib/types";

interface ThreatIndicatorsProps {
  indicators: ThreatIndicator[];
}

export default function ThreatIndicators({
  indicators,
}: ThreatIndicatorsProps) {
  if (!indicators.length) return null;

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-[20px] text-[var(--color-secondary)]">
          flag
        </span>
        <div>
          <h2 className="font-bold text-[15px] uppercase tracking-wide text-[var(--color-on-surface)]">
            Detected Threat Red Flags
          </h2>
          <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
            Specific deceptive signals and vulnerabilities uncovered during analysis.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3.5">
        {indicators.map((indicator, index) => {
          const isCritical = indicator.severity === "critical";
          const isWarning = indicator.severity === "warning";

          const bgColor = isCritical
            ? "var(--color-threat-critical-bg)"
            : isWarning
            ? "var(--color-threat-warning-bg)"
            : "var(--color-surface-low)";
          const borderColor = isCritical
            ? "var(--color-threat-critical-border)"
            : isWarning
            ? "var(--color-threat-warning-border)"
            : "var(--color-outline-variant)";
          const textColor = isCritical
            ? "var(--color-threat-critical)"
            : isWarning
            ? "var(--color-threat-warning)"
            : "var(--color-threat-safe)";
          const icon = isCritical
            ? "error"
            : isWarning
            ? "warning"
            : "info";

          return (
            <div
              key={index}
              className={`p-4 rounded-xl flex items-start gap-3 transition-all ${
                index === indicators.length - 1 && indicators.length % 2 !== 0
                  ? "sm:col-span-2"
                  : ""
              }`}
              style={{
                background: bgColor,
                border: `1.5px solid ${borderColor}`,
              }}
            >
              <span
                className="material-symbols-outlined text-[20px] shrink-0 mt-0.5"
                style={{ color: textColor }}
              >
                {icon}
              </span>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className="font-bold text-[14px]"
                    style={{ color: textColor }}
                  >
                    {indicator.name}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{
                      color: textColor,
                      background: isCritical
                        ? "rgba(220, 38, 38, 0.12)"
                        : isWarning
                        ? "rgba(217, 119, 6, 0.12)"
                        : "rgba(22, 163, 74, 0.12)",
                    }}
                  >
                    {indicator.severity}
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-[var(--color-on-surface-variant)] mt-1 leading-relaxed">
                  {indicator.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
