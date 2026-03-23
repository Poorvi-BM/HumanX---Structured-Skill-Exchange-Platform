from django.contrib import admin
from .models import DailyFocus, Task

@admin.register(DailyFocus)
class DailyFocusAdmin(admin.ModelAdmin):
    list_display = ("user", "text", "date")
    list_filter = ("date",)
    search_fields = ("user__username", "text")


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("user", "text", "done", "created_at")
    list_filter = ("done", "created_at")
    search_fields = ("text", "user__username")
