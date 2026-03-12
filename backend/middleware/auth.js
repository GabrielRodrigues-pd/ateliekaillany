import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Autenticação necessária. Por favor, faça login.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erro na validação do token de usuário:', error.message);
    res.status(401).json({ message: 'Sessão expirada ou inválida. Faça login novamente.' });
  }
};

export default authUser;
