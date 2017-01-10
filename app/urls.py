from django.conf.urls import include, url
from django.contrib.auth.views import logout
from . import views

urlpatterns = [
    # Home Page
    url(r'^$', views.index, name='index'),

    # Login Page
    url(r'^login/$',
        views.login_page, name='login_page'),

    # social login urls
    url('', include('social.apps.django_app.urls', namespace='social')),

    # logout url
    url(r'^logout/$', logout,
        {'next_page': '/'})
]
