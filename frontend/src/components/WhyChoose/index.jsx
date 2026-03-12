import { useState } from "react";
import "./WhyChoose.css";
// import fotoConfeiteira from "../../assets/fotoConfeiteira.jpg"; // To be added by user later

export default function WhyChoose() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="about" id="sobre-nos">
      <div className="container about-container">
        <div className="about-image-wrapper">
          {/* Placeholder content until user adds the real image */}
          <div className="about-image-placeholder">
            <span>[ Sua Foto Aqui ]</span>
          </div>
          {/* <img src={fotoConfeiteira} alt="Kaillany e Gabriel" className="about-image" /> */}
        </div>
        
        <div className="about-content">
          <span className="about-eyebrow">Nossa História</span>
          <h2>Sobre Nós</h2>
          
          <div className="about-text-content">
            <p>
              O <strong>Ateliê Kaillany</strong> nasceu de um sonho simples: transformar o amor pela confeitaria em momentos doces para outras pessoas. Tudo começou dentro de casa, quando o casal <strong>Kaillany e Gabriel</strong> passou a produzir doces artesanais de forma caseira, com dedicação, criatividade e muito cuidado em cada detalhe.
            </p>
            
            <p>
              O que era apenas uma ideia se transformou em um pequeno ateliê onde cada receita é preparada com carinho, ingredientes de qualidade e um toque especial de artesanalidade. Desde os primeiros testes na cozinha até as encomendas feitas por amigos, familiares e clientes da região, o objetivo sempre foi o mesmo: oferecer produtos saborosos que criem experiências únicas.
            </p>

            <div className={`about-text-hidden ${isExpanded ? 'expanded' : ''}`}>
              <p>
                Hoje, o <strong>Ateliê Kaillany</strong> continua mantendo sua essência: produção artesanal, atenção aos detalhes e compromisso em levar sabor e qualidade para cada cliente. Cada ovo de Páscoa, doce ou sobremesa é feito pensando em proporcionar momentos especiais — seja para presentear alguém querido ou para tornar uma ocasião ainda mais doce.
              </p>
              
              <p>
                Mais do que vender doces, queremos fazer parte das celebrações, lembranças e momentos felizes de cada cliente que confia no nosso trabalho.
              </p>
            </div>
            
            <button 
              className="about-read-more-btn" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Ler Menos" : "Ler a história completa"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
