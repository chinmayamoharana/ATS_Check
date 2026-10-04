import pdfplumber
from docx import Document
import re
import math
from collections import Counter


# ---------- TEXT EXTRACTION ----------
def extract_text(file):
    """Extract 100% of raw text from PDF, DOCX, or TXT file using multi-engine extraction."""
    text = ""
    file_name = file.name.lower()
    
    if file_name.endswith('.pdf'):
        file_bytes = file.read() if hasattr(file, 'read') else b""
        
        import io
        candidates = []
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                text1 = "\n".join(
                    (page.extract_text(layout=False) or page.extract_text() or "")
                    for page in pdf.pages
                ).strip()
            if text1:
                candidates.append(text1)
        except Exception:
            pass

        # Avoid two additional parser passes for the common, well-extracted case.
        if not candidates or len(re.findall(r"\b[\w+#.-]+\b", candidates[0])) < 80 or _extraction_candidate_score(candidates[0]) < 65:
            try:
                import pypdfium2
                pdf_doc = pypdfium2.PdfDocument(file_bytes)
                text2 = "\n".join(page.get_textpage().get_text_range() for page in pdf_doc).strip()
                if text2:
                    candidates.append(text2)
            except Exception:
                pass

        if not candidates or max(_extraction_candidate_score(item) for item in candidates) < 65:
            try:
                from pdfminer.high_level import extract_text as pdfminer_extract
                text3 = (pdfminer_extract(io.BytesIO(file_bytes)) or "").strip()
                if text3:
                    candidates.append(text3)
            except Exception:
                pass

        # Prefer complete, readable text over raw character count.
        if candidates:
            text = max(candidates, key=_extraction_candidate_score)

    elif file_name.endswith('.docx'):
        try:
            doc = Document(file)
            p_text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
            t_text = ""
            for table in doc.tables:
                for row in table.rows:
                    t_text += " | ".join([cell.text.strip() for cell in row.cells if cell.text.strip()]) + "\n"
            text = p_text + "\n" + t_text
        except Exception as e:
            print(f"Error extracting DOCX: {e}")
            text = ""

    elif file_name.endswith('.txt'):
        try:
            text = file.read().decode('utf-8', errors='ignore')
        except Exception:
            try:
                text = file.read().decode('latin-1', errors='ignore')
            except Exception:
                text = ""

    # Clean null bytes & control chars
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', text)
    return text.strip()


def _extraction_candidate_score(text):
    words = re.findall(r"\b[\w+#.-]+\b", text, re.UNICODE)
    non_space = [char for char in text if not char.isspace()]
    readable = sum(char.isalnum() or char in ".,;:|/+-@()#%&'" for char in non_space)
    readability = readable / max(len(non_space), 1)
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    uniqueness = len(set(lines)) / max(len(lines), 1)
    replacements = text.count("\ufffd")
    completeness = min(len(words) / 400, 1)
    return completeness * 40 + readability * 45 + uniqueness * 15 - replacements




# ---------- CLEAN & TOKENIZE ----------
def clean_text(text):
    """Clean text by keeping alphanumeric and basic spacing, normalized to lower case."""
    text_lower = text.lower()
    cleaned = re.sub(r'[^a-z0-9\s\+\#\.]', ' ', text_lower)
    return cleaned


def tokenize(text):
    """Tokenize clean text into word list."""
    words = re.findall(r'\b[a-z0-9\+\#\.]+\b', text.lower())
    stop_words = {
        'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with',
        'by', 'about', 'against', 'between', 'into', 'through', 'during', 'before',
        'after', 'above', 'below', 'from', 'up', 'down', 'of', 'off', 'over', 'under',
        'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
        'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
        'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
        's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'is', 'was', 'are',
        'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
        'did', 'doing', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'
    }
    return [w for w in words if w not in stop_words and len(w) > 1]


# ---------- COMPREHENSIVE TAXONOMIES ----------
SKILLS_TAXONOMY = {
    "Languages": [
        "python", "javascript", "typescript", "java", "c++", "c#", "golang", "go",
        "ruby", "php", "swift", "kotlin", "rust", "scala", "sql", "r", "html", "css", "html5", "css3", "bash", "shell"
    ],
    "Frontend": [
        "react", "react.js", "reactjs", "next.js", "nextjs", "vue", "vue.js", "vuejs", "angular", "tailwind", "tailwindcss",
        "bootstrap", "redux", "zustand", "graphql", "rest api", "webpack", "vite", "sass", "less",
        "jquery", "typescript", "webassembly", "pwa", "responsive design", "microfrontends"
    ],
    "Backend": [
        "django", "django rest framework", "drf", "fastapi", "flask", "node.js", "nodejs", "node", "express", "express.js", "expressjs", "spring boot",
        "nest.js", "ruby on rails", "laravel", "asp.net", "gRPC", "restful api", "rest api", "microservices",
        "celery", "rabbitmq", "kafka", "graphql", "socket.io", "websocket"
    ],
    "Databases": [
        "postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite", "oracle",
        "mssql", "cassandra", "dynamodb", "elasticsearch", "neo4j", "supabase", "firebase"
    ],
    "Cloud & DevOps": [
        "aws", "azure", "gcp", "docker", "kubernetes", "k8s", "terraform", "ansible",
        "ci/cd", "github actions", "jenkins", "gitlab ci", "nginx", "linux", "cloudformation",
        "prometheus", "grafana", "serverless", "lambda", "vercel", "netlify"
    ],
    "AI & Data Science": [
        "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn",
        "pandas", "numpy", "nlp", "llm", "langchain", "openai", "computer vision",
        "data analysis", "tableau", "power bi", "spark", "hadoop"
    ],
    "Tools & Testing": [
        "git", "github", "gitlab", "jira", "postman", "jest", "cypress", "selenium",
        "pytest", "unittest", "docker", "npm", "yarn", "pnpm", "swagger", "openapi"
    ],
    "Soft Skills": [
        "leadership", "communication", "problem solving", "teamwork", "agile", "scrum",
        "collaboration", "time management", "critical thinking", "mentorship", "project management"
    ],
    "Product & Business": [
        "product management", "product manager", "product strategy", "product roadmap", "roadmapping", "roadmap",
        "stakeholder management", "stakeholder engagement", "user research", "market research",
        "business analysis", "business strategy", "go to market", "requirements gathering",
        "requirements analysis", "user stories", "product analytics", "kpi", "okrs",
        "backlog management", "prioritization", "customer success", "process improvement",
        "operations management", "financial modeling", "risk management", "sales strategy",
        "marketing strategy", "cross functional", "analytics", "stakeholder relations", "program management"
    ]
}


ACTION_VERBS = [
    "achieved", "architected", "automated", "built", "created", "designed", "developed",
    "engineered", "established", "expanded", "implemented", "increased", "integrated",
    "launched", "led", "managed", "migrated", "optimized", "orchestrated", "overhauled",
    "pioneered", "reduced", "refactored", "scaled", "spearheaded", "standardized",
    "streamlined", "transformed", "accelerated", "crafted", "delivered", "executed",
    "formulated", "improved", "maximized", "mentored", "resolved", "solved"
]

JOB_TEMPLATES = {
    "fullstack": {
        "title": "Full Stack Developer",
        "core_skills": ["python", "django", "react", "javascript", "typescript", "sql", "postgresql", "rest api", "git", "docker", "tailwind"],
        "description": "Develops end-to-end web applications using modern frontend frameworks and robust backend architecture."
    },
    "frontend": {
        "title": "Frontend Developer (React/Next.js)",
        "core_skills": ["react", "javascript", "typescript", "html", "css", "tailwind", "next.js", "redux", "vite", "rest api", "git"],
        "description": "Specializes in building responsive, high-performance web user interfaces and user experiences."
    },
    "backend": {
        "title": "Backend Engineer (Python/Django)",
        "core_skills": ["python", "django", "fastapi", "sql", "postgresql", "redis", "docker", "rest api", "microservices", "git", "aws"],
        "description": "Focuses on server-side logic, database optimization, API design, and system scalability."
    },
    "datascience": {
        "title": "Data Scientist / AI Engineer",
        "core_skills": ["python", "pandas", "numpy", "machine learning", "tensorflow", "pytorch", "scikit-learn", "sql", "nlp", "r"],
        "description": "Extracts insights from complex data models and builds machine learning & AI systems."
    },
    "devops": {
        "title": "DevOps & Cloud Engineer",
        "core_skills": ["aws", "docker", "kubernetes", "terraform", "ci/cd", "linux", "bash", "python", "ansible", "nginx", "prometheus"],
        "description": "Automates cloud deployment pipelines, infrastructure provisioning, and system reliability."
    },
    "mobile": {
        "title": "Mobile App Developer",
        "core_skills": ["react native", "flutter", "swift", "kotlin", "javascript", "typescript", "ios", "android", "rest api", "git"],
        "description": "Crafts cross-platform or native mobile applications with intuitive mobile interfaces."
    },
    "productmanager": {
        "title": "Product / Technical Project Manager",
        "core_skills": ["project management", "agile", "scrum", "jira", "leadership", "roadmap", "user experience", "data analysis", "communication"],
        "description": "Drives product strategy, sprint planning, and cross-functional team execution."
    }
}

BUZZWORDS = [
    "synergy", "hardworking", "detail-oriented", "self-starter", "team player",
    "thought leader", "results-driven", "go-getter", "dynamic", "passionate",
    "out-of-the-box", "proactive", "strategic thinker", "expert", "visionary",
    "guru", "ninja", "rockstar", "wizard", "fast learner", "hard worker",
    "motivated", "dedicated", "value-add", "bottom-line", "paradigm", "synergies"
]

PASSIVE_PHRASES = [
    "was responsible for", "worked on", "helped with", "assisted in", "duties included",
    "served as", "participated in", "tasked with", "involved in", "worked closely with",
    "helped to", "responsible for"
]


# ---------- AUDIT HELPERS ----------
def detect_buzzwords_and_passive(text):
    """Detect overused fluff buzzwords and passive voice phrasing."""
    clean = clean_text(text)
    text_lower = text.lower()

    found_buzzwords = []
    for b in BUZZWORDS:
        pattern = r'\b' + re.escape(b) + r'\b'
        if re.search(pattern, clean):
            found_buzzwords.append(b.title())

    found_passive = []
    for p in PASSIVE_PHRASES:
        if p in text_lower:
            found_passive.append(p)

    return list(set(found_buzzwords)), list(set(found_passive))


def generate_bullet_suggestions(missing_keywords, job_role="fullstack"):
    """Generate ready-to-use Google X-Y-Z formula bullet points tailored to missing keywords."""
    template = JOB_TEMPLATES.get(job_role, JOB_TEMPLATES["fullstack"])
    suggestions = []

    for kw in missing_keywords[:4]:
        kw_name = kw["name"]
        suggestions.append({
            "keyword": kw_name,
            "category": kw["category"],
            "suggested_bullet": f"• Used {kw_name} to deliver [specific task or feature], improving [measured outcome] by [verified result].",
            "alt_bullet": f"• Applied {kw_name} to [project or process]; measured the result using [metric or evidence]."
        })

    return suggestions


def check_contact_info(text):
    """Detect presence of contact information in text with high resilience."""
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    phone_pattern = r'(\+?\d{1,3}[-.\s]*)?\(?\d{2,5}\)?[-.\s]*\d{3,5}[-.\s]*\d{3,5}'
    linkedin_pattern = r'(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+'
    github_pattern = r'(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+'
    portfolio_pattern = r'(?:https?:\/\/)?([a-zA-Z0-9_-]+\.(?:vercel\.app|netlify\.app|dev|me|io|github\.io|app|tech))(?:[^\s]*)'

    email_match = re.search(email_pattern, text)
    phone_match = re.search(phone_pattern, text)
    linkedin_match = re.search(linkedin_pattern, text, re.IGNORECASE)
    github_match = re.search(github_pattern, text, re.IGNORECASE)
    portfolio_match = re.search(portfolio_pattern, text, re.IGNORECASE)

    return {
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "linkedin": linkedin_match.group(0) if linkedin_match else None,
        "github": github_match.group(0) if github_match else None,
        "portfolio": portfolio_match.group(0) if portfolio_match else None,
        "has_email": bool(email_match),
        "has_phone": bool(phone_match),
        "has_linkedin": bool(linkedin_match),
        "has_github": bool(github_match)
    }


def clean_candidate_name(text):
    """Return a plausible name from the first line, without inventing one."""
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        return "Candidate Profile"
    first_line = re.split(r"\s*[|•]\s*", lines[0], maxsplit=1)[0]
    candidate_name = re.sub(r"\b(?:resume|curriculum vitae)\b", "", first_line, flags=re.I)
    candidate_name = re.sub(r"[^\w .'-]", " ", candidate_name)
    candidate_name = re.sub(r"\s+", " ", candidate_name).strip(" .-'")
    headings = {alias for aliases in SECTION_ALIASES.values() for alias in aliases}
    tokens = candidate_name.split()
    if (not candidate_name or len(candidate_name) > 60 or len(tokens) > 5
            or candidate_name.lower() in headings or re.search(r"\d|@|https?", first_line, re.I)):
        return "Candidate Profile"
    return candidate_name.title() if candidate_name.isupper() else candidate_name




SECTION_ALIASES = {
    "summary": ("summary", "professional summary", "career summary", "profile", "professional profile", "objective", "about me"),
    "experience": ("experience", "work experience", "professional experience", "work history", "employment history", "employment"),
    "education": ("education", "education and degrees", "education & degrees", "academic background", "academic qualifications"),
    "skills": ("skills", "technical skills", "core skills", "technical proficiencies", "competencies", "technologies"),
    "projects": ("projects", "key projects", "personal projects", "selected projects", "portfolio"),
    "certifications": ("certifications", "certificates", "licenses", "licenses and certifications"),
}


def _normalize_heading(line):
    normalized = re.sub(r"^[\s•●▪*-]+|[\s:：|—–-]+$", "", line.lower()).strip()
    return re.sub(r"\s+", " ", normalized)


def split_resume_sections(text):
    """Return content grouped under recognized, standalone section headings."""
    blocks = {key: [] for key in SECTION_ALIASES}
    current = None
    for line in text.splitlines():
        heading = _normalize_heading(line)
        matched = next((key for key, aliases in SECTION_ALIASES.items() if heading in aliases), None)
        if matched:
            current = matched
        elif current:
            blocks[current].append(line)
    return {key: "\n".join(lines).strip() for key, lines in blocks.items()}


def contains_term(text, term):
    """Match a keyword as a complete term while allowing flexible phrase spacing."""
    term_pattern = re.escape(term.strip())
    term_pattern = term_pattern.replace(r"\ ", r"[\s/_-]+")
    term_pattern = term_pattern.replace(r"\/", r"[\s/_-]*")
    return bool(re.search(r"(?<![a-z0-9])" + term_pattern + r"(?![a-z0-9])", text, re.IGNORECASE))


def _resume_check(check_id, category, label, earned, maximum, finding, recommendation=""):
    earned = round(max(0, min(float(earned), float(maximum))), 1)
    ratio = earned / maximum if maximum else 1
    return {
        "id": check_id,
        "category": category,
        "label": label,
        "earned": earned,
        "max": maximum,
        "status": "not_scored" if not maximum else "good" if ratio >= 0.8 else "warning" if ratio >= 0.5 else "needs_work",
        "finding": finding,
        "recommendation": recommendation,
    }


def review_extracted_text(text):
    """Flag obvious extraction problems without pretending to measure ATS success."""
    words = re.findall(r"\b[\w+#.-]+\b", text, re.UNICODE)
    warnings = []
    if len(words) < 80:
        warnings.append(f"Only {len(words)} words were extracted. Check that all resume pages and sections are present.")
    if "\ufffd" in text:
        warnings.append("Some characters could not be decoded. Review the extracted text before using the score.")
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if len(lines) >= 8:
        repeated_ratio = 1 - (len(set(lines)) / len(lines))
        if repeated_ratio > 0.35:
            warnings.append("Many extracted lines are repeated. A complex layout may have affected text reading order.")
    if lines and not any(_normalize_heading(line) in {alias for aliases in SECTION_ALIASES.values() for alias in aliases} for line in lines):
        warnings.append("No standard resume section headings were recognized. Check the text extraction and headings.")
    return {"word_count": len(words), "warnings": warnings}


def audit_sections(text):
    """Detect section headings, requiring a heading-like line to avoid body-text matches."""
    titles = {
        "summary": "Professional Summary / Objective",
        "experience": "Work Experience / History",
        "education": "Education & Degrees",
        "skills": "Technical & Core Skills",
        "projects": "Key Projects",
        "certifications": "Certifications & Licenses",
    }
    weights = {"summary": 10, "experience": 30, "education": 20, "skills": 25, "projects": 15, "certifications": 0}
    found = set()
    for line in text.splitlines():
        normalized = _normalize_heading(line)
        for section, names in SECTION_ALIASES.items():
            if normalized in names:
                found.add(section)

    sections = {
        key: {"title": titles[key], "present": key in found, "weight": weights[key]}
        for key in SECTION_ALIASES
    }

    present_count = sum(1 for s in sections.values() if s["present"])
    score = (sum(s["weight"] for s in sections.values() if s["present"]) / 100.0) * 100

    return sections, round(score, 1), present_count


def extract_quantified_metrics(text):
    """Find metrics (numbers, percentages, dollar values, multipliers)."""
    patterns = [
        r'(?<!\w)\d+(?:\.\d+)?\s*%(?!\w)',
        r'\$\d+(?:,\d+)*(?:\.\d+)?(?:\s*[kKmMbB])?\b',
        r'\b\d+x\b',
        r'\b\d+\s*(?:\+\s*)?(?:users|clients|customers|projects|requests|ms|seconds|minutes|hours|percent|members|developers|revenue|transactions|deployments|incidents|tickets)\b'
    ]

    found_metrics = []
    lines = text.split('\n')
    for line in lines:
        for p in patterns:
            matches = re.findall(p, line, re.IGNORECASE)
            for m in matches:
                if len(found_metrics) < 10:
                    found_metrics.append({"metric": m, "context": line.strip()[:80]})

    return found_metrics


def extract_action_verbs(text):
    """Extract action verbs found in text."""
    clean = clean_text(text)
    words = tokenize(clean)
    found_verbs = [v for v in ACTION_VERBS if v in words]
    verb_counts = Counter(found_verbs)
    return [{"verb": v.capitalize(), "count": c} for v, c in verb_counts.most_common()]


# ---------- BIT-BY-BIT DEEP CONTENT PARSER ----------
def parse_bit_by_bit(text):
    """
    Extracts and audits resume contents entity-by-entity and bit-by-bit:
    1. Candidate Profile & Contact details
    2. Work History & Roles
    3. Education Entries
    4. Projects
    5. Section Scores
    """
    name = clean_candidate_name(text)
    contact = check_contact_info(text)
    
    location_match = re.search(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),\s*([A-Z]{2}|[A-Z][a-z]+)\b', text)
    location = location_match.group(0) if location_match else "Not extracted"
    text_lower = text.lower()
    blocks = split_resume_sections(text)
    sections, _, _ = audit_sections(text)

    # Keep only details supported by text in the corresponding resume section.
    work_roles = []
    date_pattern = r'(?:19\d{2}|20\d{2})\s*(?:–|-|to)\s*(?:(?:19|20)\d{2}|present|current)'
    experience_lines = blocks["experience"].splitlines()
    role_line_indexes = []
    for line_index, line in enumerate(experience_lines):
        if not re.search(date_pattern, line, re.IGNORECASE):
            continue
        parts = re.split(r'\s*[|@]\s*', line, maxsplit=1)
        title = re.sub(date_pattern, "", parts[0], flags=re.IGNORECASE).strip(" ()-–")
        if not re.search(r'\b(engineer|developer|manager|architect|analyst|lead|specialist|consultant|intern|designer|scientist|director)\b', title, re.I):
            continue
        company = re.sub(date_pattern, "", parts[1], flags=re.IGNORECASE).strip(" ()-–") if len(parts) > 1 else "Not extracted"
        role_line_indexes.append(line_index)
        work_roles.append({
            "title": title or "Not extracted",
            "company": company or "Not extracted",
            "dates": re.search(date_pattern, line, re.IGNORECASE).group(0),
            "bullet_count": 0,
        })
    for role_index, line_index in enumerate(role_line_indexes):
        next_role_line = role_line_indexes[role_index + 1] if role_index + 1 < len(role_line_indexes) else len(experience_lines)
        work_roles[role_index]["bullet_count"] = sum(
            bool(re.match(r'^\s*(?:[•●▪*-])\s+\S', item))
            for item in experience_lines[line_index + 1:next_role_line]
        )
    work_roles = work_roles[:8]

    education_entries = []
    degree_pattern = r'\b(B\.?\s?Tech|M\.?\s?Tech|B\.?\s?E\.?|B\.?\s?S\.?|M\.?\s?S\.?|Ph\.?D\.?|Bachelor(?:\s+of\s+\w+)?|Master(?:\s+of\s+\w+)?|Associate(?:\s+Degree)?|Diploma)\b'
    for line in blocks["education"].splitlines():
        degree = re.search(degree_pattern, line, re.IGNORECASE)
        if degree:
            education_entries.append({"degree": degree.group(0).strip(), "details": line.strip()})
    education_entries = education_entries[:6]

    project_entries = []
    for line in blocks["projects"].splitlines():
        item = re.sub(r'^\s*[•●▪*-]\s*', '', line).strip()
        if item:
            title = item.split(":", 1)[0].strip()
            project_entries.append({"title": title[:100] or "Project entry detected"})
    project_entries = project_entries[:8]

    sec_scores = {
        "contact_score": 100 if (contact["has_email"] and contact["has_phone"]) else 0,
        "summary_score": 100 if sections["summary"]["present"] else 0,
        "experience_score": 100 if sections["experience"]["present"] else 0,
        "education_score": 100 if sections["education"]["present"] else 0,
        "skills_score": 100 if sections["skills"]["present"] else 0,
        "projects_score": 100 if sections["projects"]["present"] else 0,
    }

    return {
        "candidate_profile": {
            "name": name,
            "email": contact["email"],
            "phone": contact["phone"],
            "linkedin": contact["linkedin"],
            "github": contact["github"],
            "portfolio": contact["portfolio"],
            "location": location
        },
        "work_roles": work_roles,
        "education_entries": education_entries,
        "project_entries": project_entries,
        "bit_by_bit_section_scores": sec_scores
    }



# ---------- RESUME SIGNAL HELPERS ----------
def audit_career_path(text):
    """Evaluates Career Path (25 Pts Max): years experience, title progression, recency."""
    text_lower = text.lower()
    
    # Years of experience check
    yrs_match = re.search(r'\b(\d{1,2})\+?\s*(?:years|yrs)\b', text_lower)
    years = int(yrs_match.group(1)) if yrs_match else 0
    
    if years >= 5: exp_pts = 12
    elif years >= 3: exp_pts = 10
    elif years >= 1: exp_pts = 7
    else: exp_pts = 5

    # Title progression check (Senior / Lead / Architect)
    has_progression = bool(re.search(r'\b(senior|lead|architect|principal|head|director)\b', text_lower))
    progression_pts = 8 if has_progression else 5

    # Recency check
    is_recent = bool(re.search(r'\b(present|current|2024|2025|2026)\b', text_lower))
    recency_pts = 5 if is_recent else 2

    total_career = exp_pts + progression_pts + recency_pts
    return min(total_career, 25), years, has_progression, is_recent


def audit_certifications(text):
    """Evaluates Certifications & Academic Degree (15 Pts Max)."""
    text_lower = text.lower()
    known_certs = [
        "aws certified", "aws", "gcp certified", "azure certified", "kubernetes",
        "cka", "cks", "pmp", "scrum master", "csm", "cissp", "ccna", "comptia"
    ]
    
    found_certs = []
    for c in known_certs:
        if c in text_lower:
            found_certs.append(c.upper())
            
    cert_pts = min(len(found_certs) * 2.5, 5)
    
    has_degree = bool(re.search(r'\b(btech|mtech|bachelor|master|degree|bs|ms|phd)\b', text_lower))
    degree_pts = 10 if has_degree else 4
    
    return min(cert_pts + degree_pts, 15), found_certs, has_degree


def audit_hobbies_and_culture(text):
    """Evaluates Hobbies, Open Source & Culture Fit (5 Pts Max)."""
    text_lower = text.lower()
    
    # Open Source & Tech Community
    has_opensource = bool(re.search(r'\b(open source|github|hackathon|blog|medium|dev\.to|stack overflow)\b', text_lower))
    open_pts = 3 if has_opensource else 0
    
    # Hobbies & Extracurriculars
    known_hobbies = ["chess", "reading", "blogging", "sports", "gaming", "music", "photography", "volunteering", "writing", "travelling"]
    found_hobbies = [h.title() for h in known_hobbies if h in text_lower]
    hobby_pts = min(len(found_hobbies) * 1, 2)
    
    return min(open_pts + hobby_pts, 5), found_hobbies, has_opensource


def audit_layout_safety(text):
    """
    Checks extracted text for common readability and parsing concerns:
    - Non-standard bullet characters (➢, ➔, ★, ■, ✔, etc.)
    - Canonical heading compliance
    - Contact placement hygiene
    - Word count density boundaries
    """
    bad_symbols = ['➢', '➔', '★', '■', '✔', '►', '❖', '✦']
    found_bad_symbols = [s for s in bad_symbols if s in text]
    
    sections, _, _ = audit_sections(text)
    found_canonical = [section["title"] for section in sections.values() if section["present"]]
    
    contact = check_contact_info(text)
    word_count = len(text.split())
    
    # Calculate cleanliness score (0 - 100)
    score = 100
    if found_bad_symbols:
        score -= len(found_bad_symbols) * 10
    if len(found_canonical) < 3:
        score -= 20
    if not (contact["has_email"] and contact["has_phone"]):
        score -= 25
    if word_count < 250 or word_count > 1100:
        score -= 15
        
    score = max(10, min(score, 100))
    
    return {
        "parser_safety_score": score,
        "found_bad_symbols": found_bad_symbols,
        "canonical_headers_count": len(found_canonical),
        "found_canonical_headers": found_canonical,
        "is_contact_clean": contact["has_email"] and contact["has_phone"],
        "word_count_status": "Optimal (300-900 words)" if 300 <= word_count <= 900 else "Suboptimal"
    }


def simulate_boolean_search(text, job_role="fullstack", job_description=""):
    """Build an illustrative Boolean query from the selected role or supplied JD."""
    target_terms = []
    if job_description and job_description.strip():
        for category, skills in SKILLS_TAXONOMY.items():
            for skill in skills:
                if skill != "go" and contains_term(job_description, skill):
                    target_terms.append((skill, category))
    if not target_terms:
        role = JOB_TEMPLATES.get(job_role, JOB_TEMPLATES["fullstack"])
        for skill in role["core_skills"]:
            category = next((name for name, skills in SKILLS_TAXONOMY.items() if skill in skills), "Target role")
            target_terms.append((skill, category))

    groups = {}
    for term, category in target_terms:
        groups.setdefault(category, [])
        if term not in groups[category]:
            groups[category].append(term)
    clauses = [
        {"label": category, "terms": terms,
         "boolean": "(" + " OR ".join('"' + term + '"' for term in terms) + ")"}
        for category, terms in groups.items() if terms
    ]
    matched_clauses = []
    missing_clauses = []
    for c in clauses:
        matched_term = next((term for term in c["terms"] if contains_term(text, term)), None)
        if matched_term:
            matched_clauses.append({
                "label": c["label"],
                "boolean": c["boolean"],
                "matched_term": matched_term.title()
            })
        else:
            missing_clauses.append({
                "label": c["label"],
                "boolean": c["boolean"]
            })
            
    pass_rate = round((len(matched_clauses) / len(clauses)) * 100, 1) if clauses else 0
    full_boolean_query = " AND ".join([c["boolean"] for c in clauses])
    return {
        "pass_rate": pass_rate,
        "matched_term_count": sum(1 for term, _ in target_terms if contains_term(text, term)),
        "clause_count": len(clauses),
        "is_qualified": pass_rate >= 75.0,
        "full_boolean_query": full_boolean_query,
        "matched_clauses": matched_clauses,
        "missing_clauses": missing_clauses
    }


def audit_keyword_density_and_tfidf(text, matched_skills):
    """
    Reports repeated target terms as a review heuristic; it does not predict ATS penalties.
    """
    words = tokenize(clean_text(text))
    total_words = max(len(words), 1)
    counts = Counter(words)
    
    keyword_densities = []
    overstuffed_keywords = []
    
    for s in matched_skills:
        raw_name = s["raw"].lower()
        cnt = counts.get(raw_name, 0)
        density = round((cnt / total_words) * 100, 2)
        
        item = {
            "name": s["name"],
            "count": cnt,
            "density": density,
            "status": "Overstuffed" if density > 4.5 else "Optimal"
        }
        keyword_densities.append(item)
        if density > 4.5:
            overstuffed_keywords.append(item)
            
    return {
        "keyword_densities": sorted(keyword_densities, key=lambda x: x["density"], reverse=True)[:8],
        "overstuffed_keywords": overstuffed_keywords,
        "is_density_healthy": len(overstuffed_keywords) == 0
    }



# ---------- ATS MAIN SCORING ENGINE ----------
def calculate_ats_score(resume_text, job_description="", job_role="fullstack"):
    """
    Score evidence found in extracted text with transparent weighted checks.
    """
    if not resume_text or len(resume_text.strip()) < 10:
        return {
            "error": "Resume text is empty or too short for analysis",
            "ats_score": 0
        }

    word_count = len(resume_text.split())
    extraction_review = review_extracted_text(resume_text)

    # 1. SKILL TAXONOMY MATCHING (Pillar 2: Tech Skills - 25 Pts)
    matched_skills = []
    for category, skill_list in SKILLS_TAXONOMY.items():
        for skill in skill_list:
            if skill == "go":
                continue  # Too ambiguous to count safely without an explicit language label.
            if contains_term(resume_text, skill):
                matched_skills.append({
                    "name": skill.title() if len(skill) > 3 else skill.upper(),
                    "category": category,
                    "raw": skill
                })

    # The taxonomy contains aliases and category overlap; expose one row per term.
    unique_skills = {}
    for skill in matched_skills:
        unique_skills.setdefault(skill["raw"], skill)
    matched_skills = list(unique_skills.values())

    # This is a general resume quality score, not a job-match score. Skill signals
    # are capped at 10 points so one technical taxonomy cannot dominate the result.
    skill_count = len(matched_skills)
    skills_points = (10 if skill_count >= 10 else 8 if skill_count >= 7 else
                     6 if skill_count >= 4 else 3 if skill_count >= 1 else 0)
    # A generic resume review has no target job, so it must not call role-specific
    # tools "missing" or encourage candidates to add skills they may not have.
    unique_missing = []

    blocks = split_resume_sections(resume_text)
    verbs_found = extract_action_verbs(blocks["experience"] + "\n" + blocks["projects"])
    contact_info = check_contact_info(resume_text)
    sections, _, _ = audit_sections(resume_text)
    bad_symbols = ['➢', '➔', '★', '■', '✔', '►', '❖', '✦']
    found_bad_symbols = [symbol for symbol in bad_symbols if symbol in resume_text]
    canonical_count = sum(section["present"] for section in sections.values())

    # Each scored check has a fixed weight; the active weights sum to 100.
    resume_checks = []
    def add_check(*args, **kwargs):
        resume_checks.append(_resume_check(*args, **kwargs))

    add_check("contact_email", "Contact", "Email address", 3 if contact_info["has_email"] else 0, 3,
              "Email address detected." if contact_info["has_email"] else "No email address was detected in the extracted text.",
              "Add a plain-text email address near the top of the resume." if not contact_info["has_email"] else "")
    add_check("contact_phone", "Contact", "Phone number", 2 if contact_info["has_phone"] else 0, 2,
              "Phone number detected." if contact_info["has_phone"] else "No phone number was detected in the extracted text.",
              "Add a reachable phone number in plain text near your email." if not contact_info["has_phone"] else "")

    section_points = {"summary": 4, "experience": 4, "skills": 4, "projects": 5}
    for key, points in section_points.items():
        sec = sections[key]
        recommendation = "Add a clearly labeled '" + sec["title"] + "' section." if not sec["present"] else ""
        add_check("section_" + key, "Resume sections", sec["title"], points if sec["present"] else 0, points,
                  "Standalone section heading detected." if sec["present"] else "No standalone section heading detected.", recommendation)

    skill_names = [item["name"] for item in matched_skills]
    keyword_finding = f"Detected {skill_count} recognized skill or competency terms."
    if skill_names:
        keyword_finding += " Examples: " + ", ".join(skill_names[:10]) + "."
    keyword_recommendation = ("Use a clearly labeled Skills or Core Competencies section for relevant capabilities. "
                              "Only list skills you can support with real experience.") if skill_count < 7 else ""
    add_check("resume_skills", "Skills", "Skills and competencies", skills_points, 10, keyword_finding, keyword_recommendation)

    experience_lines = blocks["experience"].splitlines()
    role_title_pattern = r'\b(engineer|developer|manager|architect|analyst|lead|specialist|consultant|intern|designer|scientist|director|teacher|nurse|accountant|coordinator|administrator|technician|therapist|recruiter|executive|supervisor|researcher|editor|writer|attorney|counsel|chef|electrician|mechanic|representative|strategist)\b'
    date_pattern = r'\b(?:19|20)\d{2}\b|\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{4}\b'
    dated_role_lines = []
    for line_index, line in enumerate(experience_lines):
        adjacent = " ".join(experience_lines[max(0, line_index - 1):line_index + 2])
        if re.search(role_title_pattern, line, re.I) and re.search(date_pattern, adjacent, re.I):
            dated_role_lines.append(line)
    bullet_lines = [line for line in experience_lines if re.match(r'^\s*(?:[•●▪*-])\s+\S', line)]
    exp_heading_points = 5 if sections["experience"]["present"] else 0
    date_points = 14 if len(dated_role_lines) >= 2 else 8 if dated_role_lines else 0
    bullet_points = 14 if len(bullet_lines) >= 5 else 10 if len(bullet_lines) >= 3 else 4 if bullet_lines else 0
    add_check("experience_section", "Experience evidence", "Work history section", exp_heading_points, 5,
              "Work history heading found." if exp_heading_points else "A work history heading was not detected.",
              "Use a standard heading such as 'Work Experience' or 'Professional Experience'." if not exp_heading_points else "")
    add_check("experience_dates", "Experience evidence", "Role titles and dates", date_points, 14,
              f"Found {len(dated_role_lines)} experience line(s) with a recognizable role title and year.",
              "Put each job title, employer, and employment dates on clearly readable lines." if date_points < 14 else "")
    add_check("experience_bullets", "Experience evidence", "Role accomplishments", bullet_points, 14,
              f"Found {len(bullet_lines)} bullet-style line(s) under Work Experience.",
              "Add concise accomplishment bullets to relevant roles; describe your own actions." if bullet_points < 14 else "")

    scoped_metrics = extract_quantified_metrics(blocks["experience"] + "\n" + blocks["projects"])
    metric_points = 12 if len(scoped_metrics) >= 3 else 8 if len(scoped_metrics) == 2 else 4 if scoped_metrics else 0
    verb_points = 10 if len(verbs_found) >= 5 else 7 if len(verbs_found) >= 3 else 4 if verbs_found else 0
    add_check("measurable_results", "Achievement quality", "Measured outcomes", metric_points, 12,
              f"Found {len(scoped_metrics)} measurable result(s) in experience or project sections.",
              "Where you have reliable data, state scale, time saved, revenue, quality, or performance change. Never invent metrics." if metric_points < 12 else "")
    add_check("action_verbs", "Achievement quality", "Specific action language", verb_points, 10,
              f"Detected {len(verbs_found)} distinct action verb(s).",
              "Start accomplishment bullets with precise verbs such as built, analyzed, improved, or delivered." if verb_points < 10 else "")

    education_block = blocks["education"]
    degree_pattern = r'\b(B\.?\s?Tech|M\.?\s?Tech|B\.?\s?E\.?|B\.?\s?S\.?|M\.?\s?S\.?|Ph\.?D\.?|Bachelor|Master|Associate|Diploma)\b'
    found_degree_evidence = bool(re.search(degree_pattern, education_block, re.I))
    cert_patterns = (r'aws certified', r'google cloud certified', r'microsoft certified', r'certified kubernetes administrator', r'\b(?:pmp|cissp|ccna|cka|cks)\b', r'comptia\s+[a-z+]+' )
    found_certs = sorted({match.group(0).upper() for pattern in cert_patterns for match in re.finditer(pattern, blocks["certifications"], re.I)})
    credential_finding = "Education entry detected; education is optional and does not affect the score." if found_degree_evidence else "No education entry detected; education and certifications are optional and do not affect the score."
    if found_certs:
        credential_finding += " Certification(s) found: " + ", ".join(found_certs[:5]) + "."
    add_check("credentials", "Optional information", "Education and certifications", 0, 0, credential_finding)

    length_points = 5 if 150 <= word_count <= 1200 else 3 if 100 <= word_count < 150 or 1200 < word_count <= 1800 else 0
    bullet_safety_points = 3 if not found_bad_symbols else 0
    heading_points = 5 if canonical_count >= 4 else 3 if canonical_count >= 3 else 0
    add_check("resume_length", "Parsing and readability", "Resume length", length_points, 5,
              f"Extracted {word_count} words; length is a broad readability signal, not a hard ATS rule.",
              "Review for missing detail or repetition; keep length appropriate to your experience and target market." if length_points < 5 else "")
    add_check("bullet_format", "Parsing and readability", "Bullet characters", bullet_safety_points, 3,
              "No flagged decorative bullet symbols found." if not found_bad_symbols else "Flagged symbols: " + " ".join(found_bad_symbols) + ".",
              "Replace decorative symbols with plain bullets or simple hyphens." if found_bad_symbols else "")
    add_check("section_headings", "Parsing and readability", "Recognizable section headings", heading_points, 5,
              f"Detected {canonical_count} recognized section heading(s).",
              "Use plain, conventional headings and keep each heading on its own line." if heading_points < 5 else "")

    total_ats_score = round(sum(item["earned"] for item in resume_checks), 1)
    if total_ats_score >= 90: grade = "A+"
    elif total_ats_score >= 80: grade = "A"
    elif total_ats_score >= 70: grade = "B"
    elif total_ats_score >= 55: grade = "C"
    else: grade = "D"
    priority_checks = sorted((item for item in resume_checks if item["earned"] < item["max"] and item["recommendation"]),
                             key=lambda item: (item["max"] - item["earned"], item["max"]), reverse=True)
    recommendations = [
        {"priority": "High" if item["max"] - item["earned"] >= 5 else "Medium", "check_id": item["id"],
         "title": item["label"], "action": item["recommendation"], "evidence": item["finding"],
         "points_available": round(item["max"] - item["earned"], 1)}
        for item in priority_checks
    ]

    return {
        "ats_score": total_ats_score,
        "score_grade": grade,
        "parsed_resume": {
            "word_count": word_count,
            "character_count": len(resume_text),
            "contact_info": contact_info,
            "full_extracted_text": resume_text
        },
        "extraction_review": extraction_review,

        "resume_checks": resume_checks,
        "recommendations": recommendations,
        "score_disclaimer": "A general resume quality estimate based on extracted text, not a job match or a score from a specific ATS. Screening systems use different rules, and no score guarantees an interview.",
    }


