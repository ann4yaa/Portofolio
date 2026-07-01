import React from 'react';
import { Link } from 'react-router-dom';

export const CHOCO_FORM_CSS = `
  :root {
    --choco-900: #24140f;
    --choco-800: #321c14;
    --choco-700: #4a2a1d;
    --cream-50: #fff8ed;
    --cream-100: #f6ead7;
    --cream-200: #ead5b8;
    --caramel: #c98545;
    --transition: all 0.3s ease;
  }
  body{
    background:
      radial-gradient(circle at 18% 10%, rgba(201, 133, 69, 0.16), transparent 30%),
      radial-gradient(circle at 84% 92%, rgba(74, 42, 29, 0.12), transparent 28%),
      linear-gradient(180deg, #fff8ed 0%, #f6ead7 100%);
    min-height:100vh;
    color:#fff8ed;
    position:relative;
    overflow-x:hidden;
  }
  body::before{
    content:'';
    position:fixed;
    inset:0;
    z-index:0;
    pointer-events:none;
    background:
      radial-gradient(ellipse at 18% 18%, rgba(36,20,15,0.28) 0 7px, rgba(201,133,69,0.26) 8px 15px, transparent 16px),
      radial-gradient(ellipse at 72% 28%, rgba(74,42,29,0.24) 0 6px, rgba(201,133,69,0.22) 7px 13px, transparent 14px),
      radial-gradient(ellipse at 36% 74%, rgba(36,20,15,0.22) 0 5px, rgba(201,133,69,0.20) 6px 12px, transparent 13px);
    background-size:145px 130px,175px 155px,190px 170px;
    opacity:0.72;
    mask-image:
      radial-gradient(circle at 0 0, #000 0 20%, transparent 36%),
      radial-gradient(circle at 100% 0, #000 0 20%, transparent 36%),
      radial-gradient(circle at 0 100%, #000 0 20%, transparent 36%),
      radial-gradient(circle at 100% 100%, #000 0 20%, transparent 36%);
    -webkit-mask-image:
      radial-gradient(circle at 0 0, #000 0 20%, transparent 36%),
      radial-gradient(circle at 100% 0, #000 0 20%, transparent 36%),
      radial-gradient(circle at 0 100%, #000 0 20%, transparent 36%),
      radial-gradient(circle at 100% 100%, #000 0 20%, transparent 36%);
  }
  .container{position:relative;z-index:1}
  .glass-card{
    background:linear-gradient(145deg, rgba(50,28,20,0.94), rgba(36,20,15,0.90));
    border-radius:20px;
    border:1px solid rgba(255,248,237,0.16);
    box-shadow:0 24px 80px rgba(36,20,15,0.18), inset 0 1px 0 rgba(255,248,237,0.12);
    padding:2rem;
  }
  .glass-card h3{color:#fff8ed}
  .glass-card h3 i{color:var(--caramel)}
  .form-label,.form-check-label,small{color:rgba(255,248,237,0.78)!important}
  .form-control,.form-control:focus{
    background:rgba(255,248,237,0.10);
    border-color:rgba(255,248,237,0.18);
    color:#fff8ed;
    border-radius:8px;
    padding:0.6rem 1rem;
  }
  .form-control::placeholder{color:rgba(255,248,237,0.45)}
  .form-control:focus{box-shadow:0 0 0 0.2rem rgba(201,133,69,0.25);outline:none}
  select.form-control option{background:#321c14;color:#fff8ed}
  .form-check-input{
    background-color:rgba(255,248,237,0.12);
    border-color:rgba(255,248,237,0.26);
  }
  .form-check-input:checked{
    background-color:var(--caramel);
    border-color:var(--caramel);
  }
  .form-check-input:focus{
    border-color:var(--caramel);
    box-shadow:0 0 0 0.2rem rgba(201,133,69,0.24);
  }
  .current-img{
    max-width:200px;
    border-radius:12px;
    border:2px solid rgba(255,248,237,0.22);
    box-shadow:0 14px 34px rgba(0,0,0,0.20);
  }
  .btn-save{
    background:linear-gradient(135deg, #fff2d8, #c98545);
    border:none;
    color:#24140f;
    font-weight:700;
    padding:0.5rem 2rem;
    border-radius:14px;
    cursor:pointer;
    transition:var(--transition);
    display:inline-flex;
    align-items:center;
    gap:0.4rem;
  }
  .btn-save:hover{background:linear-gradient(135deg, #ffe7bc, #b87535);color:#24140f}
  .btn-cancel{
    background:rgba(255,248,237,0.08);
    border:1px solid rgba(255,248,237,0.38);
    color:#fff8ed;
    font-weight:700;
    padding:0.5rem 2rem;
    border-radius:14px;
    text-decoration:none;
    transition:var(--transition);
    display:inline-flex;
    align-items:center;
    gap:0.4rem;
  }
  .btn-cancel:hover{background:rgba(255,248,237,0.12);color:#fff8ed}
  .mb-3{margin-bottom:1rem}
  .mb-4{margin-bottom:1.5rem}
  .row.g-2{--bs-gutter-x:0.5rem;--bs-gutter-y:0.5rem}
  .form-check{display:flex;align-items:center;gap:0.4rem;padding:0.2rem 0}
  .d-flex.gap-2{display:flex;gap:0.5rem;flex-wrap:wrap}
  .text-light{color:rgba(255,248,237,0.68)!important}
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