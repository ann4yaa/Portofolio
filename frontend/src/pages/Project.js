// Project.js - Fix dengan background leopard statis + font button Playfair
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DOMPurify from 'dompurify'; // 🔒 TAMBAHKAN INI

export default function Project() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const filterKategori = parseInt(searchParams.get('kategori')) || 0;
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🔒 FETCH DENGAN VALIDASI DATA
  useEffect(() => {
    fetch('/assets/data.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        console.log('✅ Data dari JSON:', data);
        
        // ===== VALIDASI DATA =====
        if (!data || typeof data !== 'object') {
          throw new Error('Data tidak valid');
        }
        
        if (!Array.isArray(data.projects)) {
          data.projects = [];
        }
        
        // Validasi setiap project
        const validProjects = data.projects.filter(p => {
          return (
            typeof p === 'object' &&
            p !== null &&
            typeof p.id === 'number' &&
            typeof p.nama_project === 'string' &&
            p.nama_project.length > 0 &&
            typeof p.deskripsi === 'string' &&
            Array.isArray(p.teknologi)
          );
        });
        
        if (validProjects.length === 0) {
          setProjects([]);
          setKategoriList([]);
          setLoading(false);
          return;
        }
        
        // Ambil kategori unik dari data
        const kategoriSet = new Map();
        validProjects.forEach(p => {
          if (p.kategori && typeof p.kategori === 'string' && !kategoriSet.has(p.kategori)) {
            kategoriSet.set(p.kategori, {
              id: kategoriSet.size + 1,
              kategori: p.kategori
            });
          }
        });
        const kategoriList = Array.from(kategoriSet.values());
        setKategoriList(kategoriList);
        
        // Filter berdasarkan kategori
        let filteredProjects = validProjects;
        if (filterKategori > 0) {
          const selectedKategori = kategoriList.find(k => k.id === filterKategori);
          if (selectedKategori) {
            filteredProjects = validProjects.filter(p => p.kategori === selectedKategori.kategori);
          }
        }
        setProjects(filteredProjects);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Gagal baca data.json:', err);
        setProjects([]);
        setKategoriList([]);
        setLoading(false);
      });
  }, [filterKategori]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded || loading) return;

    cardRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.7s cubic-bezier(0.34,1.56,0.64,1)';
      }
    });
    const timer = setTimeout(() => {
      cardRefs.current.forEach((el, i) => {
        if (el) {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, i * 80);
        }
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [isLoaded, loading, projects]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          color: '#3d251a',
          fontSize: '1.2rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #c98545',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p>Loading data...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </>
    );
  }

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
          --gold: #d4a055;
          --gradient-main: linear-gradient(145deg, #2c1a12 0%, #5a3828 60%, #c98545 100%);
          --gradient-glass: linear-gradient(145deg, rgba(44, 26, 18, 0.95), rgba(26, 15, 10, 0.92));
          --glass-border: rgba(253, 246, 238, 0.08);
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
          min-height: 100vh;
          font-family: var(--font-body);
          position: relative;
          overflow-x: hidden;
        }

        /* ========== LEOPARD BACKGROUND PATTERN (STATIS) ========== */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: 
            radial-gradient(ellipse at 18% 18%, rgba(201, 133, 69, 0.25) 0 6px, rgba(201, 133, 69, 0.08) 7px 12px, transparent 13px),
            radial-gradient(ellipse at 72% 28%, rgba(61, 37, 26, 0.20) 0 5px, rgba(201, 133, 69, 0.06) 6px 10px, transparent 11px),
            radial-gradient(ellipse at 36% 74%, rgba(201, 133, 69, 0.20) 0 4px, rgba(61, 37, 26, 0.06) 5px 9px, transparent 10px),
            radial-gradient(ellipse at 82% 72%, rgba(61, 37, 26, 0.18) 0 5px, rgba(201, 133, 69, 0.05) 6px 11px, transparent 12px),
            radial-gradient(ellipse at 10% 50%, rgba(201, 133, 69, 0.15) 0 4px, rgba(61, 37, 26, 0.04) 5px 8px, transparent 9px),
            radial-gradient(ellipse at 55% 90%, rgba(201, 133, 69, 0.22) 0 5px, rgba(61, 37, 26, 0.06) 6px 10px, transparent 11px),
            radial-gradient(ellipse at 90% 55%, rgba(61, 37, 26, 0.18) 0 4px, rgba(201, 133, 69, 0.05) 5px 9px, transparent 10px),
            radial-gradient(ellipse at 45% 10%, rgba(201, 133, 69, 0.20) 0 5px, rgba(61, 37, 26, 0.06) 6px 11px, transparent 12px);
          background-size: 180px 160px, 200px 180px, 220px 200px, 190px 170px, 160px 140px, 210px 190px, 170px 150px, 230px 210px;
          opacity: 0.6;
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
        @keyframes shimmerBorder {
          0% { background-position: -300% center; }
          100% { background-position: 300% center; }
        }
        @keyframes shimmer {
          0%,100%{background-position:0% 50%}
          50%{background-position:100% 50%}
        }
        @keyframes chocoShimmer {
          0% { background-position: -200% center; }
          50% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        .bg-orb{position:absolute;border-radius:50%;filter:blur(100px);animation:floatOrb 25s ease-in-out infinite;pointer-events:none}
        .bg-orb:nth-child(1){width:450px;height:450px;background:#c98545;top:-180px;right:-120px;opacity:0.08}
        .bg-orb:nth-child(2){width:350px;height:350px;background:#5a3828;bottom:-100px;left:-90px;animation-delay:-8s;opacity:0.10}
        .bg-orb:nth-child(3){width:280px;height:280px;background:#2c1a12;top:40%;left:25%;animation-delay:-16s;opacity:0.06}

        .main-content{position:relative;z-index:1;padding-top:100px}

        .page-header-glass{
          background:var(--gradient-glass);
          border:1px solid var(--glass-border);
          box-shadow:var(--glass-shadow);
          border-radius:var(--radius-xl);
          padding:2.5rem 3rem;
          margin-bottom:2rem;
          position:relative;
          overflow:hidden;
          color:#fdf6ee;
          animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(10px);
        }

        .page-header-glass::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: var(--radius-xl);
          padding: 1px;
          background: linear-gradient(
            135deg,
            transparent 30%,
            rgba(201,133,69,0.05),
            rgba(245,198,208,0.03),
            rgba(201,133,69,0.05),
            transparent 70%
          );
          background-size: 300% 300%;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: shimmerBorder 4s linear infinite;
          z-index: 0;
          pointer-events: none;
        }

        .page-header-glass > * { position: relative; z-index: 1; }

        .page-title{
          font-family: var(--font-display);
          font-size:2.4rem;
          font-weight:900;
          margin-bottom:0.5rem;
          letter-spacing:-0.5px;
          color:#fdf6ee;
        }
        .page-title .gradient-text{
          background:linear-gradient(120deg,#fdf6ee 0%,#e8b87a 35%,#fdf6ee 55%,#c98545 78%,#fdf6ee 100%);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          background-size:260% 260%;
          animation:gradientMove 4s ease-in-out infinite;
        }
        .page-title i{color:#e8b87a}
        .page-subtitle{
          color:rgba(253,246,238,0.7);
          font-size:1rem;
          font-weight:400;
        }

        /* ================================================================ */
        /* ========== FILTER BUTTON ======================================= */
        /* ================================================================ */

        .filter-section{
          margin-bottom:2rem;
          display:flex;
          flex-wrap:wrap;
          justify-content:center;
          gap:0.5rem;
          animation: fadeInUp 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .filter-btn {
          padding: 0.6rem 1.8rem;
          border-radius: 50px;
          border: 2px solid rgba(61, 37, 26, 0.3);
          background: linear-gradient(135deg, #2c1a12, #3d251a, #5a3828);
          background-size: 300% 300%;
          color: #ffe9cf;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          flex-shrink: 0;
          font-family: var(--font-display); /* PLAYFAIR DISPLAY */
          position: relative;
          overflow: hidden;
          animation: chocoShimmer 4s ease-in-out infinite;
          box-shadow: 0 2px 15px rgba(44, 26, 18, 0.3);
        }

        .filter-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,215,180,0.1), transparent);
          transition: left 0.6s ease;
        }

        .filter-btn:hover::before {
          left: 100%;
        }

        .filter-btn:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 6px 25px rgba(44, 26, 18, 0.4);
          border-color: rgba(61, 37, 26, 0.5);
          background: linear-gradient(135deg, #3d251a, #5a3828, #6b4228);
          background-size: 300% 300%;
          animation: chocoShimmer 3s ease-in-out infinite;
          color: #ffe7cb;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #ffe7cb, #c98545) !important;
          background-size: 300% 300% !important;
          color: #2c1a12 !important;
          border: 2px solid rgba(201, 133, 69, 0.5) !important;
          font-weight: 700;
          box-shadow: 0 4px 25px rgba(201, 133, 69, 0.3);
          animation: shimmer 3s ease-in-out infinite;
        }

        .filter-btn.active:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 8px 35px rgba(201, 133, 69, 0.4);
          background: linear-gradient(135deg, #fff8ed, #d4a055) !important;
          background-size: 300% 300% !important;
          animation: shimmer 3s ease-in-out infinite;
          color: #2c1a12 !important;
        }

        .project-card{
          background:var(--gradient-glass);
          border-radius:var(--radius-lg);
          overflow:hidden;
          border:1px solid var(--glass-border);
          box-shadow:var(--glass-shadow);
          transition:var(--transition);
          height:100%;
          color:var(--cream-50);
          backdrop-filter: blur(10px);
        }
        .project-card:hover{transform:translateY(-8px);box-shadow:0 24px 80px rgba(26,15,10,0.25)}
        .project-card-img{
          width:100%;
          height:200px;
          object-fit:cover;
          display:block;
        }
        .project-card-body{padding:1.5rem}
        .project-card-title{
          font-family: var(--font-display);
          font-size:1.05rem;
          font-weight:700;
          color:#fdf6ee;
          margin-bottom:0.3rem;
          display:block;
        }
        .project-card-kategori{
          font-size:0.75rem;
          color:#e8b87a;
          font-weight:600;
          display:block;
          margin-bottom:0.5rem;
          font-family: var(--font-body);
        }
        .project-card-desc{
          font-size:0.85rem;
          color:rgba(253,246,238,0.7);
          margin-bottom:1rem;
          display:-webkit-box;
          -webkit-line-clamp:3;
          -webkit-box-orient:vertical;
          overflow:hidden;
        }
        .project-tech{
          display:flex;
          flex-wrap:wrap;
          gap:0.35rem;
          margin-bottom:1rem;
        }
        .project-tech-badge{
          background:rgba(253,246,238,0.06);
          color:#e8b87a;
          padding:0.2rem 0.7rem;
          border-radius:50px;
          font-size:0.7rem;
          font-weight:600;
          border:1px solid rgba(253,246,238,0.06);
          flex-shrink:0;
          transition:var(--transition);
          font-family: var(--font-body);
        }
        .project-tech-badge:hover{
          background: linear-gradient(135deg, #fff2d8, #c98545) !important;
          color:#24140f;
          border-color:rgba(61,37,26,0.15);
          transform:scale(1.05);
        }
        .project-card-links{display:flex;gap:0.75rem;flex-wrap:wrap}
        .project-card-links a{
          display:inline-flex;
          align-items:center;
          gap:0.4rem;
          font-size:0.8rem;
          font-weight:600;
          color:#e8b87a;
          text-decoration:none;
          padding:0.4rem 1rem;
          border-radius:50px;
          border:1px solid rgba(253,246,238,0.08);
          background:rgba(253,246,238,0.04);
          transition:var(--transition);
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

        .glass-card{
          background:var(--gradient-glass);
          border-radius:var(--radius-lg);
          border:1px solid var(--glass-border);
          box-shadow:var(--glass-shadow);
          padding:2rem;
          color:var(--cream-50);
          backdrop-filter: blur(10px);
        }
        .footer-glass{
          background:var(--gradient-glass);
          border-top:1px solid var(--glass-border);
          padding:1.5rem 0;
          margin-top:4rem;
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

        .text-muted{color:rgba(253,246,238,0.6)!important}

        @media(max-width:768px){
          .main-content{padding-top:85px}
          .page-header-glass{padding:2rem 1.5rem;border-radius:var(--radius-lg)}
          .page-title{font-size:1.8rem}
          .project-card-img{height:180px}
          .filter-btn{
            padding:0.4rem 1rem;
            font-size:0.75rem;
          }
        }
        @media(max-width:576px){
          .main-content{padding-top:75px}
          .page-header-glass{padding:1.2rem 1rem;border-radius:var(--radius-md)}
          .page-title{font-size:1.4rem}
          .page-subtitle{font-size:0.8rem}
          .project-card-img{height:140px}
          .project-card-body{padding:0.8rem}
          .project-card-title{font-size:0.9rem}
          .project-card-desc{font-size:0.75rem;margin-bottom:0.6rem}
          .project-card-kategori{font-size:0.65rem}
          .project-tech-badge{font-size:0.6rem;padding:0.15rem 0.5rem}
          .project-card-links a{padding:0.25rem 0.6rem;font-size:0.65rem}
          .filter-btn{
            padding:0.25rem 0.7rem;
            font-size:0.65rem;
          }
          .filter-section{gap:0.3rem}
          .footer-text{font-size:0.7rem}
          .glass-card{padding:1rem}
        }
      `}</style>
      {/* 🔒 HAPUS DUPLIKAT CSS - SUDAH DI INDEX.HTML */}
      {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" /> */}
      {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" /> */}

      {/* HAPUS leopard-spots-container - diganti background pattern */}

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="bg-orb"></div>
        <div className="bg-orb"></div>
        <div className="bg-orb"></div>
      </div>

      <Navbar />

      <div className="main-content">
        <div className="container">
          <div className="page-header-glass">
            <h1 className="page-title">
              <i className="fas fa-folder-open me-2"></i>
              <span className="gradient-text">Portfolio Projects</span>
            </h1>
            <p className="page-subtitle">Explore a collection of projects that showcase my skills, creativity, and passion for software development.</p>
          </div>

          <div className="filter-section">
            <button
              className={`filter-btn ${filterKategori === 0 ? 'active' : ''}`}
              onClick={() => setSearchParams({})}
            >
              <i className="fas fa-th me-1"></i>All Projects
            </button>
            {kategoriList.map((k) => (
              <button
                key={k.id}
                className={`filter-btn ${filterKategori === k.id ? 'active' : ''}`}
                onClick={() => setSearchParams({ kategori: k.id })}
              >
                {DOMPurify.sanitize(k.kategori)}
              </button>
            ))}
          </div>

          {projects.length > 0 ? (
            <div className="row g-4">
              {projects.map((project, i) => {
                const teknologiList = Array.isArray(project.teknologi) 
                  ? project.teknologi 
                  : (project.teknologi ? project.teknologi.split('|') : []);
                
                return (
                  <div className="col-md-6 col-lg-4 col-12" key={project.id}>
                    <div className="project-card" ref={(el) => { cardRefs.current[i] = el; }}>
                      {project.gambar ? (
                        <img src={`/assets/uploads/${project.gambar}`} alt={project.nama_project} className="project-card-img" />
                      ) : (
                        <div className="project-card-img d-flex align-items-center justify-content-center"
                          style={{ background: 'linear-gradient(145deg,#f5e8d8 0%,#fdf6ee 100%)' }}>
                          <i className="fas fa-image" style={{ fontSize: '3rem', color: '#5a3828' }}></i>
                        </div>
                      )}
                      <div className="project-card-body">
                        {/* 🔒 SANITASI DENGAN DOMPurify */}
                        <span className="project-card-title">
                          {DOMPurify.sanitize(project.nama_project)}
                        </span>
                        <span className="project-card-kategori">
                          {DOMPurify.sanitize(project.kategori)}
                        </span>
                        <p className="project-card-desc">
                          {DOMPurify.sanitize(project.deskripsi)}
                        </p>
                        <div className="project-tech">
                          {teknologiList.map((t, j) => (
                            <span className="project-tech-badge" key={j}>
                              {DOMPurify.sanitize(t)}
                            </span>
                          ))}
                        </div>
                        <div className="project-card-links">
                          {project.github && (
                            <a href={DOMPurify.sanitize(project.github)} target="_blank" rel="noreferrer">
                              <i className="fab fa-github me-1"></i><span>GitHub</span>
                            </a>
                          )}
                          {project.demo && (
                            <a href={DOMPurify.sanitize(project.demo)} target="_blank" rel="noreferrer">
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
          ) : (
            <div className="glass-card text-center py-5">
              <i className="fas fa-inbox" style={{ fontSize: '4rem', color: '#fbda98' }}></i>
              <h5 className="mt-3" style={{ color: '#c98545' }}>More projects coming soon</h5>
            </div>
          )}
        </div>
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