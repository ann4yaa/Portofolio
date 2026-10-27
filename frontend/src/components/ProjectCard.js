// ProjectCard.js - dipakai di Home (tone="dark", di atas cream) dan Project (tone="light", di atas maroon)
import React from 'react';
import { plain, projectImageUrl, safeUrl, toTechList } from '../utils/projectHelpers';

export default function ProjectCard({ project, tone = 'dark', clamp = false, maxTags = Infinity }) {
  const name = plain(project.nama_project);
  const category = plain(project.kategori);
  const tech = toTechList(project).map(plain).filter(Boolean);
  const github = safeUrl(project.github);
  const demo = safeUrl(project.demo);
  const image = projectImageUrl(project.gambar);

  const shown = tech.slice(0, maxTags);
  const hidden = tech.length - shown.length;

  return (
    <article className={`pf-card ${tone === 'light' ? 'pf-card--light' : ''}`}>
      <div className="pf-card__media">
        {image ? (
          <img src={image} alt={`Screenshot of ${name}`} loading="lazy" decoding="async" />
        ) : (
          <div className="pf-card__ph" aria-hidden="true">
            <i className="fas fa-image"></i>
          </div>
        )}
      </div>

      <div className="pf-card__body">
        <h3 className="pf-card__title">{name}</h3>
        {category && <p className="pf-card__cat">{category}</p>}
        <p className={`pf-card__desc ${clamp ? 'pf-card__desc--clamp' : ''}`}>{plain(project.deskripsi)}</p>

        {shown.length > 0 && (
          <ul className="pf-tags" aria-label="Technologies">
            {shown.map((t, i) => (
              <li key={`${t}-${i}`}>{t}</li>
            ))}
            {hidden > 0 && <li>+{hidden}</li>}
          </ul>
        )}

        {(github || demo) && (
          <div className="pf-card__links">
            {github && (
              <a href={github} target="_blank" rel="noreferrer">
                <i className="fab fa-github" aria-hidden="true"></i>GitHub
              </a>
            )}
            {demo && (
              <a href={demo} target="_blank" rel="noreferrer">
                <i className="fas fa-up-right-from-square" aria-hidden="true"></i>Live demo
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}