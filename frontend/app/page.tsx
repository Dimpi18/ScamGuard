"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalysisCard from "@/components/AnalysisCard";
import AnalysisProgress from "@/components/AnalysisProgress";
import ThreatReport from "@/components/ThreatReport";
import HowItWorks from "@/components/HowItWorks";
import CommonScams from "@/components/CommonScams";
import { useAnalysis } from "@/hooks/useAnalysis";

type TabId = "paste" | "screenshot" | "link";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("paste");
  const [presetText, setPresetText] = useState<string | undefined>(undefined);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    state,
    mode,
    originalContent,
    report,
    error,
    submitText,
    submitImage,
    submitURL,
    reset,
  } = useAnalysis();

  const handleQuickSelect = (tab: TabId) => {
    setActiveTab(tab);
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSelectSample = (tab: "paste" | "link", text: string) => {
    setActiveTab(tab);
    setPresetText(text);
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="bg-[var(--color-background)] text-[var(--color-on-surface)] min-h-screen flex flex-col justify-between transition-colors duration-200">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] shrink-0">
                error
              </span>
              <span>{error}</span>
            </div>
            <button
              onClick={reset}
              className="text-xs font-semibold underline hover:opacity-80 ml-4 shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero & Plain English Value Proposition */}
        <section className="text-center flex flex-col items-center max-w-3xl mx-auto pt-4 sm:pt-8 pb-2 px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-800/70 rounded-full text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold mb-4 shadow-xs backdrop-blur-xs transition-all hover:border-blue-300 dark:hover:border-blue-700">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-blue-600 dark:text-blue-400">
              shield
            </span>
            <span>Free Personal Threat Protection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-on-surface)] leading-[1.12] sm:leading-[1.15] text-balance">
            Don&apos;t just detect the scam.{" "}
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Understand the attack.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--color-on-surface-variant)] leading-relaxed mt-4 sm:mt-5 text-balance font-normal">
            Got a suspicious text, email, or link? Check it in seconds to uncover
            how the scam works and stay protected.
          </p>
        </section>

        {/* Main Ingestion Card */}
        <div ref={cardRef}>
          <AnalysisCard
            onSubmitText={submitText}
            onSubmitImage={submitImage}
            onSubmitURL={submitURL}
            isAnalyzing={state === "analyzing"}
            selectedTab={activeTab}
            onTabSelect={setActiveTab}
            presetText={presetText}
          />
        </div>

        {/* Secondary Modality Quick Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card: Upload Screenshot */}
          <div
            id="card-trigger-screenshot"
            onClick={() => handleQuickSelect("screenshot")}
            className="card p-5 flex items-start gap-4 transition-all cursor-pointer group hover:border-[var(--color-secondary)]/50"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-low)] flex items-center justify-center text-[var(--color-primary)] dark:text-blue-400 shrink-0 group-hover:bg-[var(--color-primary)] group-hover:text-white dark:group-hover:bg-blue-600 transition-colors">
              <span className="material-symbols-outlined text-[22px]">
                document_scanner
              </span>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[15px] text-[var(--color-on-surface)] group-hover:text-[var(--color-secondary)] transition-colors">
                  Upload Screenshot
                </h3>
                <span className="material-symbols-outlined text-[var(--color-outline)] text-[18px] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-on-surface-variant)] mt-1 leading-relaxed">
                Drop an image of an SMS, DM, or email to automatically extract and
                inspect deceptive text and spoofed brands.
              </p>
            </div>
          </div>

          {/* Card: Analyze Link */}
          <div
            id="card-trigger-link"
            onClick={() => handleQuickSelect("link")}
            className="card p-5 flex items-start gap-4 transition-all cursor-pointer group hover:border-[var(--color-secondary)]/50"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-low)] flex items-center justify-center text-[var(--color-primary)] dark:text-blue-400 shrink-0 group-hover:bg-[var(--color-primary)] group-hover:text-white dark:group-hover:bg-blue-600 transition-colors">
              <span className="material-symbols-outlined text-[22px]">
                link
              </span>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[15px] text-[var(--color-on-surface)] group-hover:text-[var(--color-secondary)] transition-colors">
                  Analyze Link
                </h3>
                <span className="material-symbols-outlined text-[var(--color-outline)] text-[18px] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-on-surface-variant)] mt-1 leading-relaxed">
                Paste a suspicious URL to safely check registrar, domain age,
                and threat intelligence databases without risk.
              </p>
            </div>
          </div>
        </section>

        {/* Trust & Privacy Badges */}
        <section className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 border-t border-[var(--color-outline-variant)]/60 text-[var(--color-on-surface-variant)]">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
            <span className="material-symbols-outlined text-[18px] text-[var(--color-secondary)]">
              verified_user
            </span>
            <span>100% Private &amp; Anonymous</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-outline-variant)] hidden sm:block" />
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
            <span className="material-symbols-outlined text-[18px] text-[var(--color-secondary)]">
              visibility_off
            </span>
            <span>No data stored or shared</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-outline-variant)] hidden sm:block" />
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
            <span className="material-symbols-outlined text-[18px] text-[var(--color-secondary)]">
              delete_sweep
            </span>
            <span>Zero-retention inspection</span>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Common Scams Section */}
        <CommonScams onSelectSample={handleSelectSample} />
      </main>

      <Footer />

      {/* Full-Screen Analysis Loading Overlay */}
      {state === "analyzing" && <AnalysisProgress mode={mode} />}

      {/* Full-Screen Threat Analysis Results Overlay */}
      {state === "complete" && report && (
        <ThreatReport
          report={report}
          originalContent={originalContent}
          onReset={reset}
        />
      )}
    </div>
  );
}
