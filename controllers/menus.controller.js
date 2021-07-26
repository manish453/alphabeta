"use strict"
const logger = require("../utils/logger.util");
const { paginate_data } = require("../utils/pug.util")
const MenusModel = Sqlmodels.menus;


const controllerfilename = "menus-controller",
	  limit = 10;

exports.view = (req, res) => {
	try {
		res.render("menus/");
	} catch (error) {
		logger.error(controllerfilename, "Catch-index ", error)
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
				attributes: ["menu_id", "name", "url", "order_number", "status"],
				primary: "menu_id",
				page: wquery.page,
				limit: limit,
				orderby: "order_number",
				order: "asc",
				templatePath: "./views/menus/table.pug",
			}

		let data = await paginate_data(request, MenusModel);
		res.send(data)
	} catch (e) {
		logger.error(controllerfilename, "paginate ", e)
		res.status(500).json({ error: "Internal Error on our side. Sorry for the inconvience" })
	}
}

exports.fetch = async (req, res) => {
	try {
		const id = req.params.id;
		let result = await MenusModel.findByPk(id);
		if (result) {
			res.json(result)
		} else {
			res.status("500").send({
				status: "failed",
				message: "Result not found"
			})
		}
	} catch (error) {
		logger.error(controllerfilename, "Catch-index ", error)
		res.status("500").send({
			status: "failed",
			message: "We broke something"
		})
	}
}

exports.save = async (req, res) => {
	try {
		let request = req.body,
			params = {
				name: request.name,
				url: request.url,
				order_number : request.order_number,
				status : request.status ? request.status : '1'
			},
			id = request.menu_id
		if (id === "" || id === undefined) await MenusModel.create(params)
		else await MenusModel.update(params, { where: { menu_id: id } })
		res.json({ status: true })
	} catch (error) {
		logger.error(controllerfilename, "Catch-index ", error)
		res.status("500").send({
			status: "failed",
			message: "We broke something"
		})
	}
}


exports.delete = async (req, res) => {
	try {
		let id = req.body.menu_id
		await MenusModel.update({status:'0'},{ where: { menu_id: id } })
		res.json({ status: "success" })
	} catch (tryerr) {
		logger.error(controllerfilename, "Delete tryerror ", tryerr)
		res.status(500).json({ status: "failed", message: tryerr })
	}
}