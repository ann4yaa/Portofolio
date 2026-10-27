// Edit.js - ubah project yang sudah ada.
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProjectFields from './components/ProjectFields';

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kategoriList, setKategoriList] = useState([]);
  const [teknologiList, setTeknologiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ nama_project: '', kategori_id: '', deskripsi: '', github: '', demo: '' });
  const [currentImage, setCurrentImage] = useState('');
  const [gambarFile, setGambarFile] = useState(null);
  const [selectedTech, setSelectedTech] = useState([]);

  useEffect(() => {
    fetch('/api/kategori')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setKategoriList(Array.isArray(data) ? data : []))
      .catch(() => setKategoriList([
        { id: 1, kategori: 'Website' },
        { id: 2, kategori: 'Mobile' },
        { id: 3, kategori: 'Desktop' },
        { id: 4, kategori: 'Other' },
      ]));

    fetch('/api/teknologi')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setTeknologiList(Array.isArray(data) ? data : []))
      .catch(() => setTeknologiList([
        { id: 1, nama_teknologi: 'React' },
        { id: 2, nama_teknologi: 'JavaScript' },
        { id: 3, nama_teknologi: 'Node.js' },
        { id: 4, nama_teknologi: 'MySQL' },
        { id: 5, nama_teknologi: 'PHP' },
        { id: 6, nama_teknologi: 'HTML5' },
        { id: 7, nama_teknologi: 'CSS3' },
        { id: 8, nama_teknologi: 'Bootstrap' },
        { id: 9, nama_teknologi: 'Tailwind CSS' },
        { id: 10, nama_teknologi: 'Laravel' },
      ]));

    fetch(`/api/projects/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(async (data) => {
        let p = data;
        // Jika server lokal belum aktif, cari di projects.json
        if (!p) {
          try {
            const res = await fetch('/projects.json');
            if (res.ok) {
              const list = await res.json();
              p = list.find((item) => String(item.id) === String(id));
            }
          } catch (_) {}
        }

        if (!p) {
          setError('Project tidak ditemukan.');
          return;
        }

        let gambarName = p.gambar || '';
        if (gambarName && typeof gambarName === 'string') {
          const parts = gambarName.replace(/\\/g, '/').split('/');
          gambarName = parts.pop() || gambarName;
        }

        setForm({
          nama_project: p.nama_project || '',
          kategori_id: p.kategori_id || '',
          deskripsi: p.deskripsi || '',
          github: p.github || '',
          demo: p.demo || '',
        });
        setCurrentImage(gambarName);
        setSelectedTech((p.selected_teknologi || []).map(String));
      })
      .catch((err) => {
        setError(`Gagal memuat detail project: ${err.message}`);
      });
  }, [id]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleTech = (tid) =>
    setSelectedTech((prev) => (prev.includes(tid) ? prev.filter((t) => t !== tid) : [...prev, tid]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (gambarFile) data.append('gambar', gambarFile);
    selectedTech.forEach((tid) => data.append('teknologi[]', tid));

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'PUT', body: data });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success) {
        navigate('/admin?status=edit');
      } else {
        setError(result.message || result.error || `Gagal menyimpan perubahan (server returned ${res.status}).`);
      }
    } catch (err) {
      setError(`Gagal menyimpan perubahan: Backend server belum aktif. Pastikan Anda menjalankan "node server.js" dan MySQL di Laragon.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Edit project" subtitle={form.nama_project}>
      {error && (
        <div className="adm-notice adm-notice--error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} aria-label="Tutup">
            &times;
          </button>
        </div>
      )}
      <ProjectFields
        form={form}
        onChange={handleChange}
        kategoriList={kategoriList}
        teknologiList={teknologiList}
        selectedTech={selectedTech}
        onToggleTech={toggleTech}
        onClearTech={() => setSelectedTech([])}
        currentImage={currentImage}
        gambarFile={gambarFile}
        onFile={setGambarFile}
        loading={loading}
        submitLabel="Simpan perubahan"
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}

