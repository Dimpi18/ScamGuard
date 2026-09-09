import type { AttackChainStep } from "@/lib/types";

interface AttackChainProps {
  steps: AttackChainStep[];
}

export default function AttackChain({ steps }: AttackChainProps) {
  if (!steps.length) return null;

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-[20px] text-[var(--color-secondary)]">
          account_tree
        </span>
        <div>
          <h2 className="font-bold text-[15px] uppercase tracking-wide text-[var(--color-on-surface)]">
            How This Attack Unfolds
          </h2>
          <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
            The step-by-step psychological and technical progression staged by the scammer.
          </p>
        </div>
      </div>

      <div className="relative space-y-3">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isInitial = index === 0;

          return (
            <div key={index} className="relative flex items-start gap-3.5 group">
              {/* Step Number Bubble */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 z-10 ${
                  isLast
                    ? "bg-red-600 text-white shadow-xs"
                    : isInitial
                    ? "bg-blue-600 text-white"
                    : "bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)]"
                }`}
              >
                {step.order || index + 1}
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className="absolute left-3.5 top-7 bottom-0 w-0.5 -ml-[1px] bg-[var(--color-outline-variant)]"
                />
              )}

              {/* Step Card */}
              <div
                className={`flex-1 p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isLast
                    ? "bg-red-500/[0.06] dark:bg-red-950/30 border-red-500/30"
                    : "bg-[var(--color-surface-low)] border-[var(--color-outline-variant)]/60"
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span
                    className={`font-bold text-[14px] ${
                      isLast
                        ? "text-red-600 dark:text-red-400"
                        : "text-[var(--color-on-surface)]"
                    }`}
                  >
                    {step.tactic}
                  </span>
                  {isLast && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      Final Objective
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="text-xs sm:text-[13px] text-[var(--color-on-surface-variant)] mt-1 leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
