import Product from '../models/Product.js';

// 1. Criar novo produto (POST)
export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. Obter produtos com filtros e ordenação (GET)
export const getProducts = async (req, res) => {
  try {
    const { category, filling, sort } = req.query;
    
    let filter = {};
    if (category && category !== 'Todos') {
      if (category === 'Colher 50g') {
        filter.category = { $in: ['Colher 50g', 'Kit Degustação'] };
      } else {
        filter.category = category;
      }
    }
    if (filling && filling !== 'Todos') {
      filter.filling = filling;
    }

    // Construir objeto de ordenação
    let sortOptions = {};
    if (sort === 'price_asc' || sort === 'Crescente') {
      sortOptions.price = 1;
    } else if (sort === 'price_desc' || sort === 'Decrescente') {
      sortOptions.price = -1;
    } else {
      sortOptions.createdAt = -1; // Padrão: mais recentes primeiro
    }

    const products = await Product.find(filter).sort(sortOptions);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Obter um produto por ID (GET)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Atualizar um produto (PUT)
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 5. Deletar um produto (DELETE)
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json({ message: 'Produto deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
