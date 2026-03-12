import { useState } from "react";
import CardsIndulge from "../CardsIndulge";
import "./IndulgeSection.css";
import ovoTrio from "../../assets/ovoTrio.png";
import ovoChocolatudo from "../../assets/ovoChocolatudo.png";
import miniOvoColher from "../../assets/miniOvoColher.png";
import ovoNinhoNutella from "../../assets/ovoNinhoNutella.png";
import ovoNinhoMorango from "../../assets/ovoNinhoMorango.png";
import ovoDoisAmores from "../../assets/ovoDoisAmores.png";
import sacolinha from "../../assets/sacolinha.png";
import ovoBrownie from "../../assets/ovoBrownie.png";
import ovoFerrero from "../../assets/ovoFerrero.png";
import ovoColher from "../../assets/ovoColher.jpg";

// Mock Product Data
const productsData = [
  {
    id: "1",
    categoria: "Colher",
    title: "Ovo Chocolatudo",
    descri: "Casca de chocolate meio amargo, recheio de chocolate com brigadeiro.",
    img: ovoChocolatudo,
    alt: "Classic Easter eggs",
    price: 89.9,
    prices: { "250g": 69.90, "350g": 89.90 },
    chocolateType: "Meio Amargo",
    filling: "Chocolate"
  },
  {
    id: "2",
    categoria: "Infantil",
    title: "Sacolinha de Ovos",
    descri: "Sacolinha de Ovos de 50g cada.",
    img: sacolinha,
    alt: "Sacolinha de Ovos",
    price: 35.0,
    chocolateType: "Meio Amargo",
    filling: "Tradicional"
  },
  {
    id: "3",
    categoria: "Trio de Ovos",
    title: "Trio de Ovos",
    descri: "O kit contém 3 ovos de colher de 50g cada. Recheio a escolha do cliente.",
    img: ovoTrio,
    alt: "Trio de Ovos",
    price: 25.0,
    chocolateType: "Branco",
    filling: ""
  },
  {
    id: "4",
    categoria: "Colher 50g",
    title: "Mini Ovos de Colher",
    descri: "Ovo de colher de 50g. Acompanha caixa de sacola luxo.",
    img: miniOvoColher,
    alt: "Mini Ovos de Colher",
    price: 16.0,
    chocolateType: "Meio Amargo",
    filling: ""
  },
  {
    id: "5",
    categoria: "Colher",
    title: "Ovo Ferrero",
    descri: "Casca de chocolate meio amargo com amendoim, recheio chocolate, amendoim e nutella.",
    img: ovoFerrero,
    alt: "Ovo de ferrero com amendoim",
    price: 75.0,
    prices: { "250g": 55.00, "350g": 75.00 },
    chocolateType: "Meio Amargo",
    filling: "Chocolate"
  },
  {
    id: "6",
    categoria: "Colher",
    title: "Ovo Ninho com Nutella",
    descri: "Casca de chocolate meio amargo, recheio de ninho com nutella.",
    img: ovoNinhoNutella,
    alt: "Ovo de ninho com nutella",
    price: 74.99,
    prices: { "250g": 54.99, "350g": 74.99 },
    chocolateType: "Ao Leite",
    filling: "Ninho"
  },
  {
    id: "7",
    categoria: "Colher",
    title: "Ovo Brownie",
    descri: "Casca brownie com chocolate meio amargo, recheio chocolate e ninho.",
    img: ovoBrownie,
    alt: "Ovo brownie",
    price: 74.99,
    prices: { "250g": 54.99, "350g": 74.99 },
    chocolateType: "Meio Amargo",
    filling: "Chocolate"
  },
  {
    id: "8",
    categoria: "Colher",
    title: "Ovo Ninho com Morango",
    descri: "Casca chocolate meio amargo, recheio ninho e morango.",
    img: ovoNinhoMorango,
    alt: "Ovo de ninho com morango",
    price: 74.99,
    prices: { "250g": 54.99, "350g": 74.99 },
    chocolateType: "Meio Amargo",
    filling: "Ninho"
  },
  {
    id: "9",
    categoria: "Colher",
    title: "Ovo Dois Amores",
    descri: "Casca chocolate meio amargo, recheio ninho e morango.",
    img: ovoDoisAmores,
    alt: "Ovo de ninho com morango",
    price: 74.99,
    prices: { "250g": 54.99, "350g": 74.99 },
    chocolateType: "Meio Amargo",
    filling: "Ninho"
  }
];

export default function IndulgeSection() {
  const [filterFilling, setFilterFilling] = useState("Todos");
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [sortPrice, setSortPrice] = useState("Normal");

  // Filtering Logic
  let filteredProducts = productsData.filter((product) => {
    const matchFilling = filterFilling === "Todos" || product.filling === filterFilling;
    const matchCategory = filterCategory === "Todos" || product.categoria === filterCategory;
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
        <h2>Três maneiras luxuosas de saborear nossos Ovos de Páscoa</h2>
        <p>Cascas ricas de chocolate belga escondem verdadeiros tesouros a cada mordida.</p>
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
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <CardsIndulge
              key={product.id}
              id={product.id}
              categoria={product.categoria}
              title={product.title}
              descri={product.descri}
              img={product.img}
              alt={product.alt}
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
