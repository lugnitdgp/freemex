from .utils import *


def updatejob():
    print("updating stock prices..")
    update_all_stock_prices()
    print("updating player assets..")
    update_all_player_assets()
