from django.urls import path
from .views import ATSCheckView

urlpatterns = [
    path('check/', ATSCheckView.as_view(), name='ats-check'),
]
