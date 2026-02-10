import "./Creations.css";

export default function Creations() {
  return (
    <section className="creations">
      <div className="container creations-header">
        <h2>Our creations</h2>
        <p>Each egg is a small work of art</p>
      </div>

      <div className="creations-gallery">
        <img src="/c1.png" />
        <img src="/c2.png" />
        <img src="/c3.png" />
        <img src="/c4.png" />
      </div>
    </section>
  );
}
