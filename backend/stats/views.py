from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from drivers.models import DriverStanding
from .serializers import DriverPointsStatSerializer


class DriverPointsStatViewSet(ViewSet):
    """API ViewSet for driver points statistics"""

    def list(self, request):
        """Get all driver points data for graphing"""
        try:
            # Get all standings, filter by season
            season = request.query_params.get('season')
            queryset = DriverStanding.objects.all()

            

            if season:
                queryset = queryset.filter(season=season)

            # Order by driver and round for consistent frontend processing
            queryset = queryset.order_by('driver_number', 'round')

            serializer = DriverPointsStatSerializer(queryset, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': 'Unable to fetch points data'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )