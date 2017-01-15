import requests
import json
from .models import *


def fetch_quotes(symbols):
    """Fetch stock prices from list of symbols
    """
    quotes = {}
    query_string = ""
    for symbol in symbols:
        query_string = query_string + "NASDAQ:" + symbol + ","

    link = "http://finance.google.com/finance/info?client=ig&q=" + query_string
    try:
        response = requests.get(link)
    except:
        return None
    if response.status_code != 200:
        return None
    content = response.text
    data = json.loads(content[3:])
    for stock in data:
        quotes[stock['t']] = stock
    return quotes


def update_all_stock_prices():
    all_stocks = models.Stock.objects.all()
    symbol_list = [s.code for s in all_stocks]
    quotes = fetch_quotes(symbol_list)
    for stock in all_stocks:
        stock.price = quotes[stock.code]['l']
        stock.diff = quotes[stock.code]['c']
        stock.save()


def update_all_player_assets():
    all_players = Player.objects.all()
    for player in all_players:
        player.value_in_stocks = 0
        for j in PlayerStock.objects.filter(player=player):
            player.value_in_stocks += j.stock.price * j.quantity
        player.save()
