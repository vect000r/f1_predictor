from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
import logging
from predictions import utils
from rest_framework import status
from drivers.models import Driver, DriverStanding
from rest_framework.response import Response
from datetime import datetime
from predictions.models import Prediction

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    """Management command for running predictions"""

    def handle(self, *args, **options):
        try:
            standings = list(DriverStanding.objects.all().values())

            chosen_model = 'xgboost'

            predictor = utils.Predictor(model_type=chosen_model)
            predictor.train(standings)

            for driver in Driver.objects.all():
                pred = predictor.predict(standings, driver.driver_number)
                if pred:
                    prediction_obj, created = Prediction.objects.update_or_create(
                        driver_number=driver.driver_number,
                        defaults={
                            'predicted_position': pred['predicted_position'],
                            'predicted_points_gain': pred['predicted_points_gain'],
                            'predicted_total_points': pred['predicted_total_points'],
                            'current_position': pred['current_position'],
                            'current_points': pred['current_points'],
                            'confidence': pred['confidence'],
                            'generated_at': datetime.now().isoformat(),
                            'model_type': chosen_model
                        }
                    )
                    action = f'Created prediction for driver #{driver.driver_number}' if created else f'Updated prediction for driver #{driver.driver_number}'
                    logger.info(action)

                else:
                    logger.error(f"Error predicting for driver #{driver.driver_number}")

        except Exception as e:
            logger.error(f"Error getting predictions: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
