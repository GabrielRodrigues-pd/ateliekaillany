import { useState } from "react";
import CardsIndulge from "../CardsIndulge";
import "./IndulgeSection.css";
import ovoCombo from "../../assets/ovoCombo.jpg";
import ovoColher from "../../assets/ovoColher.jpg";
import ovoTrufado from "../../assets/ovoTrufado.jpg";

// Mock Product Data
const productsData = [
  {
    id: "classic-egg-1",
    categoria: "Clássico",
    title: "Ovo de Páscoa Tradicional Recheado",
    descri: "Recheio cremoso envolto em chocolate temperado.",
    img: ovoCombo,
    alt: "Classic Easter eggs",
    price: 89.9,
    chocolateType: "Ao Leite",
    filling: "Tradicional"
  },
  {
    id: "elegant-egg-1",
    categoria: "Elegante",
    title: "Ovo com Colher Ninho e Nutella",
    descri: "Conchas delicadas que se abrem com expectativa.",
    img: ovoColher,
    alt: "Elegant spoon eggs",
    price: 115.0,
    chocolateType: "Branco",
    filling: "Trufado"
  },
  {
    id: "decadent-egg-1",
    categoria: "Decadente",
    title: "Ovo Trufado Frutas Vermelhas",
    descri: "Centros de ganache que merecem ser saboreados.",
    img: ovoTrufado,
    alt: "Decadent truffled eggs",
    price: 145.5,
    chocolateType: "Meio Amargo",
    filling: "Frutas"
  },
  {
    id: "classic-egg-2",
    categoria: "Clássico",
    title: "Ovo de Páscoa Crocante Amargo",
    descri: "Sabor intenso para amantes de cacau.",
    img: ovoCombo,
    alt: "Dark Chocolate egg",
    price: 95.0,
    chocolateType: "Meio Amargo",
    filling: "Tradicional"
  },
  {
    id: "elegant-egg-2",
    categoria: "Elegante",
    title: "Ovo de Colher Brigadeiro",
    descri: "O clássico brasileiro na versão de colher.",
    img: ovoColher,
    alt: "Brigadeiro spoon eggs",
    price: 105.0,
    chocolateType: "Ao Leite",
    filling: "Trufado"
  },
  {
    id: "decadent-egg-2",
    categoria: "Decadente",
    title: "Ovo Trufado Maracujá Branco",
    descri: "O contraste perfeito entre o doce e o cítrico.",
    img: ovoTrufado,
    alt: "Passion fruit truffled eggs",
    price: 135.0,
    chocolateType: "Branco",
    filling: "Frutas"
  }
];

export default function IndulgeSection() {
  const [filterChocolate, setFilterChocolate] = useState("Todos");
  const [filterFilling, setFilterFilling] = useState("Todos");
  const [sortPrice, setSortPrice] = useState("Normal");

  // Filtering Logic
  let filteredProducts = productsData.filter((product) => {
    const matchChocolate = filterChocolate === "Todos" || product.chocolateType === filterChocolate;
    const matchFilling = filterFilling === "Todos" || product.filling === filterFilling;
    return matchChocolate && matchFilling;
  });

  // Sorting Logic
  if (sortPrice === "Crescente") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortPrice === "Decrescente") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <section className="indulge" id="produtos">
      <div className="container indulge-header">
        <span className="indulge-eyebrow">Feito à mão com muito carinho</span>
        <h2>Três maneiras luxuosas de saborear nossos Ovos de Páscoa</h2>
        <p>Cascas ricas de chocolate belga escondem verdadeiros tesouros a cada mordida.</p>
      </div>

      <div className="container filters-container">
        <div className="filter-group">
          <label htmlFor="chocolate-type">Chocolate:</label>
          <select 
            id="chocolate-type" 
            value={filterChocolate} 
            onChange={(e) => setFilterChocolate(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Ao Leite">Ao Leite</option>
            <option value="Meio Amargo">Meio Amargo</option>
            <option value="Branco">Branco</option>
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
            <option value="Tradicional">Tradicional</option>
            <option value="Trufado">Trufado</option>
            <option value="Frutas">Frutas</option>
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
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <CardsIndulge
              key={product.id}
              id={product.id}
              categoria={product.categoria}
              title={product.title}
              descri={product.descri}
              img={product.img}
              alt={product.alt}
              price={product.price}
            />
          ))
        ) : (
          <p className="no-products-msg">Nenhum produto encontrado com esses filtros.</p>
        )}
      </div>
    </section>
  );
}
