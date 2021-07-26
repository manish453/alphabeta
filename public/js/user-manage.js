let swaloption = {
	title: "Error",
	icon: "error",
	message: ""
}

$(function () {
	$("#loginform").submit(function (e) {
		e.preventDefault()
		let email = $("#loginemail").val()
		let pass = $("#loginpass").val()
		if (email == "" || pass == "") {
			swaloption.title = "Error"
			swaloption.icon = "error"
			swaloption.message = "Please enter your credentials!!"
			callAlertModal(swaloption)
		} else {
			$(this).ajaxSubmit({
				error: function (xhr) {
					swaloption.title = "Error"
					swaloption.icon = "error"
					swaloption.message = xhr.responseJSON.error
					callAlertModal(swaloption)
				},
				success: function (response) {
					window.location.reload()
				}
			})
		}
		return false
	});

	$("#showforget").click(function (e) {
		e.preventDefault()
		$(".loginbox").fadeOut("slow", function () {
			$(".forgetbox").fadeIn()
		})
	})

	$("#closeforget").click(function (e) {
		e.preventDefault()
		$(".forgetbox").fadeOut("slow", function () {
			$(".loginbox").fadeIn()
		})
	})

	$("#forgetform").submit(function (e) {
		e.preventDefault()
		let email = $("#registerEmail").val()
		if (email == "") {
			swaloption.title = "Error"
			swaloption.icon = "error"
			swaloption.message = "Please enter your register Email!!"
			callAlertModal(swaloption)
		} else {
			$(this).ajaxSubmit({
				error: function (xhr) {
					swaloption.title = "Error"
					swaloption.icon = "error"
					swaloption.message = xhr.responseJSON.error
					callAlertModal(swaloption)
				},
				success: function (response) {
					swaloption.title = "Success"
					swaloption.icon = "success"
					swaloption.message = "New password has been send on you register email!"
					callAlertModal(swaloption)
				}
			})
		}
		return false
	});
})
