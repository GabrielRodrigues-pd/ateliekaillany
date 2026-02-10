import "./Testimonials.css";

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container testimonials-header">
        <h2>What customers say</h2>
        <p>Real praise from those who know quality</p>
      </div>

      <div className="container testimonials-grid">
        <article className="testimonial-card">
          <div className="stars">★★★★★</div>
          <p className="quote">
            “These eggs taste like they were made by someone who actually cares
            about chocolate.”
          </p>
          <div className="author">
            <img src="/user1.png" alt="Maria Santos" />
            <div>
              <strong>Maria Santos</strong>
              <span>Food enthusiast, São Paulo</span>
            </div>
          </div>
        </article>

        <article className="testimonial-card">
          <div className="stars">★★★★★</div>
          <p className="quote">
            “I've tasted chocolate across three continents. This is the real
            thing.”
          </p>
          <div className="author">
            <img src="/user2.png" alt="James Mitchell" />
            <div>
              <strong>James Mitchell</strong>
              <span>Chef, Melbourne</span>
            </div>
          </div>
        </article>

        <article className="testimonial-card">
          <div className="stars">★★★★★</div>
          <p className="quote">
            “The attention to detail in every egg shows. Worth every bite.”
          </p>
          <div className="author">
            <img src="/user3.png" alt="Ana Costa" />
            <div>
              <strong>Ana Costa</strong>
              <span>Restaurant owner, Rio</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
