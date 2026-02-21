import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbDir = join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = join(dbDir, 'tennistracker.db');

console.log(`Initializing database at: ${dbPath}`);

const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

console.log('Creating tables if they do not exist...');

// Players table
db.exec(`
CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rank INTEGER,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    hand TEXT CHECK(hand IN ('Left', 'Right')),
    backhand TEXT CHECK(backhand IN ('One-handed', 'Two-handed')),
    country TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);`); 

// Matchs table
db.exec(`
CREATE TABLE IF NOT EXISTS matchs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tournament TEXT NOT NULL,
    round TEXT NOT NULL,
    surface TEXT NOT NULL,
    date TEXT NOT NULL,
    duration TEXT,
    playerA_id INTEGER NOT NULL,
    playerB_id INTEGER NOT NULL,
    playerA_seed INTEGER,
    playerB_seed INTEGER,
    winner TEXT CHECK(winner IN ('A', 'B')),
    tossWinner TEXT CHECK(tossWinner IN ('A', 'B')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playerA_id) REFERENCES players(id),
    FOREIGN KEY (playerB_id) REFERENCES players(id)
);`); 

// Live Match Sessions - tracks active/ongoing matches
db.exec(`
CREATE TABLE IF NOT EXISTS live_match_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id INTEGER NOT NULL UNIQUE,
    status TEXT CHECK(status IN ('scheduled', 'in-progress', 'suspended', 'completed')) DEFAULT 'scheduled',
    current_set INTEGER DEFAULT 1,
    current_server TEXT CHECK(current_server IN ('A', 'B')),
    match_start_time TEXT,
    match_end_time TEXT,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matchs(id)
);`);

// Live Sets - tracks score for each set
db.exec(`
CREATE TABLE IF NOT EXISTS live_sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    set_number INTEGER NOT NULL,
    games_a INTEGER DEFAULT 0,
    games_b INTEGER DEFAULT 0,
    is_tiebreak BOOLEAN DEFAULT 0,
    tiebreak_points_a INTEGER DEFAULT 0,
    tiebreak_points_b INTEGER DEFAULT 0,
    set_winner TEXT CHECK(set_winner IN ('A', 'B', NULL)),
    completed_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES live_match_sessions(id),
    UNIQUE(session_id, set_number)
);`);

// Live Games - tracks score for each game within a set
db.exec(`
CREATE TABLE IF NOT EXISTS live_games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    set_id INTEGER NOT NULL,
    game_number INTEGER NOT NULL,
    points_a INTEGER DEFAULT 0,
    points_b INTEGER DEFAULT 0,
    game_winner TEXT CHECK(game_winner IN ('A', 'B', NULL)),
    server TEXT CHECK(server IN ('A', 'B')) NOT NULL,
    completed_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (set_id) REFERENCES live_sets(id),
    UNIQUE(set_id, game_number)
);`);

// Live Points - individual point history
db.exec(`
CREATE TABLE IF NOT EXISTS live_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    point_number INTEGER NOT NULL,
    winner TEXT CHECK(winner IN ('A', 'B', NULL)),
    serve_type TEXT CHECK(serve_type IN ('first', 'second', 'N/A')),
    serve_result TEXT CHECK(serve_result IN ('ace', 'won', 'error', 'double-fault', 'N/A')),
    rally_type TEXT CHECK(rally_type IN ('service-winner', 'baseline', 'net-play', 'N/A')),
    winner_shot TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES live_games(id)
);`);

// Live Match Events - timeline of important match events
db.exec(`
CREATE TABLE IF NOT EXISTS live_match_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    event_type TEXT CHECK(event_type IN ('match-start', 'set-start', 'game-start', 'point-won', 'game-won', 'set-won', 'match-end', 'suspension', 'resumption', 'medical-timeout', 'court-breakdown')) NOT NULL,
    set_number INTEGER,
    game_number INTEGER,
    player TEXT CHECK(player IN ('A', 'B')),
    details TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES live_match_sessions(id)
);`);

// Live Match Stats - real-time statistics
db.exec(`
CREATE TABLE IF NOT EXISTS live_match_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    set_number INTEGER NOT NULL,
    player TEXT CHECK(player IN ('A', 'B')) NOT NULL,
    aces INTEGER DEFAULT 0,
    double_faults INTEGER DEFAULT 0,
    first_serve_count INTEGER DEFAULT 0,
    first_serve_won INTEGER DEFAULT 0,
    second_serve_count INTEGER DEFAULT 0,
    second_serve_won INTEGER DEFAULT 0,
    winners INTEGER DEFAULT 0,
    unforced_errors INTEGER DEFAULT 0,
    break_points_won INTEGER DEFAULT 0,
    break_points_faced INTEGER DEFAULT 0,
    total_points_won INTEGER DEFAULT 0,
    serves_total INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES live_match_sessions(id),
    UNIQUE(session_id, set_number, player)
);`); 

console.log('Database initialized successfully.'); 

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_matchs_playerA_id ON matchs(playerA_id);
  CREATE INDEX IF NOT EXISTS idx_matchs_playerB_id ON matchs(playerB_id);
  CREATE INDEX IF NOT EXISTS idx_live_sessions_match_id ON live_match_sessions(match_id);
  CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON live_match_sessions(status);
  CREATE INDEX IF NOT EXISTS idx_live_sets_session_id ON live_sets(session_id);
  CREATE INDEX IF NOT EXISTS idx_live_games_set_id ON live_games(set_id);
  CREATE INDEX IF NOT EXISTS idx_live_points_game_id ON live_points(game_id);
  CREATE INDEX IF NOT EXISTS idx_live_events_session_id ON live_match_events(session_id);
  CREATE INDEX IF NOT EXISTS idx_live_stats_session_id ON live_match_stats(session_id);
`);

db.exec(`
    INSERT INTO players (rank, firstname, lastname, hand, backhand, country) VALUES 
    (1, 'Carlos', 'Alcaraz', 'Right', 'Two-handed', 'ES'), 
    (2, 'Jannik', 'Sinner', 'Right', 'Two-handed', 'IT'),
    (3, 'Novak', 'Djokovic', 'Right', 'Two-handed', 'RS'),
    (4, 'Alexander', 'Zverev', 'Right', 'Two-handed', 'DE'), 
    (5, 'Lorenzo', 'Musetti', 'Right', 'Two-handed', 'IT'), 
    (6, 'Felix', 'Auger-Aliassime', 'Right', 'Two-handed', 'CA'), 
    (7, 'Taylor', 'Fritz', 'Right', 'Two-handed', 'US'), 
    (8, 'Rafael', 'Nadal', 'Right', 'Two-handed', 'ES'), 
    (9, 'Roger', 'Federer', 'Right', 'One-handed', 'CH');
`);

db.exec(`INSERT INTO matchs (tournament, round, surface, date, duration, playerA_id, playerB_id, playerA_seed, playerB_seed, tossWinner) VALUES 
    ('Wimbledon', 'Final', 'Grass', '2026-06-06T15:57:31.000Z', '2h30m', 1, 3, 1, 3, 'A'), 
    ('US Open', 'Semi-Final', 'Hard', '2026-06-06T15:57:31.000Z', '3h15m', 3, 7, 3, 7, 'B'), 
    ('Roland Garros', 'Quarter-Final', 'Clay', '2023-06-12T15:57:31.000Z', '2h45m', 1, 2, 1, 2, 'A'); `);

console.log('');
console.log('✅ Database initialization complete!');
console.log('   Database location:', dbPath);
console.log('   Tables created: 8');
console.log('   Indices created: 10');
console.log('');
console.log('📊 Tables:');
console.log('   - players (player profiles)');
console.log('   - matchs (match records)');
console.log('   - live_match_sessions (active/ongoing matches)');
console.log('   - live_sets (set-level scoring)');
console.log('   - live_games (game-level scoring)');
console.log('   - live_points (point-by-point history)');
console.log('   - live_match_events (match event timeline)');
console.log('   - live_match_stats (real-time match statistics)');
console.log('');

db.close();