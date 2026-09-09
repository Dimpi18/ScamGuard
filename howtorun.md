Terminal 1: Run the Backend (FastAPI on Port 8000)
Navigate to the backend directory:

powershell
cd c:\Users\admin\Desktop\ScamGuard\backend
Activate your virtual environment:

powershell
.\venv\Scripts\Activate.ps1
(If you're using Command Prompt instead of PowerShell: .\venv\Scripts\activate.bat)

Start the FastAPI server using uvicorn:

powershell
uvicorn main:app --reload --port 8000
API URL: http://localhost:8000
Interactive API Docs: http://localhost:8000/docs
Health Check: http://localhost:8000/health
Terminal 2: Run the Frontend (Next.js on Port 3000)
Navigate to the frontend directory:
powershell
cd c:\Users\admin\Desktop\ScamGuard\frontend
Start the development server:
powershell
npm run dev
Open your browser at:
Frontend App: http://localhost:3000
Verification Checklist:
Ensure your backend/.env file has your GEMINI_API_KEY populated.
Frontend .env.local is already configured to point to NEXT_PUBLIC_API_URL=http://localhost:8000.