from django.shortcuts import render


def index(request):
    return render(request, 'astaykov/default_view.html')