// Edit.js - ubah project yang sudah ada.
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProjectFields from './components/ProjectFields';

const API = '';

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kategoriList, setKategoriList] = useState([]);
  const [teknologiList, setTeknologiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({ nama_project: '', kategori_id: '', deskripsi: '', github: '', demo: '' });
  const [currentImage, setCurrentImage] = useState('');
  const [gambarFile, setGambarFile] = useState(null);
  const [selectedTech, setSelectedTech] = useState([]); // id sebagai string

  useEffect(() => {
    fetch(`${API}/api/kategori`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setKategoriList(Array.isArray(data) ? data : []))
      .catch(console.error);
    fetch(`${API}/api/teknologi`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setTeknologiList(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch(`${API}/api/projects/${id}`)
      .then((r) => {
        if (!r.ok) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setForm({
          nama_project: data.nama_project || '',
          kategori_id: data.kategori_id || '',
          deskripsi: data.deskripsi || '',
          github: data.github || '',
          demo: data.demo || '',
        });
        setCurrentImage(data.gambar || '');
        setSelectedTech((data.selected_teknologi || []).map(String));
      })
      .catch(console.error);
  }, [id]);

  // project tidak ditemukan -> kembali ke daftar (di effect, bukan saat render)
  useEffect(() => {
    if (notFound) navigate('/', { replace: true });
  }, [notFound, navigate]);

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
      const res = await fetch(`${API}/api/projects/${id}`, { method: 'PUT', body: data });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success) {
        navigate('/?status=edit');
      } else {
        setError(result.message || result.error || `Gagal menyimpan perubahan (server returned ${res.status}).`);
      }
    } catch (err) {
      setError(`Gagal menyimpan perubahan: ${err.message}`);
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
