from django.conf.urls import include, url
from django.contrib.auth.views import login, logout
from . import views

urlpatterns = [
    # Home Page
    url(r'^$', views.index, name='index'),

    # New user registration
    url(r'^register/$', views.registerUser, name='register'),

    # User login
    url(r'^login/$', views.loginUser, name='login'),

    # Username JSON data
    url(r'get_users/$', views.getUsers, name='get_users'),

    # Change username
    url(r'^change_username/$', views.changeUsername, name='change_username'),

    # Stock price JSON data
    url(r'view/stockprice/$', views.stockPrices, name='stockPrice'),

    # Market watch
    url(r'^market/$', views.market, name='market'),

    # Leaderboard
    url(r'^leaderboard/$', views.leaderboard, name='leaderboard'),

    # Buy stock
    url(r'^buystock/$', views.buyStock, name='buyStock'),

    # Sell stock
    url(r'^sellstock/$', views.sellStock, name='sellStock'),

    # Rules
    url(r'^rules/$', views.rules, name='rules'),

    # Engage
    url(r'^engage/$', views.engage, name='engage'),

    # social login urls
    url('', include('social_django.urls', namespace='social')),

    # Logout url
    url(r'^logout/$', logout, {'next_page': '/'}),
]
