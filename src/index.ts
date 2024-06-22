import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import winston from 'winston';

import './logs/logger';

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const basicLogger = winston.loggers.get('basicLogger');

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
  basicLogger.log('info', `Server is started at port: http://localhost:${port}`);
});
