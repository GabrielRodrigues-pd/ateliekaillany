import "./CTA.css";

export default function CTA() {
  return (
    <section className="cta">
      <h2>Start your order today</h2>
      <p>The best chocolate waits for no one. Choose your favorites now.</p>

      <div className="cta-actions">
        <button className="btn-primary">Order</button>
        <button className="btn-secondary">Browse</button>
      </div>

      <img src="/cta-image.png" alt="Chocolate egg" />
    </section>
  );
}
