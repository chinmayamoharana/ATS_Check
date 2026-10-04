# ClearCV Resume Review

ClearCV extracts text from an uploaded resume and reports a transparent resume quality score with evidence-based suggestions. It does not predict a specific employer's ATS result or guarantee an interview.

## What it checks

- Email and phone visibility.
- Common resume sections and headings.
- Skills and competency terms recognized by the included taxonomy.
- Work history dates, role titles, and accomplishment bullets.
- Measurable outcomes and action language.
- Broad text length and bullet character signals.
- Optional education and certifications are reported but do not affect the score.

The score is a general heuristic. It is not tailored to a job description, and visual PDF layout is not fully evaluated. Image-only scanned PDFs require OCR, which is not currently configured. Always review the extracted text and suggestions yourself.

## Local setup

Requirements: Python 3.13 and Node.js 18 or newer.

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
cd ats_backend
python manage.py check
python manage.py runserver 8001
```

The API runs at `http://127.0.0.1:8001/`.

### Frontend

```powershell
cd frontend
npm install
npm run lint
npm run dev -- --host 127.0.0.1
```

Vite prints the local URL when it starts. For a separate backend, set `VITE_API_BASE_URL` to its `/api/ats` URL before starting/building the frontend. Production deployments must configure the API URL and Django CORS origins for their actual hostnames.

## Backend configuration

`backend/env.example` lists the Django environment variables. It is a reference file; export the values in the shell or deployment environment. Before deployment:

- Set a unique `DJANGO_SECRET_KEY` outside source control.
- Set `DJANGO_DEBUG=false` and configure `DJANGO_ALLOWED_HOSTS`.
- Set `CORS_ALLOWED_ORIGINS` to the frontend origin(s) only.
- Serve the application over HTTPS and use a production WSGI/ASGI server.

The upload API limits files to 10 MB and extracted text to 200,000 characters. It processes the upload for analysis without saving it to the project's database or media directory. Add rate limiting and operational privacy/retention policy before opening the service to public traffic.

## API

`POST /api/ats/check/` accepts a multipart `resume` file in PDF, DOCX, or TXT format. It returns the score, individual checks, recommendations, extracted text, and extraction warnings. Text-only PDFs are supported; scanned image PDFs currently return an extraction error because OCR is not installed.
