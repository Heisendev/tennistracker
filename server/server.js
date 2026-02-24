import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import BetterSqlite3Store from 'better-sqlite3-session-store';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getDatabase } from './db.js';
import playersRouter from './routes/players.js';
import matchesRouter from './routes/matches.js';
import liveScoringRouter from './routes/live-scoring.js';
import authRouter from './routes/auth.js';
import { requireAuth } from './middleware/requireAuth.js';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') });

const app = express();
const PORT = process.env.PORT || 3003;

// CORS configuration for both development and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL, // Set in environment variables for production
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}, NODE ENV: ${process.env.NODE_ENV} `));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Session middleware
const SqliteStore = BetterSqlite3Store(session);
app.use(session({
  store: new SqliteStore({ client: getDatabase() }),
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Auth routes (public — no requireAuth)
app.use('/auth', authRouter);

// Protected API routes
app.use('/players', requireAuth, playersRouter);
app.use('/matches', requireAuth, matchesRouter);
app.use('/live-scoring', requireAuth, liveScoringRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
app.listen(PORT, host, () => {
    console.log(`Server is running on http://${host}:${PORT}`);
});
