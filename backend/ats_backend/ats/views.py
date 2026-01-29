from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .utils import extract_text, calculate_ats_score


class ATSCheckView(APIView):
    def post(self, request):
        resume = request.FILES.get("resume")

        if not resume:
            return Response(
                {"error": "Resume file is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        resume_text = extract_text(resume)
        result = calculate_ats_score(resume_text)

        return Response(result, status=status.HTTP_200_OK)
