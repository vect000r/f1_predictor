from django.db import models

class Driver(models.Model):
    """Model to store driver information"""
    broadcast_name = models.CharField(max_length=100)
    country_code = models.CharField(max_length=100, null=True)
    driver_number = models.IntegerField()
    first_name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=100)
    headshot_url = models.URLField(null=True)
    last_name = models.CharField(max_length=100)
    meeting_key = models.IntegerField()
    name_acronym = models.CharField(max_length=100)
    session_key = models.IntegerField()
    team_colour = models.CharField(max_length=100)
    team_name = models.CharField(max_length=100)

    class Meta:
        ordering = ['last_name', 'first_name', 'driver_number']
        verbose_name_plural = 'Drivers'

    def __str__(self):
        return self.full_name

class Meeting(models.Model):
    """Model to store meeting information, where a meeting is any F1 weekend"""
    circuit_key = models.IntegerField()
    circuit_short_name = models.CharField(max_length=100)
    meeting_code = models.CharField(max_length=100, null=True)
    country_code = models.CharField(max_length=100)
    country_key = models.IntegerField()
    country_name = models.CharField(max_length=100)
    date_start = models.CharField(max_length=50)
    gmt_offset = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    meeting_key = models.IntegerField()
    meeting_name = models.CharField(max_length=100)
    meeting_official_name = models.CharField(max_length=100)
    year = models.IntegerField()

    class Meta:
        ordering = ['meeting_name', 'year', 'meeting_key']
        verbose_name_plural = 'Meetings'

    def __str__(self):
        return self.meeting_name

class Result(models.Model):
    """Model to store result information"""
    dnf = models.BooleanField()
    dns = models.BooleanField()
    dsq = models.BooleanField()
    driver_number = models.IntegerField()
    duration = models.IntegerField()
    gap_to_leader = models.IntegerField()
    number_of_laps = models.IntegerField()
    meeting_key = models.IntegerField()
    position = models.IntegerField()
    session_key = models.IntegerField()

    class Meta:
        ordering = ['meeting_key', 'position', 'driver_number']
        verbose_name_plural = 'Results'

    def __str__(self):
        return f"GP: {self.meeting_key} \n Driver: {self.driver_number} \n Result: {self.position}"

class DriverStanding(models.Model):
    """Model to store current driver standing in the WDC"""
    position = models.IntegerField()
    points = models.IntegerField()
    wins = models.IntegerField()
    season = models.CharField(max_length=5)
    round = models.IntegerField()
    driver_number = models.IntegerField()
