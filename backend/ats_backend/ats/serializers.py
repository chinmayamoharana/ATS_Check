from rest_framework import serializers

class ATSCheckSerializer(serializers.Serializer):
    resume = serializers.FileField()
    job_description = serializers.CharField()
