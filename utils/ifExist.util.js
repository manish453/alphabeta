const bluebird = require("bluebird"),
	Op = Sqlmodels.Sequelize.Op

exports.if_email_exist = async (request, model, primary) => {
	return new bluebird(async (resolve, reject) => {
		try {
			let where = { email: request.email }
			if (request.user_id) {
				where[primary] = { [Op.ne]: request.user_id }
			}
			let response = await model.findOne({
				where: where,
				attributes: ["email"]
			})
			if (response) resolve({ response: true, message: "We already have this email with us!!" })
			else resolve({ response: false })

		} catch (err) {
			reject({ message: err.message })
		}
	});
}