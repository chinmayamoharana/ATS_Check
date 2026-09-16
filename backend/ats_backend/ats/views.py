from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .utils import extract_text, calculate_ats_score, JOB_TEMPLATES


class ATSCheckView(APIView):
    """Multipart file upload endpoint for ATS analysis."""
    def post(self, request):
        resume = request.FILES.get("resume")
        job_description = request.data.get("job_description", "")
        job_role = request.data.get("job_role", "fullstack")

        if not resume:
            return Response(
                {"error": "Resume file is required (.pdf, .docx, or .txt)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        resume_text = extract_text(resume)
        if not resume_text:
            return Response(
                {"error": "Could not extract readable text from the uploaded file. Please make sure it contains selectable text."},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        result = calculate_ats_score(resume_text, job_description=job_description, job_role=job_role)
        return Response(result, status=status.HTTP_200_OK)


class RealtimeATSAnalyzeView(APIView):
    """Real-time JSON endpoint for live resume text scoring & feedback."""
    def post(self, request):
        resume_text = request.data.get("resume_text", "")
        job_description = request.data.get("job_description", "")
        job_role = request.data.get("job_role", "fullstack")

        if not resume_text or len(resume_text.strip()) == 0:
            return Response(
                {"error": "resume_text parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = calculate_ats_score(resume_text, job_description=job_description, job_role=job_role)
        return Response(result, status=status.HTTP_200_OK)


class JobTemplatesView(APIView):
    """Endpoint returning target job role templates and target core skills."""
    def get(self, request):
        return Response(JOB_TEMPLATES, status=status.HTTP_200_OK)

