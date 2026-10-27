const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');

const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);

function imageFilename(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const filename = value.trim().replace(/\\/g, '/').split('/').pop();
  return filename && filename !== '.' && filename !== '..' ? filename : null;
}

function publicImagePath(value) {
  const filename = imageFilename(value);
  return filename ? `/assets/uploads/${filename}` : null;
}

function toPublicProjects(rows) {
  return rows.map((row) => ({
    id: Number(row.id),
    nama_project: row.nama_project,
    kategori_id: row.kategori_id === null ? null : Number(row.kategori_id),
    kategori: row.kategori,
    deskripsi: row.deskripsi,
    gambar: publicImagePath(row.gambar),
    github: row.github,
    demo: row.demo,
    teknologi: Array.isArray(row.teknologi)
      ? row.teknologi
      : row.teknologi
        ? String(row.teknologi).split('|')
        : [],
    created_at: row.created_at,
  }));
}

async function writePublicProjects(projects, publicDir) {
  if (!Array.isArray(projects)) {
    throw new TypeError('Project export data must be an array.');
  }

  await fs.mkdir(publicDir, { recursive: true });
  const destination = path.join(publicDir, 'projects.json');
  const temporary = `${destination}.${process.pid}.${crypto.randomUUID()}.tmp`;

  try {
    await fs.writeFile(temporary, `${JSON.stringify(projects, null, 2)}\n`, 'utf8');
    await fs.rename(temporary, destination);
  } catch (error) {
    try {
      await fs.unlink(temporary);
    } catch (cleanupError) {
      if (cleanupError.code !== 'ENOENT') {
        console.error('Failed to remove incomplete project export:', cleanupError);
      }
    }
    throw error;
  }
}

async function removeUnusedProjectImages(projects, uploadsDir) {
  const usedImages = new Set(
    projects.map((project) => imageFilename(project.gambar)).filter(Boolean)
  );

  let entries;
  try {
    entries = await fs.readdir(uploadsDir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return 0;
    throw error;
  }

  let removed = 0;
  for (const entry of entries) {
    if (!entry.isFile() || !IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue;
    if (usedImages.has(entry.name)) continue;

    await fs.unlink(path.join(uploadsDir, entry.name));
    removed += 1;
  }

  return removed;
}

module.exports = {
  IMAGE_EXTENSIONS,
  imageFilename,
  publicImagePath,
  removeUnusedProjectImages,
  toPublicProjects,
  writePublicProjects,
};
