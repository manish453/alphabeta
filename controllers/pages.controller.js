"use strict"
const logger = require("../utils/logger.util"),
	bluebird = require("bluebird"),
	PagesModel = Sqlmodels.pages,
	Op = Sqlmodels.Sequelize.Op;
const { paginate_data } = require("../utils/pug.util");
const { create_clean_string } = require("../utils/utilities")


const controllerfilename = "pages-controller";
const limit = 10;

const if_slug_exist = async (request, primary) => {
	return new bluebird(async (resolve, reject) => {
		try {
			let where = { slug: request.slug }
			if (request.page_id) {
				where[primary] = { [Op.ne]: request.page_id }
			}
			let response = await PagesModel.findOne({
				where: where,
				attributes: ["slug"]
			})
			if (response) resolve({ response: true, message: "We already have this Slug(URL)!!" })
			else resolve({ response: false })

		} catch (err) {
			reject({ message: err.message })
		}
	});
}

exports.view = (req, res) => {
	try {
		res.render("pages/");
	} catch (error) {
		logger.error(controllerfilename, "Catch-index ", error)
		res.status("500").send({
			status: "failed",
			message: "We broke something"
		})
	}
}

exports.addPage = (req, res) => {
	try {
		let pagetype = "Add Page";
		res.render("pages/page-add-edit", { pagetype,result:{} });
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
				attributes: ["page_id", "slug", "title", "description", "keyword", "other_meta", "ptitle", "body", "status", "createdAt"],
				primary: "page_id",
				page: wquery.page,
				limit: limit,
				orderby: "page_id",
				order: "desc",
				templatePath: "./views/pages/table.pug",
			}

		let data = await paginate_data(request, PagesModel);
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
		let result = await PagesModel.findByPk(id);
		if (result) {
			res.render("pages/page-add-edit", { result, pagetype });
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
				ptitle: request.ptitle,
				slug: create_clean_string(request.slug),
				title: request.title,
				description: request.description,
				keyword: request.keyword,
				other_meta: request.other_meta,
				body: request.body,
				status: '1'
			},
			id = request.page_id;
			
		let slugStatus = await if_slug_exist(request, 'page_id');
		if (slugStatus.response) {
			res.status(500).json({ error: slugStatus.message })
		} else {
			let message = "",
				optype = "";
			if (id === "" || id === undefined) {
				message = "Page has been successfully created.";
				optype = "add";
				await PagesModel.create(params)
			} else {
				message = "Page has been successfully Updated.";
				optype = "update";
				await PagesModel.update(params, { where: { page_id: id } })
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
		let id = req.body.page_id;
		await PagesModel.update({ status: '0' }, { where: { page_id: id } })
		res.json({ status: "success" })
	} catch (tryerr) {
		logger.error(controllerfilename, "Delete tryerror ", tryerr)
		res.status(500).json({ status: "failed", message: tryerr })
	}
}

