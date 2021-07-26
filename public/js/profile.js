const pageurl = "/profile/"
let swaloption = {
	title: "",
	icon: "",
	message: ""
}


$(function () {
	$(document).ready(function () {
		$('#updatePassword').on('submit', function (event) {
			event.preventDefault();
			event.stopPropagation();
			swaloption.title = "Error"
			swaloption.icon = "error"
			let pass = $.trim($('#password').val());
			let confirPass = $.trim($('#confirPass').val());
			console.log(pass+"  "+confirPass);
			
			if (pass === '') {
				swaloption.message = "Please enter Password"
				callAlertModal(swaloption)
			}
			else if (pass.length < 5) {
				swaloption.message = "Password length must be greater than 5 characters"
				callAlertModal(swaloption)
			}
			else if (confirPass === '') {
				swaloption.message = "Please enter confirm password"
				callAlertModal(swaloption)
			}
			else if (pass !== confirPass) {
				swaloption.message = "Password did not match: Please try again..."
				callAlertModal(swaloption)
			}
			else {
				$(this).ajaxSubmit({
					error: function (xhr) {
						if (xhr.status == 401) {
							callReloadSwal()
						} else {
							swaloption.title = "Error"
							swaloption.icon = "error"
							if (xhr.responseJSON) {
								swaloption.message = xhr.responseJSON.error
							}
							callAlertModal(swaloption)
						}
					},
					success: function (response) {
						swaloption.title = "Success"
						swaloption.icon = "success"
						swaloption.message = "Password has been updated"
						callAlertModal(swaloption)
					}
				})
				return false
			}
		})

	})
})
