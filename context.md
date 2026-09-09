# ScamGuard — Comprehensive Project Context & Technical Architecture

> **Tagline**: *"Don't just detect the scam. Understand the attack."*  
> **Mission**: Democratize enterprise-grade cyber threat intelligence and forensic analysis for everyday consumers through multi-modal AI and zero-retention privacy.

---

## 1. Executive Summary

**ScamGuard** is a full-stack, real-time personal cybersecurity and scam deconstruction platform. Unlike legacy antivirus tools that issue opaque "Blocked" or "Dangerous" warnings without explanation, ScamGuard dissects suspicious messages, screenshots, and web addresses to explain:
1. **The Attacker's Psychology**: How urgency, fear, authority, and emotional manipulation are being deployed.
2. **The Mechanism**: What technical traps are hidden in the message (credential harvesting forms, fake KYC, rogue redirect chains, spoofed domains).
3. **The Attack Chain**: A chronological step-by-step breakdown of how the scam unfolds from initial contact to financial exfiltration.
4. **Actionable Recovery Steps**: Prioritized, practical "DO" and "DON'T" instructions tailored to the specific attack.

The application is built with **Next.js 16 (React 19)**, **Tailwind CSS v4**, **FastAPI (Python 3.10+)**, and **Google Gemini AI**.

---

## 2. System Architecture & Data Flow

ScamGuard follows a decoupled, asynchronous microservices architecture:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             FRONTEND (Next.js 16)                           │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ AnalysisCard Ingestion UI (Tabs: Text | Screenshot Image | URL Link)   │  │
│  └──────────────────────────────────┬────────────────────────────────────┘  │
│                                     │ Submits content                       │
│                                     ▼                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ useAnalysis Hook (State: idle ➔ analyzing ➔ complete | error)         │  │
│  └──────────────────┬───────────────────────────────▲────────────────────┘  │
│                     │ POST HTTP                     │ ThreatReport JSON     │
└─────────────────────┼───────────────────────────────┼───────────────────────┘
                      │                               │
                      ▼                               │
┌─────────────────────────────────────────────────────┼───────────────────────┐
│                             BACKEND (FastAPI)       │                       │
│  ┌──────────────────────────────────────────────────┴────────────────────┐  │
│  │ FastAPI Routers (/api/analyze/text, /image, /url)                     │  │
│  │ Strict Pydantic v2 Schema Validation                                  │  │
│  └──────────────────┬────────────────────────────────────────────────────┘  │
│                     │                                                       │
│         ┌───────────┴───────────┐                                           │
│         ▼                       ▼                                           │
│  ┌───────────────┐     ┌─────────────────────────────────────────────────┐  │
│  │  url_intel.py │     │ gemini_engine.py                                │  │
│  │  • SafeBrowse │     │ • Multi-modal prompt with system instructions   │  │
│  │  • RDAP/WHOIS │     │ • Structured Output (response_schema)           │  │
│  │  • DNS A/CNAME│     │ • Deterministic JSON validation                 │  │
│  │  • Heuristics │     │ • Fallback heuristic engine (offline safety net)│  │
│  └──────┬────────┘     └────────────────────────▲────────────────────────┘  │
│         │                                       │                           │
│         └─────────────── Passes Intel ──────────┘                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dual-Layer Resilient Execution
ScamGuard guarantees high availability through dual-tier fallback mechanisms:
1. **Tier 1 (Live AI & Live Threat Intelligence)**: FastAPI calls Google Gemini API using structured JSON output schemas alongside real-time WHOIS/RDAP and Google Safe Browsing lookups.
2. **Tier 2 (Backend Heuristic Fallback)**: If `GEMINI_API_KEY` is not set or network quota limits are hit, `backend/services/gemini_engine.py` employs an offline NLP/keyword/pattern recognition engine to generate full forensic reports without downtime.
3. **Tier 3 (Client-Side Resilient Fallback)**: If the backend service is offline, `frontend/lib/fallbackAnalyzer.ts` intercepts the request client-side, runs local forensic analysis, and renders the complete report seamlessly.

---

## 3. Directory Structure

```
ScamGuard/
├── backend/
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py              # Pydantic v2 data models for requests and reports
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── analyze_text.py         # POST /api/analyze/text router
│   │   ├── analyze_image.py        # POST /api/analyze/image router (multipart)
│   │   └── analyze_url.py          # POST /api/analyze/url router
│   ├── services/
│   │   ├── __init__.py
│   │   ├── gemini_engine.py        # Gemini API client, system prompt & fallbacks
│   │   └── url_intel.py            # WHOIS/RDAP, DNS, Safe Browsing, & URL heuristics
│   ├── config.py                   # Environment variable loader (.env)
│   ├── main.py                     # FastAPI entrypoint, CORS configuration & healthcheck
│   ├── requirements.txt            # Python dependencies
│   └── test_backend.py             # Test suite for backend routers and services
├── frontend/
│   ├── app/
│   │   ├── globals.css             # Tailwind v4 theme definitions and utility classes
│   │   ├── layout.tsx              # Root layout, theme hydration script, Google Fonts
│   │   └── page.tsx                # Main SPA page view and state orchestrator
│   ├── components/
│   │   ├── AnalysisCard.tsx        # Ingestion component (tabs for text, screenshot, url)
│   │   ├── AnalysisProgress.tsx    # Live scanning progress modal with step timeline
│   │   ├── AttackChain.tsx         # Chronological attack graph visualization
│   │   ├── CommonScams.tsx         # Interactive catalog of popular scam templates
│   │   ├── Footer.tsx              # Trust guarantees and navigation links
│   │   ├── Header.tsx              # Brand shield, navigation anchors, dark/light toggle
│   │   ├── HowItWorks.tsx          # 3-step platform explainer
│   │   ├── RecommendedActions.tsx  # Categorized DO/DON'T recovery checklist
│   │   ├── RiskScoreBadge.tsx      # High-contrast 0-100% risk meter badge
│   │   ├── ThreatIndicators.tsx    # Forensic threat tags with severity badges
│   │   └── ThreatReport.tsx        # Full-screen forensic report modal
│   ├── hooks/
│   │   └── useAnalysis.ts          # State management hook for analysis workflows
│   ├── lib/
│   │   ├── api.ts                  # Fetch client with 60s timeout & fallback hook
│   │   ├── fallbackAnalyzer.ts     # In-browser client-side forensic fallback engine
│   │   └── types.ts                # TypeScript interfaces mirroring backend schemas
│   ├── package.json                # Frontend dependencies and Next.js scripts
│   ├── postcss.config.mjs          # PostCSS configuration for Tailwind v4
│   └── tsconfig.json               # TypeScript compiler configuration
├── create_presentation.py          # Python automation script for 8-slide PowerPoint deck
├── ScamGuard_Presentation.pptx     # 16:9 executive presentation deck
└── context.md                      # This comprehensive technical documentation
```

---

## 4. Backend Deep Dive

### 4.1. Core Endpoints (`backend/main.py` & `backend/routers/`)

| Method | Endpoint | Payload | Response Model | Description |
|---|---|---|---|---|
| `GET` | `/health` | None | `{"status": "ok", ...}` | Container health monitoring and keepalive |
| `POST` | `/api/analyze/text` | `TextAnalysisRequest` | `ThreatReport` | Analyzes text, SMS, email body for urgency and social engineering |
| `POST` | `/api/analyze/image` | `multipart/form-data` | `ThreatReport` | Extracts OCR text and visual cues from PNG/JPG/HEIC/WEBP (max 15MB) |
| `POST` | `/api/analyze/url` | `URLAnalysisRequest` | `ThreatReport` | Performs domain age, DNS, blacklist query, and structural analysis |

### 4.2. Pydantic Data Contract (`backend/models/schemas.py`)

All outputs strictly conform to the `ThreatReport` schema:

```python
class ThreatIndicator(BaseModel):
    name: str                           # e.g., "Credential Theft", "Brand Impersonation"
    severity: Literal["critical", "warning", "info"]
    description: str                    # Plain-English forensic explanation

class AttackChainStep(BaseModel):
    order: int                          # Sequence order (1..N)
    tactic: str                         # e.g., "Urgency Hook", "Fake Verification Portal"
    description: str                    # What happens at this specific stage

class RecommendedAction(BaseModel):
    action_type: Literal["do", "dont"]  # Action category
    action: str                         # Specific, actionable instruction

class Explanation(BaseModel):
    title: str                          # e.g., "Account Lockout Threat"
    description: str                    # Detailed analysis of why this was flagged

class URLIntelligence(BaseModel):
    safe_browsing_verdict: Optional[str]
    domain_age_days: Optional[int]
    registrar: Optional[str]
    dns_records: Optional[List[str]]
    is_newly_registered: Optional[bool] # True if age < 30 days

class ThreatReport(BaseModel):
    risk_score: int                     # 0 to 100
    threat_level: Literal["CRITICAL", "SUSPICIOUS", "SAFE"]
    verdict: str                        # One clear, concise executive sentence
    threat_indicators: List[ThreatIndicator]
    explanations: List[Explanation]
    attack_chain: List[AttackChainStep]
    recommended_actions: List[RecommendedAction]
    extracted_text: Optional[str]       # Legible OCR text extracted from images
    url_intelligence: Optional[URLIntelligence]
    analyzed_at: str                    # ISO 8601 UTC timestamp
```

### 4.3. Gemini AI Engine (`backend/services/gemini_engine.py`)

* **SDK**: Official Google GenAI SDK (`from google import genai`, `from google.genai import types`).
* **Model**: Defaults to `gemini-3.6-flash` (customizable via `GEMINI_MODEL` environment variable).
* **Deterministic Structured Output**:
  ```python
  config=types.GenerateContentConfig(
      system_instruction=SYSTEM_INSTRUCTION,
      response_mime_type="application/json",
      response_schema=ThreatReport,
      temperature=0.1,  # Low temperature ensures factual, deterministic analysis
  )
  ```
* **Multimodal Vision Handling**: Image bytes are passed directly into `client.models.generate_content` via `types.Part.from_bytes(data=image_bytes, mime_type=mime_type)`.

### 4.4. URL Forensics Engine (`backend/services/url_intel.py`)

The URL analysis pipeline executes multiple concurrent forensic tasks:
1. **Google Safe Browsing v4**: Queries the `threatMatches:find` endpoint for `MALWARE`, `SOCIAL_ENGINEERING`, and `UNWANTED_SOFTWARE`.
2. **RDAP / WHOIS Lookup**: Queries `https://rdap.org/domain/{domain}` to retrieve official entity registrar data and initial domain creation timestamps (`registration` events). Calculates `domain_age_days` and flags `is_newly_registered = True` if the domain was created fewer than 30 days prior.
3. **DNS Record Verification**: Uses `dnspython` (with fallback to `socket.gethostbyname_ex`) to resolve IPv4 `A` and `CNAME` records to verify if the domain is actively routed or parked.
4. **Static URL Heuristics (`analyze_url_structure`)**:
   - **Raw IP Detection**: Catches URLs structured with raw IPv4 addresses (`http://192.168.1.1/...`) bypassing domain registries.
   - **High-Abuse TLDs**: Flags high-risk top-level domains: `.cc`, `.tk`, `.ml`, `.ga`, `.cf`, `.gq`, `.xyz`, `.top`, `.click`, `.buzz`, `.work`, `.cn`, `.ru`, etc.
   - **Excessive Subdomain Levels**: Detects multi-level subdomains used to disguise real hosts (e.g., `login.chase.com.security-verify.cc`).
   - **Brand Typosquatting**: Checks for major brand keywords (`chase`, `paypal`, `apple`, `usps`, `netflix`, `bankofamerica`) where the apex domain is not the authentic brand domain.
   - **Punycode / IDN Homograph Attacks**: Identifies `xn--` prefixes where Cyrillic or Greek glyphs mimic Latin alphabet letters.
   - **Phishing Path Keyword Inspection**: Flags paths targeting credentials (`/auth?token=`, `/verify-account`, `/kyc/update`, `/signin`).

---

## 5. Frontend Deep Dive

### 5.1. Tech Stack & Dependencies
* **Framework**: Next.js 16.3.4 (App Router, Turbopack enabled)
* **Runtime**: React 19.2.8
* **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` with `@theme inline` design system)
* **Fonts**: Google Inter (primary interface font) & JetBrains Mono (forensic data & code blocks)
* **Icons**: Inline scalable vector graphics (SVG) with Material Symbols fallback

### 5.2. State Management (`frontend/hooks/useAnalysis.ts`)
The entire user journey is governed by a unified state machine:
* `state`: `"idle"` ➔ `"analyzing"` ➔ `"complete"` | `"error"`
* `mode`: `"text"` | `"image"` | `"url"`
* `originalContent`: Stores string snippet or file name for side-by-side verification
* `report`: Holds the validated `ThreatReport` data object
* `error`: Stores user-friendly error details

### 5.3. Components Architecture

#### `AnalysisCard.tsx`
* Three modality tabs:
  1. `Paste message`: Multi-line text area with live character counter (up to 5,000 chars) and one-click **"⚡ Try sample phishing SMS"** button for instant testing.
  2. `Upload screenshot`: Drag-and-drop file uploader accepting PNG, JPG, JPEG, and HEIC (up to 15MB).
  3. `Analyze link`: URL text box with `https://` prefix lock and Enter-key listener.
* Directly invokes the corresponding `submitText`, `submitImage`, or `submitURL` callback.

#### `AnalysisProgress.tsx`
* Full-screen loading overlay (`fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md`).
* Sequential step progression (updates every 800ms):
  - **Text Mode**: Extracting message ➔ Detecting social engineering ➔ Inspecting links ➔ Checking domain reputation ➔ Generating threat assessment.
  - **Image Mode**: Reading screenshot ➔ Analyzing extracted text ➔ Detecting visual deception ➔ Evaluating threat patterns ➔ Generating threat assessment.
  - **URL Mode**: Resolving destination URL ➔ Checking threat databases ➔ Inspecting domain registration ➔ Analyzing URL structure ➔ Generating threat assessment.
* Live status badges for each step:
  - `Done` (Emerald green badge with checkmark icon).
  - `Running` (Electric blue badge with spinning radar ring and pulsating ping indicator).
  - `Queued` (Subtle muted numerical step indicator).
* Live percentage tracker with gradient fill bar.
* Ephemeral sandbox trust assurances in footer.

#### `ThreatReport.tsx`
* Full-screen forensic report modal (`fixed inset-0 z-[101] bg-[var(--color-background)] overflow-y-auto`).
* **Header & Action Bar**: "Threat Analysis Report" header, analyzed timestamp, and "Analyze another message" reset trigger.
* **Verdict & Risk Score**: Houses `RiskScoreBadge.tsx` alongside the primary plain-English summary.
* **Original Message Inspector**: Expandable preview displaying either verbatim submitted text or OCR-extracted image text.
* **Threat Indicators**: Houses `ThreatIndicators.tsx` rendering severity tags.
* **Why This Is Suspicious**: Grid of explanation cards detailing specific deceptive triggers.
* **Attack Chain**: Houses `AttackChain.tsx` rendering the sequential kill-chain timeline.
* **Recommended Actions**: Houses `RecommendedActions.tsx` rendering prioritized DO and DON'T guidance with direct links to official reporting channels (FCC, FTC, Carrier 7726).

---

## 6. Threat Assessment & Scoring Matrix

| Risk Score | Threat Level | Visual Style | Criteria & Indicators |
|---|---|---|---|
| **70% – 100%** | `CRITICAL` | Crimson / Red (`#DC2626`) | Presence of direct credential harvesting, brand impersonation, deceptive shortlinks, high-urgency threats (arrest, account closure, legal penalty), or domain flagged in threat feeds. |
| **30% – 69%** | `SUSPICIOUS` | Amber / Warning (`#D97706`) | Unsolicited contact, vague prize claims, generic greetings, newly registered domains (<30 days), non-standard sender address, or artificial urgency without immediate credential demands. |
| **0% – 29%** | `SAFE` | Emerald / Green (`#16A34A`) | Standard communications, verified domains, absence of coercive emotional pressure, and no deceptive links or credential requests. |

---

## 7. Privacy & Security Architecture

1. **Zero Data at Rest**: ScamGuard does not connect to any database (no PostgreSQL, MongoDB, MySQL, or SQLite). All analysis runs in transient memory buffers.
2. **Ephemeral Memory Execution**: Once the JSON report is generated and transmitted over HTTP, the text buffer and image byte-array are immediately garbage collected.
3. **No User Accounts / No Tracking**: No user authentication, cookies, or profiling tokens are collected or stored.
4. **Safe URL Crawling**: URL inspection does not download or execute client-side scripts, applets, or binaries; it solely traverses HTTP redirects, DNS records, and WHOIS registries.

---

## 8. Development History & Technical Gotchas

### 8.1. Tailwind CSS v4 Theme Scale Hijacking (Fixed)
* **Problem**: In early builds, `AnalysisProgress.tsx` rendered as an ultra-narrow (48px) vertical tube, causing all text to break and overflow across border lines.
* **Root Cause**: `frontend/app/globals.css` declared `--spacing-2xl: 3rem;` inside Tailwind v4's `@theme inline` block. In Tailwind v4, defining `--spacing-*` custom properties injects into the global spacing scale. Because Tailwind v4 prioritizes spacing keys for `max-w-*` utilities, `.max-w-2xl` compiled to `max-width: 3rem;` (48px) instead of the container scale (`42rem` / 672px).
* **Fix**: Removed redundant `--spacing-*` definitions from `globals.css`, restoring standard Tailwind container widths (`.max-w-2xl { max-width: var(--container-2xl); }`), and set modal containers to explicit responsive widths (`w-full max-w-xl mx-auto`).

### 8.2. Web Font Loading vs. Native SVG Rendering (Fixed)
* **Problem**: Relying solely on Google Material Symbols font caused occasional missing icon glyphs or visual layout shifts during initial load.
* **Fix**: All critical status indicators (checkmarks, spinners, locks, shields) in `AnalysisProgress.tsx` were converted into inline semantic SVGs, ensuring instant rendering without external network font dependencies.

---

## 9. Environment Variables Configuration

Create a `.env` file inside `backend/` with the following keys:

```env
# Google Gemini API Key (Required for live AI threat deconstruction)
# Obtain at: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# Gemini Model Selection (Optional, defaults to gemini-3.6-flash)
GEMINI_MODEL=gemini-3.6-flash

# Google Safe Browsing API Key (Optional, enables live Google threat feed queries)
# Obtain at: https://console.cloud.google.com/apis/credentials
SAFE_BROWSING_API_KEY=your_safe_browsing_key_here

# Allowed CORS Origins (Comma-separated)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Frontend environment settings (configured in `frontend/.env.local` if needed):
```env
# URL pointing to the FastAPI backend service
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 10. Local Setup & Running Guide

### Prerequisites
* **Node.js**: v18.18.0 or newer (v20+ recommended)
* **Python**: v3.10, 3.11, 3.12, 3.13, or 3.14

### Running the Backend
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate virtual environment
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the FastAPI development server
uvicorn main:app --reload --port 8000
```
Backend API interactive documentation is available at: `http://localhost:8000/docs`.

### Running the Frontend
```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
Frontend application is available at: `http://localhost:3000`.

### Running Automated Backend Tests
```bash
cd backend
python test_backend.py
```

### Generating the Executive PowerPoint Deck
```bash
# Run using the python environment containing python-pptx
python create_presentation.py ScamGuard_Presentation.pptx
```
Outputs the 8-slide presentation to `ScamGuard_Presentation.pptx`.
