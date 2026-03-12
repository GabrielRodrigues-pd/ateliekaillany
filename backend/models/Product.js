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
    required: [true, 'O preço do produto é obrigatório']
  },
  // Por exemplo, "Colher", "Trufado", "Trio de Ovos", "Infantil"
  category: {
    type: String,
    required: [true, 'Você deve classificar o tipo do ovo ou produto'],
    default: 'Diversos'
  },
  // Ex: "Chocolate", "Ninho"
  filling: {
    type: String,
    default: ""
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
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
