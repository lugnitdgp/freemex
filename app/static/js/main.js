// Function to search players in the leaderboard
function leaderboardSearch() {
    var search_query = $("#leaderboard-search").val().toUpperCase();

    // Loop through all table rows, and hide those which don't match the search query
    $(".leaderboard-table tbody tr").each(function() {
        if ($(this).children('td').eq(1).html().toUpperCase().indexOf(search_query) > -1) {
            $(this).css({"display": ""});
        } else {
            $(this).css({"display": "none"});
        }
    });
}

// Function to search stocks on the market page
function marketSearch() {
    var search_query = $("#market-search").val().toUpperCase();

    // Loop through all the cards, and hide those which don't match the search query
    $(".stock-card").each(function() {
        if ($(this).attr("data-name").toUpperCase().indexOf(search_query) > -1) {
            $(this).css({"display": ""});
        } else {
            $(this).css({"display": "none"});
        }
    });
}

// Ajax call to update the prices on the market and portfolio page
function updateStockPrices() {
    $.ajax({
        url: "view/stockprice",
        dataType: 'json',
        success: function(data) {
            $('.stock-card').each(function() {
                var stock = $(this).attr('data-name');
                var price = data[stock]['price'];
                var diff = data[stock]['diff'];
                var elem = $(this).find('#diff');
                if (diff >= 0) {
                    var diff_html = diff + " <i class=\"fa fa-arrow-up\" aria-hidden=\"true\">";
                    elem.html(diff_html);
                    if (elem.hasClass('down')) {
                        elem.removeClass('down');
                        elem.addClass('up');
                    }
                } else {
                    var diff_html = diff + " <i class=\"fa fa-arrow-down\" aria-hidden=\"true\">";
                    elem.html(diff_html);
                    if (elem.hasClass('up')) {
                        elem.removeClass('up');
                        elem.addClass('down');
                    }
                }
                $(this).find('#price').html(price);
            });
            var last_updated = new Date(data['last_updated']);
            var now = new Date(Date.now());
            time = now - last_updated;
            var options = {"month": "short", "day": "2-digit", "year": "numeric", "hour": "2-digit", "minute": "2-digit"};
            var current_time = now.toLocaleDateString("en-US", options);
            current_time = current_time.slice(0,3) + "." + current_time.slice(3);
            current_time = current_time.replace("PM", "p.m.");
            current_time = current_time.replace("AM", "a.m.");
            $('#last-updated').html(current_time);
        }
    });
    setTimeout(updateStockPrices, 60*1000 - time);
}

$(document).ready(function() {
    time = 60*1000 - 100;

    // Call the function to update prices of stock on market and portfolio page
    updateStockPrices();

    // Handles the buying of stocks on market or porfolio page
    $('.buy-form').on('submit', function(event){
        event.preventDefault();
        $('#loader').fadeIn();
        $.ajax({
            type: $(this).attr('method'),
            url: this.action,
            data: $(this).serialize(),
            context: this,
            success: function(data, status) {
                statusCode = data['code'];
                statusMessage = data['message'];
                alert(statusMessage);
                location.reload();
            }
        });
        return false;
    });

    // Handles the selling of stocks on porfolio page
    $('.sell-form').on('submit', function(event){
        event.preventDefault();
        $('#loader').fadeIn();

        $.ajax({
            type: $(this).attr('method'),
            url: this.action,
            data: $(this).serialize(),
            context: this,
            success: function(data, status) {
                statusCode = data['code'];
                statusMessage = data['message'];
                alert(statusMessage);
                location.reload();
            }
        });
        return false;
    });

    // Updates the maximum number of stocks that can be bought, when modal is opened
    $('.market-buy-button').click(function(){
        var pcash = $('#playercash').html();
        var stockprice = $(this).attr("data-price");
        $('.maxqty').text(parseInt(pcash/stockprice));
    });
});
