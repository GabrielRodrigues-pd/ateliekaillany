import "./CardsTestimon.css";
import user from "../../assets/user.avif";

function CardsTestimon({ descri, name, subTexto }) {
  return (
    <article className="testimonial-card">
      <div className="quote-icon">“</div>
      <p className="quote">{descri}</p>
      <hr className="divider" />
      <div className="author">
        <img src={user} alt={name} />
        <div className="author-info">
          <strong>{name}</strong>
          <span>{subTexto}</span>
        </div>
      </div>
    </article>
  );
}

export default CardsTestimon;
