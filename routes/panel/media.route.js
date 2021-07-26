"use strict"

const express = require("express"),
	router = express.Router(),
	controller = require("../../controllers/media.controller"),
	{ sessioncheck } = require("../../middleware/session.check")

/* Login Routing */
router.get('/', sessioncheck, controller.view)
router.post('/uploadimage', sessioncheck, controller.uploadimage)
router.get('/paginate', sessioncheck, controller.paginate)
router.post('/delete', sessioncheck, controller.delete)

module.exports = router