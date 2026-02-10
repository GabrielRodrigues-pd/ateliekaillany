import "./Hero.css";

export default function Hero() {
  return (
    <>
      <header className="header">
        <div className="container header-content">
          <div className="logo">Kaillany</div>

          <nav className="nav">
            <a href="#">Home</a>
            <a href="#">Products</a>
            <a href="#">About us</a>
            <a href="#">More ▾</a>
          </nav>

          <button className="contact-btn">Contact</button>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-card">
          <div className="hero-image">
            <img src="/hero-image.png" alt="Chocolate sweets" />
          </div>

          <div className="hero-text">
            <h1>
              Handcrafted sweets
              <br />
              made with care
            </h1>

            <p>
              Each egg is filled with the finest ingredients and wrapped in
              chocolate that melts on your tongue. Order now and taste the
              difference that craftsmanship brings.
            </p>

            <div className="hero-actions">
              <button className="btn-primary">Order</button>
              <button className="btn-secondary">Browse</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
