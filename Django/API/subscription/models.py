from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.
class Plan(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    features = models.JSONField(default=list)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Plan"
        verbose_name_plural = "Planes"


class Membership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memberships')
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='memberships')
    is_active = models.BooleanField(default=True)
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return f"{self.user.username} - {self.plan.name} ({'Active' if self.is_active else 'Inactive'})"

    class Meta:
        verbose_name = "Membresía"
        verbose_name_plural = "Membresías"
        unique_together = ('user', 'plan', 'start_date')