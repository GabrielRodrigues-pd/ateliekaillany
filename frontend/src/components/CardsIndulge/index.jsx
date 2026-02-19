import "./CardsIndulge.css";

function CardsIndulge({ categoria, title, descri, img, alt }) {
  return (
    <article className="indulge-card">
      <div className="card-content">
        <span className="card-tag">{categoria}</span>
        <h3>{title}</h3>
        <p>{descri}</p>
        <a href="#" className="card-link">
          Explore →
        </a>
      </div>

      <div className="card-image">
        <img src={img} alt={alt} />
      </div>
    </article>
  );
}

export default CardsIndulge;
