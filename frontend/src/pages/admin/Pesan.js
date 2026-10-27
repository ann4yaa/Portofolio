// Pesan.js - info inbox pesan EmailJS
import React from 'react';
import AdminLayout from './components/AdminLayout';

export default function Pesan() {
  return (
    <AdminLayout title="Pesan" subtitle="Pengiriman melalui EmailJS">
      <div className="adm-card adm-empty">
        <h2>Pesan dikirim ke email Anda</h2>
        <p>
          Form Contact mengirim pesan langsung melalui EmailJS ke alamat email Anda.
          Pesan tidak disimpan di database lokal; periksa kotak masuk dan folder spam
          pada alamat email penerima yang telah diatur di akun EmailJS Anda.
        </p>
      </div>
    </AdminLayout>
  );
}

