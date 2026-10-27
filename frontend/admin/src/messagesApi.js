// messagesApi.js - API inbox pesan untuk admin.
// Endpoint POST /api/contact (dipakai form Contact di website) tidak diubah.
//
// Kontrak backend:
//   GET    /api/contact            -> [{ id, name, email, message, is_read (0/1), created_at }]  (terbaru dulu)
//   PUT    /api/contact/:id/read   body JSON { is_read: 0|1 }  -> { success: true }
//   DELETE /api/contact/:id                                    -> { success: true }
// Kalau gagal, balas JSON { "message": "alasan" } supaya tampil di layar.
const ENDPOINT = '/api/contact';

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(options.headers || {}) },
  });
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.json()).message || '';
    } catch {
      /* balasan bukan JSON */
    }
    throw new Error(detail || `server returned ${res.status}`);
  }
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function fetchMessages() {
  const data = await request(ENDPOINT);
  return Array.isArray(data) ? data : [];
}

export function setMessageRead(id, isRead = true) {
  return request(`${ENDPOINT}/${id}/read`, { method: 'PUT', body: JSON.stringify({ is_read: isRead ? 1 : 0 }) });
}

export function deleteMessage(id) {
  return request(`${ENDPOINT}/${id}`, { method: 'DELETE' });
}