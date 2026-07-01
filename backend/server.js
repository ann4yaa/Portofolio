const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5000;

// ========================
// Middleware
// ========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================
// Koneksi Database
// ========================
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'portfolio',
  timezone: '+07:00',
});

conn.connect((err) => {
  if (err) {
    console.error('Koneksi gagal:', err.message);
    process.exit(1);
  }
  console.log('Terhubung ke database MySQL (portfolio)');
});

// ========================
// Multer - Upload Gambar
// ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Format file tidak didukung'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// ========================
// ROUTES - Kategori
// ========================
// GET semua kategori
app.get('/api/kategori', (req, res) => {
  conn.query('SELECT * FROM kategori ORDER BY kategori', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ========================
// ROUTES - Teknologi
// ========================
// GET semua teknologi
app.get('/api/teknologi', (req, res) => {
  conn.query('SELECT * FROM teknologi ORDER BY nama_teknologi', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ========================
// ROUTES - Project
// ========================

// GET semua project (admin - dengan teknologi)
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

// GET project dengan filter kategori (halaman project publik)
app.get('/api/projects/public', (req, res) => {
  const kategoriId = parseInt(req.query.kategori) || 0;

  let query = `
    SELECT p.*, k.kategori,
           GROUP_CONCAT(DISTINCT t.nama_teknologi SEPARATOR '|') AS teknologi,
           GROUP_CONCAT(DISTINCT t.id SEPARATOR '|') AS teknologi_id
    FROM project p
    LEFT JOIN kategori k ON p.kategori_id = k.id
    LEFT JOIN project_teknologi pt ON p.id = pt.project_id
    LEFT JOIN teknologi t ON pt.teknologi_id = t.id
  `;
  const params = [];
  if (kategoriId > 0) {
    query += ' WHERE p.kategori_id = ?';
    params.push(kategoriId);
  }
  query += ' GROUP BY p.id ORDER BY p.created_at DESC';

  conn.query(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET 3 project terbaru (homepage)
app.get('/api/projects/recent', (req, res) => {
  const query = `
    SELECT p.*,
           GROUP_CONCAT(t.nama_teknologi SEPARATOR '|') AS teknologi
    FROM project p
    LEFT JOIN project_teknologi pt ON p.id = pt.project_id
    LEFT JOIN teknologi t ON pt.teknologi_id = t.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT 3
  `;
  conn.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET total project
app.get('/api/projects/count', (req, res) => {
  conn.query('SELECT COUNT(*) AS total FROM project', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: rows[0].total });
  });
});

// GET satu project (untuk edit)
app.get('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  conn.query('SELECT * FROM project WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Project tidak ditemukan' });

    const project = rows[0];
    // Ambil teknologi yang dipilih
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

  // Ambil gambar lama jika tidak ada upload baru
  conn.query('SELECT gambar FROM project WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Project tidak ditemukan' });

    const oldGambar = rows[0].gambar;
    let newGambar = oldGambar;

    if (req.file) {
      newGambar = req.file.filename;
      // Hapus gambar lama
      if (oldGambar) {
        const oldPath = path.join(__dirname, 'uploads', oldGambar);
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

        // Hapus teknologi lama lalu insert baru
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

    // Hapus file gambar
    if (gambar) {
      const filePath = path.join(__dirname, 'uploads', gambar);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // Hapus project (ON DELETE CASCADE akan hapus project_teknologi)
    conn.query('DELETE FROM project WHERE id = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ success: true, status: 'hapus' });
    });
  });
});

// ========================
// Start Server
// ========================
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
