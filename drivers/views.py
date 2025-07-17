from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import Http404, JsonResponse

from .models import Driver, Meeting, Result
from .serializers import (
    DriverSerializer,
    MeetingSerializer,
    ResultSerializer,
)

import logging
from urllib.request import urlopen
import json

logger = logging.getLogger(__name__)

class DriverViewSet(viewsets.ModelViewSet):
    """API viewset for Driver objects."""
    queryset = Driver.objects.all().order_by('driver_number')
    serializer_class = DriverSerializer
    lookup_field = 'driver_number'

class MeetingViewSet(viewsets.ModelViewSet):
    """API viewset for Meeting objects."""
    queryset = Meeting.objects.all().order_by('meeting_key')
    serializer_class = MeetingSerializer
    lookup_field = 'meeting_key'

class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all().order_by('id')
    serializer_class = ResultSerializer

    @action(detail=False, methods=['get'], url_path='latest')
    def latest_top3(self, request):
        """Custom GET endpoint to fetch top 3 results from the latest session."""
        try:
            url = 'https://api.openf1.org/v1/session_result?session_key=latest&position%3C=3'
            response = urlopen(url)

            if response.status == 200:
                results = json.loads(response.read().decode('utf-8'))
                return Response({'results': results})
            else:
                return Response({'error': 'API returned non-200 status'}, status=response.status)

        except Exception as e:
            logger.error(f"Error getting results: {e}")
            return Response({"error": str(e)}, status=500)
