import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <div className="logo">Kaillany Nunes Atelier</div>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#produtos">Produtos</a>
          <a href="#avaliacoes">Avaliações</a>
          <a href="#sobre-nos">Sobre nós</a>
          <a href="#criacoes">Criações</a>
          <a href="#contato">Contato</a>
        </nav>
      </div>

      <div className="container footer-bottom">
        <span>© 2025 Ateliê Kaillany Nunes. Todos os direitos reservados.</span>
        <span className="disclaimer">* Imagens meramente ilustrativas.</span>
        <div className="links">
          <a href="#">Política de Privacidade</a>
          <a href="#">Termos de Serviço</a>
        </div>
      </div>
    </footer>
  );
}
