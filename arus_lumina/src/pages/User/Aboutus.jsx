import { useState, useEffect, useRef } from "react";

/* ─── Inline Styles & Fonts ─── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --navy: #0A1628;
    --gold: #D4A017;
    --gold-light: #F5C842;
    --orange: #E8640A;
    --cream: #FDF8F0;
    --white: #FFFFFF;
    --gray-light: #F4F4F6;
    --gray-mid: #8A8FA3;
    --gray-dark: #3D4259;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .about-page {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--navy);
    overflow-x: hidden;
  }

  .font-display { font-family: 'Playfair Display', serif; }

  /* ── Hero ── */
  .hero-section {
    min-height: 100vh;
    background: var(--navy);
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .hero-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(212,160,23,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,160,23,0.07) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .hero-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,160,23,0.18) 0%, transparent 70%);
    top: -100px;
    right: -100px;
    pointer-events: none;
  }

  .hero-glow-2 {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(232,100,10,0.12) 0%, transparent 70%);
    bottom: -80px;
    left: 10%;
    pointer-events: none;
  }

  .logo-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(212,160,23,0.12);
    border: 1px solid rgba(212,160,23,0.35);
    padding: 8px 20px;
    border-radius: 50px;
    margin-bottom: 32px;
  }

  .logo-circle {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--orange));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    font-size: 18px;
    color: white;
    letter-spacing: -1px;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(42px, 7vw, 80px);
    font-weight: 900;
    line-height: 1.05;
    color: var(--white);
    margin-bottom: 24px;
  }

  .hero-title .gold { color: var(--gold); }
  .hero-title .orange { color: var(--orange); }

  .hero-tagline {
    font-size: clamp(15px, 2vw, 18px);
    color: rgba(255,255,255,0.65);
    font-weight: 300;
    max-width: 520px;
    line-height: 1.8;
    margin-bottom: 48px;
  }

  .stat-row {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
  }

  .stat-item { text-align: left; }
  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 800;
    color: var(--gold);
    line-height: 1;
  }
  .stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.45);
    margin-top: 4px;
  }

  .hero-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(212,160,23,0.2);
    border-radius: 24px;
    padding: 40px;
    backdrop-filter: blur(10px);
  }

  .service-pill {
    display: inline-block;
    background: rgba(212,160,23,0.12);
    border: 1px solid rgba(212,160,23,0.25);
    color: var(--gold-light);
    font-size: 12px;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 50px;
    margin: 4px;
  }

  /* ── Section Common ── */
  .section-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--orange);
    margin-bottom: 16px;
  }

  .section-label::before {
    content: '';
    display: block;
    width: 24px;
    height: 2px;
    background: var(--orange);
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 800;
    line-height: 1.1;
    color: var(--navy);
    margin-bottom: 20px;
  }

  /* ── Overview ── */
  .overview-section {
    padding: 120px 0;
    background: var(--cream);
  }

  .overview-img-block {
    position: relative;
  }

  .overview-img-main {
    width: 100%;
    border-radius: 24px;
    background: linear-gradient(135deg, var(--navy) 0%, #1a2d50 100%);
    height: 460px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .overview-img-accent {
    position: absolute;
    bottom: -24px;
    right: -24px;
    width: 180px;
    height: 180px;
    border-radius: 20px;
    background: linear-gradient(135deg, var(--gold), var(--orange));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
    box-shadow: 0 20px 40px rgba(212,160,23,0.3);
  }

  .accent-num {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 900;
    color: white;
    line-height: 1;
  }

  .accent-text {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 4px;
  }

  .check-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }

  .check-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--orange));
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
    font-size: 12px;
    color: white;
  }

  /* ── Founder ── */
  .founder-section {
    padding: 120px 0;
    background: var(--navy);
    position: relative;
    overflow: hidden;
  }

  .founder-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(212,160,23,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,160,23,0.05) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  .founder-avatar {
    width: 100%;
    max-width: 360px;
    aspect-ratio: 1;
    border-radius: 28px;
    background: linear-gradient(145deg, #1a2d50, #0f1f3d);
    border: 2px solid rgba(212,160,23,0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .founder-avatar::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(212,160,23,0.15), transparent);
  }

  .founder-initials {
    font-family: 'Playfair Display', serif;
    font-size: 80px;
    font-weight: 900;
    color: var(--gold);
    opacity: 0.4;
    line-height: 1;
  }

  .founder-name-tag {
    position: absolute;
    bottom: 24px;
    left: 24px;
    right: 24px;
    background: rgba(212,160,23,0.15);
    border: 1px solid rgba(212,160,23,0.3);
    border-radius: 12px;
    padding: 14px 18px;
    z-index: 2;
  }

  .quote-mark {
    font-family: 'Playfair Display', serif;
    font-size: 80px;
    color: var(--gold);
    opacity: 0.2;
    line-height: 0.8;
    float: left;
    margin-right: 8px;
    margin-top: 12px;
  }

  .founder-quote {
    font-family: 'Playfair Display', serif;
    font-size: clamp(18px, 2.5vw, 24px);
    font-weight: 700;
    color: white;
    line-height: 1.6;
    font-style: italic;
  }

  /* ── Vision Mission ── */
  .vm-section {
    padding: 120px 0;
    background: white;
  }

  .vm-card {
    border-radius: 24px;
    padding: 48px;
    position: relative;
    overflow: hidden;
    height: 100%;
  }

  .vm-card-vision {
    background: var(--navy);
    border: 1px solid rgba(212,160,23,0.2);
  }

  .vm-card-mission {
    background: linear-gradient(135deg, var(--gold) 0%, var(--orange) 100%);
  }

  .vm-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-bottom: 28px;
  }

  .vm-card-vision .vm-icon { background: rgba(212,160,23,0.15); }
  .vm-card-mission .vm-icon { background: rgba(255,255,255,0.25); }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
    margin-top: 60px;
  }

  .value-card {
    background: var(--gray-light);
    border-radius: 20px;
    padding: 32px 24px;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
    border: 1px solid rgba(0,0,0,0.05);
  }

  .value-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  }

  .value-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--gold), var(--orange));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 0 auto 16px;
  }

  /* ── Team ── */
  .team-section {
    padding: 120px 0;
    background: var(--cream);
  }

  .team-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.07);
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .team-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 48px rgba(10,22,40,0.12);
  }

  .team-avatar-wrap {
    height: 220px;
    position: relative;
    overflow: hidden;
  }

  .team-avatar-bg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 56px;
    font-weight: 900;
    color: white;
    opacity: 0.5;
  }

  .team-role-badge {
    position: absolute;
    bottom: 16px;
    left: 16px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 50px;
    padding: 5px 14px;
    font-size: 11px;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .social-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--gray-light);
    color: var(--gray-dark);
    font-size: 14px;
    text-decoration: none;
    transition: all 0.2s;
    border: 1px solid rgba(0,0,0,0.08);
  }

  .social-btn:hover {
    background: var(--navy);
    color: var(--gold);
    border-color: transparent;
  }

  /* ── Why ARUS ── */
  .why-section {
    padding: 120px 0;
    background: var(--navy);
    position: relative;
    overflow: hidden;
  }

  .why-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 20% 50%, rgba(212,160,23,0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(232,100,10,0.08) 0%, transparent 50%);
  }

  .why-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(212,160,23,0.15);
    border-radius: 20px;
    padding: 32px;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
    height: 100%;
  }

  .why-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--gold), var(--orange));
    transform: scaleX(0);
    transition: transform 0.3s;
    transform-origin: left;
  }

  .why-card:hover::before { transform: scaleX(1); }

  .why-card:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(212,160,23,0.35);
    transform: translateY(-4px);
  }

  .why-num {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
    font-weight: 900;
    color: rgba(212,160,23,0.15);
    line-height: 1;
    margin-bottom: 16px;
  }

  /* ── CTA ── */
  .cta-section {
    padding: 100px 0;
    background: linear-gradient(135deg, var(--gold) 0%, var(--orange) 100%);
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .cta-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.07'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--navy);
    color: var(--gold);
    padding: 18px 40px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s;
    border: 2px solid transparent;
  }

  .cta-btn:hover {
    background: transparent;
    border-color: var(--navy);
    color: var(--navy);
  }

  .cta-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    color: white;
    padding: 18px 40px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    border: 2px solid rgba(255,255,255,0.5);
    transition: all 0.3s;
  }

  .cta-btn-outline:hover {
    background: white;
    color: var(--orange);
    border-color: white;
  }

  /* ── Animate on scroll ── */
  .fade-up {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-up.delay-1 { transition-delay: 0.1s; }
  .fade-up.delay-2 { transition-delay: 0.2s; }
  .fade-up.delay-3 { transition-delay: 0.3s; }
  .fade-up.delay-4 { transition-delay: 0.4s; }

  /* ── Nav ── */
  .about-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 20px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s;
  }

  .about-nav.scrolled {
    background: rgba(10,22,40,0.95);
    backdrop-filter: blur(16px);
    padding: 14px 40px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .nav-logo-circle {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--orange));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    font-size: 16px;
    color: white;
  }

  .nav-links {
    display: flex;
    gap: 32px;
    list-style: none;
  }

  .nav-links a {
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s;
  }

  .nav-links a:hover { color: var(--gold); }

  .nav-cta {
    background: linear-gradient(135deg, var(--gold), var(--orange));
    color: white !important;
    padding: 10px 24px;
    border-radius: 50px;
    font-weight: 600 !important;
  }

  /* ── Container ── */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }

  .grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  @media (max-width: 900px) {
    .grid-2 { grid-template-columns: 1fr; gap: 40px; }
    .grid-3 { grid-template-columns: 1fr 1fr; }
    .grid-4 { grid-template-columns: 1fr 1fr; }
    .about-nav { padding: 16px 20px; }
    .nav-links { display: none; }
  }

  @media (max-width: 580px) {
    .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .stat-row { gap: 24px; }
  }
`;

/* ─── Data ─── */
const SERVICES_PILLS = [
  "Electrician", "Plumber", "Carpenter", "Painter",
  "Electronic Repair", "Property Dealer", "Event Catering",
  "Photography", "Home Cleaning", "Home Tutor",
  "Packers & Movers", "Builder Services",
];

const TEAM = [
  { name: "Arun Kumar Singh", role: "Founder & CEO", dept: "Leadership", color: "linear-gradient(135deg,#0A1628,#1a3a6b)", exp: "15+ yrs", initials: "AK" },
  { name: "Priya Sharma", role: "Head of Operations", dept: "Operations", color: "linear-gradient(135deg,#D4A017,#E8640A)", exp: "10+ yrs", initials: "PS" },
  { name: "Rahul Mishra", role: "Technical Director", dept: "Technical", color: "linear-gradient(135deg,#0f6e56,#1a9e75)", exp: "12+ yrs", initials: "RM" },
  { name: "Sunita Devi", role: "Customer Relations", dept: "CRM", color: "linear-gradient(135deg,#a02070,#d4537e)", exp: "8+ yrs", initials: "SD" },
  { name: "Vikram Pandey", role: "Sales Manager", dept: "Business Dev", color: "linear-gradient(135deg,#185fa5,#378add)", exp: "9+ yrs", initials: "VP" },
  { name: "Neha Gupta", role: "Marketing Head", dept: "Marketing", color: "linear-gradient(135deg,#3b6d11,#63aa22)", exp: "7+ yrs", initials: "NG" },
];

const WHY_CARDS = [
  { num: "01", title: "One Call, All Solutions", desc: "No need to search multiple vendors. One call to ARUS LUMINA connects you to every service you need — home, office, events, construction and more.", icon: "📞" },
  { num: "02", title: "Verified Professionals", desc: "Every service provider on our platform is background-verified, skilled, and trained to deliver consistently high-quality results.", icon: "✅" },
  { num: "03", title: "Affordable Pricing", desc: "We believe quality service shouldn't break the bank. Our competitive, transparent pricing ensures zero hidden charges.", icon: "💰" },
  { num: "04", title: "On-Time Service", desc: "We respect your time. Our professionals arrive on schedule and complete tasks within the committed timeframe, every time.", icon: "⏰" },
  { num: "05", title: "Experienced Team", desc: "With 15+ years of combined expertise across trades, our team handles every task with skill, care, and professionalism.", icon: "🏆" },
  { num: "06", title: "100% Satisfaction", desc: "Not happy? We make it right. Our customer-first approach means we don't rest until you're completely satisfied with the service.", icon: "⭐" },
];

const VALUES = [
  { icon: "🤝", title: "Trust", desc: "We build lasting relationships through honesty and reliability." },
  { icon: "💡", title: "Innovation", desc: "Constantly improving how services are delivered in Bihar." },
  { icon: "🌱", title: "Community", desc: "Empowering local skilled professionals and families." },
  { icon: "🛡️", title: "Quality", desc: "No shortcuts — only the best workmanship on every job." },
];

/* ─── Scroll animation hook ─── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Nav ─── */
/* ─── Hero Section ─── */
function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-grid-bg" />
      <div className="hero-glow" />
      <div className="hero-glow-2" />
      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 100 }}>
        <div className="grid-2">
          <div>
            <div className="logo-badge">
              <div className="logo-circle">AL</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold-light)', letterSpacing: 1 }}>ARUS LUMINA Pvt. Ltd.</span>
            </div>
            <h1 className="hero-title">
              Light of<br />
              <span className="gold">Solutions,</span><br />
              Power of <span className="orange">Services</span>
            </h1>
            <p className="hero-tagline">
              Bihar's most trusted multi-service platform — connecting skilled professionals to every home, office, event, and business need across Patna and beyond.
            </p>
            <div className="stat-row">
              {[['30+','Services'],['500+','Happy Clients'],['15+','Years Exp.'],['24/7','Support']].map(([n,l]) => (
                <div className="stat-item" key={l}>
                  <div className="stat-num">{n}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="hero-card">
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Services We Offer</p>
              <div>
                {SERVICES_PILLS.map(s => (
                  <span className="service-pill" key={s}>{s}</span>
                ))}
              </div>
              <div style={{ marginTop: 28, padding: '20px 0 0', borderTop: '1px solid rgba(212,160,23,0.15)' }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Call us anytime</p>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, color: 'var(--gold)' }}>📞 7360050505</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Patna, Bihar — All Districts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Company Overview ─── */
function OverviewSection() {
  return (
    <section className="overview-section" id="overview">
      <div className="container">
        <div className="grid-2">
          <div className="overview-img-block fade-up">
            <div className="overview-img-main">
              <div style={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 72, fontWeight: 900, color: 'rgba(212,160,23,0.25)', lineHeight: 1 }}>ARUS</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 72, fontWeight: 900, color: 'rgba(212,160,23,0.15)', lineHeight: 1 }}>LUMINA</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 12, letterSpacing: 3, textTransform: 'uppercase' }}>Est. in Patna, Bihar</div>
              </div>
              <div style={{ position: 'absolute', top: 24, left: 24, background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.25)', borderRadius: 12, padding: '10px 16px' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 }}>SINCE</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 800, color: 'var(--gold)' }}>2010</div>
              </div>
            </div>
            <div className="overview-img-accent">
              <div className="accent-num">30+</div>
              <div className="accent-text">Services<br/>Available</div>
            </div>
          </div>
          <div className="fade-up delay-2">
            <div className="section-label">Company Overview</div>
            <h2 className="section-title">Bihar's Most Complete<br />Service Platform</h2>
            <p style={{ fontSize: 16, color: 'var(--gray-dark)', lineHeight: 1.9, marginBottom: 32 }}>
              <strong>ARUS LUMINA Pvt. Ltd.</strong> is a modern multi-service platform headquartered in Patna, Bihar. We connect households, businesses, and institutions with verified, skilled professionals across 30+ service categories — from electrical work and plumbing to grand event management and property consultation.
            </p>
            <p style={{ fontSize: 15, color: 'var(--gray-mid)', lineHeight: 1.8, marginBottom: 36 }}>
              Our mission is simple: <em>Aapki Zarurat, Hamara Solution</em>. Whatever you need, one call brings the right expert to your doorstep — at a fair price, on time, every time.
            </p>
            {[
              'Serving all districts across Bihar',
              'Background-verified professionals only',
              'Transparent, no hidden-charge pricing',
              'Available 24×7 for emergency services',
              'Trusted by 500+ homes, offices & events',
            ].map(item => (
              <div className="check-item" key={item}>
                <div className="check-icon">✓</div>
                <span style={{ fontSize: 15, color: 'var(--gray-dark)', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Founder Message ─── */
function FounderSection() {
  return (
    <section className="founder-section" id="founder">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }} className="fade-up">
          <div className="section-label" style={{ justifyContent: 'center', color: 'var(--gold)' }}>
            <span style={{ background: 'var(--gold)', width: 24, height: 2 }}></span>
            Founder's Message
          </div>
          <h2 className="section-title" style={{ color: 'white' }}>A Word From Our Founder</h2>
        </div>
        <div className="grid-2">
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="founder-avatar">
              <div className="founder-initials">AK</div>
              <div className="founder-name-tag">
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 800, color: 'var(--gold)' }}>Arun Kumar Singh</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>Founder & Managing Director</div>
              </div>
            </div>
          </div>
          <div className="fade-up delay-2" style={{ position: 'relative' }}>
            <div style={{ overflow: 'hidden' }}>
              <span className="quote-mark">"</span>
              <p className="founder-quote">
                I started ARUS LUMINA with a single vision — to create a platform where every person in Bihar could access trustworthy, skilled services without worry or hassle.
              </p>
            </div>
            <div style={{ marginTop: 28, fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9 }}>
              <p style={{ marginBottom: 20 }}>
                Growing up in Patna, I saw how difficult it was for families to find reliable electricians, plumbers, or event managers at short notice. People were either overcharged or left with poor workmanship. That gap inspired me to build something better.
              </p>
              <p style={{ marginBottom: 20 }}>
                Today, ARUS LUMINA is more than a service company — it's a promise. A promise that when you call us, you will be heard, respected, and served with the highest standards of quality at a price that feels fair.
              </p>
              <p>
                We are not just building a business. We are building <span style={{ color: 'var(--gold)', fontWeight: 600 }}>trust, one service at a time.</span>
              </p>
            </div>
            <div style={{ marginTop: 36, display: 'flex', gap: 40 }}>
              {[['15+','Years Experience'],['500+','Happy Families'],['30+','Service Types']].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 800, color: 'var(--gold)' }}>{n}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Vision & Mission ─── */
function VisionMissionSection() {
  return (
    <section className="vm-section" id="vision">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }} className="fade-up">
          <div className="section-label" style={{ justifyContent: 'center' }}>Vision &amp; Mission</div>
          <h2 className="section-title">What Drives Us Forward</h2>
          <p style={{ fontSize: 16, color: 'var(--gray-mid)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
            Our north star and daily commitment — the principles that shape every decision at ARUS LUMINA.
          </p>
        </div>
        <div className="grid-2" style={{ gap: 28, alignItems: 'stretch' }}>
          <div className="vm-card vm-card-vision fade-up">
            <div className="vm-icon">🔭</div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--gold)', marginBottom: 12 }}>Our Vision</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 20, lineHeight: 1.3 }}>
              Bihar's #1 Trusted Multi-Service Platform
            </h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.85 }}>
              To become the most trusted and comprehensive service marketplace across all of Bihar — a platform where every skilled professional thrives, and every customer gets exactly what they need, when they need it.
            </p>
            <div style={{ marginTop: 28, padding: '20px 0 0', borderTop: '1px solid rgba(212,160,23,0.15)' }}>
              {['Expand to all 38 Bihar districts', 'Create 10,000+ skilled jobs locally', 'Become a household name in Patna'].map(v => (
                <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="vm-card vm-card-mission fade-up delay-2">
            <div className="vm-icon">🎯</div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 3, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>Our Mission</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 20, lineHeight: 1.3 }}>
              Aapki Zarurat, Hamara Solution
            </h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.85 }}>
              To deliver reliable, affordable, and high-quality services to every home, office, and event in Bihar — through a single, trusted platform that connects verified professionals to customers efficiently and transparently.
            </p>
            <div style={{ marginTop: 28, padding: '20px 0 0', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              {['Quality service on every call', 'Fair pricing, no hidden charges', 'Verified pros at your doorstep'].map(v => (
                <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="values-grid fade-up" style={{ marginTop: 64 }}>
          {VALUES.map(v => (
            <div className="value-card" key={v.title}>
              <div className="value-icon">{v.icon}</div>
              <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 800, color: 'var(--navy)', marginBottom: 10 }}>{v.title}</h4>
              <p style={{ fontSize: 14, color: 'var(--gray-mid)', lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Team ─── */
function TeamSection() {
  return (
    <section className="team-section" id="team">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }} className="fade-up">
          <div className="section-label" style={{ justifyContent: 'center' }}>Our Team</div>
          <h2 className="section-title">The People Behind<br />Every Great Service</h2>
          <p style={{ fontSize: 16, color: 'var(--gray-mid)', maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
            A dedicated team of professionals committed to delivering excellence across every service we offer.
          </p>
        </div>
        <div className="grid-3">
          {TEAM.map((m, i) => (
            <div className={`team-card fade-up delay-${(i % 4) + 1}`} key={m.name}>
              <div className="team-avatar-wrap">
                <div className="team-avatar-bg" style={{ background: m.color }}>
                  {m.initials}
                </div>
                <div className="team-role-badge">{m.dept}</div>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 800, color: 'var(--navy)', marginBottom: 4 }}>{m.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--orange)', fontWeight: 600, marginBottom: 8 }}>{m.role}</p>
                <p style={{ fontSize: 12, color: 'var(--gray-mid)', marginBottom: 16 }}>Experience: {m.exp}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['📧','💼','📱'].map((icon, j) => (
                    <a href="#" className="social-btn" key={j} title={['Email','LinkedIn','Call'][j]}>{icon}</a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Why ARUS LUMINA ─── */
function WhySection() {
  return (
    <section className="why-section" id="why-us">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }} className="fade-up">
          <div className="section-label" style={{ justifyContent: 'center', color: 'var(--gold)' }}>Why Choose Us</div>
          <h2 className="section-title" style={{ color: 'white' }}>6 Reasons to Trust<br />ARUS LUMINA</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
            We've built our reputation one satisfied customer at a time. Here's what sets us apart.
          </p>
        </div>
        <div className="grid-3">
          {WHY_CARDS.map((c, i) => (
            <div className={`why-card fade-up delay-${(i % 4) + 1}`} key={c.num}>
              <div className="why-num">{c.num}</div>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 12 }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ──
/* ─── Root ─── */
export default function AboutUs() {
  useScrollReveal();
  return (
    <>
      <style>{globalStyles}</style>
      <div className="about-page">
        
        <HeroSection />
        <OverviewSection />
        <FounderSection />
        <VisionMissionSection />
        <TeamSection />
        <WhySection />
      </div>
    </>
  );
}