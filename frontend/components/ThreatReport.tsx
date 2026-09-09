"use client";

import type { ThreatReport as ThreatReportType } from "@/lib/types";
import RiskScoreBadge from "./RiskScoreBadge";
import ThreatIndicators from "./ThreatIndicators";
import AttackChain from "./AttackChain";
import RecommendedActions from "./RecommendedActions";

interface ThreatReportProps {
  report: ThreatReportType;
  originalContent?: string;
  onReset: () => void;
}

export default function ThreatReport({
  report,
  originalContent,
  onReset,
}: ThreatReportProps) {
  const displayMessage =
    report.extracted_text || originalContent || "";

  const isCritical = report.threat_level === "CRITICAL";
  const isSuspicious = report.threat_level === "SUSPICIOUS";

  return (
    <div className="fixed inset-0 z-[101] bg-[var(--color-background)] text-[var(--color-on-surface)] overflow-y-auto">
      <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-5">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-[var(--color-outline-variant)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">
                shield
              </span>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-secondary)]">
                ScamGuard Threat Report
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-on-surface)]">
                Security Assessment
              </h1>
            </div>
          </div>

          <button
            onClick={onReset}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-lowest)] hover:bg-[var(--color-surface-low)] text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:border-[var(--color-secondary)]/40"
          >
            <span className="material-symbols-outlined text-[18px]">
              refresh
            </span>
            <span>Check Another</span>
          </button>
        </div>

        {/* 1. HERO VERDICT & RISK SCORE GAUGE */}
        <section className="card p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
            <RiskScoreBadge
              riskScore={report.risk_score}
              threatLevel={report.threat_level}
            />

            <div className="flex-1 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-outline)] mb-1.5">
                <span>Core Verdict</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-on-surface)] leading-snug">
                {report.verdict}
              </h2>
              {report.explanations.length > 0 && (
                <p className="text-sm sm:text-[15px] text-[var(--color-on-surface-variant)] mt-2 leading-relaxed">
                  {report.explanations[0].description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 2. IMMEDIATE ACTIONABLE ADVICE (DO'S & DON'TS) */}
        {report.recommended_actions.length > 0 && (
          <RecommendedActions actions={report.recommended_actions} />
        )}

        {/* 3. INSPECTED MESSAGE / OCR EXTRACTED TEXT */}
        {displayMessage && (
          <section className="card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[var(--color-outline)]">
                  {report.extracted_text ? "document_scanner" : "chat"}
                </span>
                <h3 className="font-bold text-[14px] uppercase tracking-wide text-[var(--color-on-surface)]">
                  {report.extracted_text
                    ? "Extracted Screenshot Text"
                    : "Submitted Content"}
                </h3>
              </div>
              <span className="text-xs text-[var(--color-outline)] font-mono">
                {displayMessage.length} chars
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[var(--color-surface-bright)] border border-[var(--color-outline-variant)] text-[14px] leading-relaxed text-[var(--color-on-surface)] whitespace-pre-wrap break-words font-mono text-xs sm:text-sm">
              &ldquo;{displayMessage}&rdquo;
            </div>
          </section>
        )}

        {/* 4. WHY THIS IS SUSPICIOUS (PLAIN ENGLISH EXPLANATIONS) */}
        {report.explanations.length > 0 && (
          <section className="card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[20px] text-[var(--color-secondary)]">
                psychology_alt
              </span>
              <h3 className="font-bold text-[15px] uppercase tracking-wide text-[var(--color-on-surface)]">
                Why This Is Suspicious
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-3.5 text-[14px]">
              {report.explanations.map((explanation, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/60 flex flex-col justify-between"
                >
                  <div>
                    <div className="font-bold text-[14px] text-[var(--color-on-surface)] mb-1">
                      {explanation.title}
                    </div>
                    <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                      {explanation.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. THREAT INDICATORS */}
        <ThreatIndicators indicators={report.threat_indicators} />

        {/* 6. ATTACK PROGRESSION CHAIN */}
        <AttackChain steps={report.attack_chain} />

        {/* 7. URL TECHNICAL INTELLIGENCE (IF URL SUBMISSION) */}
        {report.url_intelligence && (
          <section className="card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[20px] text-[var(--color-secondary)]">
                dns
              </span>
              <h3 className="font-bold text-[15px] uppercase tracking-wide text-[var(--color-on-surface)]">
                URL Technical Forensics
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3.5 text-[14px]">
              {report.url_intelligence.safe_browsing_verdict && (
                <div className="p-4 rounded-xl bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/60">
                  <div className="text-xs font-semibold text-[var(--color-outline)] uppercase tracking-wider">
                    Safe Browsing Status
                  </div>
                  <div className="text-[13px] text-[var(--color-on-surface)] font-mono font-bold mt-1">
                    {report.url_intelligence.safe_browsing_verdict}
                  </div>
                </div>
              )}
              {report.url_intelligence.domain_age_days !== null && (
                <div className="p-4 rounded-xl bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/60">
                  <div className="text-xs font-semibold text-[var(--color-outline)] uppercase tracking-wider">
                    Domain Age
                  </div>
                  <div className="text-[13px] text-[var(--color-on-surface)] font-bold mt-1 flex items-center gap-2">
                    <span>{report.url_intelligence.domain_age_days} days</span>
                    {report.url_intelligence.is_newly_registered && (
                      <span className="badge-warning text-[10px] px-1.5 py-0.5 rounded font-bold">
                        NEWLY REGISTERED
                      </span>
                    )}
                  </div>
                </div>
              )}
              {report.url_intelligence.registrar && (
                <div className="p-4 rounded-xl bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/60">
                  <div className="text-xs font-semibold text-[var(--color-outline)] uppercase tracking-wider">
                    Registrar
                  </div>
                  <div className="text-[13px] text-[var(--color-on-surface)] font-semibold mt-1">
                    {report.url_intelligence.registrar}
                  </div>
                </div>
              )}
              {report.url_intelligence.dns_records &&
                report.url_intelligence.dns_records.length > 0 && (
                  <div className="p-4 rounded-xl bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)]/60">
                    <div className="text-xs font-semibold text-[var(--color-outline)] uppercase tracking-wider">
                      DNS Records
                    </div>
                    <div className="text-[12px] text-[var(--color-on-surface-variant)] mt-1 font-mono space-y-0.5">
                      {report.url_intelligence.dns_records.map(
                        (record, index) => (
                          <div key={index}>{record}</div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </section>
        )}

        {/* Footer Timestamp & Privacy Assurance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 pb-8 border-t border-[var(--color-outline-variant)] text-xs text-[var(--color-outline)]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-emerald-500">
              lock
            </span>
            <span>
              Analysis conducted in an encrypted sandbox. Zero data stored.
            </span>
          </div>
          <div className="font-mono">
            Analyzed {new Date(report.analyzed_at).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
