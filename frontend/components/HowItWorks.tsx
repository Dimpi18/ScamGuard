"use client";

interface Step {
  number: string;
  icon: string;
  title: string;
  tag: string;
  description: string;
  details: string[];
}

const STEPS: Step[] = [
  {
    number: "01",
    icon: "input",
    title: "Multi-Modal Ingestion",
    tag: "Encrypted & Ephemeral",
    description:
      "Submit suspicious communication through any channel: paste raw SMS text, forward email copy, upload full-res screenshots, or paste unknown links.",
    details: [
      "Zero-retention memory buffer",
      "OCR image text extraction",
      "No account or sign-in needed",
    ],
  },
  {
    number: "02",
    icon: "psychology",
    title: "Social Engineering AI Heuristics",
    tag: "Behavioral Analysis",
    description:
      "Gemini-powered semantic engine detects psychological manipulation tactics designed to bypass rational judgment.",
    details: [
      "Artificial countdown urgency & panic",
      "Impersonation of trusted banks/couriers",
      "Financial coercion & advance-fee traps",
    ],
  },
  {
    number: "03",
    icon: "travel_explore",
    title: "Technical Threat Intelligence",
    tag: "Live Infrastructure Check",
    description:
      "Deep technical verification inspects domain metadata, reputation databases, and deceptive network routes.",
    details: [
      "WHOIS lookup & domain creation age",
      "Google Safe Browsing reputation check",
      "Punycode & lookalike typosquatting",
    ],
  },
  {
    number: "04",
    icon: "verified_user",
    title: "Plain-English Action Playbook",
    tag: "Instant Remediation",
    description:
      "Receive a clear 0–100 risk score and step-by-step guidance written for everyday humans, not security jargon.",
    details: [
      "Verdict: Safe, Suspicious, or Critical",
      "Attacker objective & exploitation chain",
      "Step-by-step safety checklist",
    ],
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="pt-12 sm:pt-16 pb-8 border-t border-[var(--color-outline-variant)]/60"
    >
      <div className="mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 rounded-full text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-[15px]">
            account_tree
          </span>
          <span>Security Engine Architecture</span>
        </div>
        <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-[var(--color-on-surface)]">
          How ScamGuard Decodes Threats
        </h2>
        <p className="text-sm sm:text-base text-[var(--color-on-surface-variant)] mt-2 ">
          Behind every scam is a playbook of psychological pressure and technical deception. Here is how ScamGuard unmasks attacks in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="card p-6 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--color-secondary)]/50 transition-all hover:shadow-md"
          >
            {/* Top Row: Icon + Step Number */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[var(--color-secondary)]">
                  <span className="material-symbols-outlined text-[22px]">
                    {step.icon}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[var(--color-outline)] bg-[var(--color-surface-low)] px-2.5 py-1 rounded-md border border-[var(--color-outline-variant)]">
                    STEP {step.number}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-lg font-bold text-[var(--color-on-surface)]">
                  {step.title}
                </h3>
              </div>
              <span className="inline-block text-[11px] font-semibold text-[var(--color-secondary)] uppercase tracking-wider mb-2.5">
                {step.tag}
              </span>

              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-4">
                {step.description}
              </p>
            </div>

            {/* Checklist items */}
            <div className="pt-3 border-t border-[var(--color-outline-variant)]/60 flex flex-col gap-1.5">
              {step.details.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)] font-medium"
                >
                  <span className="material-symbols-outlined text-[15px] text-[var(--color-secondary)] shrink-0">
                    check_circle
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
