import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';

import recipeRoutes from './api/routes/recipes.js';
import userRoutes from './api/routes/user.js';

const app = express();

console.log('MONGO:  ' + process.env.MONGO_ATLAS_PW);
mongoose
  .connect(
    'mongodb+srv://artureczku:' +
      process.env.MONGO_ATLAS_PW +
      '@cluster0.ctd8f7t.mongodb.net/'
  )
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/recipes', recipeRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
