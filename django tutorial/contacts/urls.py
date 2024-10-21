from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_contact, name='add-contact'),
    path('edit/<int:pk>/', views.edit_contact, name='edit-contact'),
    path('delete/<int:pk>/', views.delete_contact, name='delete-contact'),
    path('', views.list_contacts, name='list-contacts'),
]
