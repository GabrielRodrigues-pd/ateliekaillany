import Order from '../models/Order.js';

// Get all orders ordered by latest (excluding deleted)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos', error: error.message });
  }
};

// Get canceled/all orders including canceled (Admin)
export const getAdminOrders = async (req, res) => {
  try {
    const { includeDeleted } = req.query;
    const filter = includeDeleted === 'true' ? {} : { isDeleted: false };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos admin', error: error.message });
  }
};

// Create a new order (Optional, usually for the frontend checkout itself later)
export const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['novo', 'em_producao', 'pronto', 'entregue', 'cancelado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return updated doc
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pedido', error: error.message });
  }
};

// Get orders for the logged-in user (Cleaning up old canceled or deleted ones)
export const getUserOrders = async (req, res) => {
  try {
    // Visibility window: 24 hours for canceled orders
    const visibilityWindow = 24 * 60 * 60 * 1000;
    const cutoff = new Date(Date.now() - visibilityWindow);

    const orders = await Order.find({ 
      userId: req.user.id,
      isDeleted: false, // Don't show soft-deleted orders to the user
      $or: [
        { status: { $ne: 'cancelado' } }, // Show all non-canceled orders
        { status: 'cancelado', updatedAt: { $gte: cutoff } } // Show canceled only if updated in last 24h
      ]
    }).sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar seus pedidos', error: error.message });
  }
};

// Soft delete an order (Admin only)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    
    res.status(200).json({ message: 'Pedido excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir pedido', error: error.message });
  }
};

// Cancel an order (Customer)
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    // Security: Only allow cancellation if user owns the order
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Não autorizado a cancelar este pedido' });
    }

    // Policy: Only allow cancellation if status is 'novo'
    if (order.status !== 'novo') {
      return res.status(400).json({ message: 'Não é possível cancelar um pedido que já está em produção ou finalizado.' });
    }

    order.status = 'cancelado';
    order.cancellationReason = reason || 'Nenhum motivo fornecido';
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cancelar pedido', error: error.message });
  }
};

// Update delivery schedule (Admin)
export const updateDeliverySchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, location } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        scheduledDeliveryDate: date, 
        scheduledDeliveryLocation: location 
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao agendar entrega', error: error.message });
  }
};

// Update full order details (Admin)
export const updateOrderAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pedido', error: error.message });
  }
};
