from django.contrib import admin
from django.urls import path
from backend.views import home, get_tasks, post_task, delete_task, complete_task
from backend.views import login_view, logout_view, signup_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home),
    path('login', login_view),
    path('logout', logout_view),
    path('signup', signup_view),
    path('api/get_tasks', get_tasks),
    path('api/post_task', post_task),
    path('api/delete_task', delete_task),
    path('api/complete_task', complete_task),
]
