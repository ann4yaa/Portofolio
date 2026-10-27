import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './Admin';
import Tambah from './Tambah';
import Edit from './Edit';
import Pesan from './Pesan';

// Admin hanya untuk local development
function App() {
  return (
    <BrowserRouter basename={process.env.NODE_ENV === 'production' ? '/admin' : undefined}>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/tambah" element={<Tambah />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/pesan" element={<Pesan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;