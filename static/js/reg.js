const nameInput = $("input[name='name']");
const usernameInput = $("input[name='username']");
const passwordInput = $("input[name='password']");
const regNoInput = $("input[name='regNo']");
const emailInput = $("input[name='email']");
const phoneNoInput = $("input[name='phoneNo']");

const regexname = /^[a-zA-Z`!@#$%^&* ]{3,20}$/;
const usernameregex = /^[a-zA-Z0-9_`!@#$%^&*]{3,20}$/;
const emailregex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneregex = /^[0-9]{9,10}$/;
const regregex = /^1\d[a-zA-Z]{3}\d{4}$/;
const passregex = /^[a-zA-Z0-9_!@#$%^&* ]{5,15}$/;

function onSubmit(token) {
	const name = encodeURIComponent(nameInput.val());
	const username = encodeURIComponent(usernameInput.val());
	const password = encodeURIComponent(passwordInput.val());
	const regNo = encodeURIComponent(regNoInput.val());
	const email = encodeURIComponent(emailInput.val());
	const phoneNo = encodeURIComponent(phoneNoInput.val());

	const formData = `g-recaptcha-response=${token}&name=${name}&username=${username}&password=${password}&regNo=${regNo}&email=${email}&phoneNo=${phoneNo}`;
	$.ajax({
		type: "POST",
		url: "/auth/register",
		data: formData,
		success: data => {
			if (data["success"] == true) {
				$("#registerForm").hide();
				$(".post-form-content").show();
			} else {
				alert(data["message"]);
			}
		},
		error: (xhr, status, message) => {
			const error = JSON.parse(xhr.responseText);
			if (error["message"] == "duplicateUser") {
				alert(
					"User with same email/username/regNo has already signed up"
				);
			} else if (error["message"] == "invalidDetails") {
				alert("One or more fields are invalid");
			} else {
				alert(error["message"]);
			}
		}
	});

	grecaptcha.reset();
}

$(() => {
	document.addEventListener("touchmove", function (e) { e.preventDefault() });

	$("#registerForm").submit(e => {
		e.preventDefault();
		grecaptcha.execute();
	});

	$(".signUpText").click(() => {
		$(".post-form-content").hide();
		$("#registerForm").show();
		$("#registerPopup").show();
	});

	$(".shutdown-container").click(() => {
		if (confirm("Do you want to shutdown?")) {
			$(".shutdownScreen").fadeIn();
			$("body").css({ overflow: "hidden" });
			document.getElementById("shutdownSound").play();
		}
	});
});

nameInput.on("keyup", function () {
	if (!$(this).val().match(regexname)) {
		// there is a mismatch, hence show the error message
		$("#nameError.emsg").removeClass("hidden");
		$("#registerSubmitBtn").prop("disabled", true);
		$("#nameError.emsg").show();
	} else {
		// else, do not display message
		$("#nameError.emsg").addClass("hidden");
		$("#registerSubmitBtn").prop("disabled", false);
	}
});

regNoInput.on("keyup", function () {
	$(this).val(function (i, val) {
		return val.toUpperCase();
	});
	if (!$(this).val().match(regregex) && (!$(this).val() == '' || !$(this).val() == null)) {
		// there is a mismatch, hence show the error message
		$("#regnoError.emsg").removeClass("hidden");
		$("#registerSubmitBtn").prop("disabled", true);
		$("#regnoError.emsg").show();
	} else {
		// else, do not display message
		$("#regnoError.emsg").addClass("hidden");
		$("#registerSubmitBtn").prop("disabled", false);
	}
});

passwordInput.on("keyup", function () {
	if (
		!$(this)
			.val()
			.match(passregex)
	) {
		// there is a mismatch, hence show the error message
		$("#passwordError.emsg").removeClass("hidden");
		$("#registerSubmitBtn").prop("disabled", true);
		$("#passwordError.emsg").show();
	} else {
		// else, do not display message
		$("#passwordError.emsg").addClass("hidden");
		$("#registerSubmitBtn").prop("disabled", false);
	}
});

phoneNoInput.on("keyup", function () {
	if (
		!$(this)
			.val()
			.match(phoneregex)
	) {
		// there is a mismatch, hence show the error message
		$("#phoneError.emsg").removeClass("hidden");
		$("#registerSubmitBtn").prop("disabled", true);
		$("#phoneError.emsg").show();
	} else {
		// else, do not display message
		$("#phoneError.emsg").addClass("hidden");
		$("#registerSubmitBtn").prop("disabled", false);
	}
});

emailInput.on("keyup", function () {
	$(this).val(function (i, val) {
		return val.toLowerCase();
	});
	if (
		!$(this)
			.val()
			.match(emailregex)
	) {
		// there is a mismatch, hence show the error message
		$("#emailError.emsg").removeClass("hidden");
		$("#registerSubmitBtn").prop("disabled", true);
		$("#emailError.emsg").show();
	} else {
		// else, do not display message
		$("#emailError.emsg").addClass("hidden");
		$("#registerSubmitBtn").prop("disabled", false);
	}
});

usernameInput.on("keyup", function () {
	$(this).val(function (i, val) {
		return val.toLowerCase().trim();
	});
	if (
		!$(this)
			.val()
			.match(usernameregex)
	) {
		// there is a mismatch, hence show the error message
		$("#usernameError.emsg").removeClass("hidden");
		$("#registerSubmitBtn").prop("disabled", true);
		$("#usernameError.emsg").show();
	} else {
		// else, do not display message
		$("#usernameError.emsg").addClass("hidden");
		$("#registerSubmitBtn").prop("disabled", false);
	}
});
