from django.core.management.base import BaseCommand
from django.core.management.base import CommandError
from drivers.models import DriverStanding
from urllib.request import urlopen
import json
import logging
import time

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    """Management command for populating DriverStanding objects with data"""
    help = 'Populate DriverStanding objects with data from the FastF1 API'

    def handle(self, *args, **options):
        try:
            # Call the Jolpica-F1 api for results from each round
            for round_num in range(1, 25):
                self.stdout.write(f"Processing round {round_num}...")

                url = f'https://api.jolpi.ca/ergast/f1/2025/{round_num}/driverstandings/'

                try:
                    response = urlopen(url)

                    if response.status == 200:
                        standings_data = json.loads(response.read().decode('utf-8'))

                        # Process the standings data
                        success_count = self.process_standings_data(standings_data, round_num)

                        if success_count > 0:
                            self.stdout.write(
                                self.style.SUCCESS(
                                    f"Successfully processed {success_count} standings for round {round_num}")
                            )
                        else:
                            self.stdout.write(f"No standings data available for round {round_num}")

                    else:
                        logger.warning(f"Failed to fetch data for round {round_num}. Status: {response.status}")

                except Exception as e:
                    logger.error(f"Error fetching data for round {round_num}: {e}")
                    continue

                # Rate limiting
                time.sleep(0.5)

        except Exception as e:
            raise CommandError(f"Command failed: {e}")

    def process_standings_data(self, standings_data, round_num):
        """
        Process the standings data from API response
        Returns the number of successfully processed standings
        """
        success_count = 0

        # Navigate through the nested data structure
        mr_data = standings_data.get('MRData', {})
        standings_table = mr_data.get('StandingsTable', {})
        standings_lists = standings_table.get('StandingsLists', [])

        if not standings_lists:
            return 0  # No data for this round yet

        standings_list = standings_lists[0]
        season = standings_list.get('season')
        round_number = self.safe_int_conversion(standings_list.get('round'), 'round number')

        if round_number is None:
            logger.error(f"Invalid round number for round {round_num}")
            return 0

        driver_standings_list = standings_list.get('DriverStandings', [])

        for standing in driver_standings_list:
            if self.process_single_standing(standing, season, round_number, round_num):
                success_count += 1

        return success_count

    def process_single_standing(self, standing, season, round_number, round_num):
        """
        Process a single driver standing entry
        Returns True if successful, False otherwise
        """
        try:
            # Safely extract and convert numeric values
            position = self.safe_int_conversion(standing.get('position'), 'position')
            points = self.safe_int_conversion(standing.get('points'), 'points')
            wins = self.safe_int_conversion(standing.get('wins'), 'wins')

            # Extract driver data
            driver_data = standing.get('Driver', {})
            driver_number = self.safe_int_conversion(
                driver_data.get('permanentNumber'),
                'driver permanent number'
            )

            # Fix Verstappen's number (permanent #33 -> current #1)
            if driver_number == 33:
                driver_number = 1

            if any(value is None for value in [position, points, wins, driver_number]):
                logger.warning(f"Missing required data for a driver in round {round_num}")
                return False

            standing_obj, created = DriverStanding.objects.update_or_create(
                season=season,
                round=round_number,
                driver_number=driver_number,
                defaults={
                    "position": position,
                    "points": points,
                    "wins": wins,
                }
            )

            action = "Created" if created else "Updated"
            logger.info(f"{action} standing for driver {driver_number} in round {round_number}")
            return True

        except Exception as e:
            logger.error(f"Error processing driver standing for round {round_num}: {e}")
            return False

    def safe_int_conversion(self, value, field_name):
        """
        Safely convert a value to integer, handling None values
        Returns the integer value or None if conversion fails
        """
        if value is None:
            logger.debug(f"Missing {field_name} in API response")
            return None

        try:
            return int(value)
        except (ValueError, TypeError) as e:
            logger.warning(f"Could not convert {field_name} '{value}' to integer: {e}")
            return None