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

function leaderboardSearch() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("leaderboard-search");
  filter = input.value.toUpperCase();
  table = document.getElementById("leaderboard_table_body");
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

function marketSearch() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("market-search");
  filter = input.value.toUpperCase();
  
  cards = $(".market-card");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < cards.length; i++) {
      if (cards[i].getAttribute('data-name').toUpperCase().indexOf(filter) > -1) {
        cards[i].style.display = "";
      } else {
        cards[i].style.display = "none";
      }
  }
}
