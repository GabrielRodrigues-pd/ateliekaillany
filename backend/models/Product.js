import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'O nome do produto é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'A descrição do produto é obrigatória']
  },
  price: {
    type: Number,
    required: [true, 'O preço do produto é obrigatório'],
    index: true // Adicionado índice para ordenação/filtro de preço
  },
  prices: {
    type: Map,
    of: Number,
    default: undefined
  },
  // Por exemplo, "Colher", "Trufado", "Trio de Ovos", "Infantil"
  category: {
    type: String,
    required: [true, 'Você deve classificar o tipo do ovo ou produto'],
    default: 'Diversos',
    index: true // Adicionado índice para filtro por categoria
  },
  // Ex: "Chocolate", "Ninho"
  filling: {
    type: String,
    default: "",
    index: true // Adicionado índice para filtro por recheio
  },
  weight: {
    type: String, // ex: "250g", "350g"
    default: ""
  },
  imageUrl: {
    type: String, // String para a URL da imagem ou import static no frontend 
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Adicionado índice para ordenação padrão
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
