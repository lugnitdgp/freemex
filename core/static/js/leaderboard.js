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

$(window).on("load", function() {
    setTimeout(function() {
        location.reload();
    }, 60*1000);
});
