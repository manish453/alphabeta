"use strict"

const express = require("express"),
	router = express.Router(),
	controller = require("../../controllers/menus.controller"),
	{ sessioncheck } = require("../../middleware/session.check")

/* Login Routing */
router.get('/', sessioncheck, controller.view)
router.get('/paginate', sessioncheck, controller.paginate)
router.get('/fetch/:id', sessioncheck, controller.fetch)
router.post('/save', sessioncheck, controller.save)
router.post('/delete', sessioncheck, controller.delete)

module.exports = router