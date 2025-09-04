from rest_framework import serializers
from constructors.models import Constructor

class ConstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Constructor
        fields = '__all__'
        read_only_fields = ('constructor_id',)
