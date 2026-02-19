import CardsIndulge from "../CardsIndulge";
import "./IndulgeSection.css";
import ovoCombo from "../../assets/ovoCombo.jpg";
import ovoColher from "../../assets/ovoColher.jpg";
import ovoTrufado from "../../assets/ovoTrufado.jpg";

export default function IndulgeSection() {
  return (
    <section className="indulge">
      <div className="container indulge-header">
        <span className="indulge-eyebrow">Crafted</span>
        <h2>Three ways to indulge</h2>
        <p>Rich chocolate shells hide treasures within each bite</p>
      </div>

      <div className="container indulge-grid">
        {/* CARD 1 */}
        <CardsIndulge
          categoria={"Clássico"}
          title={"Ovos de Páscoa recheados e repletos de sabor"}
          descri={"Recheio cremoso envolto em chocolate temperado."}
          img={ovoCombo}
          alt={"Classic Easter eggs"}
        />

        {/* CARD 2 */}
        <CardsIndulge
          categoria={"Elegante"}
          title={"Ovos com colher para um paladar refinado"}
          descri={"Conchas delicadas que se abrem com expectativa."}
          img={ovoColher}
          alt={"Elegant spoon eggs"}
        />

        {/* CARD 3 */}
        <CardsIndulge
          categoria={"Decadente"}
          title={"Ovos trufados em camadas com uma complexidade escura"}
          descri={"Centros de ganache que merecem ser saboreados."}
          img={ovoTrufado}
          alt={"Decadent truffled eggs"}
        />
      </div>
    </section>
  );
}
