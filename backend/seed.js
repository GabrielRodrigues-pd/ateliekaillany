import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const initialProducts = [
  {
    category: "Colher",
    title: "Ovo Chocolatudo",
    description: "Casca de chocolate meio amargo, recheio de chocolate com brigadeiro.",
    imageUrl: "ovoChocolatudo.png",
    price: 89.9,
    prices: { "250g": 69.90, "350g": 89.90 },
    filling: "Chocolate",
    weight: "350g"
  },
  {
    category: "Infantil",
    title: "Sacolinha de Ovos",
    description: "Sacolinha de Ovos de 50g cada.",
    imageUrl: "sacolinha.png",
    price: 35.0,
    filling: "Chocolate",
    weight: "50g"
  },
  {
    category: "Trio de Ovos",
    title: "Trio de Ovos",
    description: "O kit contém 3 ovos de colher de 50g cada. Recheio a escolha do cliente.",
    imageUrl: "ovoTrio.png",
    price: 25.0,
    filling: "",
    weight: "150g"
  },
  {
    category: "Colher",
    title: "Mini Ovos de Colher",
    description: "Ovo de colher de 50g. Acompanha caixa de sacola luxo.",
    imageUrl: "miniOvoColher.png",
    price: 16.0,
    filling: "",
    weight: "50g"
  },
  {
    category: "Colher",
    title: "Ovo Ferrero",
    description: "Casca de chocolate meio amargo com amendoim, recheio chocolate, amendoim e nutella.",
    imageUrl: "ovoFerrero.png",
    price: 75.0,
    prices: { "250g": 55.00, "350g": 75.00 },
    filling: "Chocolate",
    weight: "350g"
  },
  {
    category: "Colher",
    title: "Ovo Ninho com Nutella",
    description: "Casca de chocolate meio amargo, recheio de ninho com nutella.",
    imageUrl: "ovoNinhoNutella.png",
    price: 74.99,
    prices: { "250g": 54.99, "350g": 74.99 },
    filling: "Ninho",
    weight: "350g"
  },
  {
    category: "Colher",
    title: "Ovo Brownie",
    description: "Casca brownie com chocolate meio amargo, recheio chocolate e ninho.",
    imageUrl: "ovoBrownie.png",
    price: 74.99,
    prices: { "250g": 54.99, "350g": 74.99 },
    filling: "Chocolate",
    weight: "350g"
  },
  {
    category: "Colher",
    title: "Ovo Ninho com Morango",
    description: "Casca chocolate meio amargo, recheio ninho e morango.",
    imageUrl: "ovoNinhoMorango.png",
    price: 74.99,
    prices: { "250g": 54.99, "350g": 74.99 },
    filling: "Ninho",
    weight: "350g"
  },
  {
    category: "Colher",
    title: "Ovo Dois Amores",
    description: "Casca chocolate meio amargo, recheio ninho e morango.",
    imageUrl: "ovoDoisAmores.png",
    price: 74.99,
    prices: { "250g": 54.99, "350g": 74.99 },
    filling: "Ninho",
    weight: "350g"
  }
];

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
       console.error("ERRO: Faltando string de conexão no arquivo .env");
       process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Conectado ao MongoDB!');

    // Limpar coleção atual antes de inserir
    await Product.deleteMany({});
    console.log('🗑️ Banco de dados limpo para nova semeadura.');

    // Inserir pacotes de ovos de páscoa
    await Product.insertMany(initialProducts);
    console.log('✅ Produtos semeados com sucesso do catálogo de testes!');

    mongoose.disconnect();
    console.log('👋 Desconectado.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  }
};

seedDB();
