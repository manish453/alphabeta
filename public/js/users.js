const pageurl = "/users/"
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
		$("body").on('click', '.triggerModal', function () {
			let type = $(this).data('type');
			let title = type == 'add' ? 'Add User' : 'Edit User';
			$('.modal-title').html(title)
			if (type === 'edit') {
				let id = $.trim($(this).data('id'))
				$.ajax({
					type: 'get',
					dataType: 'json',
					url: pageurl + 'fetch/' + id,
					success: function (res) {
						let inputs = $('#addEditUserForm :input:not(:checkbox):not(:button)');
						for (const iterator of inputs) {
							$('#' + iterator.id).val(res.data[iterator.id])
						};
					},
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
				})
			}
			$("#myModal").modal();

		});

		$('#addEditUserForm').on('submit', function (event) {
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
					window.location.reload()
				}
			})
			return false
		})

		$("body").on('click', '#closeModal', function () {
			$('#addEditUserForm').trigger("reset");
			$('#myModal').modal('toggle');
		});

		$("body").on('click', '.delete_record', function () {
			let id = $.trim($(this).data('id'));
			delete_records(pageurl + 'delete', { user_id: id }, fetchPages)
		});
	})

})
