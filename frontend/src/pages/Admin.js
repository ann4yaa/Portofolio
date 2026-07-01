import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const API = '';

const CHOCO_CSS = `
  :root {
    --choco-900:#24140f;--choco-800:#321c14;--choco-700:#4a2a1d;
    --cream-50:#fff8ed;--cream-100:#f6ead7;--cream-200:#ead5b8;--caramel:#c98545;
    --pink-1:#ff6b9d;--pink-2:#ff4d7a;--pink-3:#ff2d5a;
    --gradient-main:linear-gradient(135deg,#ff6b9d 0%,#ff4d7a 40%,#ff2d5a 80%,#ff6b9d 100%);
    --text-dark:#1a1a2e;--text-gray:#6b7280;
    --glass-bg:rgba(255,255,255,0.88);--glass-border:rgba(255,255,255,0.5);
    --glass-shadow:0 8px 32px rgba(255,75,122,0.1);
    --radius-lg:28px;--radius-md:18px;
    --transition:all 0.5s cubic-bezier(0.34,1.56,0.64,1);
  }
  body{
    font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
    background:
      radial-gradient(circle at 18% 10%,rgba(201,133,69,0.16),transparent 30%),
      radial-gradient(circle at 84% 92%,rgba(74,42,29,0.12),transparent 28%),
      linear-gradient(180deg,var(--cream-50) 0%,var(--cream-100) 100%);
    min-height:100vh;padding:2rem 1rem;position:relative;overflow-x:hidden;
  }
  body::before{
    content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
    background:
      radial-gradient(ellipse at 18% 18%,rgba(36,20,15,0.28) 0 7px,rgba(201,133,69,0.26) 8px 15px,transparent 16px),
      radial-gradient(ellipse at 72% 28%,rgba(74,42,29,0.24) 0 6px,rgba(201,133,69,0.22) 7px 13px,transparent 14px),
      radial-gradient(ellipse at 36% 74%,rgba(36,20,15,0.22) 0 5px,rgba(201,133,69,0.20) 6px 12px,transparent 13px);
    background-size:145px 130px,175px 155px,190px 170px;
    opacity:0.72;
    mask-image:radial-gradient(circle at 0 0,#000 0 20%,transparent 36%),radial-gradient(circle at 100% 0,#000 0 20%,transparent 36%),radial-gradient(circle at 0 100%,#000 0 20%,transparent 36%),radial-gradient(circle at 100% 100%,#000 0 20%,transparent 36%);
    -webkit-mask-image:radial-gradient(circle at 0 0,#000 0 20%,transparent 36%),radial-gradient(circle at 100% 0,#000 0 20%,transparent 36%),radial-gradient(circle at 0 100%,#000 0 20%,transparent 36%),radial-gradient(circle at 100% 100%,#000 0 20%,transparent 36%);
  }
  @keyframes gradientMove{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes shimmer{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes pulseBadge{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-40px)scale(0.95)}to{opacity:1;transform:translateY(0)scale(1)}}
  @keyframes floatOrb{0%,100%{transform:translate(0,0)scale(1)}25%{transform:translate(30px,-40px)scale(1.15)}50%{transform:translate(-20px,20px)scale(0.85)}75%{transform:translate(40px,30px)scale(1.1)}}

  .admin-container{max-width:1200px;margin:0 auto;position:relative;z-index:1}
  .admin-glass{
    background:linear-gradient(145deg,rgba(50,28,20,0.94),rgba(36,20,15,0.90));
    border-radius:var(--radius-lg);border:1px solid rgba(255,248,237,0.16);
    box-shadow:0 24px 80px rgba(36,20,15,0.18),inset 0 1px 0 rgba(255,248,237,0.12);
    padding:2.5rem;animation:slideDown 0.8s cubic-bezier(0.34,1.56,0.64,1);
  }
  .admin-header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:2rem}
  .admin-title{font-weight:900;font-size:1.85rem;color:var(--cream-50);letter-spacing:-0.5px;margin:0}
  .admin-title .gradient-text{
    background:linear-gradient(135deg,#fff2d8,#d79a58,#8a4b2a);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  }
  .admin-title i{color:#f1c28a;margin-right:0.75rem}
  .admin-badge{
    background:rgba(255,248,237,0.10);color:#f1c28a;
    padding:0.3rem 1.2rem;border-radius:50px;font-size:0.8rem;font-weight:600;
    border:1px solid rgba(255,248,237,0.14);display:inline-flex;align-items:center;gap:0.4rem;
    animation:pulseBadge 2.5s ease-in-out infinite;
  }
  .btn-primary-glass{
    background:linear-gradient(135deg,#fff2d8,#c98545);
    color:#24140f;border:none;padding:0.7rem 2rem;border-radius:50px;
    font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem;
    box-shadow:0 4px 16px rgba(255,75,122,0.25);background-size:200% 200%;
    animation:shimmer 3s ease-in-out infinite;transition:var(--transition);cursor:pointer;
  }
  .btn-primary-glass:hover{transform:translateY(-3px);box-shadow:0 6px 28px rgba(201,133,69,0.4);color:#24140f}

  .alert-glass{
    background:rgba(255,248,237,0.10);border:1px solid rgba(255,248,237,0.16);
    color:#fff2d8;border-radius:16px;padding:1rem 1.5rem;margin-bottom:1.5rem;
    display:flex;align-items:center;justify-content:space-between;
  }
  .alert-close{background:none;border:none;color:#fff2d8;font-size:1.2rem;cursor:pointer;padding:0 0.5rem}

  .table-container{overflow-x:auto;border-radius:16px}
  table.table-custom{width:100%;border-collapse:collapse;min-width:600px}
  .table-custom thead th{
    padding:1rem 1.2rem;font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;
    color:rgba(255,248,237,0.68);border-bottom:1px solid rgba(255,248,237,0.14);text-align:left;
  }
  .table-custom tbody td{
    padding:1rem 1.2rem;color:var(--cream-50);border-bottom:1px solid rgba(255,248,237,0.08);
    vertical-align:middle;
  }
  .table-custom tbody tr:hover{background:rgba(255,248,237,0.06)}
  .table-custom strong{color:#fff8ed}

  .tech-badge{
    display:inline-block;background:rgba(255,248,237,0.10);color:#f1c28a;
    padding:0.2rem 0.7rem;border-radius:50px;font-size:0.75rem;font-weight:600;
    border:1px solid rgba(255,248,237,0.14);margin:0.1rem;
  }
  .project-thumb{
    width:56px;height:40px;object-fit:cover;border-radius:8px;
    border:1px solid rgba(255,248,237,0.18);background:#f5e5cd;
  }
  .btn-edit-glass{
    background:rgba(255,248,237,0.10);color:#f1c28a;border:1px solid rgba(255,248,237,0.14);
    padding:0.4rem 1.2rem;border-radius:50px;transition:var(--transition);
    text-decoration:none;font-size:0.85rem;font-weight:500;display:inline-flex;align-items:center;gap:0.3rem;
  }
  .btn-edit-glass:hover{background:linear-gradient(135deg,#fff2d8,#c98545);color:#24140f;border-color:transparent}
  .btn-delete-glass{
    background:rgba(127,45,32,0.24);color:#f0a08e;border:1px solid rgba(240,160,142,0.18);
    padding:0.4rem 1.2rem;border-radius:50px;transition:var(--transition);
    font-size:0.85rem;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:0.3rem;
  }
  .btn-delete-glass:hover{background:#7f2d20;color:#fff8ed}
  .empty-state{text-align:center;padding:4rem 2rem;color:rgba(255,248,237,0.72)}
  .empty-state i{font-size:4rem;color:#d79a58;margin-bottom:1rem;display:block}
  .empty-state h5{font-weight:700;margin-bottom:0.5rem}
  .text-muted{color:rgba(255,248,237,0.62)!important}
`;

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'tambah') setAlertMsg('Project berhasil ditambahkan!');
    else if (status === 'edit') setAlertMsg('Project berhasil diperbarui!');
    else if (status === 'hapus') setAlertMsg('Project berhasil dihapus!');
  }, [searchParams]);

  useEffect(() => {
    fetch(`${API}/api/projects`).then(r => r.json()).then(setProjects).catch(console.error);
  }, []);

  const handleHapus = (id) => {
    if (!window.confirm('Yakin ingin menghapus project ini?')) return;
    fetch(`${API}/api/projects/${id}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => {
        setProjects(prev => prev.filter(p => p.id !== id));
        setAlertMsg('Project berhasil dihapus!');
        setSearchParams({ status: 'hapus' });
      })
      .catch(console.error);
  };

  return (
    <>
      <style>{CHOCO_CSS}</style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />

      <div className="admin-container">
        <div className="admin-glass">
          {/* Header */}
          <div className="admin-header">
            <div>
              <h1 className="admin-title">
                <i className="fas fa-lock"></i>
                <span className="gradient-text">Admin Panel</span>
              </h1>
            </div>
            <Link to="/tambah" className="btn-primary-glass">
              <i className="fas fa-plus"></i>Tambah Project
            </Link>
          </div>

          {/* Alert */}
          {alertMsg && (
            <div className="alert-glass">
              <span><i className="fas fa-check-circle me-2" style={{ color: '#d79a58' }}></i>{alertMsg}</span>
              <button className="alert-close" onClick={() => setAlertMsg('')}>&times;</button>
            </div>
          )}

          {/* Table */}
          <div className="table-container">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Project</th>
                  <th>Teknologi</th>
                  <th>Gambar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? projects.map((project, i) => (
                  <tr key={project.id}>
                    <td><strong>#{i + 1}</strong></td>
                    <td><strong>{project.nama_project}</strong></td>
                    <td>
                      {project.teknologi
                        ? project.teknologi.split(', ').map((t, j) => (
                          <span className="tech-badge" key={j}>{t}</span>
                        ))
                        : <span className="text-muted" style={{ fontSize: '0.85rem' }}>-</span>
                      }
                    </td>
                    <td>
                      {project.gambar
                        ? <img src={`/uploads/${project.gambar}`} className="project-thumb" alt={project.nama_project} />
                        : <span className="text-muted" style={{ fontSize: '0.85rem' }}>-</span>
                      }
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Link to={`/edit/${project.id}`} className="btn-edit-glass">
                          <i className="fas fa-edit"></i> Edit
                        </Link>
                        <button className="btn-delete-glass" onClick={() => handleHapus(project.id)}>
                          <i className="fas fa-trash"></i> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <i className="fas fa-inbox"></i>
                        <h5>Belum ada project</h5>
                        <p className="text-muted" style={{ fontSize: '0.95rem' }}>
                          Tambahkan project pertama Anda dengan klik tombol di atas
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
