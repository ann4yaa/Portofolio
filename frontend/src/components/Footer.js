// Footer.js - footer kotak full kiri-kanan (bukan glass floating seperti header)
import React from 'react';
import { PROFILE, SOCIALS } from '../data/siteData';
import '../styles/portfolio.css';

export default function Footer() {
  return (
    <footer className="pf-footer pf-footer--full">
      {/* [PERUBAHAN 2: FOOTER] class 'pf-glass' dihapus, diganti 'pf-footer__bar--full' (kotak full lebar, tanpa radius). Isi dibungkus 'pf-footer__inner' agar rapi. Style ada di portfolio-patch.css */}
      <div className="pf-footer__bar pf-footer__bar--full">
        <div className="pf-footer__inner">
          <span>
            &copy; {new Date().getFullYear()} {PROFILE.name}. Rekayasa Perangkat Lunak.
          </span>

          <ul className="pf-socials">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                  <i className={s.icon} aria-hidden="true"></i>
                </a>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </footer>
  );
}