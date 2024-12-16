const pool = require('../config/db');

// Граници на община Каварна
const kavarnaBounds = {
  north: 43.5,
  south: 43.35,
  east: 28.45,
  west: 28.2,
};

// Проверка за геолокация в границите на Каварна
const isWithinKavarna = (latitude, longitude) => {
  return (
    latitude >= kavarnaBounds.south &&
    latitude <= kavarnaBounds.north &&
    longitude >= kavarnaBounds.west &&
    longitude <= kavarnaBounds.east
  );
};

// Вземане на всички сигнали
const getAllSignals = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM signals');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Грешка:', error.message);
    res.status(500).send('Грешка при вземане на сигналите.');
  }
};

// Създаване на нов сигнал
const createSignal = async (req, res) => {
  const { name, description, latitude, longitude, phone, email, image_url, about, category, status, contact_info } = req.body;

  // Проверка дали геолокацията е в границите на Каварна
  if (!isWithinKavarna(latitude, longitude)) {
    return res.status(400).send('Местоположението е извън границите на община Каварна.');
  }

  try {
    const query = `
      INSERT INTO signals (name, description, latitude, longitude, phone, email, image_url, about, category, status, contact_info)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`;
    const values = [name, description, latitude, longitude, phone, email, image_url, about, category, status, contact_info];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Грешка:', error.message);
    res.status(500).send('Грешка при създаване на сигнал.');
  }
};

// Обновяване на статус на сигнал
const updateSignalStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const query = `
      UPDATE signals
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`;
    const values = [status, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).send('Сигналът не е намерен.');
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Грешка:', error.message);
    res.status(500).send('Грешка при обновяване на статус.');
  }
};

// Изтриване на сигнал (само за администратори)
const deleteSignal = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Нямате права за изтриване на сигнал.');
  }

  const { id } = req.params;
  try {
    const query = 'DELETE FROM signals WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Сигналът не е намерен.');
    }

    res.status(200).json({ message: 'Сигналът е изтрит.' });
  } catch (error) {
    console.error('Грешка:', error.message);
    res.status(500).send('Грешка при изтриване на сигнал.');
  }
};

module.exports = {
  getAllSignals,
  createSignal,
  updateSignalStatus,
  deleteSignal,
};