from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrador'),
        ('client', 'Cliente'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    image = models.ImageField(upload_to='users/%Y/%m/%d', null=True, blank=True)
    cedula = models.CharField(max_length=20, null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    reset_code = models.CharField(max_length=10, null=True, blank=True)
    reset_code_created_at = models.DateTimeField(null=True, blank=True)
    email = models.EmailField(unique=True)

    # Additional fields for future use
    # location (Caracas, Venezuela)
    # redes sociales (Instagram, Facebook, Twitter etc)
    # 

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='userapi_users',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='userapi_users_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"
