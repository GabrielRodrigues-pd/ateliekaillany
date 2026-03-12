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
    enum: ['novo', 'em_producao', 'entregue'],
    default: 'novo'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
