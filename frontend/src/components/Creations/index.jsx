import "./Creations.css";
import Carrossel from "../Carrossel";
import ovoTrio from "../../assets/ovoTrio.png";
import ovoChocolatudo from "../../assets/ovoChocolatudo.png";
import miniOvoColher from "../../assets/miniOvoColher.png";
import ovoNinhoNutella from "../../assets/ovoNinhoNutella.png";
import ovoNinhoMorango from "../../assets/ovoNinhoMorango.png";
import ovoDoisAmores from "../../assets/ovoDoisAmores.png";
import sacolinha from "../../assets/sacolinha.png";
import ovoBrownie from "../../assets/ovoBrownie.png";
import ovoFerrero from "../../assets/ovoFerrero.png";

const items = [
  {
    image: ovoTrio,
    title: "Ovo Oreo",
    description: "Chocolate meio amargo com recheio cremoso",
  },
  {
    image: ovoChocolatudo,
    title: "Ovo Tradicional",
    description: "Chocolate ao leite artesanal",
  },
  {
    image: miniOvoColher,
    title: "Ovo Frutas Vermelhas",
    description: "Recheio cremoso com frutas",
  },
  {
    image: ovoNinhoNutella,
    title: "Ovo Frutas Vermelhas",
    description: "Recheio cremoso com frutas",
  },
  {
    image: ovoNinhoMorango,
    title: "Ovo Frutas Vermelhas",
    description: "Recheio cremoso com frutas",
  },
  {
    image: ovoDoisAmores,
    title: "Ovo Frutas Vermelhas",
    description: "Recheio cremoso com frutas",
  },
  {
    image: sacolinha,
    title: "Ovo Frutas Vermelhas",
    description: "Recheio cremoso com frutas",
  },
  {
    image: ovoBrownie,
    title: "Ovo Frutas Vermelhas",
    description: "Recheio cremoso com frutas",
  }
  ,
  {
    image: ovoFerrero,
    title: "Ovo Frutas Vermelhas",
    description: "Recheio cremoso com frutas",
  }
];

export default function Creations() {
  return (
    <section className="creations" id="criacoes">
      <div className="container creations-header">
        <h2>Nossas criações</h2>
        <p>Cada ovo é uma pequena obra de arte.</p>
        <Carrossel items={items} />
      </div>
    </section>
  );
}
