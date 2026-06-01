import React from "react";

const GrowBusiness = () => {
  return (
    <section className="grow-section">
      <div className="grow-overlay" />
      <div className="container grow-content">
        <div className="grow-text">
          <h2 className="grow-title">Add Services & Grow your business with us</h2>
          <p className="grow-desc">
            A versatile platform that connects you with local professionals across multiple categories.
            From home services like plumbing and electrical work to personal services like photography.
          </p>
          <div className="grow-btns">
            <button className="grow-btn-primary">Join Us</button>
            <button className="grow-btn-outline">View All</button>
          </div>
        </div>
        <div className="grow-image">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&h=350&fit=crop"
            alt="Grow Business"
            className="grow-img"
          />
        </div>
      </div>
    </section>
  );
};

export default GrowBusiness;