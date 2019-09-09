function onSubmit() {
  const nameInput = $("input[name='name']");
  const usernameInput = $("input[name='username']");
  const passwordInput = $("input[name='password']");
  const regNoInput = $("input[name='regNo']");
  const emailInput = $("input[name='email']");
  const phoneNoInput = $("input[name='phoneNo']");

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
});
