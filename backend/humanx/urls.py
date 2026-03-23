from django.urls import path
from .views import my_sessions
from .views import rate_session
from .views import trust_score
from .views import session_chat
from .views import user_profile


from .views import (
    posts,
    offer_help,
    request_collab,
    my_help_requests,
    my_collab_requests,

    create_session,
    accept_session,
    complete_session,
    cancel_session,
)


urlpatterns = [
    path("posts/", posts),
    path("posts/<int:post_id>/help/", offer_help),
    path("posts/<int:post_id>/collab/", request_collab),
    path("my/help/", my_help_requests),
    path("my/collab/", my_collab_requests),
    path("session/create/<int:post_id>/<int:provider_id>/", create_session),
path("session/<int:session_id>/accept/", accept_session),
path("session/<int:session_id>/complete/", complete_session),
path("session/<int:session_id>/cancel/", cancel_session),
path("sessions/my/", my_sessions),
path("session/<int:session_id>/rate/", rate_session),
path("trust/<int:user_id>/", trust_score),
path("profile/<int:user_id>/", user_profile),

]
