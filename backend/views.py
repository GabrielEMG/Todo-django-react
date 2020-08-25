from django.shortcuts import render, redirect
from .models import Task
from django.http import JsonResponse
import json
from django.forms.models import model_to_dict
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User


# Create your views here.
def login_view(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(
            username=username,
            password=password,
        )
        if user is not None:
            login(request, user)
            return redirect('/')
    return render(request, 'login.html')


def signup_view(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        User.objects.create_user(
            username=username,
            password=password,
        )
        user = authenticate(
            username=username,
            password=password,
        )
        if user is not None:
            login(request, user)
            return redirect('/')
    return render(request, 'signup.html')


def logout_view(request):
    if request.method == "POST":
        logout(request)
    return redirect('/login')


def home(request):
    if request.user.is_authenticated:
        return render(request, 'index.html')
    else:
        return redirect('/login')


def get_tasks(request):
    user = request.user
    if user.is_authenticated:
        tasks = user.task_set.all().values()
        return JsonResponse(list(tasks), safe=False)
    return redirect('/login')


def post_task(request):
    user = request.user
    if user.is_authenticated:
        data = json.loads(request.body)
        title = data['title']
        description = data['description']
        task = Task.objects.create(
            title=title,
            description=description,
            owner=user
        )
        return JsonResponse({
            'created': True,
            'task': json.dumps(model_to_dict(task))
        })
    return redirect('/login')


def complete_task(request):
    user = request.user
    if user.is_authenticated:
        task_id = json.loads(request.body)['id']
        try:
            task = Task.objects.get(
                id=task_id,
                owner=user
            )
            task.completed = not task.completed
            task.save()
            return JsonResponse({'changed': True})
        except:
            return JsonResponse({'changed': False})
    return redirect('/login')


def delete_task(request):
    user = request.user
    if user.is_authenticated:
        task_id = json.loads(request.body)['id']
        try:
            task = Task.objects.get(
                id=task_id,
                owner=user,
            )
            task.delete()
            return JsonResponse({'deleted': True})
        except:
            return JsonResponse({'deleted': False})
    return redirect('/login')
