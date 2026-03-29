import express from 'express';
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import authAdmin from '../middleware/authAdmin.js';

const router = express.Router();

// 1. Criar novo produto (POST) - Protegido
router.post('/admin/', authAdmin, createProduct);

// 2. Obter todos os produtos (GET) - Público
router.get('/', getProducts);

// 3. Obter um produto por ID (GET) - Público
router.get('/:id', getProductById);

// 4. Atualizar um produto (PUT) - Protegido
router.put('/admin/:id', authAdmin, updateProduct);

// 5. Deletar um produto (DELETE) - Protegido
router.delete('/admin/:id', authAdmin, deleteProduct);

export default router;
