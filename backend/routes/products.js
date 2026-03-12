import express from 'express';
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';

const router = express.Router();

// 1. Criar novo produto (POST)
router.post('/', createProduct);

// 2. Obter todos os produtos (GET) - Agora com suporte a ?category=&filling=&sort=
router.get('/', getProducts);

// 3. Obter um produto por ID (GET)
router.get('/:id', getProductById);

// 4. Atualizar um produto (PUT)
router.put('/:id', updateProduct);

// 5. Deletar um produto (DELETE)
router.delete('/:id', deleteProduct);

export default router;
