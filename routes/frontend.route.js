"use strict"

const express = require("express"),
	router = express.Router(),
	controller = require("../controllers/frontend.controller")

/* frontend Routing */
router.get('/', controller.index)
router.post('/contact-form', controller.contactForm)
router.get('/:id', controller.pages)

module.exports = router