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
            JOIN matches m ON m.id = s.match_id
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
        const matchExists = db.prepare('SELECT id FROM matches WHERE id = ?').get(match_id);
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
            INSERT INTO live_match_sessions (match_id, status, current_set, match_start_time)
            VALUES (?, ?, ?, ?)
        `).run(match_id, 'scheduled', 1, null);

        // Create first set
        db.prepare(`
            INSERT INTO live_sets (session_id, set_number, games_a, games_b, is_tiebreak)
            VALUES (?, ?, ?, ?, ?)
        `).run(result.lastInsertRowid, 1, 0, 0, 0);

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
router.get('/sessions/:matchId', (req, res) => {
    try {
        const db = getDatabase();
        const { matchId } = req.params;

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
            JOIN matches m ON m.id = s.match_id
            JOIN players pa ON pa.id = m.playerA_id
            JOIN players pb ON pb.id = m.playerB_id
            WHERE s.match_id = ?
        `).get(matchId);

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
        `).all(session.id);

        // Get current game score
        const currentGame = db.prepare(`
            SELECT lg.points_a, lg.points_b, lg.game_number, lg.server, lg.set_id, ls.is_tiebreak
            FROM live_games lg
            JOIN live_sets ls ON ls.id = lg.set_id
            WHERE ls.session_id = ? AND lg.set_id = (
                SELECT id FROM live_sets WHERE session_id = ? AND set_number = ?
            ) AND lg.game_number = (
                SELECT MAX(game_number) FROM live_games WHERE set_id = (
                    SELECT id FROM live_sets WHERE session_id = ? AND set_number = ?
                ) AND game_winner IS NULL
            )
        `).get(session.id, session.id, session.current_set, session.id, session.current_set);

        // Get match stats for all sets
        const matchStats = db.prepare(`
            SELECT set_number, player, aces, double_faults, first_serve_count, first_serve_won, 
                   second_serve_won, winners, errors, unforced_errors, break_points_won, break_points_faced, 
                   total_points_won, serves_total
            FROM live_match_stats
            WHERE session_id = ?
            ORDER BY set_number, player
        `).all(session.id);

        // Organize stats by set and player
        const statsBySet = {};
        matchStats.forEach(stat => {
            if (!statsBySet["set_" + stat.set_number]) {
                statsBySet["set_" + stat.set_number] = {};
            }
            statsBySet["set_" + stat.set_number][stat.player] = stat;
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

        // Validation reads — outside the transaction
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

        if (!currentGame) {
            return res.status(400).json({ error: 'No active game found' });
        }

        // Determine point winner — pure logic, no DB writes
        let pointWinner = winner;
        if (serve_result === 'error' && serve_type === 'first') {
            pointWinner = null;
        } else if (serve_result === 'double-fault') {
            pointWinner = currentGame.server === 'A' ? 'B' : 'A';
        } else if (serve_result === 'ace') {
            pointWinner = currentGame.server;
        } else if (!pointWinner || !['A', 'B'].includes(pointWinner)) {
            return res.status(400).json({ error: 'winner must be A or B, or serve_result must be error/double-fault' });
        }

        const server = currentGame.server;
        const receiver = server === 'A' ? 'B' : 'A';
        const serverPts = server === 'A' ? currentGame.points_a : currentGame.points_b;
        const receiverPts = receiver === 'A' ? currentGame.points_a : currentGame.points_b;
        const isBreakPointSituation = (
            (serverPts < 3 && receiverPts === 3) ||
            (serverPts > 2 && receiverPts - serverPts === 1)
        );
        const newPoints = pointWinner === 'A' ? currentGame.points_a + 1 : (pointWinner === 'B' ? currentGame.points_b + 1 : null);
        const otherPoints = pointWinner === 'A' ? currentGame.points_b : (pointWinner === 'B' ? currentGame.points_a : null);

        const matchFormat = db.prepare('SELECT format FROM matches WHERE id = (SELECT match_id FROM live_match_sessions WHERE id = ?)').get(sessionId).format;

        // All DB writes in a single atomic transaction.
        // The transaction returns the response payload; if any write throws, everything rolls back.
        const response = db.transaction(() => {
            // Record the point
            db.prepare(`
                INSERT INTO live_points (game_id, point_number, winner, serve_type, serve_result, rally_type, winner_shot, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).run(currentGame.id, (currentGame.points_a || 0) + (currentGame.points_b || 0) + 1, pointWinner || null, serve_type || null, serve_result || null, rally_type || null, winner_shot || null, notes || null);

            // Handle double fault stats on the server
            if (serve_result === 'double-fault') {
                const serverStatsRecord = db.prepare(
                    'SELECT id FROM live_match_stats WHERE session_id = ? AND set_number = ? AND player = ?'
                ).get(sessionId, session.current_set, server);

                if (!serverStatsRecord) {
                    db.prepare('INSERT INTO live_match_stats (session_id, set_number, player, double_faults, serves_total) VALUES (?, ?, ?, 1, 2)')
                        .run(sessionId, session.current_set, server);
                } else {
                    db.prepare('UPDATE live_match_stats SET double_faults = double_faults + 1, serves_total = serves_total + 2, updated_at = CURRENT_TIMESTAMP WHERE session_id = ? AND set_number = ? AND player = ?')
                        .run(sessionId, session.current_set, server);
                }
            }

            // First serve fault: update serve count stats and return early — no game points change
            if (!pointWinner) {
                const serverStatsRecord = db.prepare(
                    'SELECT id FROM live_match_stats WHERE session_id = ? AND set_number = ? AND player = ?'
                ).get(sessionId, session.current_set, server);

                if (!serverStatsRecord) {
                    db.prepare('INSERT INTO live_match_stats (session_id, set_number, player, first_serve_count, serves_total) VALUES (?, ?, ?, 1, 1)')
                        .run(sessionId, session.current_set, server);
                } else {
                    db.prepare('UPDATE live_match_stats SET first_serve_count = first_serve_count + 1, serves_total = serves_total + 1, updated_at = CURRENT_TIMESTAMP WHERE session_id = ? AND set_number = ? AND player = ?')
                        .run(sessionId, session.current_set, server);
                }

                return {
                    message: 'First serve fault recorded',
                    game: { points_a: currentGame.points_a, points_b: currentGame.points_b },
                    gameWon: false
                };
            }

            // Update point winner stats
            const statsRecord = db.prepare(
                'SELECT id FROM live_match_stats WHERE session_id = ? AND set_number = ? AND player = ?'
            ).get(sessionId, session.current_set, pointWinner);

            console.log('Inserting new stats record for player', pointWinner);
            if (!statsRecord) {
                const statsInsert = {
                    session_id: sessionId,
                    set_number: session.current_set,
                    player: pointWinner,
                    total_points_won: 1,
                    aces: 0,
                    double_faults: 0,
                    first_serve_count: 0,
                    first_serve_won: 0,
                    second_serve_count: 0,
                    second_serve_won: 0,
                    winners: 0,
                    unforced_errors: 0,
                    errors: 0,
                    break_points_won: 0,
                    break_points_faced: 0,
                    serves_total: 0
                };

                if (serve_type === 'first') {
                    statsInsert.first_serve_count = 1;
                    statsInsert.serves_total = 1;
                    if (serve_result === 'ace') {
                        statsInsert.aces = 1;
                        statsInsert.first_serve_won = 1;
                    }
                    if (winner_shot === 'winner') {
                        statsInsert.winners = 1;
                    }
                }

                if (winner_shot === 'error' || winner_shot === 'unforced-error') {
                    const otherPlayer = pointWinner === 'A' ? 'B' : 'A';
                    const errorType = winner_shot === 'error' ? 'errors' : 'unforced_errors';
                    db.prepare(`
                    INSERT INTO live_match_stats (session_id, set_number, player, ${errorType})
                    VALUES (?, ?, ?, ?)
                `).run(statsInsert.session_id, statsInsert.set_number, otherPlayer, 1);
                }

                db.prepare(`
                    INSERT INTO live_match_stats (session_id, set_number, player, total_points_won, aces, double_faults, first_serve_count, first_serve_won, second_serve_won, winners, break_points_won, break_points_faced, serves_total)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).run(statsInsert.session_id, statsInsert.set_number, statsInsert.player, statsInsert.total_points_won, statsInsert.aces, statsInsert.double_faults, statsInsert.first_serve_count, statsInsert.first_serve_won, statsInsert.second_serve_won, statsInsert.winners, statsInsert.break_points_won, statsInsert.break_points_faced, statsInsert.serves_total);
            } 
            else {
                let updateQuery = 'UPDATE live_match_stats SET total_points_won = total_points_won + 1';
                const params = [sessionId, session.current_set, pointWinner];

                if (serve_result === 'ace' && serve_type === 'first') {
                    updateQuery += ', aces = aces + 1, first_serve_won = first_serve_won + 1, first_serve_count = first_serve_count + 1, serves_total = serves_total + 1';
                } else if (serve_result === 'ace' && serve_type === 'second') {
                    updateQuery += ', aces = aces + 1, second_serve_won = second_serve_won + 1, second_serve_count = second_serve_count + 1, serves_total = serves_total + 1';
                }

                if (winner_shot === 'winner') {
                    updateQuery += ', winners = winners + 1';
                    if (serve_type === 'first') {
                        updateQuery += ', first_serve_won = first_serve_won + 1, first_serve_count = first_serve_count + 1, serves_total = serves_total + 1';
                    } else if (serve_type === 'second') {
                        updateQuery += ', second_serve_won = second_serve_won + 1, second_serve_count = second_serve_count + 1, serves_total = serves_total + 1';
                    }
                }

                if (winner_shot === 'error' || winner_shot === 'unforced-error') {
                    const otherPlayer = pointWinner === 'A' ? 'B' : 'A';
                    console.log('Recording unforced error for player', pointWinner, winner_shot, otherPlayer);
                    const errorType = winner_shot === 'error' ? 'errors' : 'unforced_errors';
                    db.prepare(`
                    UPDATE live_match_stats SET ${errorType} = ${errorType} + 1
                    WHERE session_id = ? AND set_number = ? AND player = ?
                `).run(sessionId, session.current_set, otherPlayer);
                }

                if (isBreakPointSituation) {
                    if (pointWinner === receiver) {
                        updateQuery += ', break_points_won = break_points_won + 1';
                    } else {
                        updateQuery += ', break_points_faced = break_points_faced + 1';
                    }
                }

                updateQuery += ', updated_at = CURRENT_TIMESTAMP WHERE session_id = ? AND set_number = ? AND player = ?';
                db.prepare(updateQuery).run(...params);
            }

            // Update game points and check for game/set/match winner
            const pointsUpdate = pointWinner === 'A'
                ? { points_a: newPoints, points_b: otherPoints }
                : { points_a: otherPoints, points_b: newPoints };

            const isTiebreak = db.prepare('SELECT is_tiebreak FROM live_sets WHERE id = ?').get(currentGame.set_id).is_tiebreak;

            let gameWinner = null;
            if (isTiebreak) {
                if ((newPoints + otherPoints) % 2 !== 0) {
                    const nextServer = currentGame.server === 'A' ? 'B' : 'A';
                    db.prepare('UPDATE live_games SET server = ? WHERE id = ?').run(nextServer, currentGame.id);
                }
                // FR2 third set is a super tiebreak (first to 10); all other tiebreaks are first to 7
                const tiebreakTarget = matchFormat === 'FR2' && session.current_set === 3 ? 10 : 7;
                if ((newPoints >= tiebreakTarget && newPoints - otherPoints >= 2) || (otherPoints >= tiebreakTarget && otherPoints - newPoints >= 2)) {
                    gameWinner = newPoints > otherPoints ? pointWinner : (pointWinner === 'A' ? 'B' : 'A');
                }
            } else {
                if (newPoints >= 4 && newPoints - otherPoints >= 2) {
                    gameWinner = pointWinner;
                } else if (otherPoints >= 4 && otherPoints - newPoints >= 2) {
                    gameWinner = pointWinner === 'A' ? 'B' : 'A';
                }
            }

            if (gameWinner) {
                db.prepare('UPDATE live_games SET game_winner = ?, points_a = ?, points_b = ? WHERE id = ?')
                    .run(gameWinner, pointsUpdate.points_a, pointsUpdate.points_b, currentGame.id);
                db.prepare('INSERT INTO live_match_events (session_id, event_type, set_number, player) VALUES (?, ?, ?, ?)')
                    .run(sessionId, 'game-won', session.current_set, gameWinner);

                const setScores = db.prepare(`
                    SELECT SUM(CASE WHEN game_winner = 'A' THEN 1 ELSE 0 END) as games_a,
                           SUM(CASE WHEN game_winner = 'B' THEN 1 ELSE 0 END) as games_b
                    FROM live_games
                    WHERE set_id = ? AND game_winner IS NOT NULL
                `).get(currentGame.set_id);

                const gamesA = setScores.games_a || 0;
                const gamesB = setScores.games_b || 0;

                db.prepare('UPDATE live_sets SET games_a = ?, games_b = ? WHERE id = ?')
                    .run(gamesA, gamesB, currentGame.set_id);

                let setWinner = null;
                if ((gamesA >= 6 && gamesA - gamesB >= 2) || (gamesB >= 6 && gamesB - gamesA >= 2) || (gamesA === 7) || (gamesB === 7) || (matchFormat === 'FR2' && session.current_set === 3 && ((pointsUpdate.points_a >= 10 && pointsUpdate.points_a - pointsUpdate.points_b >= 2) || (pointsUpdate.points_b >= 10 && pointsUpdate.points_b - pointsUpdate.points_a >= 2)))) {
                    setWinner = gamesA > gamesB ? 'A' : 'B';
                } else if (gamesA === 6 && gamesB === 6 && !isTiebreak) {
                    db.prepare('UPDATE live_sets SET is_tiebreak = 1 WHERE id = ?').run(currentGame.set_id);
                }

                if (setWinner) {
                    db.prepare('UPDATE live_sets SET set_winner = ? WHERE id = ?').run(setWinner, currentGame.set_id);
                    db.prepare('INSERT INTO live_match_events (session_id, event_type, set_number, player) VALUES (?, ?, ?, ?)')
                        .run(sessionId, 'set-won', session.current_set, setWinner);

                    const setsToWin = matchFormat === 'BO5' ? 3 : 2;
                    const setsWon = db.prepare(`
                        SELECT
                            SUM(CASE WHEN set_winner = 'A' THEN 1 ELSE 0 END) as sets_a,
                            SUM(CASE WHEN set_winner = 'B' THEN 1 ELSE 0 END) as sets_b
                        FROM live_sets
                        WHERE session_id = ?
                    `).get(sessionId);

                    if (setsWon.sets_a < setsToWin && setsWon.sets_b < setsToWin) {
                        const nextSet = session.current_set + 1;
                        db.prepare('UPDATE live_match_sessions SET current_set = ? WHERE id = ?').run(nextSet, sessionId);

                        // FR2: the 3rd set is a super tiebreak, so mark it as a tiebreak from the start
                        const nextSetIsTiebreak = matchFormat === 'FR2' && nextSet === 3 ? 1 : 0;
                        const newSetResult = db.prepare('INSERT INTO live_sets (session_id, set_number, games_a, games_b, is_tiebreak) VALUES (?, ?, ?, ?, ?)')
                            .run(sessionId, nextSet, 0, 0, nextSetIsTiebreak);

                        const nextServer = currentGame.server === 'A' ? 'B' : 'A';
                        db.prepare('INSERT INTO live_games (set_id, game_number, points_a, points_b, server) VALUES (?, ?, ?, ?, ?)')
                            .run(newSetResult.lastInsertRowid, 1, 0, 0, nextServer);
                    } else {
                        const matchWinner = setsWon.sets_a > setsWon.sets_b ? 'A' : 'B';
                        db.prepare('UPDATE matches SET winner = ? WHERE id = (SELECT match_id FROM live_match_sessions WHERE id = ?)').run(matchWinner, sessionId);
                        db.prepare('UPDATE live_match_sessions SET status = ?, match_end_time = ? WHERE id = ?')
                            .run('completed', new Date().toISOString(), sessionId);
                    }
                } else {
                    const nextGameNumber = (db.prepare('SELECT MAX(game_number) as max FROM live_games WHERE set_id = ?')
                        .get(currentGame.set_id).max || 0) + 1;
                    const nextServer = currentGame.server === 'A' ? 'B' : 'A';
                    db.prepare('INSERT INTO live_games (set_id, game_number, points_a, points_b, server) VALUES (?, ?, ?, ?, ?)')
                        .run(currentGame.set_id, nextGameNumber, 0, 0, nextServer);
                }
            } else {
                db.prepare('UPDATE live_games SET points_a = ?, points_b = ? WHERE id = ?')
                    .run(pointsUpdate.points_a, pointsUpdate.points_b, currentGame.id);
            }

            return {
                message: 'Point recorded',
                game: { points_a: pointsUpdate.points_a, points_b: pointsUpdate.points_b },
                gameWon: !!gameWinner
            };
        })();

        res.json(response);
    } catch (error) {
        console.error('Error recording point:', error);
        res.status(500).json({ error: 'Failed to record point' });
    }
});

router.get('/sessions/:sessionId/points', (req, res) => {
    try {
        const db = getDatabase();
        const { sessionId } = req.params;

        const points = db.prepare(`
            SELECT lp.point_number, lp.winner, lp.serve_type, lp.serve_result, lp.rally_type, lp.winner_shot, lp.notes,
                   lg.game_number, ls.set_number
            FROM live_points lp
            JOIN live_games lg ON lg.id = lp.game_id
            JOIN live_sets ls ON ls.id = lg.set_id
            WHERE ls.session_id = ?
            ORDER BY ls.set_number, lg.game_number, lp.point_number
        `).all(sessionId);

        res.json(points);
    } catch (error) {
        console.error('Error fetching points:', error);
        res.status(500).json({ error: 'Failed to fetch points' });
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
        const { status, toss_winner } = req.body;

        if (!status || !['scheduled', 'in-progress', 'suspended', 'completed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        if (status === 'in-progress' && !toss_winner) {
            return res.status(400).json({ error: 'Toss winner is required for in-progress status' });
        }

        const timestamp = status === 'in-progress' ? new Date().toISOString() :
            status === 'completed' ? new Date().toISOString() : null;

        // Create first game
        const setId = db.prepare('SELECT id FROM live_sets WHERE session_id = ? AND set_number = 1')
            .get(sessionId).id;

        db.transaction(() => {
            db.prepare(`
                INSERT INTO live_games (set_id, game_number, points_a, points_b, server)
                VALUES (?, ?, ?, ?, ?)
            `).run(setId, 1, 0, 0, toss_winner);

            db.prepare('UPDATE matches SET tossWinner = ? WHERE id = (SELECT match_id FROM live_match_sessions WHERE id = ?)').run(toss_winner, sessionId);

            const updateQuery = status === 'in-progress'
                ? 'UPDATE live_match_sessions SET status = ?, match_start_time = ?, current_server = ? WHERE id = ?'
                : status === 'completed'
                    ? 'UPDATE live_match_sessions SET status = ?, match_end_time = ? WHERE id = ?'
                    : 'UPDATE live_match_sessions SET status = ? WHERE id = ?';

            const params = timestamp ? status === 'in-progress' ? [status, timestamp, toss_winner, sessionId] : [status, timestamp, sessionId] : [status, sessionId];

            db.prepare(updateQuery).run(...params);
        })();

        res.json({ message: `Session status updated to ${status}` });
    } catch (error) {
        console.error('Error updating session status:', error);
        res.status(500).json({ error: 'Failed to update session status' });
    }
});

export default router;
