import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Configurações do ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // Permite ler JSON no corpo das requisições

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Rota inicial padrão
app.get('/', (req, res) => {
  res.send('API do Ateliê Kaillany Nunes operando normalmente!');
});

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, {
  // Configurações de conexão padrão (não são mais obrigatórias no mongoose 6+ mas ajudam a evitar avisos)
})
.then(() => {
  console.log('Conectado ao MongoDB com sucesso!');
  // Iniciar servidor apenas se conectar ao banco de dados com sucesso
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
})
.catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err.message);
});
