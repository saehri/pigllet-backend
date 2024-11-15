const express = require('express');

// routers
const userRouters = require('./routes/usersRoutes');
const emailRouters = require('./routes/emailRoutes');
const storageRoutes = require('./routes/storageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api', userRouters);
app.use('/api', emailRouters);
app.use('/api', storageRoutes);

app.get('/', async (req, res) => {
  res.json({message: 'Hello world!'});
});

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
