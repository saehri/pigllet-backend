const supabase = require('../lib/supabaseClient');
const emailUtil = require('../lib/emailUtil');
const genStr = require('../lib/generateRandomString');

// @func get all entries of verification link
async function getAllvLinks(req, res) {
	try {
		const {data, error} = await supabase.from('user_otv_link').select();

		if(error) throw new Error(error.message)
		res.json({message: '', data});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

// @func - void send the user verification link
async function sendUserVerificationEmail(req, res) {
	try {
		const {user_id, email} = req.params;
		const token = genStr(35, false);

		// create the verification link
		const {error} = await supabase.from('user_otv_link').insert({
			user_id: Number(user_id),
			token: token,
		})

		if(error) throw new Error(error.details)
		
		// send email verification to user
		await emailUtil.sendEmailAddressVerificationLink(
			email,
			`api/email/verif/${token.trim()}`
		);

		res.json({
			message: 'Email address verification link created and sent successfully',
		});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

async function sendPasswordResetTokenEmail(req, res) {
	try {
		const {user_id, email} = req.params;
		const code = genStr(6, true);

		// create the verification link
		const {error} = await supabase.from('user_reset_password_ticket').insert({
			user_id: Number(user_id),
			code,
		})

		if(error) throw new Error(error.details)
		
		// send email verification to user
		await emailUtil.sendPasswordResetCode(email,code);

		res.json({
			message: 'Password reset code successfully sent to your email!',
		});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

// @func void - handle the process of email address verification and verification link removal
async function verifyUserEmail(req, res) {
	try {
		const {token} = req.params;

		const {data, error} = await supabase.from('user_otv_link').select().eq('token', token).single()
		if(error) throw new Error(error.message)

		// add a function that make the verification link invalid (and removed) if its older than 5 minutes after its creations
		const verificationLinkCreationDate = new Date(data.created_at);
		const differenceInMs = verificationLinkCreationDate - new Date();

		// Convert the diff (originally ms) to minutes
		const differenceInMinutes = Math.abs(differenceInMs) / (1000 * 60);
		if (differenceInMinutes > 5) {
			await supabase.from('user_otv_link').delete().eq('user_id', data.user_id)

			res.json({
				message: 'Your verification link is invalid, please create a new one',
				success: false
			});
		}

		// update he user email status to verified
		await supabase.from('users').update({is_active: true}).eq('id', data.user_id)
		await supabase.from('user_otv_link').delete().eq('user_id', data.user_id)

		res.json({message: 'Email verified successfully', success: true});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

module.exports = {
	sendUserVerificationEmail,
	verifyUserEmail,
	getAllvLinks,
	sendPasswordResetTokenEmail
};
