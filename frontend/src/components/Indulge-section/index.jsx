import { useState, useEffect } from "react";
import CardsIndulge from "../CardsIndulge";
import { getImage } from "../../utils/imageMapper";
import api from "../../services/api";
import "./IndulgeSection.css";

export default function IndulgeSection() {
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterFilling, setFilterFilling] = useState("Todos");
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [sortPrice, setSortPrice] = useState("Normal");

  // Fetch products from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProductsData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Não foi possível carregar os produtos. Tente novamente mais tarde.");
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtering Logic
  let filteredProducts = productsData.filter((product) => {
    const matchFilling = filterFilling === "Todos" || product.filling === filterFilling;
    // Database maps categories like "Trio de Ovos", "Colher", "Infantil"
    const matchCategory = filterCategory === "Todos" || product.category === filterCategory;
    return matchFilling && matchCategory;
  });

  // Sorting Logic - crucial to create a new array copy to avoid mutating the original source
  const sortedProducts = [...filteredProducts];
  if (sortPrice === "Crescente") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortPrice === "Decrescente") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <section className="indulge" id="produtos">
      <div className="container indulge-header">
        <span className="indulge-eyebrow">Feito à mão com muito carinho</span>
        <h2>Faça seu Pedido</h2>
        <p>Escolha seu doce favorito e finalize o pedido pelo WhatsApp.</p>
      </div>

      <div className="container filters-container">
        <div className="filter-group">
          <label htmlFor="egg-type">Tipo de ovo:</label>
          <select 
            id="egg-type" 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Colher">Colher</option>
            <option value="Trufado">Trufado</option>
            <option value="Trio de Ovos">Trio de ovos</option>
            <option value="Infantil">Infantil</option>
          </select>
        </div>


        <div className="filter-group">
          <label htmlFor="filling-type">Recheio:</label>
          <select 
            id="filling-type" 
            value={filterFilling} 
            onChange={(e) => setFilterFilling(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Chocolate">Chocolate</option>
            <option value="Ninho">Ninho</option>
          </select>
        </div>

        <div className="filter-group sort-group">
          <label htmlFor="sort-price">Preço:</label>
          <select 
            id="sort-price" 
            value={sortPrice} 
            onChange={(e) => setSortPrice(e.target.value)}
          >
            <option value="Normal">Padrão</option>
            <option value="Crescente">Menor Preço</option>
            <option value="Decrescente">Maior Preço</option>
          </select>
        </div>
      </div>

      <div className="container indulge-grid">
        {isLoading ? (
          <p className="loading-msg" style={{textAlign: "center", width: "100%", padding: "40px"}}>Carregando produtos deliciosos...</p>
        ) : error ? (
           <p className="error-msg" style={{textAlign: "center", width: "100%", padding: "40px", color: "var(--primary)"}}>{error}</p>
        ) : sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <CardsIndulge
              key={product._id}
              id={product._id}
              categoria={product.category}
              title={product.title}
              descri={product.description}
              img={getImage(product.imageUrl)}
              alt={product.title}
              price={product.price}
              prices={product.prices}
            />
          ))
        ) : (
          <p className="no-products-msg">Nenhum produto encontrado com esses filtros.</p>
        )}
      </div>
    </section>
  );
}
