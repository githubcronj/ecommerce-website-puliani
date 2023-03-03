var nodemailer = require('nodemailer');
var config = require("../config/environment")

var transporter = nodemailer.createTransport(config.mail.smtpConfig);

export function sendMail(from, to, subject, text, html,attachments) {

	var mailOptions = createMailBody(from, to, subject, text, html,attachments);

	return transporter.sendMail(mailOptions);
}

function createMailBody(from, to, subject, text, html,attachments) {
     console.log('attachments---'+attachments);
	var mailOptions = {
		from: from,
		to: to,
		subject: subject,
		text: text,
		html: html,
		attachments:attachments
	};
	return mailOptions;
}