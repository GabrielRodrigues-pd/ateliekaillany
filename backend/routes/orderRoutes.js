import express from 'express';
import { getOrders, createOrder, updateOrderStatus } from '../controllers/orderController.js';
import authAdmin from '../middleware/authAdmin.js';

const router = express.Router();

// GET /api/orders - Protegido pelo middleware authAdmin
router.get('/', authAdmin, getOrders);

// POST /api/orders - Aberto para os clientes criarem pedidos
router.post('/', createOrder);

// PATCH /api/orders/:id/status - Protegido pelo middleware authAdmin
router.patch('/:id/status', authAdmin, updateOrderStatus);

export default router;
