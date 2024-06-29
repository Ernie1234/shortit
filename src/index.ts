import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import logger from './logs/logger';

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
  logger.info('info', `Server is started at port: http://localhost:${port}`);
});
