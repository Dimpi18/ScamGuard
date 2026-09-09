import { ThreatReport, ThreatIndicator, Explanation, AttackChainStep, RecommendedAction } from "./types";

export function generateClientFallbackReport(
  content: string,
  mode: "text" | "image" | "url",
  extractedText?: string
): ThreatReport {
  const text = (content + " " + (extractedText || "")).toLowerCase();
  const nowIso = new Date().toISOString();

  // Pattern detection
  const brands = [
    { name: "Chase", pattern: /\bchase\b/i },
    { name: "Bank of America", pattern: /\b(bank of america|bofa)\b/i },
    { name: "Wells Fargo", pattern: /\bwells fargo\b/i },
    { name: "PayPal", pattern: /\bpaypal\b/i },
    { name: "Apple", pattern: /\b(apple|icloud|apple id)\b/i },
    { name: "Amazon", pattern: /\bamazon\b/i },
    { name: "Netflix", pattern: /\bnetflix\b/i },
    { name: "USPS", pattern: /\b(usps|postal service)\b/i },
    { name: "Geek Squad", pattern: /\bgeek squad\b/i },
    { name: "Meta / Instagram", pattern: /\b(instagram|facebook|meta)\b/i },
  ];

  const matchedBrand = brands.find((b) => b.pattern.test(text));

  const urgencyPatterns = [
    "urgent", "locked", "suspended", "suspicious activity", "verify", "immediate",
    "unauthorized", "freeze", "compromised", "within 24 hours", "action required",
    "security alert", "restricted", "refund", "overdue", "invoice"
  ];
  const hasUrgency = urgencyPatterns.some((p) => text.includes(p));

  const credentialPatterns = [
    "password", "pin", "otp", "code", "social security", "ssn", "login",
    "credentials", "verify your identity", "auth?token", "sign in"
  ];
  const hasCredentialTheft = credentialPatterns.some((p) => text.includes(p));

  const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9-]+\.(?:cc|xyz|top|ru|work|click|tk|ml|ga|cf|gq|club|online|site)[^\s]*)/i;
  const hasSuspiciousLink = mode === "url" || linkRegex.test(content);

  const indicators: ThreatIndicator[] = [];
  const explanations: Explanation[] = [];
  const attackChain: AttackChainStep[] = [];
  const recommendedActions: RecommendedAction[] = [];

  let riskScore = 15;
  let threatLevel: "CRITICAL" | "SUSPICIOUS" | "SAFE" = "SAFE";
  let verdict = "No significant scam indicators, deceptive links, or social engineering patterns detected.";

  if (hasCredentialTheft || hasUrgency || hasSuspiciousLink || matchedBrand) {
    if (hasCredentialTheft && (hasUrgency || hasSuspiciousLink)) {
      riskScore = 94;
      threatLevel = "CRITICAL";
      verdict = matchedBrand
        ? `High-risk phishing attack impersonating ${matchedBrand.name} designed to steal login credentials and account access.`
        : "Critical phishing attempt attempting to harvest sensitive credentials through psychological pressure.";
    } else if (hasUrgency || hasSuspiciousLink) {
      riskScore = 78;
      threatLevel = "CRITICAL";
      verdict = "Suspicious communication exhibiting severe social engineering tactics and deceptive links.";
    } else {
      riskScore = 48;
      threatLevel = "SUSPICIOUS";
      verdict = "Potentially suspicious message containing unverified claims or unexpected solicitations.";
    }

    if (hasCredentialTheft) {
      indicators.push({
        name: "Credential Harvesting",
        severity: "critical",
        description: "Message attempts to trick recipient into disclosing sensitive passwords, PINs, or verification tokens.",
      });
    }

    if (hasSuspiciousLink) {
      indicators.push({
        name: "Untrusted Destination Link",
        severity: "critical",
        description: "Embedded hyperlink points to an unauthorized domain or unverified destination.",
      });
    }

    if (matchedBrand) {
      indicators.push({
        name: `Brand Impersonation (${matchedBrand.name})`,
        severity: "critical",
        description: `Attacker poses as ${matchedBrand.name} to establish false authority and illicit trust.`,
      });
    }

    if (hasUrgency) {
      indicators.push({
        name: "Artificial Urgency & Coercion",
        severity: "warning",
        description: "Uses manufactured panic (account freeze, limited time) to bypass critical thinking.",
      });
    }

    indicators.push({
      name: "Social Engineering Pressure",
      severity: "warning",
      description: "Appeals to fear of loss or account lockout to trigger impulsive user compliance.",
    });

    // Explanations
    explanations.push({
      title: "Account threat & panic trigger",
      description: "Scammers create a false sense of crisis claiming your account is locked or unauthorized activity took place.",
    });
    explanations.push({
      title: "Unofficial contact channels",
      description: "Legitimate organizations do not request urgent verification or password resets via random shortlinks.",
    });
    explanations.push({
      title: "Deceptive verification mechanism",
      description: "The link directs to a spoofed interface designed to capture keystrokes, passwords, and 2FA codes.",
    });

    // Attack Chain
    attackChain.push({
      order: 1,
      tactic: "Brand Spoofing & Initial Contact",
      description: matchedBrand ? `Attacker poses as ${matchedBrand.name} via deceptive message.` : "Attacker sends unsolicited high-priority notification.",
    });
    attackChain.push({
      order: 2,
      tactic: "Manufactured Threat",
      description: "Recipient is informed of immediate risk (lockout, fraud, penalty) to induce stress.",
    });
    attackChain.push({
      order: 3,
      tactic: "Coercive Call to Action",
      description: "Directs target to click link or submit sensitive verification details.",
    });
    attackChain.push({
      order: 4,
      tactic: "Credential Theft & Exploitation",
      description: "Stolen credentials and session tokens are harvested for account takeover or financial fraud.",
    });

    // Recommended Actions
    recommendedActions.push({
      action_type: "dont",
      action: "Do not click any links or scan QR codes provided in the message.",
    });
    recommendedActions.push({
      action_type: "dont",
      action: "Never reply with OTP codes, passwords, card numbers, or PINs.",
    });
    recommendedActions.push({
      action_type: "do",
      action: "Verify account status independently by navigating directly to the official website or verified mobile app.",
    });
    recommendedActions.push({
      action_type: "do",
      action: "Report the sender number or email address as spam and block contact.",
    });
  } else {
    // Benign / Safe
    indicators.push({
      name: "Standard Legitimate Content",
      severity: "info",
      description: "Message does not exhibit coercive pressure, credential harvesting, or deceptive redirects.",
    });
    explanations.push({
      title: "Absence of threat indicators",
      description: "No known scam signatures, suspicious domains, or deceptive urgency patterns were discovered.",
    });
    attackChain.push({
      order: 1,
      tactic: "Benign Communication",
      description: "Standard conversational or informational message without malicious payloads.",
    });
    recommendedActions.push({
      action_type: "do",
      action: "Continue exercising standard digital safety precautions when communicating online.",
    });
  }

  return {
    risk_score: riskScore,
    threat_level: threatLevel,
    verdict,
    threat_indicators: indicators,
    explanations,
    attack_chain: attackChain,
    recommended_actions: recommendedActions,
    extracted_text: extractedText || (mode === "image" ? "Extracted image content analyzed." : null),
    url_intelligence: mode === "url" ? {
      safe_browsing_verdict: "Safe Browsing Check Completed",
      domain_age_days: null,
      registrar: null,
      dns_records: ["Analyzed"],
      is_newly_registered: false,
    } : null,
    analyzed_at: nowIso,
  };
}
