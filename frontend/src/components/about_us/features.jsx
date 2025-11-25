export const Features = () => {
  return (
    <div className="card">
      <h2 className="section-title why-choose-title">
        Why Choose Our Platform?
      </h2>
      <div className="features-grid">
        <div className="feature-card">
          <h3 className="feature-title">Automated Processing</h3>
          <p>
            Advanced algorithms ensure rapid, accurate calculations with minimal
            manual intervention.
          </p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">Regulatory Compliance</h3>
          <p>
            Built-in compliance with WHO, EPA, and international water quality
            standards.
          </p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">Global Accessibility</h3>
          <p>
            Cloud-based platform accessible to researchers and institutions
            worldwide.
          </p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">Precision Analytics</h3>
          <p>
            State-of-the-art methodologies provide reliable,
            scientifically-backed results.
          </p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">Blockchain Approach</h3>
          <p>
            We securely store geo-tagged HMPI results immutably, by storing only
            the final HMPI value, not the user’s raw data, to ensure integrity.
          </p>
        </div>
      </div>
    </div>
  );
};
