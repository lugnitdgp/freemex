from django.shortcuts import render

# Create your views here.


def index(request):
    return render(request, 'app/landing.html', {})


def login_page(request):
    return render(request, 'app/login.html', {})
