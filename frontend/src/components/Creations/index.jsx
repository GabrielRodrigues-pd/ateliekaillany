import "./Creations.css";
import Carrossel from "../Carrossel";
import ovoColher from "../../assets/ovoColher.jpg";
import ovoColherMorango from "../../assets/ovoColherMorango.png";
import ovoColherBranco from "../../assets/ovoColherBranco.png";
import ovoColherOreo from "../../assets/ovoColherOreo.png";

const items = [
  {
    image: ovoColherBranco,
    title: "Ovo Oreo",
    description: "Chocolate meio amargo com recheio cremoso",
  },
  {
    image: ovoColherMorango,
    title: "Ovo Tradicional",
    description: "Chocolate ao leite artesanal",
  },
  {
    image: ovoColherOreo,
    title: "Ovo Frutas Vermelhas",
    description: "Recheio cremoso com frutas",
  },
  {
    image: ovoColher,
    title: "Ovo Frutas Vermelhas",
    description: "Recheio cremoso com frutas",
  },
];

export default function Creations() {
  return (
    <section className="creations">
      <div className="container creations-header">
        <h2>Nossas criações</h2>
        <p>Cada ovo é uma pequena obra de arte.</p>
        <Carrossel items={items} />
      </div>
    </section>
  );
}
