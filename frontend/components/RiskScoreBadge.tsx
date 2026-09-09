import type { ThreatReport as ThreatReportType } from "@/lib/types";

interface RiskScoreBadgeProps {
  riskScore: number;
  threatLevel: ThreatReportType["threat_level"];
}

export default function RiskScoreBadge({
  riskScore,
  threatLevel,
}: RiskScoreBadgeProps) {
  const configs = {
    CRITICAL: {
      color: "var(--color-threat-critical)",
      bgColor: "var(--color-threat-critical-bg)",
      borderColor: "var(--color-threat-critical-border)",
      ringColor: "#ef4444",
      label: "Critical Threat",
      subLabel: "Dangerous Scam",
      icon: "dangerous",
    },
    SUSPICIOUS: {
      color: "var(--color-threat-warning)",
      bgColor: "var(--color-threat-warning-bg)",
      borderColor: "var(--color-threat-warning-border)",
      ringColor: "#f59e0b",
      label: "Suspicious",
      subLabel: "Caution Advised",
      icon: "warning",
    },
    SAFE: {
      color: "var(--color-threat-safe)",
      bgColor: "var(--color-threat-safe-bg)",
      borderColor: "var(--color-threat-safe-border)",
      ringColor: "#10b981",
      label: "Minimal Risk",
      subLabel: "Likely Safe",
      icon: "verified_user",
    },
  };

  const config = configs[threatLevel] || configs.SAFE;

  // SVG Circular Gauge parameters
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <div
      className="p-4 sm:p-5 rounded-2xl flex items-center gap-4 sm:gap-5 shrink-0 transition-all shadow-xs"
      style={{
        background: config.bgColor,
        border: `1.5px solid ${config.borderColor}`,
      }}
    >
      {/* Circular Risk Meter Gauge */}
      <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 96 96">
          {/* Background track */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-current text-black/10 dark:text-white/10"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Active progress ring */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={config.ringColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text inside gauge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className="text-2xl sm:text-3xl font-black tracking-tight leading-none"
            style={{ color: config.color }}
          >
            {riskScore}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-outline)] mt-0.5">
            Risk
          </span>
        </div>
      </div>

      {/* Label and Qualitative Status */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-outline)]">
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ color: config.color }}
          >
            {config.icon}
          </span>
          <span>Threat Level</span>
        </div>
        <div
          className="text-lg sm:text-xl font-extrabold tracking-tight mt-0.5"
          style={{ color: config.color }}
        >
          {config.label}
        </div>
        <div className="text-xs sm:text-sm font-medium text-[var(--color-on-surface-variant)] mt-0.5">
          {config.subLabel}
        </div>
      </div>
    </div>
  );
}
