"use strict"
const logger = require("../utils/logger.util"),
	{create_clean_string} = require("../utils/utilities"),
	bluebird = require("bluebird"),
	HomePagepageModel = Sqlmodels.homepage,
	Op = Sqlmodels.Sequelize.Op;
const { paginate_data } = require("../utils/pug.util");


const controllerfilename = "homepage-controller";
const limit = 10;

const if_section_id_exist = async (request, primary) => {
	return new bluebird(async (resolve, reject) => {
		try {
			let where = { section_id: request.section_id }
			if (request.id) {
				where[primary] = { [Op.ne]: request.id }
			}
			let response = await HomePagepageModel.findOne({
				where: where,
				attributes: ["section_id"]
			})
			if (response) resolve({ response: true, message: "We already have this Section!!" })
			else resolve({ response: false })

		} catch (err) {
			reject({ message: err.message })
		}
	});
}

exports.view = (req, res) => {
	try {
		res.render("homepage/");
	} catch (error) {
		logger.error(controllerfilename, "Catch-index ", error)
		res.status("500").send({
			status: "failed",
			message: "We broke something"
		})
	}
}

exports.addSection = (req, res) => {
	try {
		let pagetype = "Add Section";
		res.render("homepage/section-add-edit", { pagetype,result:{} });
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
				attributes: ["id", "section_id", "title", "body", "sec_background", "order_number", "status", "created_at"],
				primary: "id",
				page: wquery.page,
				limit: limit,
				orderby: "id",
				order: "asc",
				templatePath: "./views/homepage/table.pug",
			}

		let data = await paginate_data(request, HomePagepageModel);
		res.send(data)
	} catch (e) {
		logger.error(controllerfilename, "paginate ", e)
		res.status(500).json({ error: "Internal Error on our side. Sorry for the inconvience" })
	}
}

exports.fetch = async (req, res) => {
	try {
		const id = req.params.id;
		let pagetype = "Edit Page";
		let result = await HomePagepageModel.findByPk(id);
		if (result) {
			res.render("homepage/section-add-edit", { result, pagetype });
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
				section_id: create_clean_string(request.section_id),
				title: request.title,
				body: request.body,
				sec_background: request.sec_background || '#ffffff',
				order_number : request.order_number,
				status: 1
			},
			id = request.id;
			
		let slugStatus = await if_section_id_exist(request, 'id');
		if (slugStatus.response) {
			res.status(500).json({ error: slugStatus.message })
		} else {
			let message = "",
				optype = "";
			if (id === "" || id === undefined) {
				message = "Section has been successfully created.";
				optype = "add";
				await HomePagepageModel.create(params)
			} else {
				message = "Section has been successfully Updated.";
				optype = "update";
				await HomePagepageModel.update(params, { where: { id: id } })
			}
			res.json({ status: true, message: message, type: optype })
		}
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
		let id = req.body.id;
		await HomePagepageModel.update({ status: '0' }, { where: { id: id } })
		res.json({ status: "success" })
	} catch (tryerr) {
		logger.error(controllerfilename, "Delete tryerror ", tryerr)
		res.status(500).json({ status: "failed", message: tryerr })
	}
}

