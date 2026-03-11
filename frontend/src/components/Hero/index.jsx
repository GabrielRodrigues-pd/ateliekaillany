import "./Hero.css";
import img from "../../assets/imgOvo.jpg";
import NavBar from "../NavBar";
import OptimizedImage from "../OptimizedImage";

export default function Hero() {
  return (
    <>
      {/* <header className="header">
        <div className="container header-content">
          <div className="logo">Kaillany</div>

          <nav className="nav">
            <a href="#">Home</a>
            <a href="#">Treats</a>
            <a href="#">About</a>
          </nav>

          <button className="contact-btn">Contact</button>
        </div>
      </header> */}

      <NavBar />

      <section className="hero" id="home">
        <div className=" hero-card container">
          <div className="hero-text-card">
            <span className="hero-eyebrow">A arte do chocolate em São Paulo</span>
            <h1>Ovos de Páscoa & Doces Artesanais</h1>
            <p>
              Experimente a magia de chocolates artesanais bem pertinho de você. 
              Cada peça conta uma história de paixão, qualidade premium e muita dedicação 
              para trazer o melhor sabor de São Paulo até a sua mesa.
            </p>
            <button className="hero-btn">Descubra Nossos Doces</button>
          </div>
          <div className="hero-img-card">
            <OptimizedImage
              src={img}
              alt="Ovo de Páscoa Artesanal Ateliê Kaillany Nunes"
            />
          </div>
        </div>
      </section>
    </>
  );
}
