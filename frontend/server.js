const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const publicDir = path.join(__dirname, 'public');
const uploadsDir = path.join(publicDir, 'assets', 'uploads');
const frontendBuildDir = path.join(__dirname, 'build');
const adminBuildDir = path.join(__dirname, 'admin', 'build');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Koneksi Database
const conn = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio',
  timezone: '+07:00',
});

conn.connect((err) => {
  if (err) {
    console.error('Koneksi gagal:', err.message);
    process.exit(1);
  }
  console.log('Terhubung ke database MySQL (portfolio)');
});

const queryPublicProjects = (callback) => {
  const query = `
    SELECT p.*, k.kategori,
           GROUP_CONCAT(DISTINCT t.nama_teknologi SEPARATOR '|') AS teknologi
    FROM project p
    LEFT JOIN kategori k ON p.kategori_id = k.id
    LEFT JOIN project_teknologi pt ON p.id = pt.project_id
    LEFT JOIN teknologi t ON pt.teknologi_id = t.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;

  conn.query(query, (err, rows) => {
    if (err) return callback(err);

    callback(null, rows.map((row) => ({
      id: row.id,
      nama_project: row.nama_project,
      kategori_id: row.kategori_id,
      kategori: row.kategori,
      deskripsi: row.deskripsi,
      gambar: row.gambar,
      github: row.github,
      demo: row.demo,
      teknologi: row.teknologi ? row.teknologi.split('|') : [],
      created_at: row.created_at,
    })));
  });
};

// ========================
// MULTER - UPLOAD GAMBAR
// ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Format file tidak didukung'), false);
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

// ========================
// ROUTES - UNTUK ADMIN (local)
// ========================

// GET kategori
app.get('/api/kategori', (req, res) => {
  conn.query('SELECT * FROM kategori ORDER BY kategori', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET teknologi
app.get('/api/teknologi', (req, res) => {
  conn.query('SELECT * FROM teknologi ORDER BY nama_teknologi', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET semua project (admin)
app.get('/api/projects', (req, res) => {
  const query = `
    SELECT p.*,
           GROUP_CONCAT(t.nama_teknologi SEPARATOR ', ') AS teknologi
    FROM project p
    LEFT JOIN project_teknologi pt ON p.id = pt.project_id
    LEFT JOIN teknologi t ON pt.teknologi_id = t.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;
  conn.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET satu project
app.get('/api/projects/:id(\\d+)', (req, res) => {
  const id = parseInt(req.params.id);
  conn.query('SELECT * FROM project WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Project tidak ditemukan' });

    const project = rows[0];
    conn.query(
      'SELECT teknologi_id FROM project_teknologi WHERE project_id = ?',
      [id],
      (err2, techRows) => {
        if (err2) return res.status(500).json({ error: err2.message });
        project.selected_teknologi = techRows.map((r) => r.teknologi_id);
        res.json(project);
      }
    );
  });
});

// POST tambah project
app.post('/api/projects', upload.single('gambar'), (req, res) => {
  const { nama_project, kategori_id, deskripsi, github, demo } = req.body;
  let teknologi = req.body['teknologi[]'] || req.body.teknologi || [];
  if (!Array.isArray(teknologi)) teknologi = [teknologi];

  const gambar = req.file ? req.file.filename : null;

  const query = `
    INSERT INTO project (nama_project, kategori_id, deskripsi, gambar, github, demo)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  conn.query(query, [nama_project, kategori_id, deskripsi, gambar, github, demo], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const projectId = result.insertId;
    if (teknologi.length > 0 && teknologi[0] !== '') {
      const techValues = teknologi.map((tid) => [projectId, parseInt(tid)]);
      conn.query(
        'INSERT INTO project_teknologi (project_id, teknologi_id) VALUES ?',
        [techValues],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ success: true, id: projectId, status: 'tambah' });
        }
      );
    } else {
      res.json({ success: true, id: projectId, status: 'tambah' });
    }
  });
});

// PUT edit project
app.put('/api/projects/:id', upload.single('gambar'), (req, res) => {
  const id = parseInt(req.params.id);
  const { nama_project, kategori_id, deskripsi, github, demo } = req.body;
  let teknologi = req.body['teknologi[]'] || req.body.teknologi || [];
  if (!Array.isArray(teknologi)) teknologi = teknologi ? [teknologi] : [];

  conn.query('SELECT gambar FROM project WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Project tidak ditemukan' });

    const oldGambar = rows[0].gambar;
    let newGambar = oldGambar;

    if (req.file) {
      newGambar = req.file.filename;
      if (oldGambar) {
        const oldPath = path.join(uploadsDir, oldGambar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const query = `
      UPDATE project SET
        nama_project = ?,
        kategori_id = ?,
        deskripsi = ?,
        gambar = ?,
        github = ?,
        demo = ?
      WHERE id = ?
    `;
    conn.query(
      query,
      [nama_project, kategori_id, deskripsi, newGambar, github, demo, id],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });

        conn.query('DELETE FROM project_teknologi WHERE project_id = ?', [id], (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });

          if (teknologi.length > 0 && teknologi[0] !== '') {
            const techValues = teknologi.map((tid) => [id, parseInt(tid)]);
            conn.query(
              'INSERT INTO project_teknologi (project_id, teknologi_id) VALUES ?',
              [techValues],
              (err4) => {
                if (err4) return res.status(500).json({ error: err4.message });
                res.json({ success: true, status: 'edit' });
              }
            );
          } else {
            res.json({ success: true, status: 'edit' });
          }
        });
      }
    );
  });
});

// DELETE hapus project
app.delete('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);

  conn.query('SELECT gambar FROM project WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Project tidak ditemukan' });

    const gambar = rows[0].gambar;

    if (gambar) {
      const filePath = path.join(uploadsDir, gambar);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    conn.query('DELETE FROM project WHERE id = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ success: true, status: 'hapus' });
    });
  });
});

// ========================
// ROUTES - UNTUK FRONTEND PUBLIC
// ========================

app.get('/api/projects/public', (req, res) => {
  queryPublicProjects((err, projects) => {
    if (err) return res.status(500).json({ error: err.message });

    const kategoriId = parseInt(req.query.kategori, 10) || 0;
    res.json(kategoriId > 0
      ? projects.filter((project) => project.kategori_id === kategoriId)
      : projects);
  });
});

app.get('/api/projects/recent', (req, res) => {
  queryPublicProjects((err, projects) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(projects.slice(0, 3));
  });
});

app.get('/api/projects/count', (req, res) => {
  queryPublicProjects((err, projects) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: projects.length });
  });
});

app.use('/assets', express.static(path.join(publicDir, 'assets')));
app.use('/uploads', express.static(uploadsDir));
app.use('/admin', express.static(adminBuildDir));
app.get(/^\/admin(?:\/|$)/, (req, res) => {
  const adminIndex = path.join(adminBuildDir, 'index.html');
  if (!fs.existsSync(adminIndex)) {
    return res.status(404).send('Admin build belum tersedia.');
  }
  res.sendFile(adminIndex);
});
app.use(express.static(frontendBuildDir));
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route API tidak ditemukan' });
});
app.get('*', (req, res) => {
  const frontendIndex = path.join(frontendBuildDir, 'index.html');
  if (!fs.existsSync(frontendIndex)) {
    return res.status(404).send('Frontend build belum tersedia.');
  }
  res.sendFile(frontendIndex);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`📁 Upload gambar ke: ${uploadsDir}`);
  console.log(`🌐 Portfolio: http://localhost:${PORT}`);
  console.log(`🔐 Admin: http://localhost:${PORT}/admin`);
});