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
    title: "Trio de Ovos",
    description: "O kit contém 3 ovos de colher de 50g cada.",
  },
  {
    image: ovoChocolatudo,
    title: "Ovo Chocolatudo",
    description: "Recheio de chocolate com brigadeiro.",
  },
  {
    image: miniOvoColher,
    title: "Mini Ovos de Colher",
    description: "Acompanha caixa de sacola luxo.",
  },
  {
    image: ovoNinhoNutella,
    title: "Ovo Ninho com Nutella",
    description: "Recheio de ninho com nutella.",
  },
  {
    image: ovoNinhoMorango,
    title: "Ovo Ninho com Morango",
    description: "Recheio de ninho com morango.",
  },
  {
    image: ovoDoisAmores,
    title: "Ovo Dois Amores", 
    description: "Recheio de brigadeiro branco e brigadeiro preto.",
  },
  {
    image: sacolinha,
    title: "Sacolinha Infantil",
    description: "Casca deliciosa!",
  },
  {
    image: ovoBrownie,
    title: "Ovo Brownie",
    description: "Casca brownie com chocolate meio amargo",
  }
  ,
  {
    image: ovoFerrero,
    title: "Ovo Ferrero",
    description: "Recheio chocolate, amendoim e nutella.",
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
