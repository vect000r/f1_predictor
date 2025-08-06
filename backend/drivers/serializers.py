from rest_framework import serializers
from drivers.models import Driver, Meeting, Result, DriverStanding

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'
        read_only_fields = ('driver_number',)


class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = '__all__'
        read_only_fields = ('meeting_key',)

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = '__all__'
        read_only_fields = ('session_key', 'driver_number', 'meeting_key')


class DriverStandingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverStanding
        fields = '__all__'