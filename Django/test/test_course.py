# import pytest
# from rest_framework import status

# from API.user.models import User

# @pytest.mark.django_db
# def test_user_creation():
#     user = User.objects.create_user(
#         username='testuser',
#         password='testpassword',
#         role='client',
#         email='testuser@example.com'
#     )
#     assert user.username == 'testuser'
