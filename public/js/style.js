let currentRequest = null

function ajax_call(url, parameters, method = "GET") {
    return $.ajax({
        type: method,
        url: url,
        data: parameters
    })
}

function chkReportCount(request) {
    if (currentRequest) {
        currentRequest.abort()
    }
    currentRequest = $.ajax({
            type: request.method ? request.method : "POST",
            url: request.url,
            data: { id: request.id }
        })
        .done(function(result) {
            let response = '<div class="form-group chktest"><label>Select test to upload report(s)</label><br />';
            $.each(result, function(key, value) {
                response += ' <input type="checkbox" value="' + value.test.test_id + '" name="test[]"> ' + value.test.name;
            });
            response += '</div>';
            $('#medicaltst').html(response);

        })
        .fail(function(jqXHR, textStatus) {
            if (jqXHR.statusText != "abort") {
                if (jqXHR.status == 401) {
                    callReloadSwal()
                } else {
                    $("#loading").addClass("d-none")
                    $("#loadfail").html(
                        "<p class='fa-2x'>Oh Snap &#128533 !!!</p>" +
                        "<p class='fa-2x'>Error: " + jqXHR.status + " " + jqXHR.statusText + ".</p>"
                    )
                }
            }
        })
}

function reportList(request) {
    if (currentRequest) {
        currentRequest.abort()
    }
    currentRequest = $.ajax({
            type: request.method ? request.method : "POST",
            url: request.url,
            data: { id: request.id }
        })
        .done(function(result) {
            console.log(result);
            let response = '<div class="form-group chktest"><label>Click on links to download report</label><br /><ol>';
            let i = 1;
            $.each(result.ids, function(key, value) {
                response += '<li><a href="javascript:void()" data-download="' + value + '" class="downloadnow" >' + result.filenames[key] + '</a> <span><a style="padding:10px; color:red; margin-left:50px;font-weight:800;text-decoration:none;" href="javascript:void()" data-remove="' + value + '" class="deletereport">X</a></span></li>';
                i++;
            });
            response += '</ol></div>';
            $('#reportList').html(response);

        })
        .fail(function(jqXHR, textStatus) {
            if (jqXHR.statusText != "abort") {
                if (jqXHR.status == 401) {
                    callReloadSwal()
                } else {
                    $("#loading").addClass("d-none")
                    $("#loadfail").html(
                        "<p class='fa-2x'>Oh Snap &#128533 !!!</p>" +
                        "<p class='fa-2x'>Error: " + jqXHR.status + " " + jqXHR.statusText + ".</p>"
                    )
                }
            }
        })
}

function reportListPatient(request) {
    if (currentRequest) {
        currentRequest.abort()
    }
    currentRequest = $.ajax({
            type: request.method ? request.method : "POST",
            url: request.url,
            data: { id: request.id }
        })
        .done(function(result) {
            console.log(result);
            let response = '<div class="form-group chktest"><label>Click on links to download report</label><br /><ol>';
            let i = 1;
            $.each(result.ids, function(key, value) {
                response += '<li><a href="javascript:void()" data-download="' + value + '" class="downloadnow" >' + result.filenames[key] + '</a></li>';
                i++;
            });
            response += '</ol></div>';
            $('#reportList').html(response);

        })
        .fail(function(jqXHR, textStatus) {
            if (jqXHR.statusText != "abort") {
                if (jqXHR.status == 401) {
                    callReloadSwal()
                } else {
                    $("#loading").addClass("d-none")
                    $("#loadfail").html(
                        "<p class='fa-2x'>Oh Snap &#128533 !!!</p>" +
                        "<p class='fa-2x'>Error: " + jqXHR.status + " " + jqXHR.statusText + ".</p>"
                    )
                }
            }
        })
}

function fetchpaginatedata(request) {
    $("#showbox").empty()
    if (currentRequest) {
        currentRequest.abort()
    }
    $("#pageloadbox").removeClass("d-none")
    $("#loadfail").html("")
    $("#searchbtn").attr("disabled", "true")
    currentRequest = $.ajax({
            type: request.method ? request.method : "POST",
            url: request.url,
            data: request.parameter
        })
        .done(function(result) {
            $("#pageloadbox").addClass("d-none")
            $("#showbox").html(result)
            if (request.popover) {
                createPopover(request.popover)
            }
        })
        .fail(function(jqXHR, textStatus) {
            if (jqXHR.statusText != "abort") {
                if (jqXHR.status == 401) {
                    callReloadSwal()
                } else {
                    $("#loading").addClass("d-none")
                    $("#loadfail").html(
                        "<p class='fa-2x'>Oh Snap &#128533 !!!</p>" +
                        "<p class='fa-2x'>Error: " + jqXHR.status + " " + jqXHR.statusText + ".</p>"
                    )
                }
            }
        })
        .always(function() {
            $("#searchbtn").removeAttr("disabled")
        })
}

// Check if JSON object is empty
function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false
    }
    return true
}

// Open alertbox
function callAlertModal(values, redirectTo = "") {
    swal({
        title: values.title,
        text: values.message,
        icon: values.icon,
        button: "Dismiss"
    }).then(() => {
        if (redirectTo !== '') window.location.href = redirectTo;
    })
}

// Show Reload Message and Reload the Page
function callReloadSwal(values = {}) {
    if (isEmpty(values)) {
        values = {
            title: "Session Timed Out",
            text: "Session Timed Out. Page will be reloaded.",
            icon: "info"
        }
    }

    swal({
        title: values.title,
        text: values.message,
        icon: values.icon,
        buttons: {
            Reload: {
                text: "Reload"
            }
        }
    }).then(() => {
        window.location.href = "/"
    })
}

function checkPass(password, helpid) {
    if (password) {
        if (password.length < 8) {
            $("#" + helpid)
                .html("Please Enter 8 character password")
                .addClass("text-danger")
            return false
        } else {
            $("#" + helpid)
                .html("")
                .removeClass("text-danger")
            return true
        }
    } else {
        $("#" + helpid)
            .html("The password can't be empty")
            .addClass("text-danger")
        return false
    }
}

function cancel_records(url, params, _callback = false) {
    console.log(url, params)
    let swalalertop = {
        title: "Error",
        icon: "error",
        message: ""
    }
    swal({
        title: "Are you sure?",
        text: "Once Canceled, you will not be able to recover this record!",
        icon: "warning",
        buttons: true,
        dangerMode: true
    }).then(isConfirm => {
        if (isConfirm) {
            ajax_call(url, params, "POST")
                .done(function(result) {
                    if (result.status == "success") {
                        let values = {
                            title: "Deleted!",
                            message: "Poof! Booking Canceled.",
                            icon: "success"
                        }
                        if (typeof _callback === "function") {
                            callAlertModal(values)
                            _callback()
                        } else {
                            callReloadSwal(values)
                        }
                    } else {
                        swalalertop.message = result.reason
                        callAlertModal(swalalertop)
                    }
                })
                .fail(function(jqXHR, textStatus) {
                    if (jqXHR.status == 401) {
                        callReloadSwal()
                    } else {
                        swalalertop.message = "We faced an error!!"
                        callAlertModal(swalalertop)
                    }
                })
        } else {
            swal("Cancelled", "Booking is safe!", "error")
        }
    })
}

function delete_records(url, params, _callback = false) {
    let swalalertop = {
        title: "Error",
        icon: "error",
        message: ""
    }
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this record!",
        icon: "warning",
        buttons: true,
        dangerMode: true
    }).then(isConfirm => {
        if (isConfirm) {
            ajax_call(url, params, "POST")
                .done(function(result) {
                    if (result.status == "success") {
                        let values = {
                            title: "Deleted!",
                            message: "Poof! Record has been deleted.",
                            icon: "success"
                        }
                        if (typeof _callback === "function") {
                            callAlertModal(values)
                            _callback()
                        } else {
                            callReloadSwal(values)
                        }
                    } else {
                        swalalertop.message = result.reason
                        callAlertModal(swalalertop)
                    }
                })
                .fail(function(jqXHR, textStatus) {
                    if (jqXHR.status == 401) {
                        callReloadSwal()
                    } else {
                        swalalertop.message = "We faced an error!!"
                        callAlertModal(swalalertop)
                    }
                })
        } else {
            swal("Cancelled", "Record is safe!", "error")
        }
    })
}

function createPopover(selector) {
    $(function() {
        var popOverSettings = {
            placement: 'left',
            container: '#' + selector,
            trigger: 'click,hover',
            html: true,
            selector: '[data-toggle="popover"]',
            delay: { "hide": 500 }
        };
        $('body').popover(popOverSettings);
    });
}

function openFullscreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    $('#screenfullview i.feather').removeClass('icon-maximize').addClass('icon-minimize');
}

function closeFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    $('#screenfullview i.feather').removeClass('icon-minimize').addClass('icon-maximize');
}

$(function() {
    $(".sidebar-dropdown > a").click(function() {
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
            .parent()
            .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });

    let sidebarOpen = true;
    $("#mobile-collapse").on('click', function() {
        $(this).toggleClass('on');
        sidebarOpen = !sidebarOpen;
        $(".page-wrapper").toggleClass("toggled");
    });

    if ($(window).width() > 1024) {
        $('#sidebar').on('mouseenter', function() {
            $(".page-wrapper").addClass("toggled");
        })

        $('#sidebar').on('mouseleave', function() {
            if (!sidebarOpen) $(".page-wrapper").removeClass("toggled");
        })

        let screenFullView = false;
        $('#screenfullview').on('click', function() {
            screenFullView = !screenFullView;
            localStorage.setItem('fullscreen', screenFullView);
            (screenFullView) ? openFullscreen(): closeFullscreen();
        });
    }

    $('.sidebarOverlay').on('click', function() {
        $('.mobile-menu').removeClass('on');
        $(".page-wrapper").addClass("toggled");
        sidebarOpen = !sidebarOpen;
    });

    $("#closeSession a.logout").click(function(e) {
        e.preventDefault()
        url = "/logout"
        parameter = {}
        ajax_call(url, parameter, "POST").done(function(result) {
            if (result.status == "success") {
                window.location = "/"
            }
        })
    })
    $(".numberonly").on("keypress keyup blur", function(event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });
});