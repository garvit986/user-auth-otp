const express = require('express');
const app = express();
const sequelize = require('./config/dbConfig');
const User = require('./models/userSchema')
const userRoutes = require('./routes/userRouter');
const cookieParser = require('cookie-parser')
require('dotenv').config(); 

app.use(express.json());
app.use(cookieParser());


sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  sequelize.sync().then(() => {
    console.log('Database synchronized');
  }).catch(err => {
    console.error('Error synchronizing database:', err);
  });

  const PORT = process.env.PORT || 3000;
  app.use('/api', userRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});