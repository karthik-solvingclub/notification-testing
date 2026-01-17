import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import LandingPage from './components/LandingPage';
import NotificationTester from './components/NotificationTester';
import NotificationCenter from './components/NotificationCenter';
import './App.css';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize Capacitor when app loads
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      console.log('Capacitor initialized');
    }
  }, []);

  return (
    <NotificationProvider>
      <Router>
        <div className="app">
          <nav className="app-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/notifications" className="nav-link">Notifications</Link>
            <div className="nav-notification">
              <NotificationCenter />
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/notifications" element={<NotificationTester />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
};

export default App;
