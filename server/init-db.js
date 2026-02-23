import { getDatabase, closeDatabase } from './db.js';

// Schema creation is handled by db.js — this script only seeds data.
// It clears all existing rows first, so it can be re-run safely.
const db = getDatabase();

console.log('Clearing existing data...');
db.exec(`
    DELETE FROM live_match_stats;
    DELETE FROM live_match_events;
    DELETE FROM live_points;
    DELETE FROM live_games;
    DELETE FROM live_sets;
    DELETE FROM live_match_sessions;
    DELETE FROM matches;
    DELETE FROM players;
`);

console.log('Seeding players...');
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

console.log('Seeding matches...');
db.exec(`
INSERT INTO matches (tournament, round, surface, format, date, duration, playerA_id, playerB_id, playerA_seed, playerB_seed, tossWinner) VALUES
('Wimbledon', 'Final', 'Grass', 'BO5', '2026-06-06T15:57:31.000Z', '2h30m', 1, 3, 1, 3, 'A'),
('US Open', 'Semi-Final', 'Hard', 'BO5', '2026-06-06T15:57:31.000Z', '3h15m', 3, 7, 3, 7, 'B'),
('Open de Saran', '1st round', 'Hard', 'BO3', '2023-06-12T15:57:31.000Z', '2h45m', 9, 8, 1, 2, 'A'),
('Roland Garros', 'Quarter-Final', 'Clay', 'BO5', '2023-06-12T15:57:31.000Z', '2h45m', 1, 2, 1, 2, 'A');
`);

console.log('✅ Database seeded successfully.');
closeDatabase();
