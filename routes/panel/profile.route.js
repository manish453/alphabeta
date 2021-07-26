"use strict"

const express = require("express"),
	router = express.Router(),
	controller = require("../../controllers/profile.controller"),
	{ sessioncheck } = require("../../middleware/session.check")

/* Login Routing */
router.get('/', sessioncheck, controller.view)
router.post('/updatepassword', sessioncheck, controller.updatepassword)

module.exports = router