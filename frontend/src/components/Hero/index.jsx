import "./Hero.css";
import img from "../../assets/imgOvo.jpg";
import NavBar from "../NavBar";
import OptimizedImage from "../OptimizedImage";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <>
      <NavBar />

      <section className="hero" id="home">
        <div className=" hero-card container">
          <div className="hero-text-card">
            <span className="hero-eyebrow">A arte do chocolate em Emas-PB</span>
            <h1>Ovos de Páscoa & Doces Artesanais</h1>
            <p>
              Experimente a magia de chocolates artesanais bem pertinho de você. 
              Cada peça conta uma história de paixão, qualidade premium e muita dedicação 
              para trazer o melhor sabor de Emas-PB até a sua mesa.
            </p>
            <a href="#produtos" className="hero-btn">
              <span>Descubra Nossos Doces</span>
              <ArrowRight size={20} />
            </a>
          </div>
          <div className="hero-img-card">
            <OptimizedImage
              src={img}
              alt="Ovo de Páscoa Artesanal Ateliê Kaillany Nunes"
              priority={true}
            />
          </div>
        </div>
      </section>
    </>
  );
}
