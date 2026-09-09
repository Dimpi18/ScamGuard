from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config import CORS_ORIGINS
from routers import analyze_text, analyze_image, analyze_url

app = FastAPI(
    title="ScamGuard API",
    description="Real-time personal scam defense and cyber threat analysis API powered by Gemini AI",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(analyze_text.router, prefix="/api/analyze", tags=["Analysis"])
app.include_router(analyze_image.router, prefix="/api/analyze", tags=["Analysis"])
app.include_router(analyze_url.router, prefix="/api/analyze", tags=["Analysis"])

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for container / server monitoring."""
    return {"status": "ok", "service": "ScamGuard API", "version": "1.0.0"}

@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "ScamGuard API",
        "documentation": "/docs",
        "status": "online"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )
