import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'O nome do cliente é obrigatório']
  },
  phone: {
    type: String,
    required: [true, 'O telefone é obrigatório']
  },
  product: {
    type: String,
    required: [true, 'O produto é obrigatório']
  },
  quantity: {
    type: Number,
    required: [true, 'A quantidade é obrigatória'],
    min: [1, 'A quantidade deve ser de no mínimo 1']
  },
  city: {
    type: String,
    required: [true, 'A cidade é obrigatória']
  },
  totalPrice: {
    type: Number,
    required: [true, 'O preço total é obrigatório']
  },
  status: {
    type: String,
    enum: ['novo', 'em_producao', 'pronto', 'entregue', 'cancelado'],
    default: 'novo'
  },
  paymentStatus: {
    type: String,
    enum: ['pendente', 'pago', 'cancelado'],
    default: 'pendente'
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true // Índice para busca rápida de pedidos do usuário
  },
  scheduledDeliveryDate: {
    type: Date,
    default: null
  },
  scheduledDeliveryLocation: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
