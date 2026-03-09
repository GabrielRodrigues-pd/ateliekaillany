import "./CardsTestimon.css";
import user from "../../assets/user.avif";

function CardsTestimon({ descri, name, subTexto }) {
  return (
    <article className="testimonial-card">
      <div className="stars">★★★★★</div>
      <p className="quote">“{descri}”</p>
      <div className="author">
        <img src={user} alt="Maria Santos" />
        <div>
          <strong>{name}</strong>
          <br />
          <span>{subTexto}</span>
        </div>
      </div>
    </article>
  );
}

export default CardsTestimon;
