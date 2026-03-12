import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
  // Extract token from Header
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    // Using a default secret if not provided in .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'atelie_secret_key');
    req.admin = decoded; // Attach admin details to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

export default authAdmin;
