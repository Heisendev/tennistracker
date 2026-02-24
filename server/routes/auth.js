import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../db.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        if (username.trim().length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const db = getDatabase();
        const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username.trim());
        if (existing) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const result = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username.trim(), password_hash);

        // Ensure session exists before setting userId
        if (req.session) {
            req.session.userId = result.lastInsertRowid;
        } else {
            console.error('Session not initialized during signup');
        }
        res.status(201).json({ id: result.lastInsertRowid, username: username.trim() });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const db = getDatabase();
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim());
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Ensure session exists before setting userId
        if (req.session) {
            req.session.userId = user.id;
        } else {
            console.error('Session not initialized during login');
        }
        res.json({ id: user.id, username: user.username });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out' });
    });
});

router.get('/me', (req, res) => {
    if (!req.session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const db = getDatabase();
    const user = db.prepare('SELECT id, username FROM users WHERE id = ?').get(req.session.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

export default router;
