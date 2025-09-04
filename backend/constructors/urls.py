from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ConstructorViewSet

router = DefaultRouter()
router.register('constructors', ConstructorViewSet, basename='constructors')

urlpatterns = [
    path('', include(router.urls))
]