const supabase = require('../lib/supabaseClient');
const emailtl = require('../lib/emailUtil');
const genStr = require('../lib/generateRandomString');

// @func get all entries of verification link
async function getAllvLinks(req, res) {
	try {
		const vLinks = await prisma.emailVerification.findMany();

		res.json({message: '', data: vLinks});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

// @func - void send the user verification link
async function sendUserVerificationEmail(req, res) {
	try {
		const {userId, email} = req.params;
		const verifId = genStr(35);

		// create the verification link
		await prisma.emailVerification.create({
			data: {
				userId: Number(userId),
				verificationId: verifId,
				createdAt: new Date().toISOString(),
			},
		});

		// send email verification to user
		await emailtl.sendEmailAdressVerificationEmail(
			email,
			`api/email/verif/${verifId.trim()}`
		);

		res.json({
			message: 'Email address verification link created successfully',
		});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

// @func void - handle the process of email address verification and verification link removal
async function verifyUserEmail(req, res) {
	try {
		const {verifId} = req.params;

		const vLink = await prisma.emailVerification.findFirst({
			where: {
				verificationId: verifId,
			},
		});

		if (vLink === null) {
			return res.status(404).json({message: 'Invalid email verification link'});
		}

		// add a function that make the verification link invalid (and removed) if its older than 5 minutes after its creations
		const date = new Date(vLink.createdAt);
		const differenceInMs = date - new Date();

		const differenceInMinutes = Math.abs(differenceInMs) / (1000 * 60);
		if (differenceInMinutes > 5) {
			// remove all verification link of the user
			await prisma.emailVerification.deleteMany({
				where: {
					userId: vLink.userId,
				},
			});

			return res.json({
				message: 'Your verification link is invalid, please create a new one',
			});
		}

		// update he user email status to verified
		const user = await prisma.user.update({
			where: {
				id: vLink.userId,
			},
			data: {
				emailVerified: 1,
			},
		});

		// remove all verification link for the user
		await prisma.emailVerification.deleteMany({
			where: {
				userId: vLink.userId,
			},
		});

		res.json({message: 'Email verified successfully'});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

module.exports = {
	sendUserVerificationEmail,
	verifyUserEmail,
	getAllvLinks,
};
