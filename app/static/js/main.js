// Function to search players in the leaderboard
function leaderboardSearch() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("leaderboard-search");
    filter = input.value.toUpperCase();
    table = document.getElementById("leaderboard-table-body");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// Function to search stocks on the market page
function marketSearch() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("market-search");
    filter = input.value.toUpperCase();

    cards = $(".market-card");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < cards.length; i++) {
        if (cards[i].attr('data-name').toUpperCase().indexOf(filter) > -1) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
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
        console.log("form submitted!");  // sanity check
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
