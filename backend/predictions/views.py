from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drivers.models import Driver, DriverStanding
from .utils import Predictor
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class PredictionView(APIView):
    def get(self, request):
        try:
            standings = list(DriverStanding.objects.all().values())

            predictor = Predictor(model_type='xgboost')
            predictor.train(standings)

            predictions = {}

            for driver in Driver.objects.all():
                pred = predictor.predict(standings, driver.driver_number)
                if pred:
                    predictions[f"driver_{driver.driver_number}"] = pred
                else:
                    logger.error(f"Error predicting for driver #{driver.driver_number}")

            return Response({
                'predictions': predictions,
                'model_type': 'XGBoost',
                'generated_at': datetime.now().isoformat()
            })


        except Exception as e:
            logger.error(f"Error getting predictions: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

