"use client";

import { useEffect, useState } from "react";
import type { AnalysisMode } from "@/lib/types";

interface AnalysisProgressProps {
  mode: AnalysisMode;
}

const STEPS_BY_MODE: Record<
  AnalysisMode,
  { title: string; subtitle: string }[]
> = {
  text: [
    {
      title: "Extracting message",
      subtitle: "Reading and normalizing submitted content",
    },
    {
      title: "Detecting social engineering",
      subtitle: "Looking for urgency, fear, impersonation, and pressure",
    },
    {
      title: "Inspecting links",
      subtitle: "Checking suspicious URLs and hidden redirects",
    },
    {
      title: "Checking domain reputation",
      subtitle: "Evaluating domain age, WHOIS records, and impersonation signals",
    },
    {
      title: "Generating threat assessment",
      subtitle: "Synthesizing forensic indicators into risk score and action plan",
    },
  ],
  image: [
    {
      title: "Reading screenshot",
      subtitle: "Extracting high-fidelity text from uploaded image",
    },
    {
      title: "Analyzing extracted text",
      subtitle: "Identifying scam phrasing and urgency triggers",
    },
    {
      title: "Detecting visual deception",
      subtitle: "Scanning for spoofed brand logos and layout trickery",
    },
    {
      title: "Evaluating threat patterns",
      subtitle: "Cross-referencing known fraud campaigns and templates",
    },
    {
      title: "Generating threat assessment",
      subtitle: "Synthesizing forensic indicators into risk score and action plan",
    },
  ],
  url: [
    {
      title: "Resolving destination URL",
      subtitle: "Checking DNS records and traversing redirect hops",
    },
    {
      title: "Checking threat databases",
      subtitle: "Querying threat intelligence and malicious blacklist feeds",
    },
    {
      title: "Inspecting domain registration",
      subtitle: "Looking up WHOIS registrant details and domain creation age",
    },
    {
      title: "Analyzing URL structure",
      subtitle: "Detecting brand impersonation, deceptive paths, and risky TLDs",
    },
    {
      title: "Generating threat assessment",
      subtitle: "Synthesizing forensic indicators into risk score and action plan",
    },
  ],
};

const STEP_INTERVAL_MS = 800;

export default function AnalysisProgress({ mode }: AnalysisProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = STEPS_BY_MODE[mode];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, STEP_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [steps.length]);

  const progressPercent = Math.min(
    100,
    Math.max(15, Math.round(((currentStep + 1) / steps.length) * 100))
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Threat Analysis in Progress"
      className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-[var(--color-surface-lowest)] border border-[var(--color-outline-variant)] rounded-2xl shadow-2xl p-5 sm:p-7 text-[var(--color-on-surface)] my-auto overflow-hidden">
        {/* Subtle Ambient Glow Effects */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl"
        />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/15 px-2.5 py-1 rounded-full border border-blue-500/25 mb-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              ScamGuard Threat Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-on-surface)]">
              Analyzing suspicious{" "}
              {mode === "text"
                ? "message"
                : mode === "image"
                ? "screenshot"
                : "link"}
              ...
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-on-surface-variant)] mt-1.5 leading-relaxed">
              Evaluating threat indicators, verifying authenticity, and detecting deceptive patterns in real time.
            </p>
          </div>

          {/* Scanner Animated Icon */}
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        </div>

        {/* Progress Bar with Percentage and Step Indicator */}
        <div className="relative mb-6">
          <div className="flex justify-between items-center text-xs mb-2">
            <div className="flex items-center gap-1.5 font-medium text-[var(--color-on-surface-variant)]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Scanning indicators...</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-[var(--color-outline)] bg-[var(--color-surface-container)] px-2 py-0.5 rounded-md">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                {progressPercent}%
              </span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-[var(--color-surface-container)] dark:bg-slate-800/80 overflow-hidden border border-[var(--color-outline-variant)]/40">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="relative space-y-2.5">
          {steps.map((step, index) => {
            const isComplete = index < currentStep;
            const isActive = index === currentStep;

            return (
              <div
                key={index}
                className={`flex items-center gap-3.5 p-3 sm:p-3.5 rounded-xl border transition-all duration-300 ${
                  isComplete
                    ? "border-emerald-500/25 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06]"
                    : isActive
                    ? "border-blue-500/50 bg-blue-500/[0.08] dark:bg-blue-500/[0.12] ring-1 ring-blue-500/25 shadow-xs"
                    : "border-[var(--color-outline-variant)]/50 bg-[var(--color-surface-bright)]/30 opacity-55"
                }`}
              >
                {/* Step Status Icon */}
                <div className="shrink-0 flex items-center justify-center">
                  {isComplete ? (
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : isActive ? (
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/40 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-container)] text-[var(--color-outline)] border border-[var(--color-outline-variant)]/50 flex items-center justify-center text-xs font-mono font-medium">
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Step Title and Subtitle */}
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-xs sm:text-sm leading-snug ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-bold"
                        : isComplete
                        ? "text-[var(--color-on-surface)] font-semibold"
                        : "text-[var(--color-on-surface-variant)] font-medium"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[var(--color-on-surface-variant)]/80 truncate mt-0.5">
                    {step.subtitle}
                  </div>
                </div>

                {/* Right Status Badge */}
                {isComplete && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Done
                  </span>
                )}
                {isActive && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20 px-2 py-0.5 rounded-md border border-blue-500/30 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                    Running
                  </span>
                )}
                {!isComplete && !isActive && (
                  <span className="hidden sm:inline-block text-[11px] text-[var(--color-outline)]/60 font-medium shrink-0">
                    Queued
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Security Guarantees */}
        <div className="relative mt-5 pt-4 border-t border-[var(--color-outline-variant)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--color-outline)]">
          <span className="flex items-center gap-1.5 font-medium">
            <svg
              className="w-3.5 h-3.5 text-blue-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Encrypted Ephemeral Sandbox
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <svg
              className="w-3.5 h-3.5 text-emerald-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Zero-Retention Privacy
          </span>
        </div>
      </div>
    </div>
  );
}
