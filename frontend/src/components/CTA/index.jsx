import "./CTA.css";
import imgOvo from "../../assets/imgOvo.jpg";

export default function CTA() {
  return (
    <section className="cta" id="contato">
      <h2>Faça seu pedido hoje mesmo</h2>
      <p>
        O melhor chocolate não espera por ninguém. Escolha já os seus favoritos.
      </p>

      <div className="cta-actions">
        <a href="#produtos" className="btn-secondary cta-btn">Ver Catálogo</a>
        <button 
          className="btn-primary cta-btn whatsapp-btn"
          onClick={() => {
            const message = encodeURIComponent("Olá! Vim pelo site e gostaria de fazer uma encomenda no Ateliê Kaillany Nunes.");
            window.open(`https://wa.me/5583996918173?text=${message}`, "_blank");
          }}
        >
          {" Falar no WhatsApp"}
        </button>
      </div>

      <img src={imgOvo} alt="Chocolate egg" />
    </section>
  );
}
