from django.shortcuts import render
from rest_framework import viewsets, status
from .serializers import ConstructorSerializer
from .models import Constructor

class ConstructorViewSet(viewsets.ModelViewSet):
    """API viewset for Constructor objects."""
    queryset = Constructor.objects.all().order_by('constructor_id')
    serializer_class = ConstructorSerializer
    lookup_field = 'constructor_id'

