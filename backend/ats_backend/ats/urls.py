from django.urls import path
from .views import ATSCheckView, RealtimeATSAnalyzeView, JobTemplatesView

urlpatterns = [
    path('check/', ATSCheckView.as_view(), name='ats-check'),
    path('realtime-analyze/', RealtimeATSAnalyzeView.as_view(), name='ats-realtime-analyze'),
    path('job-templates/', JobTemplatesView.as_view(), name='ats-job-templates'),
]

