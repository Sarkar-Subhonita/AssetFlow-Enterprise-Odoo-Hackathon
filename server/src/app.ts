import express from 'express';
import cors from 'cors';
import session from 'express-session';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // required so the session cookie is sent/received
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
    // NOTE: default MemoryStore is fine for local dev only — it leaks
    // memory and resets on restart. Swap in connect-pg-simple (backed by
    // Postgres) before this ever goes near production.
  })
);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', routes);

app.use(errorHandler);

export default app;
