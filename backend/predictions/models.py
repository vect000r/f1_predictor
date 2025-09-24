from django.db import models

class Prediction(models.Model):
    """Model to store current predictions for each driver"""
    driver_number = models.IntegerField()
    predicted_position = models.FloatField()
    predicted_points_gain = models.FloatField()
    predicted_total_points = models.FloatField()
    current_position = models.IntegerField()
    current_points = models.IntegerField()
    confidence = models.FloatField()
    generated_at = models.TextField(default='2025-09-24')
    model_type = models.TextField(default='xgboost')

    class Meta:
        ordering = ['driver_number']
        verbose_name_plural = 'Predictions'

    def __str__(self):
        return f'Predicted: {self.predicted_position} for driver #{self.driver_number}'
