const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const {
  removeUnusedProjectImages,
  toPublicProjects,
  writePublicProjects,
} = require('./scripts/project-export');

dotenv.config({ path: path.join(__dirname, '.env.local') });
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const databaseName = process.env.DB_NAME || 'portfolio_react';
const publicDir = path.join(__dirname, 'public');
const uploadsDir = path.join(publicDir, 'assets', 'uploads');
const frontendBuildDir = path.join(__dirname, 'build');
const adminBuildDir = path.join(__dirname, 'admin', 'build');

// Gunakan 127.0.0.1 secara default untuk mencegah isu resolusi IPv6 (::1) pada Laragon / Windows
const databaseConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT) || 3306,
  timezone: '+07:00',
};
const conn = mysql.createPool({
  ...databaseConfig,
  database: databaseName,
  waitForConnections: true,
  connectionLimit: 10,
});
let databaseReady = false;
let databaseInitializationRunning = false;
let databaseError = null;
let lastDatabaseErrorMessage = null;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const queryAsync = (connection, query, values = []) => new Promise((resolve, reject) => {
  connection.query(query, values, (err, result) => {
    if (err) return reject(err);
    resolve(result);
  });
});

const changeDatabase = (connection) => new Promise((resolve, reject) => {
  connection.changeUser({ database: databaseName }, (err) => {
    if (err) return reject(err);
    resolve();
  });
});

const closeConnection = (connection) => new Promise((resolve) => {
  connection.end(() => resolve());
});

const seedProjects = async () => {
  const seedPath = path.join(publicDir, 'assets', 'data.json');
  if (!fs.existsSync(seedPath)) return;

  const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  if (!Array.isArray(seedData.projects) || seedData.projects.length === 0) return;

  const rows = await queryAsync(conn, 'SELECT COUNT(*) AS total FROM project');
  if (rows[0].total > 0) return;

  for (const project of seedData.projects) {
    if (!project || typeof project.nama_project !== 'string' || !project.nama_project.trim()) {
      continue;
    }

    const categoryName = project.kategori || 'Uncategorized';
    await queryAsync(conn, 'INSERT IGNORE INTO kategori (kategori) VALUES (?)', [categoryName]);
    const categories = await queryAsync(conn, 'SELECT id FROM kategori WHERE kategori = ?', [categoryName]);
    const categoryId = categories[0].id;
    const projectId = Number.isInteger(Number(project.id)) ? Number(project.id) : null;

    const insertResult = await queryAsync(
      conn,
      `INSERT INTO project
        (id, nama_project, kategori_id, deskripsi, gambar, github, demo, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        project.nama_project.trim(),
        categoryId,
        project.deskripsi || '',
        project.gambar || null,
        project.github || null,
        project.demo || null,
        project.created_at ? new Date(project.created_at) : new Date(),
      ]
    );
    const insertedProjectId = projectId || insertResult.insertId;

    for (const technologyName of Array.isArray(project.teknologi) ? project.teknologi : []) {
      if (typeof technologyName !== 'string' || !technologyName.trim()) continue;

      await queryAsync(
        conn,
        'INSERT IGNORE INTO teknologi (nama_teknologi) VALUES (?)',
        [technologyName.trim()]
      );
      const technologies = await queryAsync(
        conn,
        'SELECT id FROM teknologi WHERE nama_teknologi = ?',
        [technologyName.trim()]
      );
      await queryAsync(
        conn,
        'INSERT IGNORE INTO project_teknologi (project_id, teknologi_id) VALUES (?, ?)',
        [insertedProjectId, technologies[0].id]
      );
    }
  }

  console.log(`Data project awal berhasil diimpor dari ${seedPath}`);
};

const initializeDatabase = async () => {
  if (databaseInitializationRunning || databaseReady) return;
  databaseInitializationRunning = true;
  let bootstrapConnection;

  try {
    bootstrapConnection = mysql.createConnection(databaseConfig);
    await queryAsync(
      bootstrapConnection,
      `CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(databaseName)}
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await changeDatabase(bootstrapConnection);
    await queryAsync(
      bootstrapConnection,
      `CREATE TABLE IF NOT EXISTS kategori (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        kategori VARCHAR(100) NOT NULL UNIQUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    );
    await queryAsync(
      bootstrapConnection,
      `CREATE TABLE IF NOT EXISTS teknologi (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        nama_teknologi VARCHAR(100) NOT NULL UNIQUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    );
    await queryAsync(
      bootstrapConnection,
      `CREATE TABLE IF NOT EXISTS project (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        nama_project VARCHAR(255) NOT NULL,
        kategori_id INT NULL,
        deskripsi TEXT NOT NULL,
        gambar VARCHAR(255) NULL,
        github VARCHAR(2048) NULL,
        demo VARCHAR(2048) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_project_kategori
          FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    );
    await queryAsync(
      bootstrapConnection,
      `CREATE TABLE IF NOT EXISTS project_teknologi (
        project_id INT NOT NULL,
        teknologi_id INT NOT NULL,
        PRIMARY KEY (project_id, teknologi_id),
        CONSTRAINT fk_project_teknologi_project
          FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
        CONSTRAINT fk_project_teknologi_teknologi
          FOREIGN KEY (teknologi_id) REFERENCES teknologi(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
    );
    await closeConnection(bootstrapConnection);
    bootstrapConnection = null;

    await seedProjects();
    databaseReady = true;
    databaseError = null;
    lastDatabaseErrorMessage = null;
    console.log(`Terhubung ke database MySQL (${databaseName})`);
  } catch (err) {
    databaseError = err;
    const errorMessage = err.message || err.code || String(err);
    if (errorMessage !== lastDatabaseErrorMessage) {
      console.error(
        `Database belum siap: ${errorMessage}. Pastikan MySQL Laragon aktif dan akun DB memiliki izin membuat database.`
      );
      lastDatabaseErrorMessage = errorMessage;
    }
    setTimeout(initializeDatabase, 5000).unref();
  } finally {
    if (bootstrapConnection) await closeConnection(bootstrapConnection);
    databaseInitializationRunning = false;
  }
};

const queryPublicProjects = (callback, limit) => {
  const query = `
    SELECT p.*, k.kategori,
           GROUP_CONCAT(DISTINCT t.nama_teknologi SEPARATOR '|') AS teknologi
    FROM project p
    LEFT JOIN kategori k ON p.kategori_id = k.id
    LEFT JOIN project_teknologi pt ON p.id = pt.project_id
    LEFT JOIN teknologi t ON pt.teknologi_id = t.id
    GROUP BY p.id
    ORDER BY p.created_at DESC${Number.isInteger(limit) && limit > 0 ? ' LIMIT ?' : ''}
  `;

  conn.query(query, Number.isInteger(limit) && limit > 0 ? [limit] : [], (err, rows) => {
    if (err) return callback(err);

    callback(null, toPublicProjects(rows));
  });
};

const writeCurrentProjects = (res, successResponse) => {
  queryPublicProjects(async (err, projects) => {
    if (err) {
      console.error('Failed to read projects for static export:', err);
      return res.status(500).json({
        error: 'Project data export failed',
        message: 'The project was saved, but projects.json could not be updated.',
      });
    }

    try {
      await writePublicProjects(projects, publicDir);
      const removedImages = await removeUnusedProjectImages(projects, uploadsDir);
      if (removedImages > 0) {
        console.log(`Removed ${removedImages} unused project image(s).`);
      }
      return res.json(successResponse);
    } catch (exportError) {
      console.error('Failed to write static project data:', exportError);
      return res.status(500).json({
        error: 'Project data export failed',
        message: 'The project was saved, but projects.json could not be updated.',
      });
    }
  });
};

const cleanupUnreferencedUpload = () => {
  queryPublicProjects(async (err, projects) => {
    if (err) {
      console.error('Failed to check an unused upload after a project error:', err);
      return;
    }
    try {
      const removed = await removeUnusedProjectImages(projects, uploadsDir);
      if (removed > 0) console.log(`Removed ${removed} unused project image(s).`);
    } catch (cleanupError) {
      console.error('Failed to remove an unused project image:', cleanupError);
    }
  });
};

// Fallback pembaca file statis projects.json saat MySQL belum aktif
function getStaticProjectsFallback() {
  const destination = path.join(publicDir, 'projects.json');
  if (!fs.existsSync(destination)) return null;
  try {
    const list = JSON.parse(fs.readFileSync(destination, 'utf8'));
    if (!Array.isArray(list)) return null;
    return list.map((p) => {
      let gambar = p.gambar || null;
      if (gambar && typeof gambar === 'string') {
        const parts = gambar.replace(/\\/g, '/').split('/');
        gambar = parts.pop() || gambar;
      }
      let teknologi = '';
      if (Array.isArray(p.teknologi)) {
        teknologi = p.teknologi.join(', ');
      } else if (p.teknologi) {
        teknologi = String(p.teknologi);
      }
      return {
        ...p,
        gambar,
        teknologi,
      };
    });
  } catch (err) {
    console.error('Gagal membaca fallback projects.json:', err);
    return null;
  }
}

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
// ROUTES - STATUS KONEKSI & HEALTH
// ========================

app.get('/api/health', (req, res) => {
  res.status(databaseReady ? 200 : 503).json({
    database: databaseReady ? 'connected' : 'unavailable',
    message: databaseReady
      ? 'Database siap digunakan'
      : (databaseError?.message || databaseError?.code || 'MySQL belum siap. Pastikan Laragon MySQL sudah aktif.'),
  });
});

// ========================
// ROUTES - UNTUK ADMIN (local)
// ========================

// GET semua project (admin) - mendukung fallback jika MySQL belum connect
app.get('/api/projects', (req, res) => {
  if (databaseReady) {
    const query = `
      SELECT p.*,
             GROUP_CONCAT(t.nama_teknologi SEPARATOR ', ') AS teknologi
      FROM project p
      LEFT JOIN project_teknologi pt ON p.id = pt.project_id
      LEFT JOIN teknologi t ON pt.teknologi_id = t.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    return conn.query(query, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }

  // Fallback: baca data projects.json jika MySQL belum dinyalakan
  const fallbackProjects = getStaticProjectsFallback();
  if (fallbackProjects) {
    res.setHeader('X-Database-Fallback', 'true');
    return res.json(fallbackProjects);
  }

  res.status(503).json({
    error: 'Database belum siap',
    message: databaseError?.message || databaseError?.code || 'MySQL belum aktif di Laragon. Pastikan service MySQL di Laragon sudah dinyalakan.',
  });
});

// GET kategori
app.get('/api/kategori', (req, res) => {
  if (databaseReady) {
    return conn.query('SELECT * FROM kategori ORDER BY kategori', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }

  // Fallback kategori jika MySQL belum aktif
  res.setHeader('X-Database-Fallback', 'true');
  res.json([
    { id: 1, kategori: 'Website' },
    { id: 2, kategori: 'Mobile' },
    { id: 3, kategori: 'Desktop' },
    { id: 4, kategori: 'Other' },
  ]);
});

// GET teknologi
app.get('/api/teknologi', (req, res) => {
  if (databaseReady) {
    return conn.query('SELECT * FROM teknologi ORDER BY nama_teknologi', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }

  // Fallback daftar teknologi jika MySQL belum aktif
  const defaultTech = [
    'React', 'JavaScript', 'Node.js', 'Express', 'MySQL', 'PHP', 'HTML5', 'CSS3',
    'Bootstrap', 'Tailwind CSS', 'Laravel', 'Python', 'Git', 'GitHub', 'Figma'
  ];
  res.setHeader('X-Database-Fallback', 'true');
  res.json(defaultTech.map((name, idx) => ({ id: idx + 1, nama_teknologi: name })));
});

// GET satu project
app.get('/api/projects/:id(\\d+)', (req, res) => {
  const id = parseInt(req.params.id);
  if (databaseReady) {
    return conn.query('SELECT * FROM project WHERE id = ?', [id], (err, rows) => {
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
  }

  const fallbackProjects = getStaticProjectsFallback();
  const found = fallbackProjects?.find((p) => p.id === id);
  if (found) {
    res.setHeader('X-Database-Fallback', 'true');
    return res.json(found);
  }

  res.status(503).json({
    error: 'Database belum siap',
    message: 'MySQL belum aktif di Laragon. Pastikan service MySQL di Laragon sudah dinyalakan.',
  });
});

// Middleware pengecekan database untuk operasi TULIS (POST, PUT, DELETE)
const requireDatabase = (req, res, next) => {
  if (databaseReady) return next();
  res.status(503).json({
    error: 'Database belum siap',
    message: 'MySQL belum aktif di Laragon. Silakan buka Laragon dan klik "Start All" terlebih dahulu untuk menambah, mengubah, atau menghapus project.',
  });
};

// POST tambah project (memerlukan database)
app.post('/api/projects', requireDatabase, upload.single('gambar'), (req, res) => {
  const { nama_project, kategori_id, deskripsi, github, demo } = req.body;
  let teknologi = req.body['teknologi[]'] || req.body.teknologi || [];
  if (!Array.isArray(teknologi)) teknologi = [teknologi];

  const gambar = req.file ? req.file.filename : null;

  const query = `
    INSERT INTO project (nama_project, kategori_id, deskripsi, gambar, github, demo)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  conn.query(query, [nama_project, kategori_id, deskripsi, gambar, github, demo], (err, result) => {
    if (err) {
      cleanupUnreferencedUpload();
      return res.status(500).json({ error: err.message });
    }

    const projectId = result.insertId;
    if (teknologi.length > 0 && teknologi[0] !== '') {
      const techValues = teknologi.map((tid) => [projectId, parseInt(tid)]);
      conn.query(
        'INSERT INTO project_teknologi (project_id, teknologi_id) VALUES ?',
        [techValues],
        (err2) => {
          if (err2) {
            cleanupUnreferencedUpload();
            return res.status(500).json({ error: err2.message });
          }
          writeCurrentProjects(res, { success: true, id: projectId, status: 'tambah' });
        }
      );
    } else {
      writeCurrentProjects(res, { success: true, id: projectId, status: 'tambah' });
    }
  });
});

// PUT edit project (memerlukan database)
app.put('/api/projects/:id', requireDatabase, upload.single('gambar'), (req, res) => {
  const id = parseInt(req.params.id);
  const { nama_project, kategori_id, deskripsi, github, demo } = req.body;
  let teknologi = req.body['teknologi[]'] || req.body.teknologi || [];
  if (!Array.isArray(teknologi)) teknologi = teknologi ? [teknologi] : [];

  conn.query('SELECT gambar FROM project WHERE id = ?', [id], (err, rows) => {
    if (err) {
      cleanupUnreferencedUpload();
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      cleanupUnreferencedUpload();
      return res.status(404).json({ error: 'Project tidak ditemukan' });
    }

    const oldGambar = rows[0].gambar;
    let newGambar = oldGambar;

    if (req.file) {
      newGambar = req.file.filename;
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
        if (err2) {
          cleanupUnreferencedUpload();
          return res.status(500).json({ error: err2.message });
        }

        conn.query('DELETE FROM project_teknologi WHERE project_id = ?', [id], (err3) => {
          if (err3) {
            cleanupUnreferencedUpload();
            return res.status(500).json({ error: err3.message });
          }

          if (teknologi.length > 0 && teknologi[0] !== '') {
            const techValues = teknologi.map((tid) => [id, parseInt(tid)]);
            conn.query(
              'INSERT INTO project_teknologi (project_id, teknologi_id) VALUES ?',
              [techValues],
              (err4) => {
                if (err4) {
                  cleanupUnreferencedUpload();
                  return res.status(500).json({ error: err4.message });
                }
                writeCurrentProjects(res, { success: true, status: 'edit' });
              }
            );
          } else {
            writeCurrentProjects(res, { success: true, status: 'edit' });
          }
        });
      }
    );
  });
});

// DELETE hapus project (memerlukan database)
app.delete('/api/projects/:id', requireDatabase, (req, res) => {
  const id = parseInt(req.params.id);

  conn.query('SELECT gambar FROM project WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Project tidak ditemukan' });

    conn.query('DELETE FROM project WHERE id = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      writeCurrentProjects(res, { success: true, status: 'hapus' });
    });
  });
});

// ========================
// ROUTES - UNTUK FRONTEND PUBLIC
// ========================

app.get('/api/projects/public', (req, res) => {
  if (databaseReady) {
    return queryPublicProjects((err, projects) => {
      if (err) return res.status(500).json({ error: err.message });

      const kategoriId = parseInt(req.query.kategori, 10) || 0;
      res.json(kategoriId > 0
        ? projects.filter((project) => project.kategori_id === kategoriId)
        : projects);
    });
  }

  const staticProjects = getStaticProjectsFallback();
  if (staticProjects) {
    const kategoriId = parseInt(req.query.kategori, 10) || 0;
    return res.json(kategoriId > 0
      ? staticProjects.filter((project) => project.kategori_id === kategoriId)
      : staticProjects);
  }

  res.status(503).json({ error: 'Database belum siap' });
});

app.get('/api/projects/recent', (req, res) => {
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  if (databaseReady) {
    return queryPublicProjects((err, projects) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(projects.slice(0, 3));
    }, 3);
  }

  const staticProjects = getStaticProjectsFallback();
  if (staticProjects) {
    return res.json(staticProjects.slice(0, 3));
  }

  res.status(503).json({ error: 'Database belum siap' });
});

app.get('/api/projects/count', (req, res) => {
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  if (databaseReady) {
    return conn.query('SELECT COUNT(*) AS total FROM project', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ total: Number(rows[0].total) });
    });
  }

  const staticProjects = getStaticProjectsFallback();
  if (staticProjects) {
    return res.json({ total: staticProjects.length });
  }

  res.status(503).json({ error: 'Database belum siap' });
});

app.use('/assets', express.static(path.join(publicDir, 'assets')));
app.use('/uploads', express.static(uploadsDir));
app.use('/admin', express.static(adminBuildDir));
app.get(/^\/admin(?:\/|$)/, (req, res) => {
  const adminIndex = path.join(adminBuildDir, 'index.html');
  if (fs.existsSync(adminIndex)) {
    return res.sendFile(adminIndex);
  }
  const frontendIndex = path.join(frontendBuildDir, 'index.html');
  if (fs.existsSync(frontendIndex)) {
    return res.sendFile(frontendIndex);
  }
  res.status(404).send('Build belum tersedia.');
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
  initializeDatabase();
});
