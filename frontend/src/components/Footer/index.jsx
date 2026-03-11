import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <div className="logo">Kaillany Nunes Atelier</div>
          <address className="local-seo-address">
            <p>Rua Antônio Lopes da Silva, 180 - Centro</p>
            <p>Emas, PB - 58763-000</p>
            <p className="contact-info">📞 WhatsApp: (83) 99691-8173</p>
          </address>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#produtos">Produtos</a>
          <a href="#avaliacoes">Avaliações</a>
          <a href="#criacoes">Criações</a>
          <a href="#sobre-nos">Sobre nós</a>
          <a href="#contato">Contato</a>
        </nav>
      </div>

      <div className="container footer-bottom">
        <span>© 2025 Ateliê Kaillany Nunes. Todos os direitos reservados.</span>
        <div className="links">
          <a href="#">Política de Privacidade</a>
          <a href="#">Termos de Serviço</a>
        </div>
      </div>
    </footer>
  );
}
