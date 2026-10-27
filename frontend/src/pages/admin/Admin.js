// Admin.js - daftar project (tab "Project").
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import { iconFor } from './components/techStack';

const STATUS_TEXT = {
  tambah: 'Project ditambahkan.',
  edit: 'Perubahan project disimpan.',
  hapus: 'Project dihapus.',
};

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  // Tampilkan notifikasi dari ?status=..., lalu bersihkan URL
  useEffect(() => {
    const status = searchParams.get('status');
    if (status && STATUS_TEXT[status]) {
      setNotice(STATUS_TEXT[status]);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    fetch('/api/projects')
      .then(async (r) => {
        if (!r.ok) {
          let errorText = `server returned ${r.status}`;
          try {
            const data = await r.json();
            if (data.message || data.error) {
              errorText = data.message ? `${data.error ? data.error + ': ' : ''}${data.message}` : data.error;
            }
          } catch (_) {}
          throw new Error(errorText);
        }
        if (r.headers.get('X-Database-Fallback') === 'true') {
          setNotice('MySQL belum aktif di Laragon. Menampilkan data dari projects.json (mode baca). Silakan klik "Start All" di Laragon jika ingin menambah/mengubah data.');
        }
        return r.json();
      })
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(async (e) => {
        // Jika server backend lokal belum aktif, fallback baca langsung dari projects.json statis
        try {
          const fallbackRes = await fetch('/projects.json');
          if (fallbackRes.ok) {
            const raw = await fallbackRes.json();
            if (Array.isArray(raw)) {
              const mapped = raw.map((p) => {
                let gambar = p.gambar || null;
                if (gambar && typeof gambar === 'string') {
                  const parts = gambar.replace(/\\/g, '/').split('/');
                  gambar = parts.pop() || gambar;
                }
                const teknologi = Array.isArray(p.teknologi) ? p.teknologi.join(', ') : (p.teknologi || '');
                return { ...p, gambar, teknologi };
              });
              setProjects(mapped);
              setNotice('Server backend belum aktif. Menampilkan data cadangan dari projects.json (mode baca). Jalankan "node server.js" dan aktifkan MySQL di Laragon untuk menambah/mengedit project.');
              return;
            }
          }
        } catch (_) {}
        setError(`Gagal memuat project: ${e.message}`);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleHapus = async (project) => {
    if (!window.confirm(`Hapus project "${project.nama_project}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
      if (!res.ok) {
        let errorText = `server returned ${res.status}`;
        try {
          const data = await res.json();
          if (data.message || data.error) {
            errorText = data.message ? `${data.error ? data.error + ': ' : ''}${data.message}` : data.error;
          }
        } catch (_) {}
        throw new Error(errorText);
      }
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setNotice(STATUS_TEXT.hapus);
    } catch (e) {
      setError(`Gagal menghapus project: ${e.message}`);
    }
  };

  return (
    <AdminLayout
      title="Project"
      subtitle={loading ? '' : `${projects.length} project di portofolio`}
      actions={
        <Link to="/admin/tambah" className="adm-btn adm-btn--primary">
          <i className="fas fa-plus" aria-hidden="true"></i> Tambah project
        </Link>
      }
    >
      {notice && (
        <div className="adm-notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Tutup">
            &times;
          </button>
        </div>
      )}
      {error && (
        <div className="adm-notice adm-notice--error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} aria-label="Tutup">
            &times;
          </button>
        </div>
      )}

      <div className="adm-card">
        {!loading && projects.length === 0 ? (
          <div className="adm-empty">
            <h2>Belum ada project</h2>
            <p>Tambahkan project pertama supaya tampil di halaman Project dan Home.</p>
            <Link to="/admin/tambah" className="adm-btn adm-btn--primary">
              Tambah project
            </Link>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Gambar</th>
                  <th>Project</th>
                  <th>Teknologi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.gambar ? (
                        <img
                          className="adm-thumb"
                          src={p.gambar.startsWith('/') ? p.gambar : `/uploads/${p.gambar}`}
                          alt=""
                        />
                      ) : (
                        <span className="adm-muted">-</span>
                      )}
                    </td>
                    <td>
                      <strong>{p.nama_project}</strong>
                    </td>
                    <td>
                      {p.teknologi ? (
                        <div className="adm-chips">
                          {(Array.isArray(p.teknologi) ? p.teknologi : p.teknologi.split(', ')).map((t) => (
                            <span className="adm-chip" key={t}>
                              <i className={iconFor(t)} aria-hidden="true"></i>
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="adm-muted">-</span>
                      )}
                    </td>
                    <td>
                      <div className="adm-actions">
                        <Link to={`/admin/edit/${p.id}`} className="adm-btn adm-btn--ghost adm-btn--sm">
                          Edit
                        </Link>
                        <button type="button" className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => handleHapus(p)}>
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

