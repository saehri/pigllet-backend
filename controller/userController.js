const pwtl = require('../lib/passwordUtils');

const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

// ------------------- CREATE FUNCTIONS
async function createUser(req, res) {
  try {
    const data = req.body;

    const createdAt = new Date().toISOString();

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
