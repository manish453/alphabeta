"use strict"
const logger = require("../utils/logger.util");
const { matchhash } = require("../utils/hashing.util");
const controllerfilename = "login-controller";
const UserModel = Sqlmodels.users;
const bluebird = require("bluebird");
const { createHexHash, create_random_string } = require("../utils/hashing.util")
const { sendMail } = require("../utils/mailer.util")

exports.view = (req, res) => {
	if (req.session.email) {
		res.redirect("/dashboard");
	}
	else {
		try {
			res.render("login");
		} catch (error) {
			logger.error(controllerfilename, "Catch-index ", err)
			res.status("500").send({
				status: "failed",
				message: "We broke something"
			})
		}
	}
}

exports.login = async (req, res) => {
	try {
		const where = { email: req.body.email }
		let result = await UserModel.findOne({
			where,
			attributes: ["user_id", "email", "name", "password", "salt", "status", "role"]
		})
		if (result) {
			const check = {
				salt: result.salt,
				hash: result.password
			},
				checkpassword = req.body.password,
				checkstatus = await matchhash(check, checkpassword)
			if (checkstatus) {
				req.session.status = result.status
				req.session.email = result.email
				req.session.user_id = result.user_id + result.role
				req.session.name = result.name
				req.session.role = result.role
				req.session.type = "panel"
				res.json({ status: "success", url: "/dashboard" })
			} else {
				res.status(500).json({ error: "Invalid login credentials" })
			}
		} else {
			res.status(500).json({ error: "Invalid login credentials" })
		}
	} catch (error) {
		logger.error(controllerfilename, "catch-login", error)
		res.status("500").send({
			status: "failed",
			message: "We broke something"
		})
	}
}

exports.logout = (req, res) => {
	req.session.destroy(function (err) {
		if (err) {
			console.error(err)
		} else {
			res.clearCookie("connect.sid")
			res.json({ status: "success" })
		}
	})
}


const check_email = async (request) => {
	return new bluebird(async (resolve, reject) => {
		try {
			let where = { email: request.registerEmail }
			let response = await UserModel.findOne({
				where: where,
				attributes: ["name","email"]
			})
			if (response) resolve({ response: true, data: response})
			else resolve({ response: false, message: "This email not Register with us!!"  })

		} catch (err) {
			reject({ message: err.message })
		}
	});
}

exports.forget = async (req, res) => {
	try {
		let request = req.body;
		let params = {}
		let emailcheck = await check_email(request)
		if (emailcheck.response) {
			let data = emailcheck.data;			
			let password = create_random_string()
			let hashedv = await createHexHash(password)
			params.password = hashedv.hash;
			params.salt = hashedv.salt;
			let mail = {
				to: data.email,
				subject: "New Password has been generated",
				content:
					"<h3>Hello "+ data.name +" !</h3>" +
					"<p>Your Password for panel is :: " + password + "<br/><br/> " +
					"Thanks</p>"
			}
			sendMail(mail, false)
			await UserModel.update(params, { where: { email: data.email } })
			res.json({ status: "ok" })
		}else{
			res.status(500).json({ error: emailcheck.message })	
		}

	} catch (e) {
		logger.error(controllerfilename, "save catch", e)
		res.status(500).json({ error: "We faced an error while updating the records!!" })
	}
}