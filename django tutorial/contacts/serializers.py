from rest_framework import serializers
from .models import Contact

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id','firstname', 'surname', 'phonenumber', 'email', 'label']

    # Optional: Add extra validation for specific fields
    def validate_phonenumber(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        return value
