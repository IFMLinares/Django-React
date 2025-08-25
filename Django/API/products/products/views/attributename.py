from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from ...models import AttributeName
from ..serializers.serializers_attributename import AttributeNameSerializer

class AttributeNameListView(generics.ListAPIView):
    queryset = AttributeName.objects.all()
    serializer_class = AttributeNameSerializer
    permission_classes = [IsAuthenticated]

class AttributeNameCreateView(generics.CreateAPIView):
    queryset = AttributeName.objects.all()
    serializer_class = AttributeNameSerializer
    permission_classes = [IsAuthenticated]
