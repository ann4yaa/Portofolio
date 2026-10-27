import React from 'react';

export default function ProjectCardSkeleton({ tone = 'dark', count = 3 }) {
  return (
    <div className={tone === 'light' ? 'pf-page-grid' : 'pf-projects__grid'} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <article
          className={`pf-card pf-card--skeleton ${tone === 'light' ? 'pf-card--light' : ''}`}
          key={index}
        >
          <div className="pf-card__media" />
          <div className="pf-card__body">
            <span className="pf-skeleton-line pf-skeleton-line--title" />
            <span className="pf-skeleton-line pf-skeleton-line--short" />
            <span className="pf-skeleton-line" />
            <span className="pf-skeleton-line" />
            <span className="pf-skeleton-line pf-skeleton-line--tags" />
          </div>
        </article>
      ))}
    </div>
  );
}
