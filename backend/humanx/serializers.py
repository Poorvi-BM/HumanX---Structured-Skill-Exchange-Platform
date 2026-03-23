from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Post,
    HelpOffer,
    CollabRequest,
    Session,
    Rating,
    ChatMessage,
)


class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Post
        fields = "__all__"


class HelpOfferSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = HelpOffer
        fields = "__all__"


class CollabRequestSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = CollabRequest
        fields = "__all__"


class SessionSerializer(serializers.ModelSerializer):
    requester_username = serializers.CharField(
        source="requester.username",
        read_only=True
    )
    provider_username = serializers.CharField(
        source="provider.username",
        read_only=True
    )

    class Meta:
        model = Session
        fields = "__all__"


class RatingSerializer(serializers.ModelSerializer):
    reviewer_username = serializers.CharField(
        source="reviewer.username",
        read_only=True
    )

    class Meta:
        model = Rating
        fields = "__all__"


class ChatMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(
        source="sender.username",
        read_only=True
    )

    class Meta:
        model = ChatMessage
        fields = "__all__"
