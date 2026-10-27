// Tambah.js - tambah project baru.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProjectFields from './components/ProjectFields';

const API = '';

export default function Tambah() {
  const navigate = useNavigate();
  const [kategoriList, setKategoriList] = useState([]);
  const [teknologiList, setTeknologiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ nama_project: '', kategori_id: '', deskripsi: '', github: '', demo: '' });
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
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleTech = (id) =>
    setSelectedTech((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (gambarFile) data.append('gambar', gambarFile);
    selectedTech.forEach((tid) => data.append('teknologi[]', tid));

    try {
      const res = await fetch(`${API}/api/projects`, { method: 'POST', body: data });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success) {
        navigate('/?status=tambah');
      } else {
        setError(result.message || result.error || `Gagal menyimpan project (server returned ${res.status}).`);
      }
    } catch (err) {
      setError(`Gagal menyimpan project: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Tambah project" subtitle="Isi detail project yang akan tampil di portofolio.">
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
        gambarFile={gambarFile}
        onFile={setGambarFile}
        loading={loading}
        submitLabel="Simpan project"
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}
