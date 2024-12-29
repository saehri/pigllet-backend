const supabase = require('../lib/supabaseClient');

async function verifyCode(req, res) {
	try {
		const {code} = req.body

		const {data, error} = await supabase.from('user_reset_password_ticket').select().eq('code', code).single()

		// add a function that make the verification link invalid (and removed) if its older than 5 minutes after its creations
		const verificationLinkCreationDate = new Date(data.created_at);
		const differenceInMs = verificationLinkCreationDate - new Date();

		// Convert the diff (originally ms) to minutes
		const differenceInMinutes = Math.abs(differenceInMs) / (1000 * 60);
		if (differenceInMinutes > 5) {
			await supabase.from('user_reset_password_ticket').delete().eq('user_id', data.user_id)
			
			res.json({
				message: 'Your code link is invalid, please create a new one',
				success: false
			});
		}
		
		if(error) throw new Error(error.details)
			
		if(data.code === code) {
			await supabase.from('user_reset_password_ticket').delete().eq('user_id', data.user_id)
			res.json({message: 'Password reset code is valid!', success: true})
		} 
		res.json({message: 'Password reset code is invalid!', success: false})
	} catch (error) {
		res.status(500).json({message: error.message})
	}
}

module.exports = {verifyCode}