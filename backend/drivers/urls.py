from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    DriverViewSet,
    MeetingViewSet,
    ResultViewSet,
    DriverStandingViewSet,
)

router = DefaultRouter()
router.register('top3', ResultViewSet, basename='top3')
router.register('drivers', DriverViewSet, basename='drivers')
router.register('driverstandings', DriverStandingViewSet, basename='driverstandings')
urlpatterns = [
    path('', include(router.urls))
]