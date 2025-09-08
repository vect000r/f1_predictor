from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DriverPointsStatViewSet

router = DefaultRouter()
router.register(r'driverpoints', DriverPointsStatViewSet, basename='driverpoints')
urlpatterns = [
    path('', include(router.urls))
]