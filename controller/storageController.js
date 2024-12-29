const supabase = require('../lib/supabaseClient');

async function getUserData(req, res) {
	try {
		const {userId} = req.params;
		const data = await prisma.storage.findUnique({
			where: {
				userId: Number(userId),
			},
			include: {user: true},
		});

		if (!data) {
			return res.status(404).json({message: 'No stored data was found'});
		}

		res.json({message: '', data});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

async function getData(req, res) {
	try {
		const data = await prisma.storage.findMany();

		res.json({message: '', data});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

async function storeData(req, res) {
	try {
		const {data, userId} = req.body;

		const storage = await prisma.storage.create({
			data: {
				data: data,
				userId,
				createdAt: new Date().toISOString(),
			},
		});

		res.json({message: 'Successfully stored your data', data: storage});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

async function updateStorage(req, res) {
	try {
		const {userId} = req.params;
		const data = req.body;

		const storage = await prisma.storage.update({
			where: {userId: Number(userId)},
			data: {
				...data,
				updatedAt: new Date().toISOString(),
			},
		});

		res.json({message: 'Storage updated', data: {...storage}});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

async function deleteStorage(req, res) {
	try {
		const {userId} = req.params;
		await prisma.storage.delete({
			where: {
				userId: Number(userId),
			},
		});

		res.json({message: 'Storage removed successfully'});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

module.exports = {
	storeData,
	getData,
	getUserData,
	updateStorage,
	deleteStorage,
};
