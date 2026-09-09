import asyncio
from models.schemas import TextAnalysisRequest, URLAnalysisRequest
from services import gemini_engine, url_intel

async def run_tests():
    print("=== ScamGuard Backend Unit Test Suite ===")

    # 1. Test Text Analysis with Sample Phishing SMS
    sample_text = (
        "URGENT: Your Chase bank account has been locked due to suspicious activity. "
        "Click here immediately to verify your identity & regain access: "
        "https://chase-security-resolver.cc/auth?token=904128"
    )
    print("\n[1] Testing Text Analysis...")
    report = await gemini_engine.analyze_text(sample_text)
    print(f"Risk Score: {report.risk_score}% ({report.threat_level})")
    print(f"Verdict: {report.verdict}")
    print(f"Threat Indicators ({len(report.threat_indicators)}):")
    for ind in report.threat_indicators:
        print(f"  - [{ind.severity.upper()}] {ind.name}: {ind.description}")
    print(f"Attack Chain Steps ({len(report.attack_chain)}):")
    for step in report.attack_chain:
        print(f"  {step.order}. {step.tactic} - {step.description}")
    print(f"Recommended Actions ({len(report.recommended_actions)}):")
    for action in report.recommended_actions:
        print(f"  - [{action.action_type.upper()}] {action.action}")

    # 2. Test URL Intelligence Heuristics & DNS
    sample_url = "https://chase-security-resolver.cc/auth?token=904128"
    print("\n[2] Testing URL Intelligence Gathering...")
    heuristics = url_intel.analyze_url_structure(sample_url)
    print(f"Static Heuristic Flags ({len(heuristics)}):")
    for flag in heuristics:
        print(f"  - {flag}")

    intel = await url_intel.gather_url_intelligence(sample_url)
    print(f"Safe Browsing: {intel.safe_browsing_verdict}")
    print(f"Domain Age: {intel.domain_age_days} days (Newly Registered: {intel.is_newly_registered})")
    print(f"Registrar: {intel.registrar}")
    print(f"DNS Records: {intel.dns_records}")

    # 3. Test URL Analysis Composite Flow
    print("\n[3] Testing URL Analysis Flow...")
    url_report = await gemini_engine.analyze_url(sample_url, intel)
    print(f"URL Risk Score: {url_report.risk_score}% ({url_report.threat_level})")
    print(f"Verdict: {url_report.verdict}")

    print("\n=== All Unit Tests Completed Successfully! ===")

if __name__ == "__main__":
    asyncio.run(run_tests())
