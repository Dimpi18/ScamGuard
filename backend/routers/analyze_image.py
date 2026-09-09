from fastapi import APIRouter, File, UploadFile, HTTPException, status
from models.schemas import ThreatReport
from services import gemini_engine

router = APIRouter()

ALLOWED_MIME_TYPES = {
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/heic",
    "image/webp",
}

MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB

@router.post(
    "/image",
    response_model=ThreatReport,
    summary="Analyze screenshot image",
    description="Extracts message text and inspects visual fraud cues from uploaded screenshot images.",
)
async def analyze_image_endpoint(file: UploadFile = File(...)) -> ThreatReport:
    content_type = file.content_type or ""
    if content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{content_type}'. Please upload PNG, JPG, or HEIC.",
        )

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds the 15MB limit.",
        )

    try:
        report = await gemini_engine.analyze_image(image_bytes, content_type)
        return report
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image analysis failed: {str(e)}",
        )
