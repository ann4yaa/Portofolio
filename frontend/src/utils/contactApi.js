// contactApi.js - form Contact (pengunjung) dan inbox pesan (admin).
//
// Kontrak backend:
//   POST   /api/contact            body JSON { name, email, message }  -> 2xx
//   GET    /api/contact            -> [{ id, name, email, message, is_read (0/1), created_at }]  (terbaru dulu)
//   PUT    /api/contact/:id/read   body JSON { is_read: 0|1 }          -> { success: true }
//   DELETE /api/contact/:id                                            -> { success: true }
// Kalau gagal, balas JSON { "message": "alasan" } supaya tampil di layar.
export const CONTACT_ENDPOINT = '/api/contact';

// Fallback kredensial EmailJS jika env vars belum disetel di hosting (Vercel)
const DEFAULT_EMAILJS_SERVICE_ID = 'service_ed0eb4o';
const DEFAULT_EMAILJS_TEMPLATE_ID = 'template_59hadt9';
const DEFAULT_EMAILJS_PUBLIC_KEY = 'Huc-mAZ9tKVVxbtld';

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(options.headers || {}) },
  });

  if (!res.ok) {
    let detail = '';
    try {
      const data = await res.json();
      detail = data.message || '';
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

// ---- pengunjung ----
export function sendContactMessage({ name, email, message }) {
  const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || DEFAULT_EMAILJS_SERVICE_ID;
  const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || DEFAULT_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || DEFAULT_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('Email service is not configured.');
  }

  return fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        name,
        email,
        from_name: name,
        from_email: email,
        reply_to: email,
        message,
      },
    }),
  }).then(async (response) => {
    const detail = (await response.text()).trim();
    if (!response.ok) {
      throw new Error(detail || `EmailJS returned ${response.status}`);
    }
    return { success: true };
  });
}

// ---- admin ----
export async function fetchMessages() {
  const data = await request(CONTACT_ENDPOINT);
  return Array.isArray(data) ? data : [];
}

export function setMessageRead(id, isRead = true) {
  return request(`${CONTACT_ENDPOINT}/${id}/read`, { method: 'PUT', body: JSON.stringify({ is_read: isRead ? 1 : 0 }) });
}

export function deleteMessage(id) {
  return request(`${CONTACT_ENDPOINT}/${id}`, { method: 'DELETE' });
}
