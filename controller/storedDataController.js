const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

async function storeData(req, res) {
  try {
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

module.exports = {storeData};
