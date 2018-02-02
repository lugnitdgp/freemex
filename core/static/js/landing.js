$(document).ready(function() {

    // Call the function to get the usernames of all the players, for username validation
    get_usernames();

    // Handles the submission of registration form
    $('.registration-form').on('submit', function(e) {
        e.preventDefault();
        $('#loader').fadeIn();
        var form_validity = validate();
        if (form_validity) {
            $.ajax({
                type: $(this).attr('method'),
                url: $(this).attr('action'),
                data: $(this).serialize(),
                context: this,
                success: function(data) {
                    if (data['code'] == 1) {
                        alert(data['message']);
                    }
                    location.reload();
                }
            });
        }
    });

    $('.login-form').on('submit', function(e) {
        e.preventDefault();
        $('#loader').fadeIn();
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: $(this).serialize(),
            context: this,
            success: function(data, xhr, status) {
                if (data['code'] == 1) {
                    alert(data['message']);
                }
                location.reload();
            }
        });
    });
});
