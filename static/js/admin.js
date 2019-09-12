const usernameInput = $("input[name='username']");
const passwordInput = $("input[name='password']");

function onSubmit(token) {
    const username = encodeURIComponent(usernameInput.val());
    const password = encodeURIComponent(passwordInput.val());
    const formData = `g-recaptcha-response=${token}&username=${username}&password=${password}`;

    $.ajax({
		type: "POST",
		url: "/auth/admin",
		data: formData,
        error: (xhr, status, message) => {
            const error = JSON.parse(xhr.responseText);
            if (error["message"] == "invalidDetails") {
				alert("Don't mess up. Unless u wanna be disqualified!");
			} else if (error["message"] == "missingFields") {
				alert("Fields marked with * cannot be blank.");
			} else {
				alert(error["message"]);
			}
        }
    });

    grecaptcha.reset();
}