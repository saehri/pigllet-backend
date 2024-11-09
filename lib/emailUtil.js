const nodemailer = require('nodemailer');

// Create the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Change to your email service provider if not Gmail
  auth: {
    user: process.env.SYSTEM_EMAIL, // Your email
    pass: process.env.SYSTEM_EMAIL_PASSWORD, // Your email password or app password (for Gmail, generate an app password)
  },
});

async function sendEmailAdressVerificationEmail(email, verificationLink) {
  const mailOptions = {
    from: process.env.SYSTEM_EMAIL, // Sender's email address
    to: email, // Recipient's email address
    subject: 'Welcome to Our Service - Please Verify Your Email', // Subject line
    text: `
			Hi there,
		
			Thank you for signing up! Please verify your email address by clicking the link below.
		
			${verificationLink}
		
			If you didn’t sign up for this account, you can safely ignore this email.
		
			Best regards,
			Pigllet : The Ultimate Expense Tracker App
		  `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {sendEmailAdressVerificationEmail};
