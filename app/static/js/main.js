$('.buy-form').on('submit', function(event){
    event.preventDefault();
    console.log("form submitted!");  // sanity check
    $('#loader').fadeIn();
    $.ajax({
        type: $(this).attr('method'), 
        url: this.action, 
        data: $(this).serialize(),
        context: this,
        success: function(data, status) {
            console.log(data);
            statusCode = data['code'];
            statusMessage = data['message'];
            alert(statusMessage);
            location.reload();
        }
    });
    return false;
});

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
            console.log(data);
            statusCode = data['code'];
            statusMessage = data['message'];
            alert(statusMessage);
            location.reload();
        }
    });
    return false;
});


$('.market-buy-button').click(function(){
    var pcash = $('#playercash').html();
    var stockprice = $(this).attr("data-price");
    console.log(pcash);
    console.log(stockprice);
    console.log(parseInt(pcash/stockprice));
    $('.maxqty').text(parseInt(pcash/stockprice));
});