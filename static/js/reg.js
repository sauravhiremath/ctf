$(() => {
    const nameInput = $("input[name='name']");
    const usernameInput = $("input[name='username']");
    const passwordInput = $("input[name='password']");
    const regNoInput = $("input[name='regNo']");
    const emailInput = $("input[name='email']");
    const phoneNoInput = $("input[name='phoneNo']");

    
    $("#registerForm").submit((e) => {
        e.preventDefault(); 
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
            success: (data) => {
                console.log(data);
            },
          });
    });
});