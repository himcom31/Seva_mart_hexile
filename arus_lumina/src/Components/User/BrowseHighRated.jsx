import React, { useState } from "react";

const tabs = ["Construction", "Removal", "Electrical", "Deliveries", "Catering Services"];

const highRatedServices = [
  {
    id: 1,
    title: "Wood Cutting & Carpentry Services",
    img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=280&h=180&fit=crop",
  },
  {
    id: 2,
    title: "Structural Design & Execution",
    img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=280&h=180&fit=crop",
  },
  {
    id: 3,
    title: "Home Renovation",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=280&h=180&fit=crop",
  },
  {
    id: 4,
    title: "Interior Fit-Out",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=280&h=180&fit=crop",
  },
];

const BrowseHighRated = () => {
  const [activeTab, setActiveTab] = useState("Construction");

  return (
    <section className="section highrated-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Browse High Rated <span className="accent">Services</span>
          </h2>
          <p className="section-subtitle">
            Each listing is designed to be clear and concise, providing customers
          </p>
        </div>

        <div className="tabs-bar">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "tab-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="services-grid-4">
          {highRatedServices.map((svc) => (
            <div key={svc.id} className="highrated-card">
              <div className="service-img-wrap">
                <img src={svc.img} alt={svc.title} className="service-img" />
              </div>
              <div className="service-card-body">
                <h3 className="service-title">{svc.title}</h3>
              </div>
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

export default BrowseHighRated;