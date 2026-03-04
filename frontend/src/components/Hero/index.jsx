import "./Hero.css";
import img from "../../assets/imgOvo.jpg";

export default function Hero() {
  return (
    <>
      <header className="header">
        <div className="container header-content">
          <div className="logo">Kaillany</div>

          <nav className="nav">
            <a href="#">Home</a>
            <a href="#">Produtos</a>
            <a href="#">Sobre nós</a>
            <a href="#">More ▾</a>
          </nav>

          <button className="contact-btn">Contact</button>
        </div>
      </header>

      <section className="hero">
        <div className=" hero-card container">
          <div className="hero-image">
            <img src={img} alt="Chocolate sweets" />
          </div>

          <div className="hero-text">
            <h1>
              Doces artesanais
              <br />
              feitos com carinho
            </h1>

            <p>
              Cada ovo é recheado com os melhores ingredientes e envolto em
              chocolate que derrete na sua língua. Encomende já e sinta a
              diferença que a arte e a qualidade fazem.
            </p>

            <div className="hero-actions">
              <button className="btn-primary">Ordem</button>
              <button className="btn-secondary">Navegar</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
