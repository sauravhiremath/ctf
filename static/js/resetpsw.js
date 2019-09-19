$("#forgotPasswordBtn").click(() => {
    const email = encodeURIComponent($("input[name='forgotPassword-email']").val());
	const formData = `email=${email}`;
    $.ajax({
		type: "POST",
		url: "/auth/resetPassword",
		data: formData,
		success: data => {
			if (data["success"] == true) {
				$("#resetPasswordForm").hide();
				$("#postResetContent").show();
			} else {
				alert(data["message"]);
			}
		},
		error: (xhr, status, message) => {
			const error = JSON.parse(xhr.responseText);
			alert(error);
		}
	});
});