from fastapi import APIRouter, HTTPException, status
from models.schemas import TextAnalysisRequest, ThreatReport
from services import gemini_engine

router = APIRouter()

@router.post(
    "/text",
    response_model=ThreatReport,
    summary="Analyze suspicious message text",
    description="Analyzes SMS, email body, or chat message for phishing, social engineering, and scam patterns.",
)
async def analyze_text_endpoint(request: TextAnalysisRequest) -> ThreatReport:
    clean_content = request.content.strip()
    if not clean_content:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Message content cannot be empty or whitespace.",
        )

    try:
        report = await gemini_engine.analyze_text(clean_content)
        return report
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}",
        )
