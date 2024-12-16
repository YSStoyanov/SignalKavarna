const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Не сте упълномощени' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey12345');
    req.user = verified;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Достъп само за администратори' });
    }

    next();
  } catch (err) {
    res.status(400).json({ message: 'Невалиден токен' });
  }
};

module.exports = adminAuth;