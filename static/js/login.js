const loginUsername = $("input[name='username-login']");
const loginPassword = $("input[name='password-login']");



$(document).on("click", "#loginSubmitBtn", function(){
    const username = encodeURIComponent(loginUsername.val());
    const password = encodeURIComponent(loginPassword.val());
    if(username.length<=3 && password.length<=5){
        alert("Enter a valid username/password");
    }
    else{
            $.ajax({
                type: "POST",
                url: "/auth/login",
                data: {
                    "username": username,
                    "password": password
                },
                success: function(result) {
                    if(result["success"] == true){
                        window.location.href = '/home'
                    }
                    if(result["success"] == false){
                        var message = result["message"];
                        $(".message").html(message);
                        $("#errorModal").modal('show');
                    }
                }
        
            })
        }
    })

loginUsername.on("keyup", function () {
    if (!$(this).val().match(regexname)) {
        // there is a mismatch, hence show the error message
        $("#loginSubmitBtn").prop("disabled", true);
        $("#nameError.emsg").show();
    } else {
        // else, do not display message
        $("#nameError.emsg").addClass("hidden");
        $("#loginSubmitBtn").prop("disabled", false);
    }
});
loginPassword.on("keyup", function () {
    if (!$(this).val().match(passregex)) {
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