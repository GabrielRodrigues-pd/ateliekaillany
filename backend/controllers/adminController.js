import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Generate strict token with ID and Email
    const payload = {
      id: admin._id,
      email: admin.email
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'atelie_secret_key',
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.status(200).json({ token, admin: { email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};
