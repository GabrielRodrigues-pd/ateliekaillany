import CardsIndulge from "../CardsIndulge";
import "./IndulgeSection.css";
import ovoCombo from "../../assets/ovoCombo.jpg";
import ovoColher from "../../assets/ovoColher.jpg";
import ovoTrufado from "../../assets/ovoTrufado.jpg";

export default function IndulgeSection() {
  return (
    <section className="indulge" id="produtos">
      <div className="container indulge-header">
        <span className="indulge-eyebrow">Feito à mão com muito carinho</span>
        <h2>Três maneiras luxuosas de saborear nossos Ovos de Páscoa</h2>
        <p>Cascas ricas de chocolate belga escondem verdadeiros tesouros a cada mordida.</p>
      </div>

      <div className="container indulge-grid">
        {/* CARD 1 */}
        <CardsIndulge
          id="classic-egg"
          categoria={"Clássico"}
          title={"Ovos de Páscoa recheados e repletos de sabor"}
          descri={"Recheio cremoso envolto em chocolate temperado."}
          img={ovoCombo}
          alt={"Classic Easter eggs"}
          price={89.9}
        />

        {/* CARD 2 */}
        <CardsIndulge
          id="elegant-egg"
          categoria={"Elegante"}
          title={"Ovos com colher para um paladar refinado"}
          descri={"Conchas delicadas que se abrem com expectativa."}
          img={ovoColher}
          alt={"Elegant spoon eggs"}
          price={115.0}
        />

        {/* CARD 3 */}
        <CardsIndulge
          id="decadent-egg"
          categoria={"Decadente"}
          title={"Ovos trufados em camadas com uma complexidade escura"}
          descri={"Centros de ganache que merecem ser saboreados."}
          img={ovoTrufado}
          alt={"Decadent truffled eggs"}
          price={145.5}
        />
        <CardsIndulge
          id="classic-egg"
          categoria={"Clássico"}
          title={"Ovos de Páscoa recheados e repletos de sabor"}
          descri={"Recheio cremoso envolto em chocolate temperado."}
          img={ovoCombo}
          alt={"Classic Easter eggs"}
          price={89.9}
        />

        {/* CARD 2 */}
        <CardsIndulge
          id="elegant-egg"
          categoria={"Elegante"}
          title={"Ovos com colher para um paladar refinado"}
          descri={"Conchas delicadas que se abrem com expectativa."}
          img={ovoColher}
          alt={"Elegant spoon eggs"}
          price={115.0}
        />

        {/* CARD 3 */}
        <CardsIndulge
          id="decadent-egg"
          categoria={"Decadente"}
          title={"Ovos trufados em camadas com uma complexidade escura"}
          descri={"Centros de ganache que merecem ser saboreados."}
          img={ovoTrufado}
          alt={"Decadent truffled eggs"}
          price={145.5}
        />
      </div>
    </section>
  );
}
