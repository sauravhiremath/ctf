const loginUsername = $("input[name='username']");
const loginPassword = $("input[name='password']");



$(document).on("click", "#loginSubmitBtn", function(){
    const username = encodeURIComponent(loginUsername.val());
    const password = encodeURIComponent(loginPassword.val());
    $.ajax({
        type: "POST",
        url: "/auth/login",
        data: {
            username: username,
            password: password
        },
        success: data=> {
            console.log(data);
        }

    })
})

usernameInput.on("keyup", function () {
    if (!$(this).val().match(regexname)) {
        // there is a mismatch, hence show the error message
        $("#nameError.emsg").removeClass("hidden");
        $("#loginSubmitBtn").prop("disabled", true);
        $("#nameError.emsg").show();
        console.log("aaaaaa");
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