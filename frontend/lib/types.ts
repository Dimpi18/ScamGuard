// ScamGuard Frontend — TypeScript interfaces
// Mirrors the backend Pydantic models defined in models/schemas.py

export interface ThreatIndicator {
  name: string;
  severity: "critical" | "warning" | "info";
  description: string;
}

export interface AttackChainStep {
  order: number;
  tactic: string;
  description: string;
}

export interface RecommendedAction {
  action_type: "do" | "dont";
  action: string;
}

export interface URLIntelligence {
  safe_browsing_verdict: string | null;
  domain_age_days: number | null;
  registrar: string | null;
  dns_records: string[] | null;
  is_newly_registered: boolean | null;
}

export interface Explanation {
  title: string;
  description: string;
}

export interface ThreatReport {
  risk_score: number;
  threat_level: "CRITICAL" | "SUSPICIOUS" | "SAFE";
  verdict: string;
  threat_indicators: ThreatIndicator[];
  explanations: Explanation[];
  attack_chain: AttackChainStep[];
  recommended_actions: RecommendedAction[];
  extracted_text: string | null;
  url_intelligence: URLIntelligence | null;
  analyzed_at: string;
}

export type AnalysisState = "idle" | "analyzing" | "complete" | "error";

export type AnalysisMode = "text" | "image" | "url";
