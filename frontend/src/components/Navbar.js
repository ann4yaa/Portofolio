// Navbar.js - Fix dengan font Playfair pada button
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const mobileRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;
  const isProjectPage = location.pathname === '/project';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileOpen &&
        mobileRef.current &&
        !mobileRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        :root {
          --choco-900: #24140f;
          --choco-800: #321c14;
          --choco-700: #4a2a1d;
          --cream-50: #fff8ed;
          --cream-100: #f6ead7;
          --caramel: #c98545;
          --gradient-main: linear-gradient(135deg, #4a2a1d 0%, #8a4b2a 54%, #c98545 100%);
          --gradient-glass: linear-gradient(145deg, rgba(50, 28, 20, 0.94), rgba(36, 20, 15, 0.88));
          --glass-border: rgba(255, 248, 237, 0.16);
          --glass-shadow: 0 24px 80px rgba(36, 20, 15, 0.18), inset 0 1px 0 rgba(255, 248, 237, 0.12);
          --transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          --radius-lg: 28px;
          --font-display: 'Playfair Display', serif;
        }

        @keyframes gradientMove {
          0%,100%{background-position:0% 50%}
          50%{background-position:100% 50%}
        }
        @keyframes pulseGlow {
          0%,100%{box-shadow:0 4px 12px rgba(36,20,15,0.22)}
          50%{box-shadow:0 4px 24px rgba(201,133,69,0.35);transform:scale(1.05)}
        }
        @keyframes slideDown {
          from {
            transform: translateX(-50%) translateY(-120px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
        @keyframes expandLine {
          from { width: 0; opacity: 0; }
          to { width: 20px; opacity: 1; }
        }
        @keyframes shimmer {
          0%,100%{background-position:0% 50%}
          50%{background-position:100% 50%}
        }

        .navbar-premium {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 92%;
          max-width: 1200px;
          background: var(--gradient-glass);
          backdrop-filter: blur(24px) saturate(200%);
          -webkit-backdrop-filter: blur(24px) saturate(200%);
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          padding: 0.5rem 1.8rem;
          z-index: 1000;
          transition: var(--transition);
          animation: slideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .navbar-premium.scrolled {
          background: linear-gradient(145deg, rgba(50, 28, 20, 0.96), rgba(36, 20, 15, 0.92));
          border-color: var(--glass-border);
          box-shadow: 0 18px 58px rgba(36, 20, 15, 0.20);
          top: 10px;
          padding: 0.4rem 1.5rem;
        }

        .navbar-brand {
          font-weight: 900;
          font-size: 1.35rem;
          color: #fff8ed;
          letter-spacing: -0.5px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .navbar-brand .brand-icon {
          background: linear-gradient(135deg, #fff2d8, #c98545);
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #24140f;
          font-size: 1rem;
          animation: pulseGlow 3s ease-in-out infinite;
          background-size: 200% 200%;
          box-shadow: 0 4px 12px rgba(36, 20, 15, 0.22);
          flex-shrink: 0;
        }

        .navbar-brand .brand-text {
          background: linear-gradient(135deg, #fff2d8, #d79a58, #8a4b2a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradientMove 4s ease-in-out infinite;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .nav-link-premium {
          color: rgba(255, 248, 237, 0.74);
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          transition: var(--transition);
          text-decoration: none;
          font-size: 0.9rem;
          position: relative;
        }

        .nav-link-premium:hover {
          color: #fff2d8;
          background: rgba(255, 248, 237, 0.08);
        }

        .nav-link-premium.active {
          color: #fff2d8;
          background: rgba(255, 248, 237, 0.08);
        }

        .nav-link-premium.active::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          background: linear-gradient(135deg, #fff2d8, #c98545);
          border-radius: 4px;
          animation: expandLine 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* NAV CTA - Button Lihat Project dengan Playfair Display */
        .nav-cta {
          background: linear-gradient(135deg, #fff2d8, #c98545) !important;
          color: #24140f !important;
          padding: 0.5rem 1.8rem !important;
          border-radius: 50px !important;
          box-shadow: 0 4px 16px rgba(36, 20, 15, 0.22);
          font-weight: 700 !important;
          background-size: 200% 200%;
          animation: shimmer 3s ease-in-out infinite;
          font-family: var(--font-display) !important; /* PLAYFAIR DISPLAY */
        }

        .nav-cta:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 6px 28px rgba(201, 133, 69, 0.35);
          color: #24140f !important;
        }

        .nav-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #fff2d8;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          transition: var(--transition);
          cursor: pointer;
        }

        .nav-toggle:hover {
          background: rgba(255, 248, 237, 0.06);
        }

        .nav-mobile {
          display: none;
          position: fixed;
          top: 80px;
          left: 5%;
          right: 5%;
          background: var(--gradient-glass);
          backdrop-filter: blur(24px);
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
          padding: 1.5rem;
          box-shadow: var(--glass-shadow);
          z-index: 999;
          flex-direction: column;
          gap: 0.5rem;
          animation: slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .nav-mobile.open {
          display: flex;
        }

        .nav-mobile a {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          text-decoration: none;
          color: rgba(255, 248, 237, 0.76);
          font-weight: 500;
          transition: var(--transition);
        }

        .nav-mobile a:hover,
        .nav-mobile a.active {
          color: #fff2d8;
          background: rgba(255, 248, 237, 0.10);
        }

        /* NAV CTA MOBILE - dengan Playfair Display */
        .nav-mobile .nav-cta-mobile {
          background: linear-gradient(135deg, #fff2d8, #c98545);
          color: #24140f !important;
          text-align: center;
          margin-top: 0.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-family: var(--font-display) !important; /* PLAYFAIR DISPLAY */
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .nav-toggle {
            display: block !important;
          }
          .navbar-premium {
            padding: 0.4rem 1rem;
            top: 10px;
            border-radius: 18px;
          }
        }
      `}</style>

      <nav className={`navbar-premium ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="navbar-brand">
            <span className="brand-icon"><i className="fas fa-code"></i></span>
            <span className="brand-text">4naa</span>
          </Link>

          <div className="nav-links">
            <Link to="/" className={`nav-link-premium ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <a href="/#skills" className={`nav-link-premium ${location.pathname === '/' ? '' : ''}`}>Skills</a>
            {!isProjectPage && (
              <Link to="/project" className="nav-link-premium nav-cta">
                <i className="fas fa-folder-open me-1"></i>View Project
              </Link>
            )}
          </div>

          <button 
            className="nav-toggle" 
            ref={toggleRef}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <i className={`fas fa-${mobileOpen ? 'times' : 'bars'}`}></i>
          </button>
        </div>
      </nav>

      <div className={`nav-mobile ${mobileOpen ? 'open' : ''}`} ref={mobileRef}>
        <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Home</Link>
        <a href="/#skills" onClick={() => setMobileOpen(false)}>Skills</a>
        {!isProjectPage && (
          <Link to="/project" className="nav-cta-mobile" onClick={() => setMobileOpen(false)}>
            <i className="fas fa-folder-open me-2"></i>View Project
          </Link>
        )}
      </div>

      {mobileOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 998,
            backgroundColor: 'transparent',
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}