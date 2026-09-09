from typing import Literal, Optional, List
from pydantic import BaseModel, Field

# Request Models
class TextAnalysisRequest(BaseModel):
    content: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Suspicious text or message content to analyze (1-5000 chars)"
    )

class URLAnalysisRequest(BaseModel):
    url: str = Field(
        ...,
        min_length=3,
        max_length=2048,
        description="URL to analyze"
    )

# Report Components
class ThreatIndicator(BaseModel):
    name: str = Field(..., description="Name of indicator, e.g. Credential Theft")
    severity: Literal["critical", "warning", "info"]
    description: str = Field(..., description="Plain-English explanation of the indicator")

class AttackChainStep(BaseModel):
    order: int = Field(..., ge=1)
    tactic: str = Field(..., description="e.g. Impersonation, Urgency, Credential Theft")
    description: str = Field(..., description="Brief summary of this step in the attack chain")

class RecommendedAction(BaseModel):
    action_type: Literal["do", "dont"]
    action: str = Field(..., description="Action recommendation, e.g. Don't click the link")

class Explanation(BaseModel):
    title: str = Field(..., description="e.g. Account threat")
    description: str = Field(..., description="Why this is suspicious in plain English")

class URLIntelligence(BaseModel):
    safe_browsing_verdict: Optional[str] = None
    domain_age_days: Optional[int] = None
    registrar: Optional[str] = None
    dns_records: Optional[List[str]] = None
    is_newly_registered: Optional[bool] = None

# Unified Response Model
class ThreatReport(BaseModel):
    risk_score: int = Field(..., ge=0, le=100, description="Risk percentage from 0 to 100")
    threat_level: Literal["CRITICAL", "SUSPICIOUS", "SAFE"]
    verdict: str = Field(..., description="One concise sentence verdict summary")
    threat_indicators: List[ThreatIndicator]
    explanations: List[Explanation]
    attack_chain: List[AttackChainStep]
    recommended_actions: List[RecommendedAction]
    extracted_text: Optional[str] = None
    url_intelligence: Optional[URLIntelligence] = None
    analyzed_at: str = Field(..., description="ISO 8601 UTC timestamp")
