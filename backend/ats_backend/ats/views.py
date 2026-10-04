from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .utils import extract_text, calculate_ats_score, JOB_TEMPLATES


class ATSCheckView(APIView):
    """Multipart file upload endpoint for ATS analysis."""
    def post(self, request):
        resume = request.FILES.get("resume")
        job_description = request.data.get("job_description", "")
        job_description = job_description if isinstance(job_description, str) else ""
        job_role = request.data.get("job_role", "fullstack")
        if not isinstance(job_role, str) or job_role not in JOB_TEMPLATES:
            job_role = "fullstack"

        if not resume:
            return Response(
                {"error": "Resume file is required (.pdf, .docx, or .txt)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        extension = resume.name.lower().rsplit(".", 1)[-1] if "." in resume.name else ""
        if extension not in {"pdf", "docx", "txt"}:
            return Response(
                {"error": "Unsupported file type. Upload a PDF, DOCX, or TXT resume."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if resume.size > 10 * 1024 * 1024:
            return Response(
                {"error": "The resume file exceeds the 10 MB upload limit."},
                status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
            )

        resume.seek(0)
        header = resume.read(1024)
        resume.seek(0)
        if extension == "pdf" and b"%PDF-" not in header:
            return Response({"error": "The uploaded file does not appear to be a valid PDF."}, status=status.HTTP_400_BAD_REQUEST)
        if extension == "docx" and not header.startswith(b"PK"):
            return Response({"error": "The uploaded file does not appear to be a valid DOCX document."}, status=status.HTTP_400_BAD_REQUEST)

        resume_text = extract_text(resume)
        if not resume_text:
            return Response(
                {"error": "Could not extract readable text. Scanned PDFs need OCR, which is not enabled yet; try a text-based PDF, DOCX, or TXT file."},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        if len(resume_text) > 200_000:
            return Response(
                {"error": "The extracted resume is too large to analyze. Please upload a shorter document."},
                status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
            )

        result = calculate_ats_score(resume_text, job_description=job_description, job_role=job_role)
        return Response(result, status=status.HTTP_200_OK)


class RealtimeATSAnalyzeView(APIView):
    """Real-time JSON endpoint for live resume text scoring & feedback."""
    def post(self, request):
        resume_text = request.data.get("resume_text", "")
        job_description = request.data.get("job_description", "")
        job_description = job_description if isinstance(job_description, str) else ""
        job_role = request.data.get("job_role", "fullstack")
        if not isinstance(job_role, str) or job_role not in JOB_TEMPLATES:
            job_role = "fullstack"

        if not isinstance(resume_text, str) or not resume_text.strip():
            return Response(
                {"error": "resume_text parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if len(resume_text) > 200_000:
            return Response(
                {"error": "resume_text must be 200,000 characters or fewer."},
                status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
            )

        result = calculate_ats_score(resume_text, job_description=job_description, job_role=job_role)
        return Response(result, status=status.HTTP_200_OK)


class JobTemplatesView(APIView):
    """Endpoint returning target job role templates and target core skills."""
    def get(self, request):
        return Response(JOB_TEMPLATES, status=status.HTTP_200_OK)

