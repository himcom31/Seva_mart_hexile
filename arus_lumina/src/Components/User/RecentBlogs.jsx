import React from "react";

const blogs = [
  {
    id: 1,
    title: "Tips for Choosing a Computer Service Provider When",
    date: "March 19, 2020",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop",
    category: "Construction",
  },
  {
    id: 2,
    title: "Energy-Efficient Electrical Up... Essential Upgrades for Homes",
    date: "March 19, 2020",
    img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop",
    category: "Electrical",
  },
  {
    id: 3,
    title: "How to Look for a Reliable Construction Service Directory",
    date: "February 15, 2020",
    img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=200&fit=crop",
    category: "Carpentry",
  },
  {
    id: 4,
    title: "How to Find a Skilled Carpenter: Top Tips for Hiring Whether",
    date: "February 10, 2020",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
    category: "Interior",
  },
];

const RecentBlogs = () => {
  return (
    <section className="section blogs-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Checkout our Recent <span className="accent">Blogs</span>
          </h2>
          <p className="section-subtitle">
            Each listing is designed to be clear and concise, providing customers
          </p>
        </div>

        <div className="blogs-grid">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <div className="blog-img-wrap">
                <img src={blog.img} alt={blog.title} className="blog-img" />
                <span className="blog-category">{blog.category}</span>
              </div>
              <div className="blog-body">
                <p className="blog-date">📅 {blog.date}</p>
                <h4 className="blog-title">{blog.title}</h4>
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

export default RecentBlogs;