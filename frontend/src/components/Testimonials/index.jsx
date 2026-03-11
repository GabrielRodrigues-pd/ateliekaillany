import CardsTestimon from "../CardsTestimon";
import "./Testimonials.css";

export default function Testimonials() {
  return (
    <section className="testimonials" id="avaliacoes">
      <div className="container testimonials-header">
        <h2>O que os clientes dizem</h2>
        <p>Elogios sinceros de quem entende de qualidade.</p>
      </div>

      <div className="container testimonials-grid">
        {/* CARD 1 */}
        <CardsTestimon
          descri={
            "Esses ovos têm gosto de terem sido feitos por alguém que realmente se importa com chocolate."
          }
          name={"Maria Santos"}
          subTexto={"Food enthusiast, São Paulo"}
        />

        {/* CARD 2 */}
        <CardsTestimon
          descri={
            "Já provei chocolate em três continentes. Este é o verdadeiro chocolate."
          }
          name={"James Mitchell"}
          subTexto={"Chef, Melbourne"}
        />

        {/* CARD 3 */}
        <CardsTestimon
          descri={
            "A atenção aos detalhes em cada ovo é evidente. Vale cada mordida."
          }
          name={"Ana Costa"}
          subTexto={"Restaurant owner, Rio"}
        />
      </div>
    </section>
  );
}
