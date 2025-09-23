from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drivers.models import Driver, DriverStanding
from .models import Prediction
from .serializers import PredictionSerializer
from .utils import Predictor
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class PredictionView(APIView):
    def get(self, request):
        try:
            predictions = Prediction.objects.all()
            serializer = PredictionSerializer(predictions, many=True)

            return Response({
                'predictions': serializer.data,
                'model_type': 'XGBoost',
                'generated_at': datetime.now().isoformat()
            })


        except Exception as e:
            logger.error(f"Error getting predictions: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

