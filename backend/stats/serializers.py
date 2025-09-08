from rest_framework import serializers
from drivers.models import Driver, DriverStanding

class DriverPointsStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverStanding
        fields = 'points', 'driver_number', 'round'
