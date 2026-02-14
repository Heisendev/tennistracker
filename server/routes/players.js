import express from 'express';
import { getDatabase } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const db = getDatabase();
        const players = db.prepare(`
            SELECT * FROM players
            `).all();
        
            res.json(players); 
    } catch (error) {
        console.error("Error fetching players:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/:id', (req, res) => {
    try {
        const db = getDatabase();
        const playerId = req.params.id;
        const player = db.prepare(`
            SELECT * FROM players WHERE id = ?
            `).get(playerId);
        
            if (!player) {
                return res.status(404).json({ error: "Player not found" });
            }
        
            res.json(player); 
    } catch (error) {
        console.error("Error fetching player:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/', (req, res) => {
    try {
        const { firstname, lastname, country } = req.body;
        if (!firstname || !lastname || !country) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const db = getDatabase();
        const stmt = db.prepare(`
            INSERT INTO players (firstname, lastname, country)
            VALUES (?, ?, ?)
        `);
        const result = stmt.run(firstname, lastname, country);
        
        res.status(201).json({ id: result.lastInsertRowid, firstname, lastname, country }); 
    } catch (error) {
        console.error("Error creating player:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;