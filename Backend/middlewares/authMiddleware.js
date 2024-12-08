const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key';

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
    
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
