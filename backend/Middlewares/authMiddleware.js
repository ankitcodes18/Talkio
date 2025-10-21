import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token found' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');

    req.user = decoded; 

    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};
