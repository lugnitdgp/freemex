from django.conf.urls import include, url
from django.contrib.auth.views import logout
from django.conf import settings

from . import views

# If the event has ended disable other pages and only show leaderboard with a
# message saying event has ended
if settings.EVENT_ENDED:
    urlpatterns = [
        # Handle end event view
        url(r'^$', views.index, name='index_after_event'),

        # Leaderboard api
        url(
            r'^api/leaderboard/$', views.leaderboardApi, name='leaderboard_api'
        ),
    ]
elif not settings.EVENT_STARTED:
    urlpatterns = [
        # Handle end event view
        url(r'^$', views.index, name='index_before_event'),

        # Stock price JSON data
        url(r'view/stockprice/$', views.stockPrices, name='stock_price'),
    ]
else:
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
        url(
            r'^change_username/$', views.changeUsername, name='change_username'
        ),

        # Stock price JSON data
        url(r'view/stockprice/$', views.stockPrices, name='stock_price'),

        # Market watch
        url(r'^market/$', views.market, name='market'),

        # Leaderboard
        url(r'^leaderboard/$', views.leaderboard, name='leaderboard'),

        # Leaderboard api
        url(
            r'^api/leaderboard/$', views.leaderboardApi, name='leaderboard_api'
        ),

        # Buy stock
        url(r'^buystock/$', views.buyStock, name='buy_stock'),

        # Sell stock
        url(r'^sellstock/$', views.sellStock, name='sell_stock'),

        # Rules
        url(r'^rules/$', views.rules, name='rules'),

        # Engage
        url(r'^engage/$', views.engage, name='engage'),

        # social login urls
        url('', include('social_django.urls', namespace='social')),

        # Logout url
        url(r'^logout/$', logout, {'next_page': '/'}),
    ]
