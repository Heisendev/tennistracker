import express from 'express';
import { getDatabase } from '../db.js';
import { get } from 'http';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const db = getDatabase();
        const matchs = [];
        const matchsRequest = db.prepare(`
            SELECT
                m.id,
                m.tournament,
                m.round,
                m.surface,
                m.date,
                m.duration,
                m.winner,
                m.tossWinner,

                json_object(
                    'id', pa.id,
                    'firstname', pa.firstname,
                    'lastname', pa.lastname,
                    'country', pa.country,
                    'seed', m.playerA_seed
                ) AS playerA,

                json_object(
                    'id', pb.id,
                    'firstname', pb.firstname,
                    'lastname', pb.lastname,
                    'country', pb.country,
                    'seed', m.playerB_seed
                ) AS playerB

            FROM matchs m
            JOIN players pa ON pa.id = m.playerA_id
            JOIN players pb ON pb.id = m.playerB_id
            `);
            //for each match, we want to get the playerA and playerB info as a JSON object
            for (const match of matchsRequest.iterate()) {
                match.playerA = JSON.parse(match.playerA);
                match.playerB = JSON.parse(match.playerB);
                matchs.push(match);
            }

        
            res.json(matchs); 
    } catch (error) {
        console.error("Error fetching matchs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/:id', (req, res) => {
    try {
        const db = getDatabase();
        const matchId = req.params.id;
        const matchRequest = db.prepare(`
            SELECT
                m.id,
                m.tournament,
                m.round,
                m.surface,
                m.date,
                m.duration,
                m.winner,
                m.tossWinner,

                json_object(
                    'id', pa.id,
                    'firstname', pa.firstname,
                    'lastname', pa.lastname,
                    'country', pa.country,
                    'seed', m.playerA_seed
                ) AS playerA,

                json_object(
                    'id', pb.id,
                    'firstname', pb.firstname,
                    'lastname', pb.lastname,
                    'country', pb.country,
                    'seed', m.playerB_seed
                ) AS playerB

            FROM matchs m
            JOIN players pa ON pa.id = m.playerA_id
            JOIN players pb ON pb.id = m.playerB_id
            WHERE m.id = ?
            `);
            const match = matchRequest.get(matchId);
            if (match) {
                match.playerA = JSON.parse(match.playerA);
                match.playerB = JSON.parse(match.playerB);
                res.json(match); 
            } else {
                res.status(404).json({ error: "Match not found" });
            }
    } catch (error) {
        console.error("Error fetching match:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;