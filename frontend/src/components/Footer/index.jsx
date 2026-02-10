import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="logo">Logo</div>

        <nav>
          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">About us</a>
          <a href="#">Contact</a>
          <a href="#">Gallery</a>
        </nav>
      </div>

      <div className="container footer-bottom">
        <span>© 2025 Kaillany Nunes Atelier. All rights reserved.</span>
        <div className="links">
          <a href="#">Privacy policy</a>
          <a href="#">Terms of service</a>
          <a href="#">Cookies settings</a>
        </div>
      </div>
    </footer>
  );
}
