from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    POST_TYPES = [
        ("doubt", "Doubt"),
        ("career", "Career"),
        ("project", "Project"),
        ("help", "Help"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=POST_TYPES)
    content = models.TextField()
    solved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.user.username}"


class HelpOffer(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="help_offers"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Help by {self.user.username} on Post {self.post.id}"


class CollabRequest(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="collab_requests"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Collab by {self.user.username} on Post {self.post.id}"

class Session(models.Model):
    STATUS_CHOICES = [
        ("REQUESTED", "Requested"),
        ("ACCEPTED", "Accepted"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    requester = models.ForeignKey(
        User,
        related_name="sessions_requested",
        on_delete=models.CASCADE
    )
    provider = models.ForeignKey(
        User,
        related_name="sessions_provided",
        on_delete=models.CASCADE
    )

    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=30)

    status = models.CharField(
        max_length=12,
        choices=STATUS_CHOICES,
        default="REQUESTED"
    )

    credits_locked = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.id} | {self.status}"

class Session(models.Model):
    STATUS_CHOICES = [
        ("REQUESTED", "Requested"),
        ("ACCEPTED", "Accepted"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    requester = models.ForeignKey(
        User,
        related_name="sessions_requested",
        on_delete=models.CASCADE
    )
    provider = models.ForeignKey(
        User,
        related_name="sessions_provided",
        on_delete=models.CASCADE
    )

    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=30)

    status = models.CharField(
        max_length=12,
        choices=STATUS_CHOICES,
        default="REQUESTED"
    )

    credits_locked = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.id} | {self.status}"


class Rating(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(
        User,
        related_name="given_ratings",
        on_delete=models.CASCADE
    )
    reviewed_user = models.ForeignKey(
        User,
        related_name="received_ratings",
        on_delete=models.CASCADE
    )

    score = models.IntegerField()  # 1–5
    review = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reviewer} → {self.reviewed_user} ({self.score})"

class ChatMessage(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} → {self.session.id}"
