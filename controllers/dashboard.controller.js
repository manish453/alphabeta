"use strict"
const logger = require("../utils/logger.util");


const controllerfilename = "dashboard-controller";

exports.index = (req, res) => {
	try {
		res.render("dashboard/");
	} catch (error) {
		logger.error(controllerfilename, "Catch-index ", error)
		res.status("500").send({
			status: "failed",
			message: "We broke something"
		})
	}
}
