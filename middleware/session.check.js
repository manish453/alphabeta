"use strict"
const disallow = require("../config/disallow"),
	logger = require("../utils/logger.util")

exports.sessioncheck = function (req, res, next) {
	if (req.session.email) {
		if (req.session.role != "super" && disallow[req.session.role].indexOf(req.originalUrl) !== -1) {
			res.status("403").render("common/error", {
				status: 403,
				msg: "Access not authorized"
			})
			logger.error("authorization", "User Access", req.session.name + "[" + req.session.user_id + "] tried to access the disallowed page. Url::" + req.originalUrl)
			return
		}
		next()
	} else if (req.xhr) {
		res.status("401").send({
			status: "failed",
			message: "Session Timed Out"
		})
		return
	} else {
		res.redirect("/")
		return
	}
}

exports.patientsessioncheck = function (req, res, next) {
	if (!req.session.phone) {
		res.redirect("/")
		return
	} else {
		next()
	}

}
