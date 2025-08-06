from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import Http404, JsonResponse, FileResponse
from operator import itemgetter
from django.conf import settings

from .models import Driver, Meeting, Result, DriverStanding
from .serializers import (
    DriverSerializer,
    MeetingSerializer,
    ResultSerializer,
    DriverStandingSerializer
)

import logging
from urllib.request import urlopen
import json
import os
import mimetypes

logger = logging.getLogger(__name__)

class DriverViewSet(viewsets.ModelViewSet):
    """API viewset for Driver objects."""
    queryset = Driver.objects.all().order_by('driver_number')
    serializer_class = DriverSerializer
    lookup_field = 'driver_number'

    @action(detail=True, methods=['get'], url_path='photo')
    def get_photo(self, request, driver_number=None):
        """Endpoint to get the headshot photo of a driver"""
        try:
            driver = self.get_object()
            images_folder = os.path.join(settings.BASE_DIR, 'static', 'images')

            image_path = os.path.join(images_folder, f"{driver_number}.webp")

            if not image_path:
                return Response({"error": f"Image was not found for driver with number {driver_number}"}, status=status.HTTP_404_NOT_FOUND)

            return FileResponse(
                open(image_path, 'rb'), content_type=mimetypes.guess_type(image_path), filename=f"driver_{driver_number}_photo{os.path.splitext(image_path)[1]}"
            )


        except Exception as e:
            logger.error(f"Error getting results: {e}")
            return Response({"error": str(e)}, status=500)

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
                sorted_results = sorted(results, key=itemgetter('position'))
                return Response({'results': sorted_results})
            else:
                return Response({'error': 'API returned non-200 status'}, status=response.status)

        except Exception as e:
            logger.error(f"Error getting results: {e}")
            return Response({"error": str(e)}, status=500)


class DriverStandingViewSet(viewsets.ModelViewSet):
    queryset = DriverStanding.objects.all().order_by('driver_number')
    serializer_class = DriverStandingSerializer
    lookup_field = 'driver_number'

    @action(detail=False, methods=['get'], url_path='round/(?P<round_number>[^/.]+)/driver/(?P<driver_number>[^/.]+)')
    def get_standing_by_driver(self, request, round_number=None, driver_number=None):
        """Custom GET endpoint for getting the WDC standing of a driver"""
        try:
            standing = get_object_or_404(
                DriverStanding,
                round=round_number,
                driver_number=driver_number
            )

            serializer = self.get_serializer(standing)
            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Error getting driver standing: {e}")
            return Response(
                {'error': 'Standing not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'], url_path='round/latest/driver/(?P<driver_number>[^/.]+)')
    def get_latest_standing_for_driver(self, request, driver_number=None):
        """Custom GET endpoint for getting the latest WDC standing of a driver"""
        try:
            latest_standing = DriverStanding.objects.filter(
                driver_number=driver_number
            ).order_by('-round').first()

            serializer = self.get_serializer(latest_standing)
            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Error getting latest driver standing: {e}")
            return Response(
                {'error': 'Latest standing not found'},
                status=status.HTTP_404_NOT_FOUND
            )