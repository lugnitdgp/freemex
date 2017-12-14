import json
from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.views.decorators.cache import cache_page
from .models import *


# Create your views here.

def index(request):

    context = {}

    if request.user.is_authenticated():
        playerObj = Player.objects.get(user=request.user)
        playerStocks = PlayerStock.objects.filter(player=playerObj)

        context['player'] = playerObj
        context['player_stocks'] = playerStocks

        return render(request, 'app/portfolio.html', context)

    return render(request, 'app/landing.html', context)


def rules(request):
    context = {}

    if request.user.is_authenticated():
        playerObj = Player.objects.get(user=request.user)
        context['player'] = playerObj

    return render(request, 'app/rules.html', context)


def engage(request):
    context = {}

    if request.user.is_authenticated():
        playerObj = Player.objects.get(user=request.user)
        context['player'] = playerObj

    return render(request, 'app/engage.html', context)


@login_required
def market(request):
    context = {}

    playerObj = Player.objects.get(user=request.user)
    all_stocks = Stock.objects.all()

    context['player'] = playerObj
    context['all_stocks'] = all_stocks
    for stock in all_stocks:
        context['last_updated'] = stock.last_updated
    return render(request, 'app/market.html', context)


@cache_page(60 * 2)
def leaderboard(request):
    context = {}

    playerObj = Player.objects.get(user=request.user)
    players = Player.objects.all()
    players = sorted(players, key=lambda a: a.total_value(), reverse=True)

    context['player'] = playerObj
    context['players'] = players
    return render(request, 'app/leaderboard.html', context)


@login_required
@transaction.atomic
def buyStock(request):
    response_data = {}
    # Success = 0 and Error = 1
    response_data['code'] = 1
    response_data['message'] = 'Some Error Occurred'

    if request.method == 'POST':
        print(request.POST)
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


def stockPrices(request):
    response_data = {}
    if request.method == "GET":
        stockObjects = Stock.objects.all()
        for stock in stockObjects:
            response_data[stock.name] = {"stock": stock.code, "price": str(stock.price), "diff": str(stock.diff)}

        response_data['last_updated'] = stock.last_updated.isoformat()

    return HttpResponse(json.dumps(response_data),
                        content_type="application/json")
