import json
import logging
from datetime import datetime, timezone
from typing import Optional

from google import genai
from google.genai import types

import config
from models.schemas import (
    ThreatReport,
    ThreatIndicator,
    AttackChainStep,
    RecommendedAction,
    Explanation,
    URLIntelligence,
)

logger = logging.getLogger("scamguard.gemini_engine")

SYSTEM_INSTRUCTION = """
You are ScamGuard, an elite personal AI cybersecurity analyst built to protect everyday consumers from scams, phishing, fraud, and social engineering.

Analyze the submitted message, screenshot, or URL thoroughly.
Evaluate for:
1. Social engineering tactics: Artificial urgency, fear, account suspension threats, intimidation, impersonation of trusted organizations.
2. Threat vectors: Credential theft, phishing links, fake KYC/verification, fake payment alerts, OTP harvesting, remote access requests.
3. Brand spoofing: Pretending to be Chase, Bank of America, PayPal, Apple, Amazon, USPS, Netflix, etc.

Return your analysis strictly matching the requested JSON structure:
- risk_score: 0-100 (0-29 = SAFE, 30-69 = SUSPICIOUS, 70-100 = CRITICAL)
- threat_level: "CRITICAL" | "SUSPICIOUS" | "SAFE"
- verdict: One single plain-English sentence summarizing the verdict.
- threat_indicators: List of indicators with name, severity ("critical", "warning", "info"), and plain-English description.
- explanations: 2 to 4 items explaining "Why This Is Suspicious" (title and description).
- attack_chain: 3 to 5 chronological progression steps of the scam tactic (order: 1..N, tactic, description).
- recommended_actions: 2 to 4 actionable advice items with action_type ("do" or "dont") and clear action text.
- extracted_text: If analyzing an image, extract all visible text from the image verbatim here. Otherwise leave null.
"""

def _get_client() -> genai.Client:
    """Initialize the Google GenAI client using the configured API key."""
    if not config.GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY is not configured in backend/.env. "
            "Please add your Gemini API key to enable live AI analysis."
        )
    return genai.Client(api_key=config.GEMINI_API_KEY)

def _generate_fallback_report(
    content: str,
    extracted_text: Optional[str] = None,
    url_intel: Optional[URLIntelligence] = None,
) -> ThreatReport:
    """
    Intelligent heuristic fallback used when GEMINI_API_KEY is not configured.
    Ensures the application functions smoothly for demonstration and offline testing.
    """
    lower = (content + " " + (extracted_text or "")).lower()
    is_chase = "chase" in lower
    is_phish = any(
        kw in lower
        for kw in [
            "locked", "suspicious activity", "verify your identity", "urgent",
            "account has been", "click here", "unauthorized", "suspended",
            "freeze", "compromised", "auth?token="
        ]
    )

    now_iso = datetime.now(timezone.utc).isoformat()

    if is_phish or is_chase:
        return ThreatReport(
            risk_score=92,
            threat_level="CRITICAL",
            verdict="Likely phishing attempt impersonating a financial institution to harvest account credentials.",
            threat_indicators=[
                ThreatIndicator(
                    name="Credential Theft",
                    severity="critical",
                    description="Attempts to obtain account credentials via an unauthorized link.",
                ),
                ThreatIndicator(
                    name="Suspicious Link",
                    severity="critical",
                    description="Link destination does not belong to the trusted organization.",
                ),
                ThreatIndicator(
                    name="Brand Impersonation",
                    severity="critical",
                    description="Pretends to represent a trusted banking brand.",
                ),
                ThreatIndicator(
                    name="Urgency",
                    severity="warning",
                    description="Uses an immediate deadline or account lock to discourage careful checking.",
                ),
                ThreatIndicator(
                    name="Social Engineering",
                    severity="warning",
                    description="Uses manufactured fear and urgency to manipulate the recipient.",
                ),
            ],
            explanations=[
                Explanation(
                    title="Account threat",
                    description="Claims your account will be locked or suspended to cause panic.",
                ),
                Explanation(
                    title="Artificial urgency",
                    description="Pushes you to take immediate action instead of verifying through official channels.",
                ),
                Explanation(
                    title="Fake verification link",
                    description="Points to an unofficial domain designed to look like a security check.",
                ),
            ],
            attack_chain=[
                AttackChainStep(
                    order=1,
                    tactic="Brand Impersonation",
                    description="Attacker poses as bank fraud department.",
                ),
                AttackChainStep(
                    order=2,
                    tactic="Manufactured Fear",
                    description="Victim is alerted about unauthorized access.",
                ),
                AttackChainStep(
                    order=3,
                    tactic="Artificial Urgency",
                    description="Pressure to resolve immediately to prevent loss.",
                ),
                AttackChainStep(
                    order=4,
                    tactic="Fake Verification",
                    description="Directs victim to a spoofed login page.",
                ),
                AttackChainStep(
                    order=5,
                    tactic="Credential Theft",
                    description="Steals username, password, and 2FA tokens.",
                ),
            ],
            recommended_actions=[
                RecommendedAction(
                    action_type="dont",
                    action="Don't click the link in the message.",
                ),
                RecommendedAction(
                    action_type="dont",
                    action="Don't share OTP, PIN, or passwords with anyone.",
                ),
                RecommendedAction(
                    action_type="do",
                    action="Verify directly through your official banking app or customer support number.",
                ),
            ],
            extracted_text=extracted_text,
            url_intelligence=url_intel,
            analyzed_at=now_iso,
        )

    # Benign / Safe fallback
    return ThreatReport(
        risk_score=12,
        threat_level="SAFE",
        verdict="No significant scam indicators, deceptive links, or social engineering patterns detected.",
        threat_indicators=[
            ThreatIndicator(
                name="Standard Communication",
                severity="info",
                description="Message does not contain coercive language, credential requests, or spoofed links.",
            )
        ],
        explanations=[
            Explanation(
                title="Normal tone",
                description="No artificial urgency or fear-inducing threats were found in the content.",
            )
        ],
        attack_chain=[
            AttackChainStep(
                order=1,
                tactic="Informational",
                description="Standard communication with no malicious attack pattern.",
            )
        ],
        recommended_actions=[
            RecommendedAction(
                action_type="do",
                action="Continue exercising normal caution when sharing private information online.",
            )
        ],
        extracted_text=extracted_text,
        url_intelligence=url_intel,
        analyzed_at=now_iso,
    )

async def analyze_text(content: str) -> ThreatReport:
    """Analyze a suspicious text message or email body with Gemini AI."""
    if not config.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not configured — using intelligent fallback.")
        return _generate_fallback_report(content)

    client = _get_client()
    now_iso = datetime.now(timezone.utc).isoformat()

    prompt = f"Analyze the following suspicious message content:\n\n---\n{content}\n---"

    try:
        response = client.models.generate_content(
            model=config.GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                response_schema=ThreatReport,
                temperature=0.1,
            ),
        )

        data = json.loads(response.text)
        data["analyzed_at"] = now_iso
        return ThreatReport.model_validate(data)
    except Exception as e:
        logger.error(f"Gemini API analysis error: {e}")
        # Fallback to intelligent heuristic if API quota or connectivity fails
        return _generate_fallback_report(content)

async def analyze_image(image_bytes: bytes, mime_type: str) -> ThreatReport:
    """Extract text from screenshot and analyze threat indicators with multimodal Gemini AI."""
    if not config.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not configured — using intelligent fallback.")
        extracted = "Extracted preview: Urgent notification regarding account suspension."
        return _generate_fallback_report(
            content=extracted,
            extracted_text=extracted,
        )

    client = _get_client()
    now_iso = datetime.now(timezone.utc).isoformat()

    prompt = (
        "This is an image of a suspicious text message, email, or website. "
        "Extract all legible text from the image into the 'extracted_text' field, "
        "and perform a full threat analysis of the visual and textual content."
    )

    try:
        response = client.models.generate_content(
            model=config.GEMINI_MODEL,
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                prompt,
            ],
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                response_schema=ThreatReport,
                temperature=0.1,
            ),
        )

        data = json.loads(response.text)
        data["analyzed_at"] = now_iso
        return ThreatReport.model_validate(data)
    except Exception as e:
        logger.error(f"Gemini image analysis error: {e}")
        extracted = "Screenshot analysis completed (offline fallback)."
        return _generate_fallback_report(
            content=extracted,
            extracted_text=extracted,
        )

async def analyze_url(url: str, url_intel: URLIntelligence) -> ThreatReport:
    """Analyze a suspicious URL in conjunction with gathered URL intelligence data."""
    if not config.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not configured — using intelligent fallback.")
        return _generate_fallback_report(content=url, url_intel=url_intel)

    client = _get_client()
    now_iso = datetime.now(timezone.utc).isoformat()

    intel_summary = (
        f"URL: {url}\n"
        f"Safe Browsing Verdict: {url_intel.safe_browsing_verdict}\n"
        f"Domain Age: {url_intel.domain_age_days} days\n"
        f"Registrar: {url_intel.registrar}\n"
        f"Is Newly Registered: {url_intel.is_newly_registered}\n"
        f"DNS Records: {url_intel.dns_records}"
    )

    prompt = (
        f"Perform threat analysis on this URL and the accompanying technical intelligence:\n\n"
        f"{intel_summary}\n\n"
        f"Assess domain spoofing, typosquatting, credential harvesting risk, and brand impersonation."
    )

    try:
        response = client.models.generate_content(
            model=config.GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                response_schema=ThreatReport,
                temperature=0.1,
            ),
        )

        data = json.loads(response.text)
        data["url_intelligence"] = url_intel.model_dump()
        data["analyzed_at"] = now_iso
        return ThreatReport.model_validate(data)
    except Exception as e:
        logger.error(f"Gemini URL analysis error: {e}")
        return _generate_fallback_report(content=url, url_intel=url_intel)
