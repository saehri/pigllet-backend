const {PrismaClient} = require('@prisma/client');
const emailtl = require('../lib/emailUtil');
const genStr = require('../lib/generateRandomString');

const prisma = new PrismaClient();

async function getAllvLinks(req, res) {
  try {
    const vLinks = await prisma.emailVerification.findMany();

    res.json({message: '', data: vLinks});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

async function sendUserVerificationEmail(req, res) {
  try {
    const {userId, email} = req.params;
    const verifId = genStr(20);

    // verification_link consist of url +
    const vLink = await prisma.emailVerification.create({
      data: {
        userId: Number(userId),
        verificationId: verifId,
        createdAt: new Date().toISOString(),
      },
    });

    // send email verification to user
    await emailtl.sendEmailAdressVerificationEmail(
      email,
      `api/email/verif/${verifId.trim()}`
    );

    res.json({
      message: 'Email address verification link created successfully',
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

async function verifyUserEmail(req, res) {
  try {
    const {verifId} = req.params;

    const vLink = await prisma.emailVerification.findFirst({
      where: {
        verificationId: verifId,
      },
    });

    const user = await prisma.user.update({
      where: {
        id: vLink.userId,
      },
      data: {
        emailVerified: 1,
      },
    });

    await prisma.emailVerification.delete({
      where: {
        id: vLink.id,
      },
    });

    res.json({message: 'Email verified successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

module.exports = {
  sendUserVerificationEmail,
  verifyUserEmail,
  getAllvLinks,
};
