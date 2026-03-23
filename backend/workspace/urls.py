from django.urls import path
from .views import daily_focus, tasks

urlpatterns = [
    path("focus/", daily_focus),
    path("tasks/", tasks),
]
