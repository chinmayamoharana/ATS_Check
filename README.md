# ClearCV Resume Review

ClearCV is a resume review application built with React and Django REST Framework. Upload a resume to receive a general quality score, individual evidence-based checks, and prioritized suggestions.

The score is a transparent heuristic based on extracted text. It is not a prediction of a particular employer's ATS result, a job match score, or a guarantee of an interview.

## Features

- Upload PDF, DOCX, or TXT resumes by file picker or drag and drop.
- Review a 100-point score, grade, and prioritized improvement suggestions.
- Inspect 16 checks covering contact details, resume sections, skills, work history, achievements, and readability.
- Review extracted text and extraction warnings before relying on the score.
- Upload limit of 10 MB and extracted-text limit of 200,000 characters.
- PDF extraction uses multiple parsers as needed. Scanned, image-only PDFs are not supported because OCR is not configured.
- Uploaded files are analyzed in memory and are not saved to the project's database or media directory.

Education and certifications are shown as optional information and do not affect the score. The tool evaluates extracted text rather than the full visual layout of a resume. Review the suggestions and verify all resume content yourself; never add skills or metrics you cannot substantiate.

## Requirements

- Python 3.13
- Node.js 18 or newer and npm

## Run locally

Start the backend and frontend in separate terminals from the project root.

### 1. Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
cd ats_backend
python manage.py check
python manage.py runserver 8001
```

The Django API will be available at `http://127.0.0.1:8001/`.

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev -- --host 127.0.0.1
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173/`. The development frontend defaults to the local Django API at `http://127.0.0.1:8001/api/ats`.

To lint or create a production frontend bundle:

```powershell
npm run lint
npm run build
```

## Configuration

The example files document optional environment variables:

- `backend/env.example` for Django settings.
- `frontend/.env.example` for the API base URL.

These are examples, not automatically loaded environment files. Set the values in your shell or deployment environment. For a different API URL, set `VITE_API_BASE_URL` before starting Vite or building the frontend. Its value should be the API base ending in `/api/ats`, for example `https://api.example.com/api/ats` or `/api/ats` for same-origin hosting.

For a deployment, set a unique `DJANGO_SECRET_KEY`, set `DJANGO_DEBUG=false`, provide the deployment hostnames in `DJANGO_ALLOWED_HOSTS`, and set `CORS_ALLOWED_ORIGINS` to the frontend origin(s). Use HTTPS and a production WSGI or ASGI server. Django's development server is for local development only.

## API

### Analyze an uploaded resume

`POST /api/ats/check/` accepts `multipart/form-data` with a required `resume` file field. Supported extensions are `.pdf`, `.docx`, and `.txt`.

Example using `curl`:

```bash
curl -X POST http://127.0.0.1:8001/api/ats/check/ \
  -F "resume=@./resume.pdf"
```

A successful response includes:

- `ats_score` and `score_grade`.
- `resume_checks`, including each check's category, evidence, earned points, and maximum points.
- `recommendations`, prioritized actions tied to their supporting check.
- `parsed_resume`, with word and character counts, contact details, and extracted text.
- `extraction_review`, with word count and warnings about potentially incomplete or noisy extraction.
- `score_disclaimer`, explaining the limits of the score.

Common errors include `400` for a missing or unsupported file, `413` for files or extracted text over the limit, and `422` when no readable text can be extracted. Scanned PDFs need OCR and currently return an extraction error.

### Other backend routes

- `POST /api/ats/realtime-analyze/` scores text sent as JSON in a `resume_text` field (maximum 200,000 characters).
- `GET /api/ats/job-templates/` returns the role preset data retained by the backend.

The current frontend uses the upload route and provides a general resume review without a target job description.

## Troubleshooting

- **Frontend cannot reach the API:** Make sure Django is running on port `8001`. For a different host or port, set `VITE_API_BASE_URL` and restart Vite.
- **CORS error:** Add the exact frontend origin (including scheme and port) to `CORS_ALLOWED_ORIGINS`, then restart Django.
- **PDF has no extracted text:** Check that it contains selectable text. Image-only scans are not supported without OCR.
- **Upload rejected:** Confirm the extension is PDF, DOCX, or TXT and the file is no larger than 10 MB.

## Privacy and deployment notes

The current upload endpoint does not persist uploaded resumes. The application does not include authentication, rate limiting, or a production privacy and retention policy. Add and review those controls before making the service publicly available. Avoid uploading sensitive resumes to deployments whose data handling you have not reviewed.
