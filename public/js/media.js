const pageurl = "/media/"
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
		
		$("body").on("click", ".img-item", function (e) {
			$(".img-item").removeClass('active');
			$(this).addClass('active');
		})

		$('.file_input').change(function () {
			var id = $(this).attr('id');
			var myfile = $('#' + id).val();

			file_re = /^(([a-zA-Z]:)|(\\{2}\w+)\$?)(\\(\w[\w].*))+(.jpg|.png|.gif|.jpeg|.GIF|.JPG|.PNG)$/;
			if (myfile == '') {
				swaloption.title = "Error"
				swaloption.icon = "error"
				swaloption.message = "Please enter file name and select file"
				callAlertModal(swaloption)
				return false;
			} else {
				if (file_re.test(myfile)) {
					var file = myfile.replace(/C:\\fakepath\\/i, '');
					$('.file_temp_path').text(file);
					upload_file(myfile, id);
				} else {
					swaloption.title = "Error"
					swaloption.icon = "error"
					swaloption.message = "Only jpg, gif and png files are allowed!"
					callAlertModal(swaloption)
					$(this).val('');
					return false;
				}
			}
		});
		function upload_file(myfile, id) {
			$('.myprogress').text('0%').css('width', '0');
			$('.progress').hide();
			var formData = new FormData();
			formData.append('uploadfile', $('#uploadfile')[0].files[0]);
			formData.append('file_name', id);
			$.ajax({
				url: pageurl + 'uploadimage',
				data: formData,
				processData: false,
				contentType: false,
				type: 'POST',
				dataType: 'json',
				xhr: function () {
					$('.progress').show();
					var xhr = new window.XMLHttpRequest();
					xhr.upload.addEventListener("progress", function (evt) {
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;
							percentComplete = parseInt(percentComplete * 100);
							$('.myprogress').text(percentComplete + '%').css('width', percentComplete + '%');
						}
					}, false);
					return xhr;
				},
				error: function (xhr) {
					$('.progress').hide();
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
					fetchPages();
					setTimeout(() => {
						$('.progress').hide();
						$('.myprogress').text('0%').css('width', '0');
						$('#file-path').text(response.url);
						$('.path_cont_wrp').show();
					}, 1000)
				}
			});
		}


		$("body").on('click', '.triggerModal', function () {
			$('.file_temp_path').html('');
			$('#file-path').text('');
			$('.progress').hide();
			$('.myprogress').text('0%').css('width', '0');
			$('.path_cont_wrp').hide();
			$('#uploadfile').val('');
			$("#myModal").modal();
		});

		$("body").on('click','.copylink', function(event) {
			$(this).addClass('copied_link').text('copied!');
			var $tempElement = $("<input>");
			$("body").append($tempElement);
			$tempElement.val($(this).data('image-url')).select();
			document.execCommand("Copy");
			$tempElement.remove();
			setTimeout(()=>{
				$('.copied_link').removeClass('copied_link').text('copy link');
			},500)
		});

		$("body").on('click', '.delete_media', function () {
			let id = $.trim($(this).data('id'));
			delete_records(pageurl + 'delete', { img_id: id }, fetchPages)
		});	
		
	})
})

var uagent = navigator.userAgent.toLowerCase();
if (/safari/.test(uagent) && !/chrome/.test(uagent)) {
	document.write("<style type='text/css'>.options-buttons-area {display: none !important;}</style>");
}

(function () {
	'use strict';
	document.body.addEventListener('click', copy, true);
	function copy(e) {
		var t = e.target, c = t.dataset.copytarget, inp = c ? document.querySelector(c) : null;
		if (inp && inp.select) {
			inp.select();
			try {
				document.execCommand('copy');
				inp.blur();
				t.classList.add('copied');
				setTimeout(function () {
					t.classList.remove('copied');
				}, 1500);
			} catch (err) {
				alert('please press Ctrl/Cmd+C to copy');
			}
		}
	}
}());