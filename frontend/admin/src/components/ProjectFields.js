// ProjectFields.js - isi form project, dipakai bersama oleh Tambah.js dan Edit.js.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TechPicker from './TechPicker';

export default function ProjectFields({
  form,
  onChange,
  kategoriList,
  teknologiList,
  selectedTech,
  onToggleTech,
  onClearTech,
  currentImage, // nama file gambar lama (mode edit)
  onFile,
  gambarFile,
  loading,
  submitLabel,
  onSubmit,
}) {
  // pratinjau gambar yang baru dipilih
  const [preview, setPreview] = useState('');
  useEffect(() => {
    if (!gambarFile) {
      setPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(gambarFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [gambarFile]);

  const imgSrc = preview || (currentImage ? `/uploads/${currentImage}` : '');
  const safeKategoriList = Array.isArray(kategoriList) ? kategoriList : [];

  return (
    <form className="adm-card adm-form" onSubmit={onSubmit}>
      <div className="adm-field">
        <label htmlFor="nama_project">Nama project</label>
        <input id="nama_project" className="adm-input" name="nama_project" value={form.nama_project} onChange={onChange} required />
      </div>

      <div className="adm-field">
        <label htmlFor="kategori_id">Kategori</label>
        <select id="kategori_id" className="adm-input" name="kategori_id" value={form.kategori_id} onChange={onChange} required>
          <option value="">Pilih kategori</option>
          {safeKategoriList.map((k) => (
            <option key={k.id} value={k.id}>
              {k.kategori}
            </option>
          ))}
        </select>
      </div>

      <div className="adm-field">
        <label htmlFor="deskripsi">Deskripsi</label>
        <textarea id="deskripsi" className="adm-input" name="deskripsi" rows="4" value={form.deskripsi} onChange={onChange} required />
      </div>

      <div className="adm-field">
        <label htmlFor="gambar">{currentImage ? 'Ganti screenshot' : 'Screenshot project'}</label>
        {imgSrc && <img className="adm-preview" src={imgSrc} alt="Pratinjau screenshot" />}
        <input id="gambar" type="file" className="adm-input" accept="image/*" onChange={(e) => onFile(e.target.files[0] || null)} />
        <p className="adm-hint">
          JPG, PNG, atau GIF, maksimal 2 MB.{currentImage ? ' Kosongkan jika tidak ingin mengganti gambar.' : ''}
        </p>
      </div>

      <div className="adm-field">
        <label htmlFor="github">Link GitHub</label>
        <input id="github" type="url" className="adm-input" name="github" value={form.github} onChange={onChange} placeholder="https://github.com/..." />
      </div>

      <div className="adm-field">
        <label htmlFor="demo">Link demo</label>
        <input id="demo" type="url" className="adm-input" name="demo" value={form.demo} onChange={onChange} placeholder="https://..." />
      </div>

      <TechPicker list={teknologiList} selected={selectedTech} onToggle={onToggleTech} onClear={onClearTech} />

      <div className="adm-form-actions">
        <button type="submit" className="adm-btn adm-btn--primary" disabled={loading}>
          {loading ? 'Menyimpan...' : submitLabel}
        </button>
        <Link to="/" className="adm-btn adm-btn--ghost">
          Batal
        </Link>
      </div>
    </form>
  );
}
