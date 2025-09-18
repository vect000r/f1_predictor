from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PredictionView

urlpatterns = [
    path('predictions/', PredictionView.as_view(), name='predictions')
]