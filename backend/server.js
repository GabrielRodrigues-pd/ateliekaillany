import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import productRoutes from './routes/products.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Configurações do ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de Segurança e Produção
app.use(helmet()); // Adiciona headers de segurança
app.use(morgan('dev')); // Logging de requisições

// Limitação de Taxa (Rate Limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: 'Muitas requisições vindas deste IP, tente novamente em 15 minutos.'
});
app.use('/api/', limiter);

// CORS restrito (Whitelist)
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

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

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error('ERRO GLOBAL:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Ocorreu um erro interno no servidor.',
    // Apenas envia o stack em desenvolvimento para segurança
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Iniciar servidor imediatamente para evitar timeout no deploy
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  
  // Conectar ao MongoDB em segundo plano
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB com sucesso!'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err.message));
});
