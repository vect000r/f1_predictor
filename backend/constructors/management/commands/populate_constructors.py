from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from constructors.models import Constructor
from urllib.request import urlopen
import json
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    """Management command for populating constructor objects with data."""
    help = 'Populate Constructor objects with data from JolpicaF1 API.'

    def handle(self, *args, **options):
        try:
            url = 'https://api.jolpi.ca/ergast/f1/2025/constructors/'
            response = urlopen(url)

            if response.status == 200:
                constructors_data = json.loads(response.read().decode('utf-8'))
                mr_data = constructors_data.get('MRData', {})
                constructors_table = mr_data.get('ConstructorTable', {})
                constructors_list = constructors_table.get('Constructors', [])

                if not constructors_list:
                    logger.warning(f"Failed to fetch constructors for the current season")

                for constructor in constructors_list:
                    if not Constructor.objects.filter(name=constructor['name']).exists():
                        new_constructor = Constructor(
                            constructor_id=constructor['constructorId'],
                            url=constructor['constructorId'],
                            name=constructor['name'],
                            nationality=constructor['nationality']
                        )
                        new_constructor.save()
            else:
                raise CommandError(response.status)

        except Exception as e:
            raise CommandError(f"Command failed: {e}")
