from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from drivers.models import Meeting
from urllib.request import urlopen
import json


class Command(BaseCommand):
    """Management command for populating Meeting objects with data"""
    help = 'Populate Meeting objects with data'

    def handle(self, *args, **options):
        try:
            url = 'https://api.openf1.org/v1/meetings'
            response = urlopen(url)

            if response.status == 200:
                meetings_data = json.loads(response.read().decode('utf-8'))
                for meeting in meetings_data:
                    if not Meeting.objects.filter(meeting_key=meeting['meeting_key']):
                        new_meeting = Meeting(
                            meeting_key=meeting['meeting_key'],
                            circuit_key=meeting['circuit_key'],
                            circuit_short_name=meeting['circuit_short_name'],
                            meeting_code=meeting['meeting_code'],
                            location=meeting['location'],
                            country_key=meeting['country_key'],
                            country_code=meeting['country_code'],
                            country_name=meeting['country_name'],
                            meeting_name=meeting['meeting_name'],
                            meeting_official_name=meeting['meeting_official_name'],
                            gmt_offset=meeting['gmt_offset'],
                            date_start=meeting['date_start'],
                            year=meeting['year'],
                        )
                        new_meeting.save()
        except Exception as e:
            raise CommandError(f"Command failed: {e}")
