const fs = require('fs/promises');
const path = require('path');
const dotenv = require('dotenv');

const frontendDir = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(frontendDir, '.env.local') });
dotenv.config({ path: path.join(frontendDir, '.env') });

const mysql = require('mysql2/promise');
const {
  IMAGE_EXTENSIONS,
  imageFilename,
  toPublicProjects,
  writePublicProjects,
} = require('./project-export');

const publicDir = path.join(frontendDir, 'public');
const uploadsDir = path.join(publicDir, 'assets', 'uploads');
const databaseName = process.env.DB_NAME || 'portfolio_react';
const databaseConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT) || 3306,
  database: databaseName,
  timezone: '+07:00',
};

function legacyUploadDirectories() {
  if (process.env.LEGACY_UPLOADS_DIR) {
    return [path.resolve(frontendDir, process.env.LEGACY_UPLOADS_DIR)];
  }

  return [
    path.join(frontendDir, 'uploads'),
    path.join(frontendDir, 'backend', 'uploads'),
    path.join(frontendDir, 'public', 'uploads'),
    path.resolve(frontendDir, '..', 'backend', 'uploads'),
  ];
}

async function copyLegacyImages() {
  await fs.mkdir(uploadsDir, { recursive: true });
  const sources = legacyUploadDirectories();
  let copied = 0;
  let foundSource = false;

  for (const sourceDir of sources) {
    if (path.resolve(sourceDir) === path.resolve(uploadsDir)) continue;

    let entries;
    try {
      entries = await fs.readdir(sourceDir, { withFileTypes: true });
    } catch (error) {
      if (error.code === 'ENOENT' && !process.env.LEGACY_UPLOADS_DIR) continue;
      if (error.code === 'ENOENT') {
        throw new Error(`Legacy uploads directory does not exist: ${sourceDir}`);
      }
      throw error;
    }

    foundSource = true;
    for (const entry of entries) {
      if (!entry.isFile() || !IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue;
      await fs.copyFile(path.join(sourceDir, entry.name), path.join(uploadsDir, entry.name));
      copied += 1;
    }
  }

  if (!foundSource) {
    console.log('No legacy uploads folder found; existing public uploads were left unchanged.');
  }
  console.log(`Copied ${copied} legacy image(s) to public/assets/uploads.`);
}

async function main() {
  const pool = mysql.createPool(databaseConfig);

  try {
    const [rows] = await pool.query(`
      SELECT p.*, k.kategori,
             GROUP_CONCAT(DISTINCT t.nama_teknologi SEPARATOR '|') AS teknologi
      FROM project p
      LEFT JOIN kategori k ON p.kategori_id = k.id
      LEFT JOIN project_teknologi pt ON p.id = pt.project_id
      LEFT JOIN teknologi t ON pt.teknologi_id = t.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    const projects = toPublicProjects(rows);

    await copyLegacyImages();

    const missing = [];
    for (const project of projects) {
      const filename = imageFilename(project.gambar);
      if (!filename || missing.includes(filename)) continue;
      try {
        await fs.access(path.join(uploadsDir, filename));
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        missing.push(filename);
      }
    }
    if (missing.length > 0) {
      throw new Error(`Referenced project images are missing: ${missing.join(', ')}`);
    }

    await writePublicProjects(projects, publicDir);
    console.log(`Exported ${projects.length} project(s) to public/projects.json.`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(`Project export failed: ${error.message}`);
  process.exitCode = 1;
});
