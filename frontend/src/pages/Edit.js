import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';

const API = '';

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kategoriList, setKategoriList] = useState([]);
  const [teknologiList, setTeknologiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({
    nama_project: '',
    kategori_id: '',
    deskripsi: '',
    github: '',
    demo: '',
    gambar: '',
  });
  const [gambarFile, setGambarFile] = useState(null);
  const [selectedTech, setSelectedTech] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/kategori`).then(r => r.json()).then(setKategoriList).catch(console.error);
    fetch(`${API}/api/teknologi`).then(r => r.json()).then(setTeknologiList).catch(console.error);

    fetch(`${API}/api/projects/${id}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        setForm({
          nama_project: data.nama_project || '',
          kategori_id: data.kategori_id || '',
          deskripsi: data.deskripsi || '',
          github: data.github || '',
          demo: data.demo || '',
          gambar: data.gambar || '',
        });
        setSelectedTech(data.selected_teknologi || []);
      })
      .catch(console.error);
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTechChange = (techId) => {
    setSelectedTech(prev =>
      prev.includes(techId) ? prev.filter(t => t !== techId) : [...prev, techId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('nama_project', form.nama_project);
    data.append('kategori_id', form.kategori_id);
    data.append('deskripsi', form.deskripsi);
    data.append('github', form.github);
    data.append('demo', form.demo);
    if (gambarFile) data.append('gambar', gambarFile);
    selectedTech.forEach(tid => data.append('teknologi[]', tid));

    try {
      const res = await fetch(`${API}/api/projects/${id}`, { method: 'PUT', body: data });
      const result = await res.json();
      if (result.success) navigate('/admin?status=edit');
      else alert('Gagal memperbarui project');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (notFound) {
    navigate('/admin');
    return null;
  }

  return (
    <ProjectForm title="Edit Project" icon="fa-edit" onSubmit={handleSubmit} loading={loading}>
      <div className="mb-3">
        <label className="form-label">Nama Project</label>
        <input type="text" className="form-control" name="nama_project" value={form.nama_project} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Kategori</label>
        <select name="kategori_id" className="form-control" value={form.kategori_id} onChange={handleChange} required>
          <option value="">-- Pilih Kategori --</option>
          {kategoriList.map(k => (
            <option key={k.id} value={k.id}>{k.kategori}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Deskripsi</label>
        <textarea className="form-control" name="deskripsi" rows="4" value={form.deskripsi} onChange={handleChange} required></textarea>
      </div>

      {form.gambar && (
        <div className="mb-3">
          <label className="form-label">Gambar Saat Ini</label>
          <div>
            <img src={`/uploads/${form.gambar}`} className="current-img" alt="current" />
          </div>
          <small className="text-light opacity-50">Kosongkan jika tidak ingin mengganti gambar</small>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Ganti Gambar</label>
        <input type="file" className="form-control" accept="image/*" onChange={e => setGambarFile(e.target.files[0])} />
        <small className="text-light opacity-50">Format: JPG, PNG, GIF (Max 2MB)</small>
      </div>

      <div className="mb-3">
        <label className="form-label">Link GitHub</label>
        <input type="url" className="form-control" name="github" value={form.github} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label className="form-label">Link Demo</label>
        <input type="url" className="form-control" name="demo" value={form.demo} onChange={handleChange} />
      </div>

      <div className="mb-4">
        <label className="form-label d-block">Teknologi yang Digunakan</label>
        <div className="row g-2">
          {teknologiList.map(tech => (
            <div className="col-md-3" key={tech.id}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`tech_${tech.id}`}
                  checked={selectedTech.includes(tech.id)}
                  onChange={() => handleTechChange(tech.id)}
                />
                <label className="form-check-label" htmlFor={`tech_${tech.id}`}>
                  {tech.nama_teknologi}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProjectForm>
  );
}