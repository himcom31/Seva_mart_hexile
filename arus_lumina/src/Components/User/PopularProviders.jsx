import React from "react";

const providers = [
  {
    id: 1,
    name: "Demo provider",
    role: "Electrician",
    rating: 4.7,
    reviews: 45,
    verified: true,
    featured: true,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face",
  },
  {
    id: 2,
    name: "James anderson",
    role: "Carpenter",
    rating: 3.7,
    reviews: 30,
    verified: false,
    featured: false,
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face",
  },
  {
    id: 3,
    name: "Arshree khourie",
    role: "Plumber",
    rating: 2.9,
    reviews: 15,
    verified: false,
    featured: false,
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&face",
  },
  {
    id: 4,
    name: "William brooke",
    role: "Electrician",
    rating: 4.9,
    reviews: 55,
    verified: false,
    featured: false,
    img: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&face",
  },
];

const StarRating = ({ rating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= Math.round(rating) ? "star filled" : "star"}>★</span>
    ))}
    <span className="rating-num">{rating}</span>
  </div>
);

const PopularProviders = () => {
  return (
    <section className="section providers-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Popular <span className="accent">Providers</span>
          </h2>
          <p className="section-subtitle">
            Each listing is designed to be clear and concise, providing customers
          </p>
        </div>

        <div className="providers-grid">
          {providers.map((p) => (
            <div key={p.id} className={`provider-card ${p.featured ? "provider-featured" : ""}`}>
              {p.featured && <span className="provider-featured-badge">Featured</span>}
              <div className="provider-avatar-wrap">
                <img src={p.img} alt={p.name} className="provider-avatar" />
                {p.verified && <span className="provider-verified">✔</span>}
              </div>
              <h4 className="provider-name">{p.name}</h4>
              <p className="provider-role">{p.role}</p>
              <StarRating rating={p.rating} />
            </div>
          ))}
        </div>

        <div className="section-btn-wrap">
          <button className="btn-outline">View All ↓</button>
        </div>
      </div>
    </section>
  );
};

export default PopularProviders;