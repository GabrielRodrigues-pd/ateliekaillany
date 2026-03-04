import "./CTA.css";
import imgOvo from "../../assets/imgOvo.jpg";

export default function CTA() {
  return (
    <section className="cta">
      <h2>Faça seu pedido hoje mesmo</h2>
      <p>
        O melhor chocolate não espera por ninguém. Escolha já os seus favoritos.
      </p>

      <div className="cta-actions">
        <button className="btn-primary">Order</button>
        <button className="btn-secondary">Browse</button>
      </div>

      <img src={imgOvo} alt="Chocolate egg" />
    </section>
  );
}
