import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './Admin';
import Tambah from './Tambah';
import Edit from './Edit';

// Admin hanya untuk local development
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/tambah" element={<Tambah />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;