from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Avg

from .models import (
    Post,
    HelpOffer,
    CollabRequest,
    Session,
    Rating,
    ChatMessage,
)
from .serializers import (
    PostSerializer,
    HelpOfferSerializer,
    CollabRequestSerializer,
    SessionSerializer,
    RatingSerializer,
    ChatMessageSerializer,
)


# -------------------- POSTS --------------------

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def posts(request):

    if request.method == "GET":
        qs = Post.objects.all().order_by("-created_at")
        serializer = PostSerializer(qs, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        Post.objects.create(
            user=request.user,
            type=request.data.get("type"),
            content=request.data.get("content"),
        )
        return Response({"message": "Post created"})


# -------------------- HELP / COLLAB --------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def offer_help(request, post_id):

    HelpOffer.objects.create(
        post_id=post_id,
        user=request.user,
        message=request.data.get("message"),
    )
    return Response({"message": "Help offer sent"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def request_collab(request, post_id):

    CollabRequest.objects.create(
        post_id=post_id,
        user=request.user,
        message=request.data.get("message"),
    )
    return Response({"message": "Collaboration request sent"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_help_requests(request):

    offers = HelpOffer.objects.filter(
        post__user=request.user
    ).order_by("-created_at")

    serializer = HelpOfferSerializer(offers, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_collab_requests(request):

    reqs = CollabRequest.objects.filter(
        post__user=request.user
    ).order_by("-created_at")

    serializer = CollabRequestSerializer(reqs, many=True)
    return Response(serializer.data)


# -------------------- SESSION --------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_session(request, post_id, provider_id):

    session = Session.objects.create(
        post_id=post_id,
        requester=request.user,
        provider_id=provider_id,
        scheduled_at=request.data.get("scheduled_at"),
        duration_minutes=request.data.get("duration_minutes", 30),
        credits_locked=1,
        status="REQUESTED",
    )

    serializer = SessionSerializer(session)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_session(request, session_id):

    session = Session.objects.get(id=session_id)

    if session.provider != request.user:
        return Response({"error": "Not authorized"}, status=403)

    if session.status != "REQUESTED":
        return Response({"error": "Invalid state transition"}, status=400)

    session.status = "ACCEPTED"
    session.save()

    return Response({"message": "Session accepted"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_session(request, session_id):

    session = Session.objects.get(id=session_id)

    if session.status != "ACCEPTED":
        return Response({"error": "Only accepted sessions can be completed"}, status=400)

    session.status = "COMPLETED"
    session.credits_locked = 0
    session.save()

    return Response({"message": "Session completed"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_session(request, session_id):

    session = Session.objects.get(id=session_id)

    if session.status in ["COMPLETED", "CANCELLED"]:
        return Response({"error": "Cannot cancel"}, status=400)

    session.status = "CANCELLED"
    session.credits_locked = 0
    session.save()

    return Response({"message": "Session cancelled"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_sessions(request):

    sessions = Session.objects.filter(
        requester=request.user
    ) | Session.objects.filter(
        provider=request.user
    )

    serializer = SessionSerializer(
        sessions.order_by("-created_at"),
        many=True
    )
    return Response(serializer.data)


# -------------------- RATING --------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def rate_session(request, session_id):

    session = Session.objects.get(id=session_id)

    if session.status != "COMPLETED":
        return Response({"error": "Can only rate completed sessions"}, status=400)

    if Rating.objects.filter(
        session=session,
        reviewer=request.user
    ).exists():
        return Response({"error": "Already rated"}, status=400)

    if request.user == session.requester:
        reviewed_user = session.provider
    elif request.user == session.provider:
        reviewed_user = session.requester
    else:
        return Response({"error": "Not allowed"}, status=403)

    Rating.objects.create(
        session=session,
        reviewer=request.user,
        reviewed_user=reviewed_user,
        score=int(request.data.get("score")),
        review=request.data.get("review", ""),
    )

    return Response({"message": "Rating submitted"})


# -------------------- TRUST --------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def trust_score(request, user_id):

    user = User.objects.get(id=user_id)

    ratings = Rating.objects.filter(reviewed_user=user)

    avg_rating = ratings.aggregate(avg=Avg("score"))["avg"] or 0
    completed = Session.objects.filter(
        provider=user,
        status="COMPLETED"
    ).count()
    cancelled = Session.objects.filter(
        provider=user,
        status="CANCELLED"
    ).count()

    trust = (avg_rating * 10) + (completed * 2) - (cancelled * 3)

    return Response({
        "avg_rating": round(avg_rating, 2),
        "trust_score": round(trust, 2),
        "completed_sessions": completed,
        "cancelled_sessions": cancelled,
    })


# -------------------- CHAT --------------------

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def session_chat(request, session_id):

    session = Session.objects.get(id=session_id)

    if request.user not in [session.requester, session.provider]:
        return Response({"error": "Not allowed"}, status=403)

    if session.status != "ACCEPTED":
        return Response({"error": "Chat available only after acceptance"}, status=400)

    if request.method == "GET":
        msgs = ChatMessage.objects.filter(
            session=session
        ).order_by("created_at")
        serializer = ChatMessageSerializer(msgs, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        ChatMessage.objects.create(
            session=session,
            sender=request.user,
            message=request.data.get("message"),
        )
        return Response({"message": "Sent"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request, user_id):

    user = User.objects.get(id=user_id)

    ratings = Rating.objects.filter(reviewed_user=user)
    reviews = RatingSerializer(ratings.order_by("-created_at"), many=True).data

    avg_rating = ratings.aggregate(avg=Avg("score"))["avg"] or 0
    completed = Session.objects.filter(
        provider=user,
        status="COMPLETED"
    ).count()
    cancelled = Session.objects.filter(
        provider=user,
        status="CANCELLED"
    ).count()

    trust = (avg_rating * 10) + (completed * 2) - (cancelled * 3)

    return Response({
        "username": user.username,
        "avg_rating": round(avg_rating, 2),
        "trust_score": round(trust, 2),
        "completed_sessions": completed,
        "cancelled_sessions": cancelled,
        "reviews": reviews
    })
