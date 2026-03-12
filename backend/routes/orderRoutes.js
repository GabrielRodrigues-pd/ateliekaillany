import { getOrders, createOrder, updateOrderStatus, getUserOrders, cancelOrder, deleteOrder, getAdminOrders, updateDeliverySchedule, updateOrderAdmin } from '../controllers/orderController.js';
import authAdmin from '../middleware/authAdmin.js';
import authUser from '../middleware/auth.js';

const router = express.Router();

// --- ADMIN ROUTES (Prefixed with /admin for clarity) ---

// GET /api/orders/admin/all - Active orders for dashboard
router.get('/admin/all', authAdmin, getOrders);

// GET /api/orders/admin/history - Canceled/Deleted orders
router.get('/admin/history', authAdmin, getAdminOrders);

// PATCH /api/orders/admin/status/:id - Update order status
router.patch('/admin/status/:id', authAdmin, updateOrderStatus);

// PATCH /api/orders/admin/schedule/:id - Update delivery schedule
router.patch('/admin/schedule/:id', authAdmin, updateDeliverySchedule);

// PATCH /api/orders/admin/update/:id - Update full order details
router.patch('/admin/update/:id', authAdmin, updateOrderAdmin);

// DELETE /api/orders/admin/delete/:id - Soft delete order
router.delete('/admin/delete/:id', authAdmin, deleteOrder);


// --- CUSTOMER ROUTES ---

// GET /api/orders/user-orders - Orders for the logged-in customer
router.get('/user-orders', authUser, getUserOrders);

// POST /api/orders - Create a new order (Public)
router.post('/', createOrder);

// PATCH /api/orders/user/cancel/:id - Cancel order (Customer)
router.patch('/user/cancel/:id', authUser, cancelOrder);

export default router;
