const REGEX = {
	password:
		/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	username: /^(?=.{3,16}$)[a-zA-Z0-9](?:[a-zA-Z0-9-_]*[a-zA-Z0-9])?$/,
};

/* 
A valid **password** must be at least 6 characters long, contain at least one uppercase letter, and include at least one special character (such as `!`, `@`, `#`, `$`, etc.). This ensures the password is sufficiently strong and secure.

A valid **email address** must follow the standard format, starting with a series of characters (excluding spaces and `@`), followed by the `@` symbol, a domain name, and a period (`.`) before the domain extension (e.g., `.com`, `.net`). This ensures proper email syntax.

A valid **username** should be between 3 and 16 characters long and can only include letters, numbers, underscores (`_`), and hyphens (`-`). It cannot contain spaces or other special characters and must not start or end with a hyphen or underscore. This provides flexibility while maintaining a consistent and valid format.

*/

function validateUserData(userData) {
    if(userData.password) {
        if (!REGEX.password.test(password)) {
            return {
                valid: false,
                message:
                'Password is invalid. Make sure your password matches the specified rule!',
            };
        }
    }

    if(userData.username) {
        if (!REGEX.username.test(username)) {
            return {
                valid: false,
                message:
                'Username is invalid. Make sure your username matches the specified rule!',
            };
        }
    }

    if(userData.email) {
        if (!REGEX.email.test(email)) {
            return {
                valid: false,
                message:
                'Email is invalid. Make sure your email matches the specified rule!',
            };
        }
    }

    return {valid: true, message: 'User data is valid'};
}

module.exports = validateUserData