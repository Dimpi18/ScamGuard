"use client";

interface ScamItem {
  id: string;
  category: string;
  title: string;
  riskScore: number;
  threatLevel: "critical" | "warning";
  hook: string;
  sampleMessage: string;
  attackerGoal: string;
  defenseTip: string;
  tab: "paste" | "link";
}

const SCAMS: ScamItem[] = [
  {
    id: "bank-smishing",
    category: "Bank Impersonation",
    title: "Urgent Unauthorized Transaction Alert",
    riskScore: 94,
    threatLevel: "critical",
    hook: "Manufactures instant fear of account drainage with a short countdown to act.",
    sampleMessage:
      "URGENT: Chase detected an unauthorized $1,450.00 Zelle transfer. If this was NOT you, cancel immediately: https://chase-security-cancel.cc/auth?id=98214",
    attackerGoal:
      "Harvests your online banking password and triggers a live 2FA intercept to authorize real wire transfers.",
    defenseTip:
      "Never click SMS links. Always log into your banking app directly or dial the number on the back of your physical card.",
    tab: "paste",
  },
  {
    id: "package-delivery",
    category: "Courier Smishing",
    title: "USPS / FedEx Failed Address & Redelivery Fee",
    riskScore: 88,
    threatLevel: "warning",
    hook: "Leverages casual curiosity and an insignificant fee ($0.30–$1.50) to lower your guard.",
    sampleMessage:
      "USPS Notice: Your package #US94001928 has an incomplete delivery address and cannot be dispatched. Please update within 12h: https://usps-post-redelivery.top",
    attackerGoal:
      "Captures your full name, credit card number, CVV, and billing address on a clone portal.",
    defenseTip:
      "Official couriers never send text links for address correction fees. Track parcel IDs exclusively on usps.com or fedex.com.",
    tab: "paste",
  },
  {
    id: "crypto-investment",
    category: "Investment Fraud",
    title: "Guaranteed High-Yield Crypto Arbitrage",
    riskScore: 96,
    threatLevel: "critical",
    hook: "Exploits financial FOMO using falsified trading screenshots and promises of zero-risk profits.",
    sampleMessage:
      "Exclusive invitation: Our automated AI trading bot generated +320% ROI this week. Deposit $250 USDT today for guaranteed daily $75 payouts: https://trade-matrix-ai.vip",
    attackerGoal:
      "Lures victims into sending crypto deposits to offshore unrecoverable wallets (Pig Butchering scheme).",
    defenseTip:
      "Any entity promising guaranteed daily investment returns is mathematically and legally fraudulent.",
    tab: "paste",
  },
  {
    id: "tech-support",
    category: "Tech Support Scareware",
    title: "Trojan Virus / Windows Defender Lockdown",
    riskScore: 91,
    threatLevel: "critical",
    hook: "Triggers intense panic using loud audio alarms, flashing red banners, and fake firewall logs.",
    sampleMessage:
      "CRITICAL ALERT: Trojan:Win32/Spyware detected on this device. System locked to prevent data theft. Call Microsoft Certified Support immediately at +1-800-555-0199.",
    attackerGoal:
      "Pressures you into installing remote desktop software (AnyDesk / TeamViewer) to access files and drain bank accounts.",
    defenseTip:
      "Real operating systems never display phone numbers in popups. Close the browser tab or restart your computer.",
    tab: "paste",
  },
  {
    id: "job-task",
    category: "Employment Scam",
    title: "Daily Product Rating / High-Pay Remote Work",
    riskScore: 85,
    threatLevel: "warning",
    hook: "Appeals to desires for flexible remote income with minimal effort and no interview process.",
    sampleMessage:
      "Hello! Amazon Merchant Partners is hiring remote product raters. Earn $200-$450/day (1-2 hours). No experience required. Message our recruiter on Telegram: @amazon_recruit_hr",
    attackerGoal:
      "Assigns fake daily tasks, shows artificial profit, then requires cryptocurrency deposits to unlock 'commission tiers'.",
    defenseTip:
      "Legitimate employers never conduct hiring via anonymous Telegram DMs or demand upfront payments to release wages.",
    tab: "paste",
  },
  {
    id: "toll-violation",
    category: "Government / Toll Phishing",
    title: "Overdue Highway Toll Citation with Court Penalty",
    riskScore: 89,
    threatLevel: "warning",
    hook: "Utilizes legal intimidation and threats of license suspension or hefty late penalties.",
    sampleMessage:
      "State Toll Services: You have an unpaid toll invoice of $12.50 from Express Lanes. To avoid a $150 court summons & license suspension, settle now: https://toll-pay-citation.link",
    attackerGoal:
      "Steals credit card numbers and personal identification details via an imposter toll payment site.",
    defenseTip:
      "State transportation agencies send official mail notices to your registered vehicle address, not generic SMS links.",
    tab: "paste",
  },
];

interface CommonScamsProps {
  onSelectSample?: (tab: "paste" | "link", text: string) => void;
}

export default function CommonScams({ onSelectSample }: CommonScamsProps) {
  return (
    <section
      id="common-scams"
      className="pt-12 sm:pt-16 pb-8 border-t border-[var(--color-outline-variant)]/60"
    >
      <div className="mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 rounded-full text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-[15px]">
            warning_amber
          </span>
          <span>Threat Intelligence Library</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-on-surface)]">
          Common Cyber Scams &amp; Attack Vectors
        </h2>
        <p className="text-sm sm:text-base text-[var(--color-on-surface-variant)] mt-2 leading-relaxed">
          Examine the most widespread digital attack templates, identify psychological warning signs,
          and test them directly in ScamGuard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SCAMS.map((scam) => (
          <div
            key={scam.id}
            className="card p-5 flex flex-col justify-between hover:border-[var(--color-secondary)]/50 transition-all hover:shadow-md"
          >
            <div>
              {/* Header: Category + Risk badge */}
              <div className="flex items-center justify-between mb-3 gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-secondary)] bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {scam.category}
                </span>
                <span
                  className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                    scam.threatLevel === "critical"
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  }`}
                >
                  Risk {scam.riskScore}/100
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-[15px] sm:text-[16px] text-[var(--color-on-surface)] mb-2 leading-snug">
                {scam.title}
              </h3>

              {/* Sample Message Quote */}
              <div className="p-3 rounded-lg bg-[var(--color-surface-low)] border border-[var(--color-outline-variant)] text-xs font-mono text-[var(--color-on-surface)] leading-relaxed mb-3 break-words">
                &ldquo;{scam.sampleMessage}&rdquo;
              </div>

              {/* Attack vector info */}
              <div className="space-y-2 mb-4 text-xs">
                <div>
                  <span className="font-semibold text-[var(--color-on-surface)]">
                    🎯 Attacker Goal:{" "}
                  </span>
                  <span className="text-[var(--color-on-surface-variant)] leading-relaxed">
                    {scam.attackerGoal}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    🛡️ Defense Rule:{" "}
                  </span>
                  <span className="text-[var(--color-on-surface-variant)] leading-relaxed">
                    {scam.defenseTip}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Action Button */}
            {onSelectSample && (
              <button
                onClick={() => onSelectSample(scam.tab, scam.sampleMessage)}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-[var(--color-surface-bright)] hover:bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-xs font-semibold text-[var(--color-secondary)] hover:text-[var(--color-on-surface)] flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
              >
                <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">
                  bolt
                </span>
                <span>Test in ScamGuard Scanner</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
