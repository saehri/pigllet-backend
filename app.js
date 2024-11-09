const express = require('express');
const {PrismaClient} = require('@prisma/client');

// routers
const userRouters = require('./routes/usersRoutes');
const emailRouters = require('./routes/emailRoute');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api', userRouters);
app.use('/api', emailRouters);

app.get('/', async (req, res) => {
  res.json({message: 'Hello world!'});
});

app.listen(PORT, () => {
  console.log(`Server is runningin port ${PORT}`);
});
