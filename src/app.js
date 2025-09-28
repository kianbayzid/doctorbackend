import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routerApi from './routes/index.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Doctor voicemail API is running 🚀'));

routerApi(app);

export default app;