// AdminLayout.js - kerangka bersama semua halaman admin (top bar, tab Project / Pesan, badge belum dibaca).
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ADMIN_CSS } from './adminStyles';

const tabClass = ({ isActive }) => 'adm-tab' + (isActive ? ' is-active' : '');

export default function AdminLayout({ title, subtitle, actions, children }) {
  return (
    <>
      <style>{ADMIN_CSS}</style>
      <div className="adm-shell">
        <header className="adm-top">
          <a className="adm-brand" href="/">
            4naa<small>admin</small>
          </a>
          <nav className="adm-tabs" aria-label="Menu admin">
            <NavLink to="/" end className={tabClass}>
              Project
            </NavLink>
            <NavLink to="/pesan" className={tabClass}>
              Pesan
            </NavLink>
          </nav>
          <a className="adm-site" href="/">
            Lihat website
          </a>
        </header>

        <main className="adm-main">
          <div className="adm-head">
            <div>
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </>
  );
}