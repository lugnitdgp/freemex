from django.conf.urls import include, url
from django.contrib.auth.views import logout
from . import views

urlpatterns = [
    # Home Page
    url(r'^$', views.index, name='index'),

    # Market Watch
    url(r'^market/$', views.market, name='market'),

    # Leaderboard
    url(r'^leaderboard/$', views.leaderboard, name='leaderboard'),

    # Buy stock
    url(r'^buystock/$', views.buyStock, name='buyStock'),

    # Sell stock
    url(r'^sellstock/$', views.sellStock, name='sellStock'),

    # Rules
    url(r'^rules/$', views.rules, name='rules'),

    # social login urls
    url('', include('social.apps.django_app.urls', namespace='social')),

    # logout url
    url(r'^logout/$', logout,
        {'next_page': '/'})
]
