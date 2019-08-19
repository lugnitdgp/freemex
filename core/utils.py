import requests
from .secret import API_Access_Token

from django.db import transaction
from django.utils import timezone

from .models import Stock, Player, PlayerStock


def fetch_quotes(symbols):
    """Fetch stock prices from list of symbols"""

    quotes = {}
    query_string = ','.join(symbols)
    headers = {"Accept": "application/json", "Authorization": "Bearer {}".format(API_Access_Token)}
    link = "https://sandbox.tradier.com/v1/markets/quotes?symbols={}".format(query_string)  # noqa
    # print(link)

    try:
        response = requests.get(link, headers=headers)
    except:
        return None
    if response.status_code != 200:
        return None

    data = response.json()
    for stock in data:
        quotes[stock] = data[stock]['quote']

    return quotes


@transaction.atomic
def update_all_stock_prices():
    all_stocks = Stock.objects.all()
    symbol_list = [s.code for s in all_stocks]
    quotes = fetch_quotes(symbol_list)
    for stock in all_stocks:
        stock.price = quotes['quotes'][symbol_list.index(stock.code)]['last']
        stock.diff = quotes['quotes'][symbol_list.index(stock.code)]['change']
        stock.last_updated = timezone.now()
        stock.save()


@transaction.atomic
def update_all_player_assets():
    all_players = Player.objects.all()
    for player in all_players:
        playerObj = Player.objects.select_for_update().filter(
            user=player.user)[0]
        playerObj.value_in_stocks = 0
        for j in PlayerStock.objects.select_for_update().filter(player=playerObj):  # noqa
            playerObj.value_in_stocks += j.stock.price * j.quantity
        playerObj.save()
        print("updated ", playerObj)
