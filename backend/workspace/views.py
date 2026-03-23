from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import DailyFocus, Task
from .serializers import DailyFocusSerializer, TaskSerializer

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def daily_focus(request):
    if request.method == "GET":
        focus = DailyFocus.objects.filter(user=request.user).last()
        serializer = DailyFocusSerializer(focus)
        return Response(serializer.data if focus else {})

    if request.method == "POST":
        DailyFocus.objects.create(
            user=request.user,
            text=request.data.get("text")
        )
        return Response({"message": "Focus saved"})


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def tasks(request):
    if request.method == "GET":
        tasks = Task.objects.filter(user=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        Task.objects.create(
            user=request.user,
            text=request.data.get("text")
        )
        return Response({"message": "Task added"})
