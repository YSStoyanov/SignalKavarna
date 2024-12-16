const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET: Извличане на сигнали
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM signals');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Грешка с базата данни' });
    }
});

// POST: Добавяне на нов сигнал
router.post('/', async (req, res) => {
    const { description, location, contact } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO signals (description, location, contact) VALUES ($1, $2, $3) RETURNING *',
            [description, location, contact]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Грешка с базата данни' });
    }
});

module.exports = router;