# ATS RealTime Studio v2.0 🎯
> **AI-Powered Enterprise ATS Resume Optimizer & Realtime Job Matcher**

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Django](https://img.shields.io/badge/Django-6.0.1-green?logo=django)
![Django REST Framework](https://img.shields.io/badge/DRF-3.16.1-red?logo=django)
![Vite](https://img.shields.io/badge/Vite-7.3.1-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-38bdf8?logo=tailwindcss)
![Python](https://img.shields.io/badge/Python-3.13-yellow?logo=python)

---

## 🌟 Overview

**ATS RealTime Studio v2.0** is an enterprise-grade Applicant Tracking System (ATS) resume optimization platform modeled after the parsing, ranking, and search algorithms of **Workday, Oracle Taleo, Greenhouse, Lever, iCIMS, and SAP SuccessFactors**.

It provides job seekers with real-time debounced scoring (<50ms), a side-by-side live editor, recruiter Boolean query qualification testing, Workday parser cleanliness safety checks, 1-click ATS-proven PDF exports, and an itemized mathematical audit log.

---

## 🔥 Key Features

### 1. 📊 7-Pillar Enterprise ATS Scoring Matrix (100 Pts Total)
Evaluates candidates across the 7 foundational pillars used by enterprise hiring scorecards:
*   **Pillar 1: Career Path & Work Experience (25 Pts)** — Tenure length, recency, and leadership title trajectory.
*   **Pillar 2: Technical Skills & Tools Match (25 Pts)** — Hard keyword match ratio against target role taxonomies.
*   **Pillar 3: Projects & Portfolio Quality (15 Pts)** — Dedicated project entries and tech stack mentions.
*   **Pillar 4: Education & Certifications (15 Pts)** — Academic degrees (B.Tech, B.S., M.S., Ph.D.) and industry certs (AWS, GCP, CKA, PMP, Scrum).
*   **Pillar 5: Soft Skills & Action Verbs (10 Pts)** — High-impact action verbs and leadership terms.
*   **Pillar 6: Culture Fit & Open Source (5 Pts)** — Open-source contributions, GitHub links, tech blogs, and personal hobbies.
*   **Pillar 7: Formatting & Readability (5 Pts)** — Word count density (300–1000 words) and clean header layouts.

### 2. 🔍 Recruiter Boolean Search Simulator
Simulates recruiter Boolean query filters (e.g. `("Senior" OR "Lead") AND ("Python" OR "Django") AND "AWS"`). Displays real-time Boolean qualification percentage (&ge;75% required to pass knockout filters).

### 3. 🛡️ ATS Parser Cleanliness & Layout Safety Auditor
Detects enterprise parsing traps:
*   Non-standard bullet symbols (`➢`, `★`, `■`, `✔`).
*   Header/footer contact information risks.
*   Canonical heading compliance (`Work Experience`, `Education`, `Technical Skills`, `Key Projects`).
*   **TF-IDF Keyword Stuffing Guard**: Flags terms exceeding 4.5% density to prevent keyword stuffing penalties.

### 4. 📄 1-Click ATS Clean PDF Exporter & Template Studio
Includes **3 Workday/Taleo certified single-column templates**:
*   **Tech Standard (Classic)** — Single-column serif/sans typography with canonical section headers and inline contact info.
*   **Executive Compact** — High-density spacing optimized for experienced candidates (5+ yrs) fitting cleanly on 1 page.
*   **Minimalist Clean** — Modern layout with left-aligned indigo accent borders.
*   **1-Click High-Res PDF Export** powered by `html2pdf.js` with 100% text selectability.

### 5. 📑 100% Full Resume Extraction Inspector
Multi-engine PDF text extraction pipeline combining **`pdfplumber`**, **`pypdfium2`**, and **`pdfminer.six`** to extract 100% of uploaded document text without truncation. Includes a scrollable raw text viewer and 1-click **Copy Raw Text**.

### 6. 🧮 Transparent Mathematical Score Calculation Log
Provides an itemized point addition/deduction table showing exact math (`+22 pts`, `+18.5 pts`, `-2 pts`) with explicit human-readable diagnostic explanations.

### 7. 🤖 Google X-Y-Z Bullet Point Optimizer
Generates ready-to-use bullet points based on Google's formula: *"[Accomplished X] as measured by [Y], by doing [Z]"*.

---

## 🛠️ Technology Stack

*   **Frontend**: React 19, Vite 7, Tailwind CSS 4, Lucide React Icons, html2pdf.js, Axios, React Router 7.
*   **Backend**: Python 3.13, Django 6, Django REST Framework 3.16, pdfplumber, pypdfium2, pdfminer.six, python-docx, django-cors-headers.

---

## ⚙️ Installation & Local Setup

### Prerequisites
*   Python 3.10+
*   Node.js 18+

### 1. Clone Repository
```bash
git clone https://github.com/chinmayamoharana/ATS_Check.git
cd ATS_Check
```

### 2. Backend Setup (Django)
```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Linux / macOS:
source venv/bin/activate

# Install required dependencies
pip install django djangorestframework django-cors-headers pdfplumber pypdfium2 pdfminer.six python-docx pillow

# Run migrations & start server
python ats_backend/manage.py runserver 8000
```
*Backend runs on `http://127.0.0.1:8000/`*

### 3. Frontend Setup (React / Vite)
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
*Frontend runs on `http://localhost:5173/`*

---

## 🔌 API Endpoints Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/ats/check/` | `POST` | Multipart file upload endpoint (`.pdf`, `.docx`, `.txt`). Returns 100% extracted text & 7-pillar ATS analysis. |
| `/api/ats/realtime-analyze/` | `POST` | Real-time JSON endpoint for debounced live text scoring (<50ms). |
| `/api/ats/job-templates/` | `GET` | Returns preset job role templates & core skill taxonomies (`fullstack`, `frontend`, `backend`, `devops`, `datascience`, `mobile`, `productmanager`). |

---

## 👤 Author

**Chinmaya Moharana**
*   **GitHub**: [@chinmayamoharana](https://github.com/chinmayamoharana)
*   **LinkedIn**: [Chinmaya Moharana](https://www.linkedin.com/in/chinmayac1)
*   **Portfolio**: [chinmaya-moharana-22.vercel.app](https://chinmaya-moharana-22.vercel.app)
