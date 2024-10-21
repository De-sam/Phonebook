from django.db import models

class Contact(models.Model):
    LABEL_CHOICES = [
        ('work', 'Work'),
        ('office', 'Office'),
        ('home', 'Home'),
        ('business', 'Business'),
        ('family', 'Family'),
    ]

    firstname = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    phonenumber = models.CharField(max_length=15)
    email = models.EmailField()
    label = models.CharField(max_length=10, choices=LABEL_CHOICES, default='work')

    def __str__(self):
        return f'{self.firstname} {self.surname}'
