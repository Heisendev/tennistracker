import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

router.get('/api/matchs', (req, res) => {
    try {
        const db = getDatabase();
        const matchs = db.prepare(`
            SELECT * FROM matchs
            `).all(); 
        
            res.json(matchs); 
    } catch (error) {
        console.error("Error fetching matchs:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});