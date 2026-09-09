import type { RecommendedAction } from "@/lib/types";

interface RecommendedActionsProps {
  actions: RecommendedAction[];
}

export default function RecommendedActions({
  actions,
}: RecommendedActionsProps) {
  if (!actions.length) return null;

  const donts = actions.filter((a) => a.action_type === "dont");
  const dos = actions.filter((a) => a.action_type === "do");

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-[20px] text-[var(--color-secondary)]">
          checklist
        </span>
        <h2 className="font-bold text-[15px] uppercase tracking-wide text-[var(--color-on-surface)]">
          What You Should Do Right Now
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-3.5">
        {/* DON'T ACTIONS */}
        {donts.map((action, index) => (
          <div
            key={`dont-${index}`}
            className="p-4 rounded-xl flex items-start gap-3 transition-all"
            style={{
              background: "var(--color-threat-critical-bg)",
              border: "1.5px solid var(--color-threat-critical-border)",
            }}
          >
            <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">
                block
              </span>
            </div>
            <div className="flex-1">
              <span className="inline-block px-1.5 py-0.5 bg-red-600/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider rounded mb-1 border border-red-500/20">
                Do Not
              </span>
              <p className="text-[14px] font-semibold text-[var(--color-on-surface)] leading-snug">
                {action.action}
              </p>
            </div>
          </div>
        ))}

        {/* DO ACTIONS */}
        {dos.map((action, index) => (
          <div
            key={`do-${index}`}
            className={`p-4 rounded-xl flex items-start gap-3 transition-all ${
              dos.length === 1 && donts.length % 2 === 0
                ? "sm:col-span-2"
                : ""
            }`}
            style={{
              background: "var(--color-threat-safe-bg)",
              border: "1.5px solid var(--color-threat-safe-border)",
            }}
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">
                check_circle
              </span>
            </div>
            <div className="flex-1">
              <span className="inline-block px-1.5 py-0.5 bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded mb-1 border border-emerald-500/20">
                Recommended Action
              </span>
              <p className="text-[14px] font-semibold text-[var(--color-on-surface)] leading-snug">
                {action.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
