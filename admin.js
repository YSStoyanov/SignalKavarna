const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./config/db'); // Импортираме свързването с PostgreSQL
const signalsRoutes = require('./routes/signals'); // Роут за сигналите
const adminAuth = require('./middleware/auth'); // Middleware за проверка на админ роля

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Тайна за JWT (взета от .env файл)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey12345';

// Логин рут
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Проверка на потребителя в PostgreSQL
  pool.query(
    'SELECT * FROM users WHERE username = $1 AND password = $2',
    [username, password],
    (err, result) => {
      if (err) {
        console.error('Database Error:', err.message);
        return res.status(500).json({ error: 'Сървърна грешка' });
      }

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Невалидно потребителско име или парола!' });
      }

      const user = result.rows[0];

      // Генериране на JWT токен
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token });
    }
  );
});

// Защитен рут за сигналите
app.use('/api/signals', adminAuth, signalsRoutes);

// Главна страница (тестово съобщение)
app.get('/', (req, res) => {
  res.send('Сървърът работи успешно!');
});

// Стартиране на сървъра
app.listen(PORT, () => {
  console.log(`Сървърът работи на http://localhost:${PORT}`);
});