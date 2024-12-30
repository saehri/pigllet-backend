const supabase = require('../lib/supabaseClient.js')

// @func - create user subscriptions backup
async function createBackup(req, res) {
	try {
		const payload = req.body

		const {data, error} = await supabase.from('users_subscriptions').insert(payload).select().single()

		if(error) throw new Error(error.details)

		res.json({message: 'Successfully created backup for your subscriptions!', success: true, data})
	} catch (error) {
		res.status(500).json({message: error.message})
	}
}

// @func - get all subscriptions
async function getAllBackup(req, res) {
	try {
		const {data, error} = await supabase.from('users_subscriptions').select()

		if(error) throw new Error(error.details)
		res.json({message: '', success: true, data})
	} catch (error) {
		res.status(500).json({message: error.message})
	}
}

async function getBackup(req, res) {
	try {
		const {user_id} = req.params
		const {data, error} = await supabase.from('users_subscriptions').select().eq('user_id', user_id)

		if(error) throw new Error(error.message)
		res.json({message: '', success: true, data})
	} catch (error) {
		res.status(500).json({message: error.message})
	}
}

// @func - delete subsciptions
async function deleteBackup(req, res) {
	try {
		const {backup_id} = req.params
		const {error} = await supabase.from('users_subscriptions').select().eq('id', backup_id)

		if(error) throw new Error(error.message)
		res.json({message: 'Subscription successfully deleted!', success: true})
	} catch (error) {
		res.status(500).json({message: error.message})
	}
}

// @func - update backup
async function updateBackup(req, res) {
	try {
		const {backup_id} = req.params
		const payload = req.body
		const {data, error} = await supabase.from('users_subscriptions').update(payload).eq('id', backup_id).select().single()

		if(error) throw new Error(error.details)
		res.json({message: "Backup successfully updated!", success: true, data})
	} catch (error) {
		res.status(500).json({message: error.message})
	}
}

module.exports = {
	createBackup,
	getAllBackup,
	getBackup,
	deleteBackup,
	updateBackup
}