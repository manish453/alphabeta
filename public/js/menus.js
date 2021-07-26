const pageurl = "/menus/"
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
			let title = type == 'add' ? 'Add Menu' : 'Edit Menu';
			$('.modal-title').html(title)
			if (type === 'edit') {
				let id = $.trim($(this).data('id'))
				$.ajax({
					type: 'get',
					dataType: 'json',
					url: pageurl + 'fetch/' + id,
					success: function (res) {
						let inputs = $('#addEditMenusForm .input');
						for (const iterator of inputs) $('#' + iterator.id).val(res[iterator.id]);
						$("#myModal").modal();
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
			} else {
				$("#myModal").modal();
			}

		});

		$('#addEditMenusForm').on('submit', function (event) {
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
			$('#addEditMenusForm').trigger("reset");
			$('#myModal').modal('toggle');
		});

		$("body").on('click', '.delete_record', function () {
			let id = $.trim($(this).data('id'));
			delete_records(pageurl + 'delete', { menu_id: id }, fetchPages)
		});
	})

	$("#order_number").on("keypress keyup blur",function (event) {    
		$(this).val($(this).val().replace(/[^\d].+/, ""));
		 if (event.which < 48 || event.which > 57) {
			 event.preventDefault();
		 }
	 });
})
