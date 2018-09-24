import json

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.views.decorators.cache import cache_page
from django.conf import settings

from .models import *
from .forms import RegistrationForm


# Create your views here.


# Serve the home view

def index(request):

    context = {}

    if settings.EVENT_ENDED:

        players = map(lambda x: x.player, User.objects.filter(is_staff=False))
        players = sorted(players, key=lambda a: a.total_value(), reverse=True)

        context['message'] = {
            'first': "The event has ended... Thanks for participating. ",
            'second': "Congralutions to the winners and here is the leaderboard..."
        }
        context['players'] = players

        return render(request, 'core/leaderboard.html', context)


    if settings.EVENT_STARTED and request.user.is_authenticated():

        playerObj = Player.objects.get(user=request.user)
        playerStocks = PlayerStock.objects.filter(player=playerObj)

        context['player'] = playerObj
        context['player_stocks'] = playerStocks

        return render(request, 'core/portfolio.html', context)

    return render(request, 'core/landing.html', context)


# Register the user from the registration page

def registerUser(request):

    response_data = {}

    # Success = 0 and Error = 1
    response_data['code'] = 1
    response_data['message'] = 'Some Error Occurred'

    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')

            response_data['code'] = 0
            response_data['message'] = 'User signed up succesfully'

        return HttpResponse(json.dumps(response_data),
                            content_type="application/json")


# User login

def loginUser(request):

    response_data = {}

    # Success = 0 and Error = 1
    response_data['code'] = 1
    response_data['message'] = 'Some Error Occurred'

    if request.method == "POST":
        username = request.POST.get('username')
        raw_password = request.POST.get('password')
        user = authenticate(username=username, password=raw_password)
        if user is not None:
            login(request, user)

            response_data['code'] = 0
            response_data['message'] = 'User logged in succesfully'
        else:
            response_data['message'] = 'Wrong username or password'

    return HttpResponse(json.dumps(response_data),
                        content_type="application/json")


# Get all the player usernames for username validation

def getUsers(request):

    users = User.objects.all()
    players = []
    response_data = {}

    for user in users:
        if hasattr(user, 'player'):
            players.append(user.username)

    response_data['users'] = players

    return HttpResponse(json.dumps(response_data),
                        content_type="application/json")


# Handle the change username request

@login_required
def changeUsername(request):

    response_data = {}

    # Success = 0 and Error = 1
    response_data['code'] = 1
    response_data['message'] = 'Some error occurred'

    if request.method == "POST":

        try:
            old_username = str(request.POST['current_username']);
            new_username = str(request.POST['username']);
        except:
            response_data['message'] = 'Error in form data'
            return HttpResponse(json.dumps(response_data),
                                content_type="application/json")

        if User.objects.filter(username__exact=old_username).exists():
            user_instance = User.objects.get(username__exact=old_username)
            user_instance.username = new_username
            user_instance.save()
            response_data['code'] = 0
            response_data['message'] = 'Username changed successfully'
        else:
            response_data['message'] = 'User does not exist'

    return HttpResponse(json.dumps(response_data),
                        content_type="application/json")


# Get the stock price JSON data

def stockPrices(request):
    response_data = {}
    if request.method == "GET":
        stockObjects = Stock.objects.all()
        for stock in stockObjects:
            response_data[stock.name] = {"stock": stock.code, "price": str(stock.price), "diff": str(stock.diff)}

        response_data['last_updated'] = stock.last_updated.isoformat()

    return HttpResponse(json.dumps(response_data),
                        content_type="application/json")


# Handle the market watch page view

@login_required
def market(request):
    context = {}

    all_stocks = Stock.objects.all()
    player = Player.objects.get(user=request.user)

    context['all_stocks'] = all_stocks
    context['player'] = player
    context['last_updated'] = all_stocks.last().last_updated

    return render(request, 'core/market.html', context)


# Handle the leaderboard page view

@login_required
@cache_page(60 * 1)
def leaderboard(request):
    context = {}

    players = map(lambda x: x.player, User.objects.filter(is_staff=False))
    players = sorted(players, key=lambda a: a.total_value(), reverse=True)

    context['players'] = players
    return render(request, 'core/leaderboard.html', context)

# Get leaderboard data

def leaderboardApi(request):
    response_data = []
    if request.method == "GET":
        players = User.objects.filter(is_staff=False)
        players = sorted(players, key=lambda a: a.player.total_value(), reverse=True)

        for player in players:
            response_data.append({ "name": str(player.username),"value": str(player.player.total_value()),"email": str(player.email)})

    return JsonResponse(response_data, safe=False)


# Handle the buying of stocks

@login_required
@transaction.atomic
def buyStock(request):
    response_data = {}
    # Success = 0 and Error = 1
    response_data['code'] = 1
    response_data['message'] = 'Some Error Occurred'

    if request.method == 'POST':
        try:
            requestedStockCode = str(request.POST['code'])
            requestedStockCount = int(request.POST['quantity'])
        except:
            response_data['message'] = 'Error in form data'
            return HttpResponse(json.dumps(response_data),
                                content_type="application/json")

        stockObj = Stock.objects.get(code=requestedStockCode)
        playerObj = Player.objects.select_for_update().filter(user=request.user)[0]
        availableMoney = playerObj.cash
        stockPrice = stockObj.price
        if(availableMoney > (stockPrice * requestedStockCount) and
           requestedStockCount > 0):
            try:

                # Update player to stock table
                playerStockList = PlayerStock.objects.select_for_update().filter(
                    player=playerObj, stock=stockObj)
                if(playerStockList.count()):
                    playerStock = playerStockList[0]
                    playerStock.quantity = playerStock.quantity + requestedStockCount
                    playerStock.save()
                else:
                    playerStock = PlayerStock()
                    playerStock.player = playerObj
                    playerStock.stock = stockObj
                    playerStock.quantity = requestedStockCount
                    playerStock.save()

                # Deduct player cash
                newAvailableMoney = availableMoney - \
                    (stockPrice * requestedStockCount)
                playerObj.cash = newAvailableMoney

                # Change player value in stock
                playerObj.value_in_stocks = 0
                for j in PlayerStock.objects.filter(player=playerObj):
                    playerObj.value_in_stocks += j.stock.price * j.quantity
                playerObj.save()
                response_data['code'] = 0
                response_data['message'] = 'Transaction Successful'
            except:
                raise
        else:
            response_data['code'] = 1
            response_data['message'] = 'Not Enough Cash'

    return HttpResponse(json.dumps(response_data),
                        content_type="application/json")


# Handle the selling of stocks

@login_required
@transaction.atomic
def sellStock(request):
    response_data = {}
    # Success = 0 and Error = 1
    response_data['code'] = 1
    response_data['message'] = 'Some Error Occurred'

    if request.method == 'POST':
        try:
            requestedStockCode = str(request.POST['code'])
            requestedStockCount = int(request.POST['quantity'])
        except:
            response_data['message'] = 'Error in form data'
            return HttpResponse(json.dumps(response_data),
                                content_type="application/json")

        stockObj = Stock.objects.get(code=requestedStockCode)
        playerObj = Player.objects.select_for_update().filter(user=request.user)[0]
        availableMoney = playerObj.cash
        stockPrice = stockObj.price

        playerStockList = PlayerStock.objects.select_for_update().filter(
            player=playerObj, stock=stockObj)

        if(playerStockList.count() and
           requestedStockCount <= playerStockList[0].quantity):
            try:

                # Update player to stock table
                playerStock = playerStockList[0]
                playerStock.quantity = playerStock.quantity - requestedStockCount
                playerStock.save()

                # Add player money
                newAvailableMoney = availableMoney + \
                    (stockPrice * requestedStockCount)
                playerObj.cash = newAvailableMoney

                # Change player value in stock
                playerObj.value_in_stocks = 0
                for j in PlayerStock.objects.filter(player=playerObj):
                    playerObj.value_in_stocks += j.stock.price * j.quantity
                playerObj.save()
                response_data['code'] = 0
                response_data['message'] = 'Transaction Successful'
            except:
                raise
        else:
            response_data['code'] = 1
            response_data['message'] = 'Cannot sell more than what you have!'

    return HttpResponse(json.dumps(response_data),
                        content_type="application/json")


# Handle the rules page view

@login_required
def rules(request):

    context = {}

    return render(request, 'core/rules.html', context)


# Handle the engage page view

@login_required
def engage(request):

    context = {}

    return render(request, 'core/engage.html', context)
