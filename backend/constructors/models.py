from django.db import models

class Constructor(models.Model):
    """Model to store constructor information"""
    constructor_id = models.CharField(max_length=50)
    url = models.CharField(max_length=100)
    name = models.CharField(max_length=50)
    nationality = models.CharField(max_length=50)

    class Meta:
        ordering = ['name', 'constructor_id']
        verbose_name_plural = 'Constructors'

    def __str__(self):
        return self.name
