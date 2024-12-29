const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function scanReceipt(req, res) {
	try {
		// Check if a file was uploaded
		if (!req.file) {
			return res.status(400).json({error: 'No file uploaded'});
		}

		// Set up form data
		const formData = new FormData();
		formData.append('file', req.file.buffer, req.file.originalname);
		formData.append('providers', 'microsoft');
		formData.append('language', 'pt');

		// Make API request to Eden AI
		const response = await axios.post(
			process.env.EDEN_AI_API_URL,
			formData,
			{
				headers: {
					Authorization: `Bearer ${process.env.EDEN_AI_API_KEY}`,
					...formData.getHeaders(),
				},
			}
		);

		res.json({message: '', data: response.data});
	} catch (error) {
		console.error(
			'Error parsing receipt:',
			error.response?.data || error.message
		);
		res.status(500).json({message: 'Failed to parse receipt'});
	}
}

async function getScannedResult(req, res) {
	try {
		const {executionId} = req.params;

		// Make API request to retrieve the result only after getting executionId
		const response = await axios.get(
			`${process.env.EDEN_AI_API_URL}${executionId}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.EDEN_AI_API_KEY}`,
				},
			}
		);

		res.json({message: '', data: response.data});
	} catch (error) {
		res.status(500).json({message: error.message});
	}
}

module.exports = {scanReceipt, getScannedResult};
