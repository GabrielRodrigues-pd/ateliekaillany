import "./Creations.css";
import Carrossel from "../Carrossel";
import ovoColher from "../../assets/ovoColher.jpg";

const items = [
  {
    image: ovoColher,
    title: "Ovo Oreo",
    description: "Chocolate meio amargo com recheio cremoso",
  },
  {
    image: ovoColher,
    title: "Ovo Tradicional",
    description: "Chocolate ao leite artesanal",
  },
  {
    image: ovoColher,
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
        <h2>Our creations</h2>
        <p>Each egg is a small work of art</p>
        <Carrossel items={items} />
      </div>
    </section>
  );
}
