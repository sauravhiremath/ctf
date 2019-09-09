const nameInput = $("input[name='name']");
const usernameInput = $("input[name='username']");
const passwordInput = $("input[name='password']");
const regNoInput = $("input[name='regNo']");
const emailInput = $("input[name='email']");
const phoneNoInput = $("input[name='phoneNo']");

const regexname = /^[a-zA-Z`!@#$%^&* ]{3,20}$/;
const usernameregex = /^[a-zA-Z0-9_`!@#$%^&*]{3,20}$/;
const emailregex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneregex = /^[2-9]{2}[0-9]{8}$/;
const regregex = /^1\d[a-zA-Z]{3}\d{4}$/;
const passregex = /^[a-zA-Z0-9_!@#$%^&*]{5,15}$/;

function onSubmit() {

	const name = encodeURIComponent(nameInput.val());
	const username = encodeURIComponent(usernameInput.val());
	const password = encodeURIComponent(passwordInput.val());
	const regNo = encodeURIComponent(regNoInput.val());
	const email = encodeURIComponent(emailInput.val());
	const phoneNo = encodeURIComponent(phoneNoInput.val());


	const formData = `name=${name}&username=${username}&password=${password}&regNo=${regNo}&email=${email}&phoneNo=${phoneNo}`;
	$.ajax({
		type: "POST",
		url: "/auth/register",
		data: formData,
		success: data => {
			if (data["success"] == true) {
				alert("Succesfully Registered");
			} else {
				alert(data["message"]);
			}
		},
		error: (xhr, status, message) => {
			const error = JSON.parse(xhr.responseText);
			if (error["message"] == "duplicateUser") {
				alert("User with same email/username/regNo has already signed up");
			} else if (error["message"] == "invalidDetails") {
				alert("One or more fields are invalid")
			} else {
				alert(error["message"]);
			}
		}
	});

	grecaptcha.reset();
}

$(() => {
  $("#registerForm").submit(e => {
    grecaptcha.execute();
    e.preventDefault();
  });

  $(".shutdown-container").click(() => {
    if (confirm("Do you want to shutdown?")) {
      $(".shutdownScreen").fadeIn();
      $("body").css({"overflow": "hidden"});
      document.getElementById("shutdownSound").play();
    }
  })
});


nameInput.on('keyup', function () {
	if (!$(this).val().match(regexname)) {
		// there is a mismatch, hence show the error message
		$('#nameError.emsg').removeClass('hidden');
		$('#nameError.emsg').show();
	}
	else {
		// else, do not display message
		$('#nameError.emsg').addClass('hidden');
	}
});

regNoInput.on('keyup', function () {
	if (!$(this).val().match(regregex)) {
		// there is a mismatch, hence show the error message
		$('#regnoError.emsg').removeClass('hidden');
		$('#regnoError.emsg').show();
	}
	else {
		// else, do not display message
		$('#regnoError.emsg').addClass('hidden');
	}
});

passwordInput.on('keyup', function () {
	if (!$(this).val().match(passregex)) {
		// there is a mismatch, hence show the error message
		$('#passwordError.emsg').removeClass('hidden');
		$('#passwordError.emsg').show();
	}
	else {
		// else, do not display message
		$('#passwordError.emsg').addClass('hidden');
	}
});

phoneNoInput.on('keypress keydown keyup', function () {
	if (!$(this).val().match(phoneregex)) {
		// there is a mismatch, hence show the error message
		$('#phoneError.emsg').removeClass('hidden');
		$('#phoneError.emsg').show();
	}
	else {
		// else, do not display message
		$('#phoneError.emsg').addClass('hidden');
	}
});

emailInput.on('keypress keydown keyup', function () {
	if (!$(this).val().match(emailregex)) {
		// there is a mismatch, hence show the error message
		$('#emailError.emsg').removeClass('hidden');
		$('#emailError.emsg').show();
	}
	else {
		// else, do not display message
		$('#emailError.emsg').addClass('hidden');
	}
});

usernameInput.on('keypress keydown keyup', function () {
	if (!$(this).val().match(usernameregex)) {
		// there is a mismatch, hence show the error message
		$('#usernameError.emsg').removeClass('hidden');
		$('#usernameError.emsg').show();
	}
	else {
		// else, do not display message
		$('#usernameError.emsg').addClass('hidden');
	}
}); 
