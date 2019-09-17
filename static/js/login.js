const usernameInput = $("input[name='username']");
const passwordInput = $("input[name='password']");

const usernameregex = /^[a-zA-Z0-9_`!@#$%^&*]{3,20}$/;
const passregex = /^[a-zA-Z0-9_!@#$%^&* ]{5,15}$/;

function onSubmit(token) {
    const username = encodeURIComponent(usernameInput.val());
    const password = encodeURIComponent(passwordInput.val());
    const formData = `g-recaptcha-response=${token}&username=${username}&password=${password}`;

    $.ajax({
		type: "POST",
		url: "/login",
		data: formData,
        error: (xhr, status, message) => {
            const error = JSON.parse(xhr.responseText);
            if (error["message"] == "Not registered") {
				alert("Please register");
			} else if (error["message"] == "missingFields") {
				alert("Fields marked with * cannot be blank.");
			} else {
				alert(error["message"]);
			}
        }
    });

    grecaptcha.reset();
}

(()=>{
    usernameInput.on("keyup", function () {
        if (!$(this).val().match(regexname)) {
            // there is a mismatch, hence show the error message
            $("#nameError.emsg").removeClass("hidden");
            $("#loginSubmitBtn").prop("disabled", true);
            $("#nameError.emsg").show();
        } else {
            // else, do not display message
            $("#nameError.emsg").addClass("hidden");
            $("#loginSubmitBtn").prop("disabled", false);
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
            $("#loginSubmitBtn").prop("disabled", true);
            $("#passwordError.emsg").show();
        } else {
            // else, do not display message
            $("#passwordError.emsg").addClass("hidden");
            $("#loginSubmitBtn").prop("disabled", false);
        }
    });
})