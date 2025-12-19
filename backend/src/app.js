import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import overviewRouter from './routes/overview.js';
import requestsRouter from './routes/requests.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ message: 'SIMAPAN API is ready' });
});

app.use('/api/overview', overviewRouter);
app.use('/api/requests', requestsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

export default app;
