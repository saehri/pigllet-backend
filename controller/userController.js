const pwtl = require('../lib/passwordUtils');

const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

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

// ------------------- CREATE FUNCTIONS
async function createUser(req, res) {
  try {
    const data = req.body;

    const createdAt = new Date().toISOString();

    if (!REGEX.password.test(data.password)) {
      return res.status(500).json({
        message:
          'Password is invalid. Make sure your password match the specified rule!',
      });
    }

    if (!REGEX.username.test(data.username)) {
      return res.status(500).json({
        message:
          'Username is invalid. Make sure your username match the specified rule!',
      });
    }

    if (!REGEX.email.test(data.username)) {
      return res.status(500).json({
        message:
          'Email is invalid. Make sure your email match the specified rule!',
      });
    }

    // hash the user password, store the result in passwordHashed and set password to empty string
    const passwordHashed = await pwtl.hash(data.password);
    data.passwordHashed = passwordHashed;
    data.password = '';

    const user = await prisma.user.create({
      data: {...data, createdAt},
    });

    res.json({message: 'Successfully created the user', data: user});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

// ----------------------- AUTHENTICATIONS
async function authenticate(req, res) {
  try {
    const {username, password} = req.body;

    // find the user with username
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        storage: true,
      },
    });

    if (user !== null) {
      if (user.emailVerified == 0) {
        // we use 0 because the databse only support 0 and 1 to represent boolean value
        return res.json({
          message:
            'Please verify your email address by following the link we sent to your email address',
        });
      }

      // check if the password is match
      const isPasswordMatch = await pwtl.compare(password, user.passwordHashed);
      if (isPasswordMatch)
        return res.json({message: 'Authentication successfull', data: user});

      throw new Error('Failed to log in: Password does not match!');
    } else {
      return res
        .status(404)
        .json({message: 'There are no user with that username!'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

// ---------------- GET FUNCTIONS
async function getAllUser(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.json({message: '', data: users});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

async function getUserById(req, res) {
  try {
    const {userId} = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (user == null) {
      return res
        .status(404)
        .json({message: `There are no user with id ${userId}`});
    }

    res.json({message: `Found a user with id ${userId}`, data: user});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

async function getUserByUsername(req, res) {
  try {
    const {username} = req.params;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user == null) {
      return res
        .status(404)
        .json({message: `There are no user with username ${username}`});
    }

    res.json({message: `Found a user with username ${username}`, data: user});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

// ------------------- DELETE FUNCTIONS
async function deleteUserById(req, res) {
  try {
    const {userId} = req.params;

    const user = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });

    res.json({message: 'Successfully deleted user from database'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

// ----------------------- PUT FUNCTIONS
async function editUserData(req, res) {
  try {
    const {userId} = req.params;
    const data = req.body;

    if (!REGEX.password.test(data.password)) {
      return res.status(500).json({
        message:
          'Password is invalid. Make sure your password match the specified rule!',
      });
    }

    if (!REGEX.username.test(data.username)) {
      return res.status(500).json({
        message:
          'Username is invalid. Make sure your username match the specified rule!',
      });
    }

    if (!REGEX.email.test(data.username)) {
      return res.status(500).json({
        message:
          'Email is invalid. Make sure your email match the specified rule!',
      });
    }

    let message = null;
    const exclusionLists = ['password'];
    for (const key in data) {
      if (exclusionLists.includes(key)) {
        const passwordHashed = await pwtl.hash(data.password);
        data.passwordHashed = passwordHashed;
        data.password = '';
        message = 'Your password is updated successfully!';
      }
    }

    const user = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    });

    res.json({
      message: message ? message : 'Your data is updated successfully!',
      data: user,
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
