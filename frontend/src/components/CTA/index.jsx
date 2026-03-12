import { MapPin, Phone, Instagram } from "lucide-react";
import "./CTA.css";

export default function CTA() {
  return (
    <section className="cta" id="contato">
      <div className="cta-header">
        <h2>Faça seu pedido hoje mesmo</h2>
        <p>
          O melhor chocolate não espera por ninguém. Escolha já os seus favoritos.
        </p>

        <div className="cta-actions">
          <a href="#produtos" className="btn-secondary cta-btn">Ver Catálogo</a>
          <button 
            className="btn-primary cta-btn whatsapp-btn"
            onClick={() => {
              const message = encodeURIComponent("Olá! Vim pelo site e gostaria de fazer uma encomenda no Ateliê Kaillany Nunes.");
              window.open(`https://wa.me/5583996918173?text=${message}`, "_blank");
            }}
          >
            {" Falar no WhatsApp"}
          </button>
        </div>
      </div>

      <div className="contact-cards-container">
        <div className="contact-card">
          <div className="contact-icon-wrapper">
            <MapPin size={28} />
          </div>
          <h3>Nosso Endereço</h3>
          <p>Rua Antônio Lopes da Silva, 180</p>
          <p>Centro - Emas, PB</p>
          <p className="contact-subtext">CEP: 58763-000</p>
        </div>

        <div className="contact-card">
          <div className="contact-icon-wrapper">
            <Phone size={28} />
          </div>
          <h3>Contato</h3>
          <p>WhatsApp</p>
          <p className="contact-highlight">(83) 99691-8173</p>
          <p className="contact-subtext">Atendimento em horário comercial</p>
        </div>

        <div className="contact-card">
          <div className="contact-icon-wrapper instagram-icon">
            <Instagram size={28} />
          </div>
          <h3>Redes Sociais</h3>
          <p>Siga-nos no Instagram</p>
          <a 
            href="https://www.instagram.com/ateliekaillanynunes_/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-link"
          >
            @ateliekaillanynunes_
          </a>
          <p className="contact-subtext">Fique por dentro das novidades</p>
        </div>
      </div>
    </section>
  );
}
