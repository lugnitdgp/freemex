// Initialise the time variable after which stock prices are updated
time = 60*1000 - 100;

// Initialise the empty users array
users = [];

// Ajax call to update the prices on the market and portfolio page
function updateStockPrices() {
    $.ajax({
        url: "view/stockprice/",
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
            var now_time = new Date(Date.now());
            time = now_time - last_updated;
            var options = {"month": "short", "day": "2-digit", "year": "numeric", "hour": "2-digit", "minute": "2-digit"};
            var current_time = now_time.toLocaleDateString("en-US", options);
            current_time = current_time.slice(0,3) + "." + current_time.slice(3);
            current_time = current_time.replace("PM", "p.m.");
            current_time = current_time.replace("AM", "a.m.");
            $('#last-updated').html(current_time);
        }
    });
    setTimeout(updateStockPrices, 60*1000 - time);
}

// Ajax call to get the usernames of all the players
function get_usernames() {
    $.ajax({
        url: "/get_users/",
        dataType: 'json',
        success: function(data) {
            users = data.users;
        }
    });
}

$(document).ready(function() {

    // Call the function to update prices of stock on market and portfolio page
    updateStockPrices();

    // Call the function to get the usernames of all the players, for username validation
    get_usernames();

    // Handles the changing of username
    $('.change-username-form').on('submit', function(e) {
        e.preventDefault();
        $('#loader').fadeIn();
        var is_valid = usernameChangeInput.CustomValidation.checkInput();
        if (is_valid) {
            $.ajax({
                type: $(this).attr('method'),
                url: $(this).attr('action'),
                data: $(this).serialize(),
                context: this,
                success: function(data) {
                    statusCode = data['code'];
                    statusMessage = data['message'];
                    alert(statusMessage);
                    location.reload();
                }
            });
        }
    });

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
    $('.sell-form').on('submit', function(e){
        e.preventDefault();
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
