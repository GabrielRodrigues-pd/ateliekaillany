import "./WhyChoose.css";

export default function WhyChoose() {
  return (
    <section className="why">
      <div className="container why-header">
        <span>Why</span>
        <h2>Why choose Kaillany Nunes</h2>
        <p>Made by hand in small batches with patience</p>
      </div>

      <div className="container why-grid">
        <article className="why-card">
          <img src="/why1.png" />
          <span>Honest</span>
          <h3>Ingredients that taste like themselves</h3>
          <p>No shortcuts, no compromises, just chocolate</p>
          <a href="#">Learn →</a>
        </article>

        <article className="why-card">
          <img src="/why2.png" />
          <span>Unique</span>
          <h3>Flavors you won't find anywhere else</h3>
          <p>Each creation tells its own story</p>
          <a href="#">Taste →</a>
        </article>

        <article className="why-card">
          <img src="/why3.png" />
          <span>Reliable</span>
          <h3>Delivered fresh to your door</h3>
          <p>Fast shipping that keeps quality intact</p>
          <a href="#">Button →</a>
        </article>
      </div>
    </section>
  );
}
