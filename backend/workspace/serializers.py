from rest_framework import serializers
from .models import DailyFocus, Task

class DailyFocusSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyFocus
        fields = "__all__"

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
