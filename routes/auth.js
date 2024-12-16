const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../config/db');
const SECRET_KEY = 'supersecretkey12345';

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Невалидно потребителско име или парола' });
        }

        const user = result.rows[0];
        const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Грешка с базата данни' });
    }
});

module.exports = router;