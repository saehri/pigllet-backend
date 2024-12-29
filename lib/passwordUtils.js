const bcrypt = require('bcrypt');

async function hash(password) {
	const saltRound = 10;
	const passwordHashed = await bcrypt.hash(password, saltRound);

	return passwordHashed;
}

async function compare(password, passwordHashed) {
	const isMatch = await bcrypt.compare(password, passwordHashed);
	return isMatch;
}

module.exports = {hash, compare};
