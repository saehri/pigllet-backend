function userDTO(data) {
	return ({
		id: data.id,
		username: data.username,
		email: data.email,
		is_subscribed: data.is_subscribed,
		job: data.job,
		country: data.country,
		avatar: data.avatar,
		role: data.role,
		birthday: data.birthday,
		created_at: data.created_at,
		updated_at: data.updated_at,
	})
}

module.exports = userDTO