// ContactForm.js - kirim pesan ke admin lewat utils/contactApi.js
import React, { useState } from 'react';
import { sendContactMessage } from '../utils/contactApi';

const EMPTY = { name: '', email: '', message: '', website: '' }; // "website" = honeypot anti-bot
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState({ state: 'idle', text: '' });

  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status.state === 'sending') return;

    const name = values.name.trim();
    const email = values.email.trim();
    const message = values.message.trim();

    if (!name || !email || !message) {
      setStatus({ state: 'error', text: 'Fill in your name, email, and message before sending.' });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus({ state: 'error', text: 'That email address looks incomplete. Check it and try again.' });
      return;
    }
    if (message.length < 10) {
      setStatus({ state: 'error', text: 'Write at least a short sentence so I know what you need.' });
      return;
    }

    // Bot mengisi field tersembunyi: pura-pura sukses, jangan kirim.
    if (values.website) {
      setValues(EMPTY);
      setStatus({ state: 'sent', text: 'Message sent. I will reply to your email.' });
      return;
    }

    setStatus({ state: 'sending', text: '' });
    try {
      await sendContactMessage({ name, email, message });
      setValues(EMPTY);
      setStatus({ state: 'sent', text: 'Message sent. I will reply to your email.' });
    } catch (err) {
      setStatus({ state: 'error', text: `Message not sent (${err.message}). Try again in a moment.` });
    }
  };

  return (
    <form className="pf-form" onSubmit={onSubmit} noValidate>
      <div className="pf-field">
        <label htmlFor="cf-name">Name</label>
        <input id="cf-name" name="name" type="text" autoComplete="name" maxLength={80} value={values.name} onChange={onChange} />
      </div>

      <div className="pf-field">
        <label htmlFor="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" autoComplete="email" maxLength={120} value={values.email} onChange={onChange} />
      </div>

      <div className="pf-field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" maxLength={2000} value={values.message} onChange={onChange} />
      </div>

      <div className="pf-hp" aria-hidden="true">
        <label htmlFor="cf-website">Leave this empty</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
      </div>

      <button type="submit" className="pf-btn" disabled={status.state === 'sending'}>
        <i className="fas fa-paper-plane" aria-hidden="true"></i>
        {status.state === 'sending' ? 'Sending...' : 'Send message'}
      </button>

      <p className={`pf-form__status ${status.state === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">
        {status.text}
      </p>
    </form>
  );
}