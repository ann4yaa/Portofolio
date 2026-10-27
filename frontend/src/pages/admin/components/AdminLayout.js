// AdminLayout.js - kerangka bersama semua halaman admin (top bar, tab Project / Pesan).
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ADMIN_CSS } from './adminStyles';

const tabClass = ({ isActive }) => 'adm-tab' + (isActive ? ' is-active' : '');

export default function AdminLayout({ title, subtitle, actions, children }) {
  return (
    <>
      <style>{ADMIN_CSS}</style>
      <div className="adm-shell">
        <header className="adm-top">
          <Link className="adm-brand" to="/admin">
            4naa<small>admin</small>
          </Link>
          <nav className="adm-tabs" aria-label="Menu admin">
            <NavLink to="/admin" end className={tabClass}>
              Project
            </NavLink>
            <NavLink to="/admin/pesan" className={tabClass}>
              Pesan
            </NavLink>
          </nav>
          <Link className="adm-site" to="/">
            Lihat website
          </Link>
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

