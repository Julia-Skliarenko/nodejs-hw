import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors } from 'celebrate';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import { connectMongoDB } from './db/connectMongoDB.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

export const setupServer = async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(logger);

  app.use('/notes', notesRouter);

  // Обработка ошибок от celebrate
  app.use(errors());

  app.use(notFoundHandler);
  app.use(errorHandler);

  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

setupServer();
