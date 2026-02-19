import CardsWhy from "../CardsWhy";
import "./WhyChoose.css";

export default function WhyChoose() {
  return (
    <section className="why">
      <div className="container why-header">
        <span>Por que</span>
        <h2>Por que escolher Kaillany Nunes?</h2>
        <p>Feito à mão em pequenos lotes com paciência.</p>
      </div>

      <div className="container why-grid">
        <CardsWhy
          subTitle={"Honesto"}
          title={"Ingredientes com sabor idêntico ao seu próprio."}
          descri={"Sem atalhos, sem concessões, apenas chocolate."}
        />

        <CardsWhy
          subTitle={"Exclusivo"}
          title={"Sabores que você não encontrará em nenhum outro lugar."}
          descri={"Cada criação conta a sua própria história."}
        />

        <CardsWhy
          subTitle={"Confiável"}
          title={"Entregue fresco à sua porta."}
          descri={"Envio rápido que mantém a qualidade intacta."}
        />
      </div>
    </section>
  );
}
