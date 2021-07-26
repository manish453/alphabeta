"use strict"

const conf = require("../config/configuration"),
	bluebird = require("bluebird"),
	fs = bluebird.promisifyAll(require("fs")),
	logpath = conf.dirpath + "log/"

const printconsole = (content, type = "INFO::") => {
	console.log(type + " in " + content.source)
	console.log(content.msg)
	console.log()
}

const appendlog = (file, cause, msg) => {
	try {
		let filename = logpath + file.toLowerCase() + ".log",
			date = new Date(),
			write = date.toDateString() + " " + date.toLocaleTimeString() + ": " + "Source - " + cause + " - " + msg + "\n";

		fs.appendFileSync(filename, write, function (err) { throw err })
	} catch (err) {
		let log = {
			"source": "Action : Writing log file",
			"msg": err
		}
		printconsole(log, "ERROR::")
	}
}

exports.plain = (file, cause, msg) => {
	if (conf.environment == "development") {
		let log = {
			"source": file + " :: Action : " + cause,
			"msg": msg
		}
		printconsole(log)
	} else {
		appendlog(file, cause, msg, "plain")
	}
}

exports.error = (file, cause, msg) => {
	let log = {
		"source": file + " :: caused : " + cause,
		"msg": msg
	}
	printconsole(log, "ERROR::")
	file = "error-" + file
	appendlog(file, cause, msg, "error");
}
