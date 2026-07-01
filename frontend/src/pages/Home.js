// Home.js - Dengan efek tutul leopard
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API = '';

const nama = 'Hagia Sofiana';
const tentang =
  'Full Stack Developer specializing in modern web and mobile development. Proficient in PHP, Laravel, JavaScript, React, Python, Java, and MySQL, with a passion for building scalable applications, writing clean code, and continuously exploring new technologies.';
const skills = ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'Python', 'Bootstrap', 'Java', 'React', 'Vite'];

const roles = [
  'Software Engineer',
  'Full Stack',
  'Web Development',
  'Mobile Development',
  'Desktop Development'
];

export default function Home() {
  const [recentProjects, setRecentProjects] = useState([]);
  const [totalProject, setTotalProject] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const cardRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/projects/recent`)
      .then((r) => r.json())
      .then(setRecentProjects)
      .catch(console.error);

    fetch(`${API}/api/projects/count`)
      .then((r) => r.json())
      .then((d) => setTotalProject(d.total))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, i * 100);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    cardRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.7s cubic-bezier(0.34,1.56,0.64,1)';
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, [isLoaded, recentProjects]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        :root {
          --choco-900: #1a0f0a;
          --choco-800: #2c1a12;
          --choco-700: #3d251a;
          --choco-600: #5a3828;
          --cream-50: #fdf6ee;
          --cream-100: #f5e8d8;
          --cream-200: #e8d4be;
          --caramel: #c98545;
          --caramel-light: #e8b87a;
          --pink-soft: #f5c6d0;
          --pink-mid: #e8a0b0;
          --gold: #d4a055;
          --gradient-main: linear-gradient(145deg, #2c1a12 0%, #5a3828 60%, #c98545 100%);
          --gradient-glass: linear-gradient(145deg, rgba(44, 26, 18, 0.95), rgba(26, 15, 10, 0.92));
          --glass-border: rgba(253, 246, 238, 0.10);
          --glass-shadow: 0 20px 60px rgba(26, 15, 10, 0.3);
          --radius-xl: 32px;
          --radius-lg: 24px;
          --radius-md: 16px;
          --transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          --font-display: 'Playfair Display', serif;
          --font-body: 'Inter', sans-serif;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background:
            radial-gradient(ellipse at 20% 30%, rgba(201, 133, 69, 0.08), transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(90, 56, 40, 0.06), transparent 45%),
            linear-gradient(160deg, #fdf6ee 0%, #f5e8d8 40%, #e8d4be 100%);
          color: var(--choco-900);
          min-height: 100vh;
          font-family: var(--font-body);
          position: relative;
          overflow-x: hidden;
        }

        body::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: 
            radial-gradient(circle at 25% 20%, rgba(44, 26, 18, 0.04) 0px, transparent 60px),
            radial-gradient(circle at 75% 40%, rgba(201, 133, 69, 0.04) 0px, transparent 50px),
            radial-gradient(circle at 50% 80%, rgba(90, 56, 40, 0.03) 0px, transparent 70px);
          background-size: 200px 200px, 180px 180px, 220px 220px;
        }

        @keyframes floatOrb {
          0%,100%{transform:translate(0,0)scale(1)}
          25%{transform:translate(30px,-40px)scale(1.1)}
          50%{transform:translate(-20px,20px)scale(0.9)}
          75%{transform:translate(40px,25px)scale(1.05)}
        }
        @keyframes gradientMove {
          0%,100%{background-position:0% 50%}
          50%{background-position:100% 50%}
        }
        @keyframes shimmer {
          0%,100%{background-position:0% 50%}
          50%{background-position:100% 50%}
        }
        @keyframes pulseBadge {
          0%,100%{transform:scale(1)}
          50%{transform:scale(1.02)}
        }
        @keyframes fadeInUp {
          from{opacity:0;transform:translateY(40px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes heartBeat {
          0%,100%{transform:scale(1)}
          14%{transform:scale(1.25)}
          28%{transform:scale(1)}
          42%{transform:scale(1.25)}
          56%{transform:scale(1)}
        }
        @keyframes roleChange {
          0%{opacity:0;transform:translateY(-8px)}
          12%{opacity:1;transform:translateY(0)}
          88%{opacity:1;transform:translateY(0)}
          100%{opacity:0;transform:translateY(8px)}
        }
        @keyframes heroShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes heroGlowPulse {
          0%,100% { box-shadow: 0 20px 60px rgba(26,15,10,0.3), inset 0 1px 0 rgba(253,246,238,0.08); }
          50% { box-shadow: 0 20px 80px rgba(201,133,69,0.12), 0 20px 60px rgba(26,15,10,0.3), inset 0 1px 0 rgba(253,246,238,0.12); }
        }
        @keyframes profileFloat {
          0%,100%{transform:translateY(0px)}
          50%{transform:translateY(-5px)}
        }
        @keyframes shimmerBorder {
          0% { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 40px rgba(201,133,69,0.03), 0 0 80px rgba(232,160,176,0.01); }
          50% { box-shadow: 0 0 60px rgba(201,133,69,0.10), 0 0 120px rgba(232,160,176,0.03); }
        }
        @keyframes skillFloat {
          0%,100%{transform:translateY(0px)}
          50%{transform:translateY(-4px)}
        }
        @keyframes skillIconSpin {
          0%{transform:rotate(0deg)}
          100%{transform:rotate(360deg)}
        }
        @keyframes techGlow {
          0%,100%{box-shadow:0 0 20px rgba(201,133,69,0.05)}
          50%{box-shadow:0 0 40px rgba(201,133,69,0.12)}
        }
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* ================================================================ */
        /* ========== LEOPARD SPOTS RAIN EFFECT =========================== */
        /* ================================================================ */

        @keyframes leopardFall {
          0% {
            transform: translateY(-100px) rotate(0deg) scale(0.6);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(calc(100vh + 100px)) rotate(720deg) scale(1.1);
            opacity: 0;
          }
        }

        .leopard-spots-container {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .leopard-spot {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          animation: leopardFall linear infinite;
        }

        .leopard-spot.gold {
          background: radial-gradient(circle at 40% 30%, rgba(201, 133, 69, 0.5), rgba(90, 56, 40, 0.15));
          border: 1px solid rgba(201, 133, 69, 0.12);
          box-shadow: 
            inset -2px -2px 6px rgba(0,0,0,0.08),
            inset 2px 2px 6px rgba(255,215,180,0.05);
        }

        .leopard-spot.dark {
          background: radial-gradient(circle at 45% 35%, rgba(61, 37, 26, 0.4), rgba(26, 15, 10, 0.1));
          border: 1px solid rgba(61, 37, 26, 0.08);
          box-shadow: 
            inset -2px -2px 6px rgba(0,0,0,0.12),
            inset 2px 2px 6px rgba(255,215,180,0.03);
        }

        .leopard-spot.light {
          background: radial-gradient(circle at 50% 40%, rgba(232, 184, 122, 0.4), rgba(201, 133, 69, 0.08));
          border: 1px solid rgba(232, 184, 122, 0.1);
        }

        .leopard-spot.irregular {
          border-radius: 50% 40% 50% 60% / 40% 50% 60% 50%;
        }

        .leopard-spot.irregular-2 {
          border-radius: 60% 40% 40% 50% / 50% 60% 40% 40%;
        }

        .leopard-spot.irregular-3 {
          border-radius: 45% 55% 40% 60% / 55% 40% 60% 45%;
        }

        .bg-orb{position:absolute;border-radius:50%;filter:blur(100px);animation:floatOrb 25s ease-in-out infinite;pointer-events:none}
        .bg-orb:nth-child(1){width:500px;height:500px;background:#c98545;top:-200px;right:-120px;opacity:0.10}
        .bg-orb:nth-child(2){width:400px;height:400px;background:#5a3828;bottom:-120px;left:-100px;animation-delay:-8s;opacity:0.12}
        .bg-orb:nth-child(3){width:300px;height:300px;background:#2c1a12;top:50%;left:30%;animation-delay:-16s;opacity:0.08}

        .main-content{position:relative;z-index:1;padding-top:100px}

        .hero-section{padding:0.5rem 0 2rem;animation:fadeInUp 1s cubic-bezier(0.34,1.56,0.64,1)}
        
        .hero-glass{
          background: var(--gradient-glass);
          border-radius: var(--radius-xl);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          padding: 1.5rem 2rem;
          position: relative;
          overflow: hidden;
          color: var(--cream-50);
          animation: heroGlowPulse 4s ease-in-out infinite;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(20px);
        }

        .hero-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(253,246,238,0.02) 40%,
            rgba(253,246,238,0.05) 50%,
            rgba(253,246,238,0.02) 60%,
            transparent 80%
          );
          background-size: 300% 100%;
          z-index: 0;
          pointer-events: none;
          animation: heroShimmer 6s ease-in-out infinite;
          border-radius: var(--radius-xl);
        }

        .hero-glass::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: var(--radius-xl);
          padding: 1px;
          background: linear-gradient(
            135deg,
            transparent 30%,
            rgba(201,133,69,0.06),
            rgba(245,198,208,0.04),
            rgba(201,133,69,0.06),
            transparent 70%
          );
          background-size: 300% 300%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: heroShimmer 4s linear infinite;
          z-index: 0;
          pointer-events: none;
        }

        .hero-glass:hover {
          box-shadow: 0 20px 80px rgba(26,15,10,0.35), 0 0 40px rgba(201,133,69,0.04);
          border-color: rgba(253,246,238,0.14);
        }

        .hero-glass > * {
          position: relative;
          z-index: 1;
        }

        /* ================================================================ */
        /* ========== OVAL PROFILE ========================================= */
        /* ================================================================ */
        .profile-wrapper {
          position: relative;
          display: inline-block;
          animation: profileFloat 6s ease-in-out infinite;
          padding: 5px;
        }

        .profile-border {
          position: absolute;
          inset: -3px;
          border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
          background: linear-gradient(
            135deg,
            #3d251a,
            #c98545,
            #e8b87a,
            #f5c6d0,
            #c98545,
            #3d251a
          );
          background-size: 400% 400%;
          animation: shimmerBorder 5s linear infinite;
          z-index: 0;
          opacity: 0.4;
          transition: opacity 0.5s ease;
        }

        .profile-wrapper:hover .profile-border {
          opacity: 0.9;
        }

        .profile-glow {
          position: absolute;
          inset: -15px;
          border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
          background: radial-gradient(circle, rgba(201,133,69,0.06), transparent 70%);
          filter: blur(30px);
          animation: glowPulse 4s ease-in-out infinite;
          z-index: -1;
        }

        .profile-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(253,246,238,0.03) 45%,
            rgba(253,246,238,0.06) 50%,
            rgba(253,246,238,0.03) 55%,
            transparent 70%
          );
          background-size: 300% 100%;
          z-index: 3;
          pointer-events: none;
          animation: heroShimmer 5s ease-in-out infinite;
        }

        .profile-image {
          width: 220px;
          height: 280px;
          object-fit: cover;
          display: block;
          border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
          border: 2px solid rgba(253,246,238,0.06);
          position: relative;
          z-index: 2;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: linear-gradient(145deg, #f5e8d8, #fdf6ee);
        }

        .profile-image:hover {
          transform: scale(1.04);
          border-color: rgba(253,246,238,0.15);
        }

        /* ================================================================ */
        /* ========== END PROFILE ========================================== */
        /* ================================================================ */

        .hero-badge{
          display:inline-flex;
          align-items:center;
          gap:0.6rem;
          background:rgba(253,246,238,0.06);
          color:#e8b87a;
          padding:0.4rem 1.4rem;
          border-radius:50px;
          font-size:0.8rem;
          font-weight:600;
          margin-bottom:1.2rem;
          border:1px solid rgba(253,246,238,0.08);
          animation:pulseBadge 2.5s ease-in-out infinite;
          font-family: var(--font-body);
        }
        .hero-title{
          font-family: var(--font-display);
          font-size:3.2rem;
          font-weight:900;
          line-height:1.08;
          margin-bottom:0.75rem;
          letter-spacing:-0.5px;
          color:#fdf6ee;
        }
        .hero-title .highlight{
          background:linear-gradient(135deg,#fdf6ee,#e8b87a,#c98545);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          background-size:200% 200%;
          animation:gradientMove 4s ease-in-out infinite;
        }
        .hero-title .role-text {
          background:linear-gradient(120deg,#fdf6ee 0%,#e8b87a 35%,#fdf6ee 55%,#c98545 78%,#fdf6ee 100%);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          background-size:260% 260%;
          animation:gradientMove 4s ease-in-out infinite, roleChange 3s ease-in-out infinite;
          display:inline-block;
          font-style:italic;
        }
        .hero-subtitle{
          font-size:1rem;
          color:rgba(253,246,238,0.7);
          max-width:480px;
          margin-bottom:1.8rem;
          line-height:1.8;
          font-weight:400;
        }

        .hero-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
          max-width: 480px;
        }

        /* ================================================================ */
        /* ========== BUTTON STYLE FIXED ================================== */
        /* ================================================================ */

        .btn-primary-custom {
          background: linear-gradient(135deg, #fff2d8, #c98545);
          background-size: 200% 200%;
          color: #1a0f0a;
          border: none;
          padding: 0.85rem 2.6rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: var(--transition);
          box-shadow: 0 4px 20px rgba(201, 133, 69, 0.3);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          animation: shimmer 3s ease-in-out infinite;
          cursor: pointer;
          width: 100%;
          text-align: center;
          font-family: var(--font-body);
          position: relative;
          overflow: hidden;
        }

        .btn-primary-custom::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: left 0.6s ease;
        }

        .btn-primary-custom:hover::before {
          left: 100%;
        }

        .btn-primary-custom:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 8px 40px rgba(201, 133, 69, 0.5);
          color: #1a0f0a;
          background: linear-gradient(135deg, #d4a055, #f0c88a, #d4a055);
          background-size: 200% 200%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .btn-outline-custom {
          background: linear-gradient(135deg, #3d251a, #5a3828);
          color: #fdf6ee;
          border: 2px solid rgba(201, 133, 69, 0.3);
          padding: 0.85rem 2.6rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: var(--transition);
          box-shadow: 0 4px 20px rgba(26, 15, 10, 0.25);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          cursor: pointer;
          width: 100%;
          text-align: center;
          font-family: var(--font-body);
          position: relative;
          overflow: hidden;
        }

        .btn-outline-custom::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, transparent, #fff2d8, #c98545, transparent);
          transition: left 0.6s ease;
        }

        .btn-outline-custom:hover::before {
          left: 100%;
        }

        .btn-outline-custom:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 8px 40px rgba(201, 133, 69, 0.3);
          color: #fdf6ee;
          background: linear-gradient(135deg, #4a2d1f, #6b4228);
          border-color: rgba(201, 133, 69, 0.5);
        }

        /* ================================================================ */
        /* ========== SOCIAL MEDIA FIXED ================================== */
        /* ================================================================ */

        .social-links {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .social-link {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(61, 37, 26, 0.6), rgba(90, 56, 40, 0.4));
          border: 1px solid rgba(201, 133, 69, 0.2);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #e8b87a;
          text-decoration: none;
          font-size: 1.2rem;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          padding: 0;
          margin: 0;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }

        .social-link::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, #fff2d8, #c98545);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }

        .social-link:hover {
          background: linear-gradient(135deg, #c98545, #e8b87a);
          color: #1a0f0a;
          transform: translateY(-5px) scale(1.12);
          box-shadow: 0 8px 30px rgba(201, 133, 69, 0.35);
          border-color: transparent;
        }

        .social-link:hover::before {
          opacity: 1;
        }

        .social-link i {
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }

        .social-link:hover i {
          transform: scale(1.1);
        }

        .section-title{
          font-family: var(--font-display);
          font-size:2.4rem;
          font-weight:800;
          margin-bottom:0.75rem;
          letter-spacing:-0.5px;
          color:#1a0f0a;
        }
        .section-title .gradient-text{
          background:linear-gradient(135deg,#3d251a,#5a3828,#c98545);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          background-size:200% 200%;
          animation:gradientMove 4s ease-in-out infinite;
        }
        .section-divider{
          width:70px;
          height:3px;
          margin:1.2rem auto;
          background:linear-gradient(90deg,#3d251a,#c98545,#e8b87a);
          border-radius:4px;
        }
        .section-subtitle{
          color:#6b4f3a;
          font-size:1.05rem;
          margin-bottom:2.5rem;
          font-weight:400;
        }

        /* ================================================================ */
        /* ========== SKILL TAGS WITH ICONS & MOTION ====================== */
        /* ================================================================ */
        .skill-tag-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(145deg, #3d251a, #2c1a12);
          padding: 0.65rem 1.4rem 0.65rem 1rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.85rem;
          color: #fdf6ee;
          box-shadow: 0 4px 16px rgba(26, 15, 10, 0.2), inset 0 1px 0 rgba(253, 246, 238, 0.06);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          margin: 0.35rem;
          cursor: default;
          flex-shrink: 0;
          border: 1px solid rgba(253, 246, 238, 0.06);
          animation: skillFloat 4s ease-in-out infinite;
          font-family: var(--font-body);
        }

        .skill-tag-wrapper:nth-child(odd) { animation-delay: 0s; }
        .skill-tag-wrapper:nth-child(even) { animation-delay: 0.5s; }

        .skill-tag-wrapper .skill-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          border-radius: 50%;
          background: rgba(253, 246, 238, 0.06);
          color: #e8b87a;
          transition: all 0.4s ease;
          flex-shrink: 0;
        }

        .skill-tag-wrapper:hover {
          background: linear-gradient(145deg, #fdf6ee, #f5e8d8);
          color: #1a0f0a;
          transform: translateY(-5px) scale(1.04);
          box-shadow: 0 8px 32px rgba(201, 133, 69, 0.2);
          border-color: rgba(201, 133, 69, 0.2);
        }

        .skill-tag-wrapper:hover .skill-icon {
          background: linear-gradient(135deg, #c98545, #e8b87a);
          color: #1a0f0a;
          animation: skillIconSpin 1s ease-in-out;
        }

        /* ================================================================ */
        /* ========== PROJECT CARD ========================================= */
        /* ================================================================ */
        .project-card{
          background: var(--gradient-glass);
          border-radius: var(--radius-lg);
          overflow:hidden;
          border:1px solid var(--glass-border);
          box-shadow:var(--glass-shadow);
          transition:var(--transition);
          height:100%;
          color:var(--cream-50);
          backdrop-filter: blur(10px);
        }
        .project-card:hover{transform:translateY(-10px);box-shadow:0 24px 80px rgba(26,15,10,0.25)}
        .project-card-img{
          width:100%;
          height:220px;
          object-fit:cover;
          display:block;
        }
        .project-card-body{padding:1.5rem}
        .project-card-title{
          font-family: var(--font-display);
          font-size:1.1rem;
          font-weight:700;
          color:#fdf6ee;
          margin-bottom:0.4rem;
        }
        .project-card-desc{
          font-size:0.9rem;
          color:rgba(253,246,238,0.7);
          margin-bottom:1rem;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:hidden;
        }
        .project-tech{
          display:flex;
          flex-wrap:wrap;
          gap:0.4rem;
          margin-bottom:1.2rem;
        }

        .project-tech-badge{
          background:rgba(253,246,238,0.06);
          color:#e8b87a;
          padding:0.2rem 0.85rem;
          border-radius:50px;
          font-size:0.7rem;
          font-weight:600;
          border:1px solid rgba(253,246,238,0.08);
          transition: all 0.3s ease;
          flex-shrink:0;
          font-family: var(--font-body);
        }
        .project-tech-badge:hover{
          background:#fdf6ee;
          color:#3d251a;
          border-color:rgba(61,37,26,0.15);
          transform:scale(1.05);
        }

        .project-card-links{display:flex;gap:0.75rem;flex-wrap:wrap}
        .project-card-links a{
          display:inline-flex;
          align-items:center;
          gap:0.4rem;
          padding:0.4rem 1.2rem;
          border-radius:50px;
          font-size:0.8rem;
          font-weight:600;
          transition:var(--transition);
          text-decoration:none;
          color:#e8b87a;
          border:1px solid rgba(253,246,238,0.08);
          background:rgba(253,246,238,0.04);
          flex-shrink:0;
          font-family: var(--font-body);
        }
        .project-card-links a:hover{
          background:linear-gradient(135deg,#e8b87a,#c98545);
          color:#1a0f0a;
          border-color:transparent;
          transform:translateY(-2px);
        }
        .project-card-links a:first-child{
          background:linear-gradient(135deg,#c98545,#e8b87a);
          color:#1a0f0a;
          border:none;
          font-weight:700;
          box-shadow:0 4px 16px rgba(201,133,69,0.3);
        }
        .project-card-links a:first-child:hover{
          box-shadow:0 6px 28px rgba(201,133,69,0.4);
          background:linear-gradient(135deg,#d4a055,#f0c88a);
        }

        .stat-item{
          background:var(--gradient-glass);
          border-radius:var(--radius-md);
          padding:2rem 2rem;
          border:1px solid var(--glass-border);
          box-shadow:var(--glass-shadow);
          text-align:center;
          transition:var(--transition);
          color:var(--cream-50);
          backdrop-filter: blur(10px);
        }
        .stat-item:hover{transform:translateY(-6px)scale(1.02);box-shadow:0 24px 80px rgba(26,15,10,0.2)}
        .stat-number{
          font-family: var(--font-display);
          font-size:2.8rem;
          font-weight:900;
          line-height:1;
          margin-bottom:0.25rem;
          background:linear-gradient(135deg,#fdf6ee,#e8b87a,#c98545);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .stat-label{
          font-size:0.9rem;
          color:rgba(253,246,238,0.7);
          font-weight:500;
        }

        .footer-glass{
          background:var(--gradient-glass);
          border-top:1px solid var(--glass-border);
          padding:2rem 0;
          margin-top:3rem;
          backdrop-filter: blur(10px);
        }
        .footer-text{
          font-size:0.9rem;
          color:rgba(253,246,238,0.7);
          font-family: var(--font-body);
        }
        .heart{
          color:#e8b87a;
          display:inline-block;
          animation:heartBeat 1.5s ease-in-out infinite;
        }
        .code-icon{
          background:linear-gradient(135deg,#fdf6ee,#e8b87a,#c98545);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
        }

        .text-muted{color:rgb(226, 185, 138)!important}

        /* ================================================================ */
        /* ========== RESPONSIVE =========================================== */
        /* ================================================================ */
        @media(max-width:992px){
          .profile-image {
            width: 190px;
            height: 240px;
          }
          .hero-title {
            font-size: 2.6rem;
          }
          .profile-wrapper {
            margin-top: 10px;
          }
        }

        @media(max-width:768px){
          .hero-title {
            font-size: 2.2rem;
          }
          .profile-image {
            width: 170px;
            height: 215px;
          }
          .main-content {
            padding-top: 85px;
          }
          .project-card-img {
            height: 180px;
          }
          .hero-actions {
            grid-template-columns: 1fr 1fr;
            gap: 0.6rem;
            max-width: 100%;
          }
          .btn-primary-custom, .btn-outline-custom {
            padding: 0.6rem 1.5rem;
            font-size: 0.82rem;
          }
          .section-title {
            font-size: 1.8rem;
          }
          .hero-glass {
            padding: 1rem 1.2rem;
          }
          .profile-wrapper {
            margin-top: 15px;
          }
          .skill-tag-wrapper {
            padding: 0.5rem 1rem 0.5rem 0.8rem;
            font-size: 0.75rem;
          }
          .skill-tag-wrapper .skill-icon {
            width: 24px;
            height: 24px;
            font-size: 0.9rem;
          }
          .social-link {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
        }
          
        @media(max-width:576px){
          .hero-title {
            font-size: 1.7rem;
          }
          .profile-image {
            width: 140px;
            height: 180px;
          }
          .main-content {
            padding-top: 75px;
          }
          .hero-glass {
            padding: 0.8rem 0.8rem;
            border-radius: var(--radius-lg);
          }
          .hero-actions {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }
          .btn-primary-custom, .btn-outline-custom {
            padding: 0.5rem 0.8rem;
            font-size: 0.7rem;
            border-radius: 30px;
          }
          .btn-primary-custom i, .btn-outline-custom i {
            font-size: 0.65rem;
          }
          .project-card-img {
            height: 140px;
          }
          .project-card-body {
            padding: 0.8rem;
          }
          .project-card-title {
            font-size: 0.9rem;
          }
          .project-card-desc {
            font-size: 0.75rem;
          }
          .project-tech-badge {
            font-size: 0.6rem;
            padding: 0.15rem 0.5rem;
          }
          .project-card-links a {
            padding: 0.25rem 0.6rem;
            font-size: 0.65rem;
          }
          .social-link {
            width: 36px;
            height: 36px;
            font-size: 0.9rem;
          }
          .stat-number {
            font-size: 1.8rem;
          }
          .stat-item {
            padding: 1rem 0.8rem;
          }
          .section-title {
            font-size: 1.4rem;
          }
          .section-subtitle {
            font-size: 0.8rem;
            margin-bottom: 1.5rem;
          }
          .skill-tag-wrapper {
            padding: 0.4rem 0.8rem 0.4rem 0.6rem;
            font-size: 0.65rem;
            margin: 0.2rem;
            gap: 0.3rem;
          }
          .skill-tag-wrapper .skill-icon {
            width: 20px;
            height: 20px;
            font-size: 0.75rem;
          }
          .footer-text {
            font-size: 0.7rem;
          }
          .profile-wrapper {
            margin-top: 20px;
          }
          .hero-badge {
            font-size: 0.65rem;
            padding: 0.3rem 1rem;
            margin-bottom: 0.8rem;
          }
          .hero-subtitle {
            font-size: 0.85rem;
            margin-bottom: 1.2rem;
          }
        }
      `}</style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />

      {/* ===== LEOPARD SPOTS RAIN EFFECT ===== */}
      <div className="leopard-spots-container">
        {[...Array(35)].map((_, i) => {
          const size = 3 + Math.random() * 18;
          const left = Math.random() * 100;
          const delay = Math.random() * 25;
          const duration = 12 + Math.random() * 25;
          const types = ['gold', 'dark', 'light', 'irregular', 'irregular-2', 'irregular-3'];
          const spotClass = 'leopard-spot ' + types[Math.floor(Math.random() * types.length)];
          
          return (
            <div
              key={i}
              className={spotClass}
              style={{
                width: size + 'px',
                height: size * (0.7 + Math.random() * 0.5) + 'px',
                left: left + '%',
                animationDuration: duration + 's',
                animationDelay: delay + 's',
                opacity: 0.15 + Math.random() * 0.35,
              }}
            />
          );
        })}
      </div>

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="bg-orb"></div>
        <div className="bg-orb"></div>
        <div className="bg-orb"></div>
      </div>

      <Navbar />

      <div className="main-content">
        <section className="hero-section">
          <div className="container">
            <div className="hero-glass">
              <div className="row align-items-center">
                <div className="col-lg-5 order-1 order-lg-1 text-center mb-4 mb-lg-0">
                  <div className="profile-wrapper">
                    <div className="profile-glow"></div>
                    <div className="profile-border"></div>
                    <img 
                      src="/hagia.png" 
                      alt="Hagia Sofiana" 
                      className="profile-image"
                    />
                    <div className="profile-shimmer"></div>
                  </div>
                </div>
                <div className="col-lg-7 order-2 order-lg-2">
                  <div className="hero-content">
                    <div className="hero-badge">
                      <i className="fas fa-graduation-cap"></i>
                      Rekayasa Perangkat Lunak
                    </div>
                    <h1 className="hero-title">
                      <span className="role-text">{roles[roleIndex]}</span><br/>
                      <span className="highlight">Hagia Sofiana</span>
                    </h1>
                    <p className="hero-subtitle">{tentang}</p>
                    <div className="hero-actions">
                      <Link to="/project" className="btn-primary-custom">
                        <i className="fas fa-folder-open"></i>Lihat Project
                      </Link>
                      <a href="#skills" className="btn-outline-custom">
                        <i className="fas fa-code"></i>Skill Saya
                      </a>
                    </div>
                    <div className="social-links">
                      <a href="https://github.com/ann4yaa" className="social-link" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
                      <a href="https://www.linkedin.com/in/hagia-sofiana" className="social-link" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
                      <a href="https://www.instagram.com/ann4yaa_" className="social-link" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
                      <a href="https://www.threads.com/@ann4yaa_" className="social-link" target="_blank" rel="noreferrer"><i className="fab fa-threads"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '2rem 0' }}>
          <div className="container">
            <div className="row g-3 justify-content-center">
              <div className="col-6 col-md-3">
                <div className="stat-item" ref={(el) => { cardRefs.current[0] = el; }}>
                  <div className="stat-number">{totalProject}+</div>
                  <div className="stat-label">Total Project</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="stat-item" ref={(el) => { cardRefs.current[1] = el; }}>
                  <div className="stat-number">{skills.length}+</div>
                  <div className="stat-label">Teknologi</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 0' }} id="skills">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title">Teknologi yang <span className="gradient-text">Dikuasai</span></h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">Stack teknologi yang saya gunakan dalam pengembangan web</p>
            </div>
            <div className="text-center">
              {skills.map((skill, i) => {
                const iconMap = {
                  'HTML': 'fa-brands fa-html5',
                  'CSS': 'fa-brands fa-css3-alt',
                  'JavaScript': 'fa-brands fa-js',
                  'PHP': 'fa-brands fa-php',
                  'MySQL': 'fa-solid fa-database',
                  'Python': 'fa-brands fa-python',
                  'Bootstrap': 'fa-brands fa-bootstrap',
                  'Java': 'fa-brands fa-java',
                  'React': 'fa-brands fa-react',
                  'Vite': 'fa-solid fa-bolt'
                };
                return (
                  <span className="skill-tag-wrapper" key={i} ref={(el) => { cardRefs.current[i + 2] = el; }}>
                    <span className="skill-icon">
                      <i className={iconMap[skill] || 'fa-solid fa-code'}></i>
                    </span>
                    <span>{skill}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        <section style={{ padding: '3.5rem 0' }}>
          <div className="container">
            <div className="text-center">
              <h2 className="section-title">Project <span className="gradient-text">Terbaru</span></h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">Beberapa project yang telah saya kerjakan</p>
            </div>

            {recentProjects.length > 0 ? (
              <>
                <div className="row g-4">
                  {recentProjects.map((project, i) => {
                    const teknologiList = project.teknologi ? project.teknologi.split('|') : [];
                    return (
                      <div className="col-md-4 col-sm-6 col-12" key={project.id}>
                        <div className="project-card h-100" ref={(el) => { cardRefs.current[i + 12] = el; }}>
                          {project.gambar ? (
                            <img src={`/uploads/${project.gambar}`} alt={project.nama_project} className="project-card-img" />
                          ) : (
                            <div className="project-card-img d-flex align-items-center justify-content-center"
                              style={{ background: 'linear-gradient(145deg,#f5e8d8 0%,#fdf6ee 100%)' }}>
                              <i className="fas fa-image" style={{ fontSize: '3rem', color: '#5a3828' }}></i>
                            </div>
                          )}
                          <div className="project-card-body">
                            <h5 className="project-card-title">{project.nama_project}</h5>
                            <p className="project-card-desc">{project.deskripsi}</p>
                            <div className="project-tech">
                              {teknologiList.slice(0, 3).map((t, j) => (
                                <span className="project-tech-badge" key={j}>{t}</span>
                              ))}
                              {teknologiList.length > 3 && (
                                <span className="project-tech-badge">+{teknologiList.length - 3}</span>
                              )}
                            </div>
                            <div className="project-card-links">
                              {project.github && (
                                <a href={project.github} target="_blank" rel="noreferrer">
                                  <i className="fab fa-github me-1"></i><span>GitHub</span>
                                </a>
                              )}
                              {project.demo && (
                                <a href={project.demo} target="_blank" rel="noreferrer">
                                  <i className="fas fa-external-link-alt me-1"></i><span>Demo</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-center mt-4">
                  <Link to="/project" className="btn-primary-custom" style={{ width: 'auto', padding: '0.85rem 2.6rem' }}>
                    Lihat Semua Project <i className="fas fa-arrow-right ms-2"></i>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-inbox" style={{ fontSize: '3rem', color: '#5a3828' }}></i>
                <p className="text-muted mt-3">Belum ada project.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <footer className="footer-glass">
        <div className="container">
          <div className="text-center footer-text">
            <span className="code-icon"><i className="fas fa-code me-1"></i></span> Full Stack Developer{' '}
            <span className="heart"><i className="fas fa-heart"></i></span>{' '}
            Hagia Sofiana &bull; {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </>
  );
}