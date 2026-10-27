import React from 'react';
import { Link } from 'react-router-dom';

// Tema admin: dark maroon + light cream, background tekstur bunga yang sama dengan website.
export const CHOCO_FORM_CSS = `
  :root {
    --maroon-950: #1d0609;
    --maroon-900: #2c0a10;
    --maroon-800: #4a0f18;
    --maroon-700: #621620;
    --maroon-600: #7d1d2a;
    --cream-50: #fcf2e6;
    --cream-100: #f6e7d6;
    --cream-200: #ead5ba;
    --transition: all 0.3s ease;
  }
  body{
    background:
      linear-gradient(180deg, rgba(29,6,9,0.5), rgba(29,6,9,0.8)),
      url('/assets/bg-floral.jpg') center / cover fixed no-repeat,
      #2c0a10;
    min-height:100vh;
    color:#fcf2e6;
    position:relative;
    overflow-x:hidden;
  }
  .container{position:relative;z-index:1}
  .glass-card{
    background:rgba(44,10,16,0.88);
    -webkit-backdrop-filter:blur(14px);
    backdrop-filter:blur(14px);
    border-radius:20px;
    border:1px solid rgba(252,242,230,0.18);
    box-shadow:0 24px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(252,242,230,0.1);
    padding:2rem;
  }
  .glass-card h3{color:#fcf2e6}
  .glass-card h3 i{color:var(--cream-200)}
  .form-label,.form-check-label,small{color:rgba(252,242,230,0.82)!important}
  .form-control,.form-control:focus{
    background:rgba(252,242,230,0.1);
    border-color:rgba(252,242,230,0.22);
    color:#fcf2e6;
    border-radius:8px;
    padding:0.6rem 1rem;
  }
  .form-control::placeholder{color:rgba(252,242,230,0.45)}
  .form-control:focus{box-shadow:0 0 0 0.2rem rgba(252,242,230,0.22);outline:none}
  select.form-control option{background:#2c0a10;color:#fcf2e6}
  .form-check-input{
    background-color:rgba(252,242,230,0.12);
    border-color:rgba(252,242,230,0.3);
  }
  .form-check-input:checked{
    background-color:var(--cream-50);
    border-color:var(--cream-50);
  }
  .form-check-input:focus{
    border-color:var(--cream-50);
    box-shadow:0 0 0 0.2rem rgba(252,242,230,0.22);
  }
  .current-img{
    max-width:200px;
    border-radius:12px;
    border:2px solid rgba(252,242,230,0.25);
    box-shadow:0 14px 34px rgba(0,0,0,0.3);
  }
  .btn-save{
    background:var(--cream-50);
    border:none;
    color:#1d0609;
    font-weight:700;
    padding:0.5rem 2rem;
    border-radius:14px;
    cursor:pointer;
    transition:var(--transition);
    display:inline-flex;
    align-items:center;
    gap:0.4rem;
  }
  .btn-save:hover{background:var(--cream-200);color:#1d0609}
  .btn-save:disabled{opacity:0.65;cursor:progress}
  .btn-cancel{
    background:rgba(252,242,230,0.08);
    border:1px solid rgba(252,242,230,0.4);
    color:#fcf2e6;
    font-weight:700;
    padding:0.5rem 2rem;
    border-radius:14px;
    text-decoration:none;
    transition:var(--transition);
    display:inline-flex;
    align-items:center;
    gap:0.4rem;
  }
  .btn-cancel:hover{background:rgba(252,242,230,0.16);color:#fcf2e6}
  .mb-3{margin-bottom:1rem}
  .mb-4{margin-bottom:1.5rem}
  .row.g-2{--bs-gutter-x:0.5rem;--bs-gutter-y:0.5rem}
  .form-check{display:flex;align-items:center;gap:0.4rem;padding:0.2rem 0}
  .d-flex.gap-2{display:flex;gap:0.5rem;flex-wrap:wrap}
  .text-light{color:rgba(252,242,230,0.7)!important}
`;

export default function ProjectForm({ title, icon, onSubmit, loading, children }) {
  return (
    <>
      <style>{CHOCO_FORM_CSS}</style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="glass-card">
              <h3 className="fw-bold mb-4">
                <i className={`fas ${icon} me-2`}></i>{title}
              </h3>
              <form onSubmit={onSubmit} encType="multipart/form-data">
                {children}
                <div className="d-flex gap-2">
                  <button type="submit" className="btn-save" disabled={loading}>
                    <i className="fas fa-save me-2"></i>{loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <Link to="/admin" className="btn-cancel">
                    <i className="fas fa-times me-2"></i>Batal
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}