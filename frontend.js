"use strict"

//Basic Requires
const rootdir = `${__dirname}/`
require('dotenv-safe').config({
	path: rootdir + "myenv/.env",
	example: rootdir + ".env.example"
})

const express = require("express"),
	path = require("path"),
	compression = require("compression");

global.Sqlmodels = require("./models/index");
// Route and Config Require
const logger = require("./utils/logger.util"),
	{fileversion, fport} = require("./config/configuration"),
	routes = require("./routes/frontend.route");

let app = express();
app.use(compression())
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"), { maxAge: '30 days' }));
app.use(express.static(path.join(__dirname, "uploads/images/"), { maxAge: '30 days' }));
app.use("/favicon.ico", express.static(path.join(__dirname, "favicon.ico")));

app.use(function (req, res, next) {
	res.setHeader("Surrogate-Control", "no-store");
	res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
	res.setHeader("Pragma", "no-cache")
	res.setHeader("Expires", "0")
	let render = res.render
	res.render = function (view, locals, cb) {
		locals = locals || {};
		locals.version = fileversion;
		render.call(res, view, locals, cb);
	}
	next();
});

// Add Routes
app.use("/", routes);

// Fallback Page (404)
app.use(function (req, res, next) {
	let err = {
		status: 404,
		msg: "Page not found"
	};
	next(err)
})

// error handler
app.use(function (err, req, res, next) {
	let msg = err.msg ? err.msg : "";
	let scode = err.status ? parseInt(err.status) : 500;
	if (err.constructor == Object) err = JSON.stringify(err);
	logger.error("500-400", "Request", req.url + " :: " + err);
	res.status(scode).render("common/error", { status: err.status, msg: msg });
})

// Set Port for Express
app.set("port", fport)
app.listen(app.get("port"), function () {
	logger.plain("app-frontend", "frontend", "Frontend started on port " + app.get("port"))
})
