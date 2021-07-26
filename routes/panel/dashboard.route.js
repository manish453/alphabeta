"use strict"

const express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/dashboard.controller"),
    { sessioncheck } = require("../../middleware/session.check")

/* Login Routing */
router.get('/', sessioncheck, controller.index)

module.exports = router