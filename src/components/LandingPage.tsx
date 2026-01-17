import React from 'react';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <div className="logo">
            <h1>Plattr</h1>
            <p className="tagline">South Indian Meals, Delivered Fresh</p>
          </div>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero">
          <div className="container">
            <h2 className="hero-title">Bangalore's Favorite Catering & Meal Ordering App</h2>
            <p className="hero-subtitle">
              Order authentic South Indian tiffins, snacks, lunch, dinner, meal boxes, 
              bulk meals, and catering services - all in one place.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Order Now</button>
              <button className="btn btn-secondary">Browse Menu</button>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h3 className="section-title">What We Offer</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🍽️</div>
                <h4>Tiffins</h4>
                <p>Fresh South Indian breakfast and snacks</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🍱</div>
                <h4>Lunch & Dinner</h4>
                <p>Complete meals with authentic flavors</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📦</div>
                <h4>Meal Boxes</h4>
                <p>Convenient packed meals for on-the-go</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h4>Bulk Orders</h4>
                <p>Large quantity orders for offices and events</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎉</div>
                <h4>Catering</h4>
                <p>Professional catering services for all occasions</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h4>Fast Delivery</h4>
                <p>Quick and reliable delivery across Bangalore</p>
              </div>
            </div>
          </div>
        </section>

        <section className="why-plattr">
          <div className="container">
            <h3 className="section-title">Why Choose Plattr?</h3>
            <div className="benefits">
              <div className="benefit-item">
                <strong>✓</strong> Authentic South Indian cuisine
              </div>
              <div className="benefit-item">
                <strong>✓</strong> Fresh ingredients daily
              </div>
              <div className="benefit-item">
                <strong>✓</strong> Mobile-first ordering experience
              </div>
              <div className="benefit-item">
                <strong>✓</strong> Flexible bulk ordering options
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2024 Plattr. Serving Bangalore with love.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
