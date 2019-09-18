const loginUsername = $("input[name='username-login']");
const loginPassword = $("input[name='password-login']");



$(document).on("click", "#loginSubmitBtn", function(){
    const username = encodeURIComponent(loginUsername.val());
    const password = encodeURIComponent(loginPassword.val());
    console.log("aaa");
    $.ajax({
        type: "POST",
        url: "/auth/login",
        data: {
            "username": username,
            "password": password
        },
        success: function(result) {
            if(result["success"] == true){
                console.log("home");
                window.location.href = '/home'
            }
        }

    })
})

loginUsername.on("keyup", function () {
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
loginPassword.on("keyup", function () {
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