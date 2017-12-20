// Initialise the empty users array
users = [];

// Initialise the time variable after which stock prices are updated
time = 60*1000 - 100;

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

// Custom validation for registration form
function CustomValidation(input) {
	this.invalidities = [];
	this.validityChecks = [];
	this.inputNode = input;
	this.registerListener();
}

// Custom validation prototypes
CustomValidation.prototype = {
	addInvalidity: function(message) {
		this.invalidities.push(message);
	},
	getInvalidities: function() {
		return this.invalidities.join('. \n');
	},
	checkValidity: function(input) {
		for ( var i = 0; i < this.validityChecks.length; i++ ) {

			var isInvalid = this.validityChecks[i].is_invalid(input);
			if (isInvalid) {
				this.addInvalidity(this.validityChecks[i].invalidityMessage);
			}

			var requirementElement = this.validityChecks[i].element;

			if (requirementElement) {
				if (isInvalid) {
					requirementElement.addClass('invalid');
					requirementElement.removeClass('valid');
				} else {
					requirementElement.removeClass('invalid');
					requirementElement.addClass('valid');
				}

			}
		}
	},
	checkInput: function() {

		this.inputNode.CustomValidation.invalidities = [];
        var element = this.inputNode[0];
		this.checkValidity(this.inputNode);

		if (this.inputNode.CustomValidation.invalidities.length === 0) {
			element.setCustomValidity('');
            return true;
		} else {
			var message = this.inputNode.CustomValidation.getInvalidities();
			element.setCustomValidity(message);
            return false;
		}
	},
	registerListener: function() {

		var CustomValidation = this;

		this.inputNode.on('keyup change', function() {
			CustomValidation.checkInput();
		});
	}
};

// Validity checks for different input fields

firstnameValidityChecks = [
    {
        is_invalid: function(input) {
            return (input.val() == "");
        },
        invalidityMessage: "Please fill out this field",
        element: $('.registration-form input[name=first_name]').siblings('.input-requirements').children('li').eq(0)
    },
    {
        is_invalid: function(input) {
            return !(/^[a-zA-Z]*$/.test(input.val()));
        },
        invalidityMessage: "This field cannot contain any number or special characters",
        element: $('.registration-form input[name=first_name]').siblings('.input-requirements').children('li').eq(1)
    },
];
var lastnameValidityChecks = [
    {
        is_invalid: function(input) {
            return !(/^[a-zA-Z]*$/.test(input.val()));
        },
        invalidityMessage: "This field cannot contain any number or special characters",
        element: $('.registration-form input[name=last_name]').siblings('.input-requirements').children('li').eq(0)
    },
];
var usernameValidityChecks = [
    {
        is_invalid: function(input) {
            return (input.val().length < 5);
        },
        invalidityMessage: "This field must have at least 5 characters",
        element: $('.registration-form input[name=username]').siblings('.input-requirements').children('li').eq(0)
    },
    {
        is_invalid: function(input) {
            for (var i=0;i<users.length;i++) {
                if (users[i] == input.val()) {
                    return true;
                }
            }
            return false;
        },
        invalidityMessage: "This username is already taken",
        element: $('.registration-form input[name=username]').siblings('.input-requirements').children('li').eq(1)
    },
];
var passwordValidityChecks = [
	{
		is_invalid: function(input) {
			return (input.val().length < 8 | input.val().length > 100);
		},
		invalidityMessage: 'This input needs to be between 8 and 100 characters',
		element: $('.registration-form input[name=password1]').siblings('.input-requirements').children('li').eq(0)
	},
	{
		is_invalid: function(input) {
			return !(/[a-zA-Z]+/.test(input.val()));
		},
		invalidityMessage: 'At least 1 alphabet is required',
		element: $('.registration-form input[name=password1]').siblings('.input-requirements').children('li').eq(1)
	},
	{
		is_invalid: function(input) {
			return !(/[0-9]+/.test(input.val()));
		},
		invalidityMessage: 'At least 1 numeric digit is required',
		element: $('.registration-form input[name=password1]').siblings('.input-requirements').children('li').eq(2)
	},
	{
		is_invalid: function(input) {
			return !(/[^a-zA-Z0-9]+/.test(input.val()));
		},
		invalidityMessage: 'At least 1 special character is required',
		element: $('.registration-form input[name=password1]').siblings('.input-requirements').children('li').eq(3)
	},
];
var passwordRepeatValidityChecks = [
    {
        is_invalid: function(input) {
            return input.val() != $('.registration-form input[name=password1]').val()
        },
        invalidityMessage: "Both the passwords don't match",
        element: $('.registration-form input[name=password2]').siblings('.input-requirements').children('li').eq(0)
    }
];

var usernameChangeValidityChecks = [
    {
        is_invalid: function(input) {
            return (input.val().length < 5);
        },
        invalidityMessage: "This field must have at least 5 characters",
        element: $('.change-username-form input[name=username]').siblings('.input-requirements').children('li').eq(0)
    },
    {
        is_invalid: function(input) {
            for (var i=0;i<users.length;i++) {
                if (users[i] == input.val()) {
                    return true;
                }
            }
            return false;
        },
        invalidityMessage: "This username is already taken",
        element: $('.change-username-form input[name=username]').siblings('.input-requirements').children('li').eq(1)
    },
];

var firstnameInput = $('.registration-form input[name=first_name]');
var lastnameInput = $('.registration-form input[name=last_name]');
var usernameInput = $('.registration-form input[name=username]');
var passwordInput = $('.registration-form input[name=password1]');
var passwordRepeatInput = $('.registration-form input[name=password2]');

firstnameInput.CustomValidation = new CustomValidation(firstnameInput);
firstnameInput.CustomValidation.validityChecks = firstnameValidityChecks;

lastnameInput.CustomValidation = new CustomValidation(lastnameInput);
lastnameInput.CustomValidation.validityChecks = lastnameValidityChecks;

usernameInput.CustomValidation = new CustomValidation(usernameInput);
usernameInput.CustomValidation.validityChecks = usernameValidityChecks;

passwordInput.CustomValidation = new CustomValidation(passwordInput);
passwordInput.CustomValidation.validityChecks = passwordValidityChecks;

passwordRepeatInput.CustomValidation = new CustomValidation(passwordRepeatInput);
passwordRepeatInput.CustomValidation.validityChecks = passwordRepeatValidityChecks;

// For the username change form
var usernameChangeInput = $('.change-username-form input[name=username]');

usernameChangeInput.CustomValidation = new CustomValidation(usernameChangeInput);
usernameChangeInput.CustomValidation.validityChecks = usernameChangeValidityChecks;


var inputs = [firstnameInput, lastnameInput, usernameInput, passwordInput, passwordRepeatInput];

function validate() {
    var is_valid = true;
	for (var i = 0; i < inputs.length; i++) {
		is_valid = is_valid && inputs[i].CustomValidation.checkInput();
	}
    return is_valid;
}


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

    // Call the function to update prices of stock on market and portfolio page
    updateStockPrices();

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
