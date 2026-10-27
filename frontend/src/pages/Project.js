// Project.js - semua project + filter kategori (logika filter tetap sama: ?kategori=<id>)
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import ProjectCardSkeleton from '../components/ProjectCardSkeleton';
import { fetchPublicProjects } from '../utils/projectData';
import { isValidProject, plain } from '../utils/projectHelpers';
import '../styles/portfolio.css';

export default function Project() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const filterId = parseInt(searchParams.get('kategori'), 10) || 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Data diambil sekali saja; filter dilakukan di sisi klien
  useEffect(() => {
    const controller = new AbortController();
    fetchPublicProjects({ signal: controller.signal })
      .then((list) => {
        setProjects((Array.isArray(list) ? list : []).filter(isValidProject));
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Failed to load projects:', err);
        setStatus('error');
      });
    return () => controller.abort();
  }, []);

  // Kategori unik, id berdasarkan urutan kemunculan (sama seperti sebelumnya)
  const categories = useMemo(() => {
    const seen = new Map();
    projects.forEach((p) => {
      if (p.kategori && typeof p.kategori === 'string' && !seen.has(p.kategori)) {
        seen.set(p.kategori, { id: seen.size + 1, name: p.kategori });
      }
    });
    return Array.from(seen.values());
  }, [projects]);

  const visible = useMemo(() => {
    const selected = categories.find((c) => c.id === filterId);
    return selected ? projects.filter((p) => p.kategori === selected.name) : projects;
  }, [projects, categories, filterId]);

  return (
    <div className="site">
      <Navbar />

      <main>
        <div className="pf-wrap pf-pagehead">
          <h1 className="pf-h2">Projects</h1>
          <p>A collection of web, mobile, and desktop projects I have built and published.</p>

          {categories.length > 0 && (
            <div className="pf-chips" role="group" aria-label="Filter by category">
              <button
                type="button"
                className="pf-chip"
                aria-pressed={filterId === 0}
                onClick={() => setSearchParams({})}
              >
                All projects
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="pf-chip"
                  aria-pressed={filterId === c.id}
                  onClick={() => setSearchParams({ kategori: c.id })}
                >
                  {plain(c.name)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pf-wrap">
          {status === 'loading' && <ProjectCardSkeleton tone="light" />}
          {status === 'error' && (
            <p className="pf-page-msg">Projects could not be loaded. Refresh the page to try again.</p>
          )}
          {status === 'ready' && visible.length === 0 && (
            <p className="pf-page-msg">No projects in this category yet.</p>
          )}
          {status === 'ready' && visible.length > 0 && (
            <div className="pf-page-grid">
              {visible.map((p) => (
                <ProjectCard key={p.id} project={p} tone="light" />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}