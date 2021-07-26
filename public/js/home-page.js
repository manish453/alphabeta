const pageurl = "/homepage/"
let swaloption = {
	title: "",
	icon: "",
	message: ""
}
function fetchPages(page = 1) {
	const request = {
		url: pageurl + "paginate",
		method: "GET",
		parameter: {
			page: page
		}
	}
	fetchpaginatedata(request)
}

$(function () {
	$(document).ready(function () {
		fetchPages();
		$("body").on("click", "#paging ul li a.page-link", function (e) {
			e.preventDefault()
			let page = $(this).data("page")
			if (page) fetchPages(page)
		})
		$('#addEditSectionForm').on('submit', function (event) {
			event.preventDefault();
			event.stopPropagation();
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
					swaloption.message = response.message;
					let redirectTo = (response.type == 'add') ? '/homepage/': ''
					callAlertModal(swaloption, redirectTo)

				}
			})
			return false
		})


		$("body").on('click', '.delete_record', function () {
			let id = $.trim($(this).data('id'));
			delete_records(pageurl + 'delete', { id: id }, fetchPages)
		});

		if($('#addEditSectionForm').hasClass('add-page')){
			$('#slug').attr('readonly',false)
		}else{
			$('#slug').attr('readonly',true)	
		}		
	})
})
