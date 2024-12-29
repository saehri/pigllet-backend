const supabase = require('../lib/supabaseClient');
const pwtl = require('../lib/passwordUtils');
const validateUserData = require('../lib/userDataValidator');
const userDTO = require('../dto/userDTO')

// ------------------- CREATE FUNCTIONS
async function createUser(req, res) {
	try {
		const userData = req.body;
		
		const isDataValid = validateUserData(userData);
		if(isDataValid.valid === false) {
			return res.status(500).json({message: isDataValid.message});
		}


		// hash the user password, store the result in hashed_password and set password to empty string
		const hashedPassword = await pwtl.hash(userData.password);
		userData.hashed_password = hashedPassword;
		userData.password = '';

		const {data, error} = await supabase.from('users').insert(userData).select().single();

		if(error) throw new Error(error.details)

		// TODO: - return user backup-ed data to the client

		res.json({message: 'Successfully created the user', data: userDTO(data)});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

// ----------------------- AUTHENTICATIONS
async function authenticate(req, res) {
	try {
		const {username, password} = req.body;

		// find the user with username
		const {data, error} = await supabase.from('users').select().eq('username', username).single()

		if (error) throw new Error(error.details)
		
		if (!data.is_active) return res.json({message: 'Please verify your email adress by  the link we sent to your email adress'})
		
		const isPasswordMatch = await pwtl.compare(password, data.hashed_password);
		
		if (isPasswordMatch) {
			return res.json({message: 'Authentication successfull', data});
		} else throw new Error('Failed to log in: Password does not match!');

	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

// ---------------- GET FUNCTIONS
async function getAllUser(_, res) {
	try {
		const {data} = await supabase.from('users').select()

		res.json({message: '', data: data.map(user => userDTO(user))});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

async function getUserById(req, res) {
	try {
		const {user_id} = req.params;

		const {data, error} = await supabase.from('users').select().eq('id', user_id).single()

		if(error) throw new Error(error.details);
		res.json({message: `Found a user with id ${user_id}`, data: userDTO(data)});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

async function getUserByUsername(req, res) {
	try {
		const {username} = req.params;

		const {data, error} = await supabase.from('users').select().eq('username', username).single()

		if(error) throw new Error(error.details)
		res.json({message: `Found a user with username ${username}`, data: userDTO(data)});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

// ------------------- DELETE FUNCTIONS
async function deleteUserById(req, res) {
	try {
		const {user_id} = req.params;

		const {error} = await supabase.from('users').delete().eq('id', user_id)

		if(error) throw new Error(error.details)
		return res.json({message: 'Successfully deleted user from database'});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

// ----------------------- PUT FUNCTIONS

async function editUserData(req, res) {
	try {
		const {user_id} = req.params;
		const userData = req.body;

		// check whether the data to be updated is match the schema
		const isDataValid = validateUserData(userData);
		
		if(isDataValid.valid === false) {
			return res.status(500).json({message: isDataValid.message});
		}

		/* 
		- if the password is provided, hash the password and store the result in passwordHashed
		- set the password to empty string
		*/
		if(userData.password) {
			const hashedPassword = await pwtl.hash(userData.password);
			userData.passwordHashed = hashedPassword;
			userData.password = '';
		}

		const {data, error} = await supabase.from('users').update({...userData, updated_at: new Date().toISOString()}).eq('id', user_id).select().single()

		if(error) throw new Error(error.details);

		res.json({
			message: 'Your data is updated successfully!',
			data
		});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

module.exports = {
	getAllUser,
	getUserById,
	createUser,
	getUserByUsername,
	authenticate,
	deleteUserById,
	editUserData,
};
