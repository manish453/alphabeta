"use strict"
const bluebird = require("bluebird"),
	pbkdf2 = require("pbkdf2"),
	randomstring = require("randomstring")

exports.create_random_string = (strlength = 10) => {
	return randomstring.generate({ length: strlength, charset: "alphanumeric" })
}

exports.createHexHash = async string => {
	return new bluebird((resolve, reject) => {
		try {
			const salt = this.create_random_string(),
				hexHash = pbkdf2.pbkdf2Sync(string, salt, 1000, 15, "sha512").toString("hex")
			let data = {
				salt: salt,
				hash: hexHash
			}
			console.log(data)
			resolve(data)
		} catch (err) {
			reject(err)
		}
	})
}

exports.matchhash = async ({ salt, hash }, string) => {
	return new bluebird(async (resolve, reject) => {
		try {
			const passwordEncrypted = pbkdf2.pbkdf2Sync(string, salt, 1000, 15, "sha512")
			if (passwordEncrypted.toString("hex") === hash) resolve(true)
			else resolve(false)
		} catch (err) {
			reject(err)
		}
	})
}