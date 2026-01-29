import pdfplumber
from docx import Document
import re


# ---------- TEXT EXTRACTION ----------
def extract_text(file):
    if file.name.endswith('.pdf'):
        text = ""
        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text

    elif file.name.endswith('.docx'):
        doc = Document(file)
        return " ".join([p.text for p in doc.paragraphs])

    return ""


# ---------- CLEAN TEXT ----------
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9 ]', '', text)
    return text


# ---------- KEYWORDS (YOU CAN EDIT THESE) ----------
SKILLS = [
    "python", "django", "react", "javascript",
    "html", "css", "sql", "mongodb", "api"
]

EXPERIENCE = [
    "experience", "project", "development",
    "backend", "frontend", "internship"
]

EDUCATION = [
    "btech", "degree", "computer science",
    "engineering", "college", "university"
]


# ---------- ATS SCORE LOGIC ----------
def calculate_ats_score(resume_text):
    resume_text = clean_text(resume_text)

    skills_matched = [s for s in SKILLS if s in resume_text]
    exp_matched = [e for e in EXPERIENCE if e in resume_text]
    edu_matched = [e for e in EDUCATION if e in resume_text]

    # Weighted scoring
    skill_score = (len(skills_matched) / len(SKILLS)) * 50
    exp_score = (len(exp_matched) / len(EXPERIENCE)) * 30
    edu_score = (len(edu_matched) / len(EDUCATION)) * 20

    total_score = skill_score + exp_score + edu_score

    missing = list(
        set(SKILLS + EXPERIENCE + EDUCATION)
        - set(skills_matched + exp_matched + edu_matched)
    )

    return {
        "ats_score": round(total_score, 2),
        "skills_matched": skills_matched,
        "experience_matched": exp_matched,
        "education_matched": edu_matched,
        "missing_keywords": missing
    }
