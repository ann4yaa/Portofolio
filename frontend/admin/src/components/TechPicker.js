// TechPicker.js - pilih teknologi: ada pencarian, ikon, dan hitungan terpilih.
// `list` = [{ id, nama_teknologi }] dari /api/teknologi. Ikon diambil dari techStack.js.
import React, { useMemo, useState } from 'react';
import { iconFor } from './techStack';

export default function TechPicker({ list, selected, onToggle, onClear }) {
  const [q, setQ] = useState('');
  const safeList = Array.isArray(list) ? list : [];

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return needle ? safeList.filter((t) => t.nama_teknologi.toLowerCase().includes(needle)) : safeList;
  }, [safeList, q]);

  return (
    <div className="adm-field">
      <span className="adm-label">Teknologi yang digunakan</span>

      <div className="adm-tech-bar">
        <input
          type="search"
          className="adm-input"
          placeholder="Cari teknologi..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Cari teknologi"
        />
        <span className="adm-tech-count">{selected.length} dipilih</span>
        {selected.length > 0 && (
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={onClear}>
            Hapus pilihan
          </button>
        )}
      </div>

      <div className="adm-tech-grid">
        {shown.map((t) => {
          const on = selected.includes(String(t.id));
          return (
            <button
              key={t.id}
              type="button"
              className="adm-tech"
              aria-pressed={on}
              onClick={() => onToggle(String(t.id))}
            >
              <i className={iconFor(t.nama_teknologi)} aria-hidden="true"></i>
              {t.nama_teknologi}
            </button>
          );
        })}
        {shown.length === 0 && (
          <p className="adm-hint">
            {safeList.length === 0 ? 'Belum ada teknologi di database.' : `Tidak ada teknologi bernama "${q}".`}
          </p>
        )}
      </div>
    </div>
  );
}
