import DOMPurify from 'dompurify';

// Buang semua tag HTML, hasilnya teks biasa (tidak jadi "&amp;" seperti DOMPurify.sanitize biasa).
export function plain(value) {
  const fragment = DOMPurify.sanitize(String(value ?? ''), {
    ALLOWED_TAGS: [],
    RETURN_DOM_FRAGMENT: true,
  });
  return (fragment.textContent || '').trim();
}

// Hanya izinkan link http/https. Link tanpa skema dianggap https.
export function safeUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function projectImageUrl(value) {
  const image = plain(value).replace(/\\/g, '/').replace(/^\/+/, '');
  if (!image) return null;

  if (image.startsWith('assets/uploads/')) return `/${image}`;
  const filename = image.split('/').pop();
  return filename ? `/assets/uploads/${filename}` : null;
}

export function isValidProject(p) {
  return (
    typeof p === 'object' &&
    p !== null &&
    typeof p.id === 'number' &&
    typeof p.nama_project === 'string' &&
    p.nama_project.length > 0 &&
    typeof p.deskripsi === 'string' &&
    Array.isArray(p.teknologi)
  );
}

export function toTechList(p) {
  if (Array.isArray(p.teknologi)) return p.teknologi;
  return p.teknologi ? String(p.teknologi).split('|') : [];
}