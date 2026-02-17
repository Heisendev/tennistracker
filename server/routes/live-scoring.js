import express from 'express';
import { getDatabase } from '../db.js';

const router = express.Router();

// ============ Live Match Session Endpoints ============

/**
 * GET /api/live-scoring/sessions
 * Get all live match sessions
 */
router.get('/sessions', (req, res) => {
    try {
        const db = getDatabase();
        const { status } = req.query;

        let query = `
            SELECT 
                s.id,
                s.match_id,
                s.status,
                s.current_set,
                s.current_server,
                s.match_start_time,
                s.match_end_time,
                m.tournament,
                m.round,
                m.surface,
                m.date,
                json_object(
                    'id', pa.id,
                    'firstname', pa.firstname,
                    'lastname', pa.lastname,
                    'country', pa.country
                ) AS playerA,
                json_object(
                    'id', pb.id,
                    'firstname', pb.firstname,
                    'lastname', pb.lastname,
                    'country', pb.country
                ) AS playerB
            FROM live_match_sessions s
            JOIN matchs m ON m.id = s.match_id
            JOIN players pa ON pa.id = m.playerA_id
            JOIN players pb ON pb.id = m.playerB_id
        `;

        if (status) {
            query += ` WHERE s.status = ?`;
        }

        query += ` ORDER BY s.updated_at DESC`;

        const stmt = db.prepare(query);
        const sessions = status ? stmt.all(status) : stmt.all();

        sessions.forEach(s => {
            s.playerA = JSON.parse(s.playerA);
            s.playerB = JSON.parse(s.playerB);
        });

        res.json(sessions);
    } catch (error) {
        console.error('Error fetching live sessions:', error);
        res.status(500).json({ error: 'Failed to fetch live sessions' });
    }
});

/**
 * POST /api/live-scoring/sessions
 * Create a new live match session
 */
router.post('/sessions', (req, res) => {
    try {
        const db = getDatabase();
        const { match_id } = req.body;

        if (!match_id) {
            return res.status(400).json({ error: 'match_id is required' });
        }

        // Check if match exists
        const matchExists = db.prepare('SELECT id FROM matchs WHERE id = ?').get(match_id);
        if (!matchExists) {
            return res.status(404).json({ error: 'Match not found' });
        }

        // Check if session already exists
        const existingSession = db.prepare('SELECT id FROM live_match_sessions WHERE match_id = ? AND status != ?')
            .get(match_id, 'completed');
        if (existingSession) {
            return res.status(400).json({ error: 'Active session already exists for this match' });
        }

        // Create session
        const result = db.prepare(`
            INSERT INTO live_match_sessions (match_id, status, current_set, current_server, match_start_time)
            VALUES (?, ?, ?, ?, ?)
        `).run(match_id, 'scheduled', 1, 'A', null);

        // Create first set
        db.prepare(`
            INSERT INTO live_sets (session_id, set_number, games_a, games_b, is_tiebreak)
            VALUES (?, ?, ?, ?, ?)
        `).run(result.lastInsertRowid, 1, 0, 0, 0);

        // Create first game
        const setId = db.prepare('SELECT id FROM live_sets WHERE session_id = ? AND set_number = 1')
            .get(result.lastInsertRowid).id;

        db.prepare(`
            INSERT INTO live_games (set_id, game_number, points_a, points_b, server)
            VALUES (?, ?, ?, ?, ?)
        `).run(setId, 1, 0, 0, 'A');

        res.status(201).json({
            id: result.lastInsertRowid,
            match_id,
            status: 'scheduled',
            current_set: 1,
            message: 'Live session created'
        });
    } catch (error) {
        console.error('Error creating live session:', error);
        res.status(500).json({ error: 'Failed to create live session' });
    }
});

/**
 * GET /api/live-scoring/sessions/:sessionId
 * Get detailed session info with current score
 */
router.get('/sessions/:sessionId', (req, res) => {
    try {
        const db = getDatabase();
        const { sessionId } = req.params;

        const session = db.prepare(`
            SELECT 
                s.id,
                s.match_id,
                s.status,
                s.current_set,
                s.current_server,
                s.match_start_time,
                s.match_end_time,
                m.tournament,
                m.round,
                m.surface,
                m.date,
                json_object(
                    'id', pa.id,
                    'firstname', pa.firstname,
                    'lastname', pa.lastname,
                    'country', pa.country
                ) AS playerA,
                json_object(
                    'id', pb.id,
                    'firstname', pb.firstname,
                    'lastname', pb.lastname,
                    'country', pb.country
                ) AS playerB
            FROM live_match_sessions s
            JOIN matchs m ON m.id = s.match_id
            JOIN players pa ON pa.id = m.playerA_id
            JOIN players pb ON pb.id = m.playerB_id
            WHERE s.id = ?
        `).get(sessionId);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        session.playerA = JSON.parse(session.playerA);
        session.playerB = JSON.parse(session.playerB);

        // Get set scores
        const sets = db.prepare(`
            SELECT set_number, games_a, games_b, is_tiebreak, tiebreak_points_a, tiebreak_points_b, set_winner
            FROM live_sets
            WHERE session_id = ?
            ORDER BY set_number
        `).all(sessionId);

        // Get current game score
        const currentGame = db.prepare(`
            SELECT lg.points_a, lg.points_b, lg.game_number, lg.server
            FROM live_games lg
            JOIN live_sets ls ON ls.id = lg.set_id
            WHERE ls.session_id = ? AND lg.set_id = (
                SELECT id FROM live_sets WHERE session_id = ? AND set_number = ?
            ) AND lg.game_number = (
                SELECT MAX(game_number) FROM live_games WHERE set_id = (
                    SELECT id FROM live_sets WHERE session_id = ? AND set_number = ?
                ) AND game_winner IS NULL
            )
        `).get(sessionId, sessionId, session.current_set, sessionId, session.current_set);

        // Get match stats for all sets
        const matchStats = db.prepare(`
            SELECT set_number, player, aces, double_faults, first_serve_count, first_serve_won, 
                   second_serve_won, winners, unforced_errors, break_points_won, break_points_faced, 
                   total_points_won, serves_total
            FROM live_match_stats
            WHERE session_id = ?
            ORDER BY set_number, player
        `).all(sessionId);

        // Organize stats by set and player
        const statsBySet = {};
        matchStats.forEach(stat => {
            if (!statsBySet[stat.set_number]) {
                statsBySet[stat.set_number] = {};
            }
            statsBySet[stat.set_number][stat.player] = stat;
        });

        session.sets = sets;
        session.currentGame = currentGame || {};
        session.matchStats = statsBySet;

        res.json(session);
    } catch (error) {
        console.error('Error fetching session details:', error);
        res.status(500).json({ error: 'Failed to fetch session details' });
    }
});

// ============ Point Recording ============

/**
 * POST /api/live-scoring/sessions/:sessionId/point
 * Record a point in the current game
 * Body: { winner: 'A' or 'B', serve_type?: 'first'|'second', serve_result?: 'ace'|'won'|'error'|'double-fault', rally_type?: ..., winner_shot?: 'string', notes?: 'string' }
 */
router.post('/sessions/:sessionId/point', (req, res) => {
    try {
        const db = getDatabase();
        const { sessionId } = req.params;
        const { winner, serve_type, serve_result, rally_type, winner_shot, notes } = req.body;

        if (!winner || !['A', 'B'].includes(winner)) {
            return res.status(400).json({ error: 'winner must be A or B' });
        }

        // Get current game
        const session = db.prepare('SELECT current_set FROM live_match_sessions WHERE id = ?').get(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const currentGame = db.prepare(`
            SELECT lg.id, lg.points_a, lg.points_b, lg.server, ls.id as set_id
            FROM live_games lg
            JOIN live_sets ls ON ls.id = lg.set_id
            WHERE ls.session_id = ? AND ls.set_number = ? AND lg.game_winner IS NULL
            ORDER BY lg.game_number DESC LIMIT 1
        `).get(sessionId, session.current_set);
        console.log('Current game:', currentGame, sessionId, session);
        if (!currentGame) {
            return res.status(400).json({ error: 'No active game found' });
        }

        // Record point
        const newPoints = winner === 'A' ? currentGame.points_a + 1 : currentGame.points_b + 1;
        const otherPoints = winner === 'A' ? currentGame.points_b : currentGame.points_a;

        db.prepare(`
            INSERT INTO live_points (game_id, point_number, winner, serve_type, serve_result, rally_type, winner_shot, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(currentGame.id, newPoints, winner, serve_type || null, serve_result || null, rally_type || null, winner_shot || null, notes || null);

        // Update live_match_stats for the session
        const session_data = db.prepare('SELECT current_set FROM live_match_sessions WHERE id = ?').get(sessionId);
        let statsRecord = db.prepare(`
            SELECT id FROM live_match_stats 
            WHERE session_id = ? AND set_number = ? AND player = ?
        `).get(sessionId, session_data.current_set, winner);

        if (!statsRecord) {
            // Create stats record if doesn't exist
            db.prepare(`
                INSERT INTO live_match_stats (session_id, set_number, player, total_points_won)
                VALUES (?, ?, ?, 1)
            `).run(sessionId, session_data.current_set, winner);
        } else {
            // Update existing stats
            let updateQuery = 'UPDATE live_match_stats SET total_points_won = total_points_won + 1';
            const params = [sessionId, session_data.current_set, winner];

            // Update based on serve results
            if (serve_result === 'ace') {
                updateQuery += ', aces = aces + 1, first_serve_won = first_serve_won + 1, first_serve_count = first_serve_count + 1, serves_total = serves_total + 1';
            } else if (serve_result === 'double-fault') {
                updateQuery += ', double_faults = double_faults + 1, serves_total = serves_total + 2';
            } else if (serve_result === 'error' && serve_type === 'first') {
                updateQuery += ', first_serve_count = first_serve_count + 1, serves_total = serves_total + 1';
            } else if (serve_result === 'won' && serve_type === 'first') {
                updateQuery += ', first_serve_won = first_serve_won + 1, first_serve_count = first_serve_count + 1, serves_total = serves_total + 1';
            } else if (serve_result === 'won' && serve_type === 'second') {
                updateQuery += ', second_serve_won = second_serve_won + 1, serves_total = serves_total + 1';
            }

            // Update based on shot type
            if (winner_shot === 'winner') {
                updateQuery += ', winners = winners + 1';
            } else if (winner_shot === 'error') {
                updateQuery += ', unforced_errors = unforced_errors + 1';
            }

            updateQuery += ', updated_at = CURRENT_TIMESTAMP WHERE session_id = ? AND set_number = ? AND player = ?';

            db.prepare(updateQuery).run(...params);
        }

        // Update game points
        const pointsUpdate = winner === 'A'
            ? { points_a: newPoints, points_b: otherPoints }
            : { points_a: otherPoints, points_b: newPoints };

        let gameWinner = null;
        // Check if game is won (first to 4 with 2+ lead, or tiebreak to 7 with 2+ lead)
        const isTiebreak = db.prepare('SELECT is_tiebreak FROM live_sets WHERE id = ?').get(currentGame.set_id).is_tiebreak;

        if (isTiebreak) {
            if ((newPoints >= 7 && newPoints - otherPoints >= 2) || (otherPoints >= 7 && otherPoints - newPoints >= 2)) {
                gameWinner = newPoints > otherPoints ? winner : (winner === 'A' ? 'B' : 'A');
            }
        } else {
            if (newPoints >= 4 && newPoints - otherPoints >= 2) {
                gameWinner = winner;
            } else if (otherPoints >= 4 && otherPoints - newPoints >= 2) {
                gameWinner = winner === 'A' ? 'B' : 'A';
            }
        }

        if (gameWinner) {
            // Game is won
            const points = gameWinner === 'A' ? pointsUpdate.points_a : pointsUpdate.points_b;
            const otherPlayerPoints = gameWinner === 'A' ? pointsUpdate.points_b : pointsUpdate.points_a;

            db.prepare('UPDATE live_games SET game_winner = ?, points_a = ?, points_b = ? WHERE id = ?')
                .run(gameWinner, pointsUpdate.points_a, pointsUpdate.points_b, currentGame.id);
            console.log(`Game won by Player ${gameWinner}, final score: ${pointsUpdate.points_a}-${pointsUpdate.points_b}, server: ${currentGame.server}`);
            // Record game won event
            db.prepare(`
                INSERT INTO live_match_events (session_id, event_type, set_number, player)
                VALUES (?, ?, ?, ?)
            `).run(sessionId, 'game-won', session.current_set, gameWinner);

            // Check if set is won
            const setScores = db.prepare(`
                SELECT SUM(CASE WHEN game_winner = 'A' THEN 1 ELSE 0 END) as games_a,
                       SUM(CASE WHEN game_winner = 'B' THEN 1 ELSE 0 END) as games_b
                FROM live_games
                WHERE set_id = ? AND game_winner IS NOT NULL
            `).get(currentGame.set_id);

            const gamesA = setScores.games_a || 0;
            const gamesB = setScores.games_b || 0;

            // Update the set with new game counts
            db.prepare('UPDATE live_sets SET games_a = ?, games_b = ? WHERE id = ?')
                .run(gamesA, gamesB, currentGame.set_id);

            let setWinner = null;

            // Check set winner logic
            if ((gamesA >= 6 && gamesA - gamesB >= 2) || (gamesB >= 6 && gamesB - gamesA >= 2)) {
                setWinner = gamesA > gamesB ? 'A' : 'B';
            } else if (gamesA === 6 && gamesB === 6 && !isTiebreak) {
                // Start tiebreak
                db.prepare('UPDATE live_sets SET is_tiebreak = 1 WHERE id = ?').run(currentGame.set_id);
            }

            if (setWinner) {
                db.prepare('UPDATE live_sets SET set_winner = ? WHERE id = ?').run(setWinner, currentGame.set_id);

                // Record set won event
                db.prepare(`
                    INSERT INTO live_match_events (session_id, event_type, set_number, player)
                    VALUES (?, ?, ?, ?)
                `).run(sessionId, 'set-won', session.current_set, setWinner);

                // Create next set if needed
                if (session.current_set < 3) { // Update if you support BO5
                    const nextSet = session.current_set + 1;
                    db.prepare('UPDATE live_match_sessions SET current_set = ? WHERE id = ?')
                        .run(nextSet, sessionId);

                    const newSetResult = db.prepare(`
                        INSERT INTO live_sets (session_id, set_number, games_a, games_b, is_tiebreak)
                        VALUES (?, ?, ?, ?, ?)
                    `).run(sessionId, nextSet, 0, 0, 0);

                    // Create first game of new set - alternate server
                    const nextServer = currentGame.server === 'A' ? 'B' : 'A';
                    db.prepare(`
                        INSERT INTO live_games (set_id, game_number, points_a, points_b, server)
                        VALUES (?, ?, ?, ?, ?)
                    `).run(newSetResult.lastInsertRowid, 1, 0, 0, nextServer);
                }
            } else {
                // Next game - alternate server
                const nextGameNumber = (db.prepare('SELECT MAX(game_number) as max FROM live_games WHERE set_id = ?')
                    .get(currentGame.set_id).max || 0) + 1;
                const nextServer = currentGame.server === 'A' ? 'B' : 'A';

                db.prepare(`
                    INSERT INTO live_games (set_id, game_number, points_a, points_b, server)
                    VALUES (?, ?, ?, ?, ?)
                `).run(currentGame.set_id, nextGameNumber, 0, 0, nextServer);
            }
        } else {
            db.prepare('UPDATE live_games SET points_a = ?, points_b = ? WHERE id = ?')
                .run(pointsUpdate.points_a, pointsUpdate.points_b, currentGame.id);
        }

        res.json({
            message: 'Point recorded',
            game: { points_a: pointsUpdate.points_a, points_b: pointsUpdate.points_b },
            gameWon: gameWinner ? true : false
        });
    } catch (error) {
        console.error('Error recording point:', error);
        res.status(500).json({ error: 'Failed to record point' });
    }
});

/**
 * PATCH /api/live-scoring/sessions/:sessionId/status
 * Update session status
 * Body: { status: 'in-progress' | 'suspended' | 'completed' }
 */
router.patch('/sessions/:sessionId/status', (req, res) => {
    try {
        const db = getDatabase();
        const { sessionId } = req.params;
        const { status } = req.body;

        if (!status || !['scheduled', 'in-progress', 'suspended', 'completed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const timestamp = status === 'in-progress' ? new Date().toISOString() :
            status === 'completed' ? new Date().toISOString() : null;

        const updateQuery = status === 'in-progress'
            ? 'UPDATE live_match_sessions SET status = ?, match_start_time = ? WHERE id = ?'
            : status === 'completed'
                ? 'UPDATE live_match_sessions SET status = ?, match_end_time = ? WHERE id = ?'
                : 'UPDATE live_match_sessions SET status = ? WHERE id = ?';

        const params = timestamp ? [status, timestamp, sessionId] : [status, sessionId];

        db.prepare(updateQuery).run(...params);

        res.json({ message: `Session status updated to ${status}` });
    } catch (error) {
        console.error('Error updating session status:', error);
        res.status(500).json({ error: 'Failed to update session status' });
    }
});

export default router;
