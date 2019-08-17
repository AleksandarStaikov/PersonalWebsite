from django.shortcuts import render
from django.contrib.auth.models import User


def index(request):
    return render(request, 'astaykov/default_view.html')

def profile(request):
    user = User.objects.get(username='astaykov')
    #import pdb; pdb.set_trace()
    data = {
        "user": user,
        "extended": user.userextended,
        "events": user.lifeevent_set.all()
    }

    return render(request, 'astaykov/default_view_copy.html',data)
