from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from drivers.models import Driver
from urllib.request import urlopen
import json


class Command(BaseCommand):
    """Management command for populating Driver objects with data."""
    help = 'Populate Driver objects with data from OpenF1 API.'

    def handle(self, *args, **options):
        try:
            url = 'https://api.openf1.org/v1/drivers?&driver_number%3C=100&session_key=latest'
            response = urlopen(url)

            if response.status == 200:
                drivers_data = json.loads(response.read().decode('utf-8'))
                for driver in drivers_data:
                    if not Driver.objects.filter(driver_number=driver['driver_number']).exists():
                        new_driver = Driver(
                            broadcast_name=driver['broadcast_name'],
                            country_code=driver['country_code'],
                            driver_number=driver['driver_number'],
                            first_name=driver['first_name'],
                            full_name=driver['full_name'],
                            headshot_url=driver['headshot_url'],
                            last_name=driver['last_name'],
                            meeting_key=driver['meeting_key'],
                            name_acronym=driver['name_acronym'],
                            session_key=driver['session_key'],
                            team_colour=driver['team_colour'],
                            team_name=driver['team_name'],
                        )
                        new_driver.save()
            else:
                raise CommandError(response.status)

        except Exception as e:
            raise CommandError(f"Command failed: {e}")
