from urllib.parse import urlparse
from fastapi import APIRouter, HTTPException, status
import config
from models.schemas import URLAnalysisRequest, ThreatReport
from services import url_intel, gemini_engine

router = APIRouter()

def is_valid_url(url: str) -> bool:
    target = url if "://" in url else "https://" + url
    try:
        res = urlparse(target)
        return bool(res.scheme in ["http", "https"] and res.netloc)
    except Exception:
        return False

@router.post(
    "/url",
    response_model=ThreatReport,
    summary="Analyze suspicious URL",
    description="Inspects URL domain age, Safe Browsing database status, DNS records, and evaluates scam risk.",
)
async def analyze_url_endpoint(request: URLAnalysisRequest) -> ThreatReport:
    clean_url = request.url.strip()
    if not clean_url or not is_valid_url(clean_url):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid URL format. Please provide a valid web address.",
        )

    try:
        # Gather technical intelligence (Safe Browsing, WHOIS/RDAP, DNS)
        intelligence = await url_intel.gather_url_intelligence(
            url=clean_url,
            safe_browsing_api_key=config.SAFE_BROWSING_API_KEY,
        )

        # Run AI analysis synthesizing URL heuristics with intelligence
        report = await gemini_engine.analyze_url(clean_url, intelligence)
        return report
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"URL analysis failed: {str(e)}",
        )
