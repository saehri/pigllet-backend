const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Create the transporter
const transporter = nodemailer.createTransport({
	service: 'gmail', // Change to your email service provider if not Gmail
	auth: {
		user: process.env.SYSTEM_EMAIL, // Your email
		pass: process.env.SYSTEM_EMAIL_PASSWORD, // Your email password or app password (for Gmail, generate an app password)
	},
});

async function sendEmailAddressVerificationLink(
	recipientEmail,
	verificationLink
) {
	// Read the HTML email template
	const emailTemplate = fs.readFileSync(
		path.join(__dirname, '../view/email-template/verify-email.html'),
		'utf-8'
	);

	const emailBody = emailTemplate.replace(
		'{{verificationLink}}',
		verificationLink
	);

	const mailOptions = {
		from: {
			name: 'Pigllet - The Ultimate Expense Tracker',
			address: process.env.SYSTEM_EMAIL,
		}, // Sender's email address
		to: recipientEmail, // Recipient's email address
		subject: 'Welcome to Our Service - Please Verify Your Email', // Subject line
		html: emailBody,
	};

	await transporter.sendMail(mailOptions);
}

async function sendPasswordResetCode(recipientEmail, resetCode) {
	// Read the HTML email template
	const emailTemplate = fs.readFileSync(
		path.join(__dirname, '../view/email-template/reset-password.html'),
		'utf-8'
	);

	const emailBody = emailTemplate.replace(
		'{{code}}',
		resetCode
	);

	const mailOptions = {
		from: {
			name: 'Pigllet - The Ultimate Expense Tracker',
			address: process.env.SYSTEM_EMAIL,
		}, // Sender's email address
		to: recipientEmail, // Recipient's email address
		subject: 'Reset your password', // Subject line
		html: emailBody,
	};

	await transporter.sendMail(mailOptions);
}

module.exports = {sendEmailAddressVerificationLink, sendPasswordResetCode};
