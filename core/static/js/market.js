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
