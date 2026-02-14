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
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
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

// MatchStats table by set
db.exec(`
CREATE TABLE IF NOT EXISTS match_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id INTEGER NOT NULL,
    setNumber INTEGER NOT NULL,
    aces_a INTEGER,
    aces_b INTEGER,
    aces_isPercentage BOOLEAN,
    doubleFaults_a INTEGER,
    doubleFaults_b INTEGER,
    doubleFaults_isPercentage BOOLEAN,
    firstServe_a INTEGER,
    firstServe_b INTEGER,
    firstServe_isPercentage BOOLEAN,
    firstServeWon_a INTEGER,
    firstServeWon_b INTEGER,
    firstServeWon_isPercentage BOOLEAN,
    secondServeWon_a INTEGER,
    secondServeWon_b INTEGER,
    secondServeWon_isPercentage BOOLEAN,
    winners_a INTEGER,
    winners_b INTEGER,
    winners_isPercentage BOOLEAN,
    unforcedErrors_a INTEGER,
    unforcedErrors_b INTEGER,
    unforcedErrors_isPercentage BOOLEAN,
    breakPointsWon_a INTEGER,
    breakPointsWon_b INTEGER,
    breakPointsWon_isPercentage BOOLEAN,
    totalPointsWon_a INTEGER,
    totalPointsWon_b INTEGER,
    totalPointsWon_isPercentage BOOLEAN,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matchs(id)
);`); 

console.log('Database initialized successfully.'); 

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_matchs_playerA_id ON matchs(playerA_id);
  CREATE INDEX IF NOT EXISTS idx_matchs_playerB_id ON matchs(playerB_id);
  CREATE INDEX IF NOT EXISTS idx_match_stats_match_id ON match_stats(match_id);
`);

db.exec(`
    INSERT INTO players (firstname, lastname, country) VALUES 
    ('Carlos', 'Alcaraz', 'ES'), 
    ('Jannik', 'Sinner', 'IT'),
    ('Novak', 'Djokovic', 'RS'),
    ('Alexander', 'Zverev', 'DE'), 
    ('Lorenzo', 'Musetti', 'IT'), 
    ('Felix', 'Auger-Aliassime', 'CA'), 
    ('Taylor', 'Fritz', 'USA'), 
    ('Rafael', 'Nadal', 'ES'), 
    ('Roger', 'Federer', 'CH');
`);

db.exec(`INSERT INTO matchs (tournament, round, surface, date, duration, playerA_id, playerB_id, playerA_seed, playerB_seed, winner, tossWinner) VALUES 
    ('Wimbledon', 'Final', 'Grass', '22026-06-06T15:57:31.000Z', '2h30m', 1, 3, 1, 3, 'A', 'B'), 
    ('US Open', 'Semi-Final', 'Hard', '2026-06-06T15:57:31.000Z', '3h15m', 3, 7, 3, 7, 'B', 'A'), 
    ('Roland Garros', 'Quarter-Final', 'Clay', '2023-06-12T15:57:31.000Z', '2h45m', 1, 2, 1, 2, 'A', 'B'); `);

console.log('');
console.log('✅ Database initialization complete!');
console.log('   Database location:', dbPath);
console.log('   Tables created: 11');
console.log('   Indices created: 8');
console.log('');

db.close();