import { useState, useEffect } from "react";
import CardsIndulge from "../CardsIndulge";
import { getImage } from "../../utils/imageMapper";
import api from "../../services/api";
import LoadingOverlay from "../LoadingOverlay";
import "./IndulgeSection.css";

export default function IndulgeSection() {
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterFilling, setFilterFilling] = useState("Todos");
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [sortPrice, setSortPrice] = useState("Normal");

  // Fetch products from the backend API with server-side filtering and sorting
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (filterCategory !== "Todos") params.append("category", filterCategory);
        if (filterFilling !== "Todos") params.append("filling", filterFilling);
        if (sortPrice !== "Normal") params.append("sort", sortPrice);

        const response = await api.get(`/products?${params.toString()}`);
        setProductsData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Não foi possível carregar os produtos. Tente novamente mais tarde.");
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [filterCategory, filterFilling, sortPrice]);

  // Sorting and Filtering are now handled by the server
  const sortedProducts = productsData;

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
            <option value="Ovos de Colher">Ovos de Colher</option>
            <option value="Trufados">Trufados</option>
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
          <LoadingOverlay message="Preparando nossa vitrine de delícias..." />
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
              isAvailable={product.isAvailable}
            />
          ))
        ) : (
          <div className="no-products-container" style={{width: '100%', textAlign: 'center', padding: '40px'}}>
             <p className="no-products-msg">Nenhum produto encontrado com esses filtros.</p>
          </div>
        )}
      </div>
    </section>
  );
}
