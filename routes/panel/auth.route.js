"use strict"

const express = require("express"),
	router = express.Router(),
	controller = require("../../controllers/login.controller")

/* Login Routing */
router.route('/')
	.get(controller.view)
	.post(controller.login)

router.post("/logout", controller.logout)
router.post("/forget", controller.forget)
module.exports = router