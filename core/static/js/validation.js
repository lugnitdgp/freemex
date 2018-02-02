// Initialise the empty users array
users = [];

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


// Validity checks for different input fields on the landing page
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

var inputs = [firstnameInput, lastnameInput, usernameInput, passwordInput, passwordRepeatInput];

function validate() {
    var is_valid = true;
	for (var i = 0; i < inputs.length; i++) {
		is_valid = is_valid && inputs[i].CustomValidation.checkInput();
	}
    return is_valid;
}

// Validity checks for username change input field on the portfolio page
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

// For the username change form
var usernameChangeInput = $('.change-username-form input[name=username]');

usernameChangeInput.CustomValidation = new CustomValidation(usernameChangeInput);
usernameChangeInput.CustomValidation.validityChecks = usernameChangeValidityChecks;
