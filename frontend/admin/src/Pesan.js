import React from 'react';
import AdminLayout from './components/AdminLayout';

export default function Pesan() {
  return (
    <AdminLayout title="Pesan" subtitle="Pengiriman melalui EmailJS">
      <div className="adm-card adm-empty">
        <h2>Pesan dikirim ke email Anda</h2>
        <p>
          Form Contact mengirim pesan melalui EmailJS. Pesan tidak disimpan di
          admin; periksa kotak masuk dan folder spam pada alamat penerima yang
          diatur di template EmailJS.
        </p>
      </div>
    </AdminLayout>
  );
}
