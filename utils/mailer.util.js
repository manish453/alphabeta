"Use Strict"
const nodemailer = require("nodemailer"),
	FROMNAME = "Alpha Beta solutions",
	conf = require("../config/configuration"),
	_pug = require('pug')

const pugcompile = (relativeTemplatePath, data, next) => {
	let absoluteTemplatePath = process.cwd() + '/views/' + relativeTemplatePath + '.pug';
	_pug.renderFile(absoluteTemplatePath, data, function (err, compiledTemplate) {
		if (err) {
			console.log(err)
			throw new Error('Problem compiling template(double check relative template path): ' + absoluteTemplatePath);
		}
		next(null, compiledTemplate);
	});

};

const sendingEmail = (mailbox, cc) => {
	if (conf.environment === "production") {
		let smtpTransport = global.sendTransport
		const EMAIL_ACCOUNT_USER = process.env.EMAIL_ACCOUNT_USER
		const EMAIL_ACCOUNT_PASSWORD = process.env.EMAIL_ACCOUNT_PASSWORD
		if (!global.sendTransport) {
			const smtpuri = "smtps://" + encodeURIComponent(EMAIL_ACCOUNT_USER) + ":" + encodeURIComponent(EMAIL_ACCOUNT_PASSWORD) + "@smtp.gmail.com:465";
			smtpTransport = global.sendTransport = nodemailer.createTransport(smtpuri)
		}


		var mailOptions = {
			from: FROMNAME + " < " + EMAIL_ACCOUNT_USER + ">",
			to: mailbox.to,
			subject: mailbox.subject,
			html: mailbox.content
		}

		if (mailbox.fromname) {
			mailOptions.from = mailbox.fromname + " < " + EMAIL_ACCOUNT_USER + ">";
		}

		if (mailbox.ccemail) {
			mailOptions.cc = mailbox.ccemail
		}
		smtpTransport.sendMail(mailOptions, function (error, response) {
			if (error) {
				console.log("[ERROR] Message NOT sent: to::" + mailOptions.to, error)
				success = false
			} else {
				console.log("[INFO] Message Sent: " + mailOptions.from + " - " + mailOptions.to + " - " + response.response)
			}
		})
	} else {
		console.log(mailbox)
	}
}

exports.sendTemplateMail = function (options, template) {
	pugcompile(template, options.info, function (err, html) {
		if (err) {
			throw new Error('Problem compiling template(double check relative path): ' + template);
		}
		try {
			let mailbox = {
				to: options.to,
				subject: options.subject,
				content: html,
				fromname: options.fromname || FROMNAME
			}
			//console.log(mailbox);
			
			sendingEmail(mailbox, options.cc);
		} catch (err) {
			console.log(err + ' : Problem sending email to: ' + options.to);
		}
	});
};

exports.sendMail = (mailbox, cc = true, next) => {
	sendingEmail(mailbox, cc);
}
