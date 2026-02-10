import "./IndulgeSection.css";

export default function IndulgeSection() {
  return (
    <section className="indulge">
      <div className="container indulge-header">
        <span className="indulge-eyebrow">Crafted</span>
        <h2>Three ways to indulge</h2>
        <p>Rich chocolate shells hide treasures within each bite</p>
      </div>

      <div className="container indulge-grid">
        {/* CARD 1 */}
        <article className="indulge-card">
          <div className="card-content">
            <span className="card-tag">Classic</span>
            <h3>Filled Easter eggs bursting with flavor</h3>
            <p>Smooth centers wrapped in tempered chocolate</p>
            <a href="#" className="card-link">
              Explore →
            </a>
          </div>

          <div className="card-image">
            <img src="/eggs-classic.png" alt="Classic Easter eggs" />
          </div>
        </article>

        {/* CARD 2 */}
        <article className="indulge-card">
          <div className="card-content">
            <span className="card-tag">Elegant</span>
            <h3>Spoon eggs for the refined palate</h3>
            <p>Delicate shells that crack open with anticipation</p>
            <a href="#" className="card-link">
              Discover →
            </a>
          </div>

          <div className="card-image">
            <img src="/eggs-elegant.png" alt="Elegant spoon eggs" />
          </div>
        </article>

        {/* CARD 3 */}
        <article className="indulge-card">
          <div className="card-content">
            <span className="card-tag">Decadent</span>
            <h3>Truffled eggs layered with dark complexity</h3>
            <p>Ganache centers that demand to be savored</p>
            <a href="#" className="card-link">
              Select →
            </a>
          </div>

          <div className="card-image">
            <img src="/eggs-decadent.png" alt="Decadent truffled eggs" />
          </div>
        </article>
      </div>
    </section>
  );
}
