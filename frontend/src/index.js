import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const navigationEntry = window.performance.getEntriesByType('navigation')[0];
if (navigationEntry?.type === 'reload') {
  const { hash, pathname, search } = window.location;
  if (hash) {
    window.history.replaceState(window.history.state, '', `${pathname}${search}`);
  }

  window.addEventListener(
    'pageshow',
    () => {
      window.scrollTo(0, 0);
      window.requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    },
    { once: true }
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);