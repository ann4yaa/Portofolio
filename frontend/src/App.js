import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectCardSkeleton from './components/ProjectCardSkeleton';

const Project = lazy(() => import('./pages/Project'));
const Admin = lazy(() => import('./pages/admin/Admin'));
const AdminTambah = lazy(() => import('./pages/admin/Tambah'));
const AdminEdit = lazy(() => import('./pages/admin/Edit'));
const AdminPesan = lazy(() => import('./pages/admin/Pesan'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/project"
          element={
            <Suspense fallback={<div className="site"><ProjectCardSkeleton tone="light" /></div>}>
              <Project />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="site" style={{ padding: '3rem', textAlign: 'center' }}>Memuat Admin...</div>}>
              <Admin />
            </Suspense>
          }
        />
        <Route
          path="/admin/tambah"
          element={
            <Suspense fallback={<div className="site" style={{ padding: '3rem', textAlign: 'center' }}>Memuat...</div>}>
              <AdminTambah />
            </Suspense>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <Suspense fallback={<div className="site" style={{ padding: '3rem', textAlign: 'center' }}>Memuat...</div>}>
              <AdminEdit />
            </Suspense>
          }
        />
        <Route
          path="/admin/pesan"
          element={
            <Suspense fallback={<div className="site" style={{ padding: '3rem', textAlign: 'center' }}>Memuat...</div>}>
              <AdminPesan />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
