import "./CardsWhy.css";
import material from "../../assets/material.png";

export default function CardsWhy({ subTitle, title, descri }) {
  return (
    <article className="why-card">
      <img src={material} />
      <div className="why-text">
        <span>{subTitle}</span>
        <h3>{title}</h3>
        <p>{descri}</p>
        <a href="#">Aprenda →</a>
      </div>
    </article>
  );
}
