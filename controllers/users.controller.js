"use strict"
const logger = require("../utils/logger.util");
const { paginate_data } = require("../utils/pug.util")
const UsersModel = Sqlmodels.users;
const CenterModel = Sqlmodels.center;
const { if_email_exist } = require("../utils/ifExist.util")
const { createHexHash, create_random_string } = require("../utils/hashing.util")
const { sendMail } = require("../utils/mailer.util")
const Op = Sqlmodels.Sequelize.Op;


const controllerfilename = "users-controller";
const whereparams = { "id": "user_id", "name": "name", "email": "email" }
const limit = 20

exports.view = (req, res) => {
	try {
		res.render("users/");
	} catch (error) {
		logger.error(controllerfilename, "Catch-index ", err)
		res.status("500").send({
			status: "failed",
			message: "We broke something"
		})
	}
}

exports.paginate = async (req, res) => {
	try {
		let wquery = req.query,
			request = {
				where: [],
				attributes: ["user_id", "name", "email", "role"],
				primary: "user_id",
				page: wquery.page,
				limit: limit,
				orderby: "user_id",
				order: "desc",
				templatePath: "./views/users/table.pug"
			}
		for (const key in whereparams) {
			if (wquery[key]) request.where.push({ [whereparams[key]]: wquery[key] })
		}
		let user_id = parseInt(req.session.user_id);
		request.where.push({ user_id: { [Op.not]: user_id } })
		let data = await paginate_data(request, UsersModel);
		res.send(data)
	} catch (e) {
		logger.error(controllerfilename, "paginate ", e)
		res.status(500).json({ error: "Internal Error on our side. Sorry for the inconvience" })
	}
}

exports.fetch = async (req, res) => {
	try {
		let where = { user_id: req.params.id }
		let result = await UsersModel.findOne({
			where: where,
			attributes: ["user_id", "name", "email", "role"]
		})
		if (result) res.json({ response: true, data: result })
		else res.json({ response: false })

	} catch (e) {
		logger.error(controllerfilename, "Catch-index ", e)
		res.status("500").send({
			status: "failed",
			message: "We broke something"
		})
	}
}

exports.save = async (req, res) => {
	try {
		let request = req.body;
		let id = request.user_id
		let params = {
			name: request.name,
			email: request.email,
			role: request.role
		}
		let emailcheck = await if_email_exist({ email: params.email, user_id: id }, UsersModel, "user_id")
		if (!emailcheck.response) {
			if (id === "" || id === undefined) {
				let password = create_random_string()
				let hashedv = await createHexHash(password)
				params.password = hashedv.hash;
				params.salt = hashedv.salt
				await UsersModel.create(params)
				let mail = {
					to: request.email,
					subject: "New Password has been generated",
					content:
						"<h3>Hello " + request.name + "!</h3>" +
						"<p>Your Password for panel is :: " + password + "<br/><br/> " +
						"Thanks</p>"
				}
				sendMail(mail, false)
			}
			else await UsersModel.update(params, { where: { user_id: id } })
			res.json({ status: "OK" })
		} else {
			res.status(500).json({ error: emailcheck.message })
		}
	} catch (e) {
		logger.error(controllerfilename, "save catch", e)
		res.status(500).json({ error: "We faced an error while updating the records!!" })
	}
}

exports.delete = async (req, res) => {
	try {
		let request = req.body;
		let id = request.user_id
		await UsersModel.destroy({ where: { user_id: id } })
		res.json({ status: "success" })
	} catch (tryerr) {
		logger.error(controllerfilename, "Delete tryerror ", tryerr)
		res.status(500).json({ status: "failed", message: tryerr })
	}
}

exports.change_pass = async (req, res) => {
	try {
		let request = req.body;
		let params = {
			user_id: request.id,
			password: request.password,
			changetype: "reset",
			sendmail: true
		}
		await ManagePass.update_password(params, UsersModel, "user_id")
		res.json({ status: "ok" })
	} catch (err) {
		logger.error(controllerfilename, "change_pass trycatch", err.message)
		res.status(500).json({ error: "We faced an error while updating the records!!" })
	}
}