"use strict"
const logger = require("../utils/logger.util");
const UsersModel = Sqlmodels.users;
const CenterModel = Sqlmodels.center;
const { createHexHash } = require("../utils/hashing.util")
const { sendMail } = require("../utils/mailer.util")


const controllerfilename = "profile-controller";

exports.view = async (req, res) => {
	try {
		let user_id = parseInt(req.session.user_id);
		let where = { user_id: user_id }
		let result = await UsersModel.findOne({
			where: where,
			attributes: ["user_id", "name", "email", "role"]
		})
		res.render("profile/", { user: result });
	} catch (error) {
		logger.error(controllerfilename, "Catch-index ", err)
		res.status("500").send({
			status: "failed",
			message: "We broke something"
		})
	}
}



exports.updatepassword = async (req, res) => {
	try {
		let request = req.body;
		let id = parseInt(req.session.user_id);
		let params = {
			name: req.session.name,
			email: req.session.email
		}

		let password = request.password;
		let hashedv = await createHexHash(password)
		params.password = hashedv.hash;
		params.salt = hashedv.salt;
		let mail = {
			to: req.session.email,
			subject: "New Password has been generated",
			content:
				"<h3>Hello " + req.session.name + "!</h3>" +
				"<p>Your Password for panel is :: " + password + "<br/><br/> " +
				"Thanks</p>"
		}
		sendMail(mail, false)
		console.log(params);

		await UsersModel.update(params, { where: { user_id: id } })
		res.json({ status: "OK", })
		req.end();

	} catch (e) {
		logger.error(controllerfilename, "save catch", e)
		res.status(500).json({ error: "We faced an error while updating the records!!" })
	}
}

