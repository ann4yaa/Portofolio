// Navbar.js - light glass, navigasi section + sosmed
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PROFILE, NAV_ITEMS, SOCIALS } from '../data/siteData';
import '../styles/portfolio.css';

export default function Navbar() {
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const onProjectPage = pathname === '/project';
  const scrolledRef = useRef(false);
  const activeRef = useRef('home');

  // [PERUBAHAN 4a: FIX BUG ACTIVE NAVBAR] ref untuk "mengunci" menu aktif sesaat setelah diklik
  const lockRef = useRef(false);
  const lockTimer = useRef(null);

  // [PERUBAHAN 4b] kunci menu aktif selama halaman masih scroll otomatis akibat klik menu
  const lockActive = (id) => {
    if (activeRef.current !== id) {
      activeRef.current = id;
      setActive(id);
    }
    lockRef.current = true;
    clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      lockRef.current = false;
    }, 250);
  };

  useEffect(() => () => clearTimeout(lockTimer.current), []);

  useEffect(() => {
    const section = hash.slice(1);
    const next = NAV_ITEMS.some((item) => item.hash === section) ? section : 'home';
    if (activeRef.current !== next) {
      activeRef.current = next;
      setActive(next);
    }
  }, [pathname, hash]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const next = scrolledRef.current ? window.scrollY > 24 : window.scrollY > 56;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setScrolled(next);
      }

      if (pathname !== '/') return;
      if (lockRef.current) {
        clearTimeout(lockTimer.current);
        lockTimer.current = setTimeout(() => {
          lockRef.current = false;
        }, 150);
        return;
      }

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) {
        const last = NAV_ITEMS[NAV_ITEMS.length - 1].hash;
        if (activeRef.current !== last) {
          activeRef.current = last;
          setActive(last);
        }
        return;
      }

      let current = NAV_ITEMS[0].hash;
      NAV_ITEMS.forEach((item) => {
        const el = document.getElementById(item.hash);
        if (el && el.getBoundingClientRect().top <= 90) current = item.hash;
      });
      if (activeRef.current !== current) {
        activeRef.current = current;
        setActive(current);
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const isCurrent = (hash) => (onProjectPage ? hash === 'projects' : active === hash);

  const links = NAV_ITEMS.map((item) => (
    <li key={item.hash}>
      <Link
        to={{ pathname: '/', hash: `#${item.hash}` }}
        aria-current={isCurrent(item.hash) ? 'true' : undefined}
        onClick={() => {
          setOpen(false);
          lockActive(item.hash); // [PERUBAHAN 4d] warna langsung pindah ke menu yang diklik
        }}
      >
        {item.label}
      </Link>
    </li>
  ));

  const socials = (
    <ul className="pf-socials">
      {SOCIALS.map((s) => (
        <li key={s.label}>
          <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
            <i className={s.icon} aria-hidden="true"></i>
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* [PERUBAHAN 1: NAVBAR] class dinamis: 'is-full-width' (awal, full kiri-kanan) -> 'is-scrolled' (floating/menciut saat scroll). Style-nya ada di portfolio-patch.css */}
      <header className={`pf-header pf-glass ${scrolled ? 'is-scrolled' : 'is-full-width'}`}>
        <Link to={{ pathname: '/', hash: '#home' }} className="pf-brand" aria-label={`${PROFILE.name}, home`}>
          {PROFILE.brand}
        </Link>

        <nav aria-label="Main">
          <ul className="pf-nav">{links}</ul>
        </nav>

        {socials}

        <button
          type="button"
          className="pf-burger"
          aria-expanded={open}
          aria-controls="pf-mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <i className={`fas fa-${open ? 'xmark' : 'bars'}`} aria-hidden="true"></i>
        </button>
      </header>

      <div id="pf-mobile-menu" className={`pf-mobile pf-glass ${open ? 'is-open' : ''}`}>
        <ul className="pf-mobile__list">{links}</ul>
        {socials}
      </div>
    </>
  );
}