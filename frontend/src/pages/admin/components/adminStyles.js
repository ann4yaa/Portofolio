// adminStyles.js - satu stylesheet untuk semua halaman admin (prefix .adm-)
// Palet: dark maroon + light cream, sama dengan redesain portofolio.
export const ADMIN_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Instrument+Sans:wght@400;500;600&display=swap');

.adm-shell{
  --m9:#2b0c13; --m7:#561425; --m5:#7b2236; --m3:#a8475c;
  --c50:#fcf5e8; --c100:#f4e7d0; --c200:#e7d4b4; --c300:#d3b98f;
  --ink:#2a1218; --mute:#7a5f5f; --danger:#a32630;
  min-height:100vh; background:var(--c100); color:var(--ink);
  font-family:'Instrument Sans',system-ui,-apple-system,'Segoe UI',sans-serif;
  font-size:15px; line-height:1.5;
}
.adm-shell *,.adm-shell *::before,.adm-shell *::after{box-sizing:border-box}
.adm-shell a{color:inherit}
.adm-shell :focus-visible{outline:3px solid var(--m3);outline-offset:2px}

/* ---------- top bar ---------- */
.adm-top{
  position:sticky; top:0; z-index:20; display:flex; align-items:center; gap:1.5rem;
  padding:.8rem clamp(1rem,4vw,2.5rem); background:var(--m9); color:var(--c50);
}
.adm-brand{
  font-family:'Fraunces',Georgia,serif; font-weight:700; font-size:1.35rem;
  text-decoration:none; letter-spacing:-.01em;
}
.adm-brand small{font-family:inherit;font-weight:400;font-size:.85rem;opacity:.65;margin-left:.5rem}
.adm-tabs{display:flex; gap:.35rem; margin-right:auto}
.adm-tab{
  display:inline-flex; align-items:center; gap:.5rem; padding:.45rem 1rem; border-radius:999px;
  text-decoration:none; font-weight:500; color:rgba(252,245,232,.72); transition:background .2s,color .2s;
}
.adm-tab:hover{background:rgba(252,245,232,.1); color:var(--c50)}
.adm-tab.is-active{background:var(--c50); color:var(--m9)}
.adm-count{
  min-width:1.35rem; height:1.35rem; padding:0 .4rem; border-radius:999px; display:inline-grid; place-items:center;
  background:var(--m5); color:var(--c50); font-size:.75rem; font-weight:600;
}
.adm-tab.is-active .adm-count{background:var(--m5)}
.adm-site{font-size:.9rem; text-decoration:none; opacity:.7}
.adm-site:hover{opacity:1; text-decoration:underline}

/* ---------- page ---------- */
.adm-main{max-width:1100px; margin:0 auto; padding:2rem clamp(1rem,4vw,2.5rem) 4rem}
.adm-head{display:flex; align-items:flex-end; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin-bottom:1.5rem}
.adm-head h1{
  margin:0; font-family:'Fraunces',Georgia,serif; font-weight:700; font-size:clamp(1.6rem,3vw,2.1rem);
  color:var(--m9); letter-spacing:-.02em;
}
.adm-head p{margin:.2rem 0 0; color:var(--mute)}
.adm-card{background:var(--c50); border:1px solid var(--c200); border-radius:16px}

/* ---------- buttons ---------- */
.adm-btn{
  display:inline-flex; align-items:center; justify-content:center; gap:.5rem; padding:.55rem 1.15rem;
  border-radius:10px; border:1px solid transparent; font:inherit; font-weight:600; font-size:.9rem;
  cursor:pointer; text-decoration:none; transition:background .2s,color .2s,border-color .2s;
}
.adm-btn--primary{background:var(--m7); color:var(--c50)}
.adm-btn--primary:hover{background:var(--m9)}
.adm-btn--danger{background:transparent; color:var(--danger); border-color:rgba(163,38,48,.35)}
.adm-btn--danger:hover{background:var(--danger); color:#fff}
.adm-btn--ghost{background:transparent; color:var(--ink); border-color:var(--c200)}
.adm-btn--ghost:hover{background:var(--c100)}
.adm-btn--sm{padding:.3rem .75rem; font-size:.8rem; border-radius:8px}

/* ---------- notices ---------- */
.adm-notice{
  display:flex; align-items:center; justify-content:space-between; gap:1rem;
  padding:.75rem 1rem; border-radius:10px; margin-bottom:1.25rem;
  background:rgba(86,20,37,.1); border:1px solid rgba(86,20,37,.25); color:var(--m7);
}
.adm-notice--error{background:rgba(163,38,48,.1); border-color:rgba(163,38,48,.3); color:var(--danger)}
.adm-notice button{background:none; border:none; font-size:1.2rem; cursor:pointer; color:inherit; line-height:1}

/* ---------- table ---------- */
.adm-table-wrap{overflow-x:auto}
.adm-table{width:100%; border-collapse:collapse; font-size:.92rem}
.adm-table th{
  text-align:left; padding:.85rem 1.25rem; font-weight:600; font-size:.8rem;
  text-transform:uppercase; letter-spacing:.05em; color:var(--mute);
  border-bottom:1px solid var(--c200);
}
.adm-table td{padding:1rem 1.25rem; border-bottom:1px solid var(--c200); vertical-align:middle}
.adm-table tr:last-child td{border-bottom:none}
.adm-thumb{width:64px; height:44px; object-fit:cover; border-radius:6px; background:var(--c200); display:block}
.adm-chips{display:flex; gap:.3rem; flex-wrap:wrap}
.adm-chip{
  display:inline-flex; align-items:center; gap:.35rem; font-size:.78rem;
  padding:.15rem .55rem; border-radius:999px; background:var(--c100); color:var(--m9);
  border:1px solid var(--c200);
}
.adm-actions{display:flex; gap:.4rem}
.adm-empty{padding:4rem 2rem; text-align:center; color:var(--mute)}
.adm-empty h2{color:var(--m9); margin:0 0 .5rem; font-family:'Fraunces',Georgia,serif}
.adm-empty p{margin:0 0 1.5rem}

/* ---------- form ---------- */
.adm-form{padding:2rem clamp(1.25rem,3vw,2.5rem); display:grid; gap:1.25rem}
.adm-field{display:grid; gap:.4rem}
.adm-field label,.adm-label{font-weight:600; font-size:.85rem; color:var(--m9)}
.adm-input{
  width:100%; font:inherit; font-size:.95rem; padding:.65rem .85rem; border-radius:10px;
  border:1px solid var(--c200); background:#fff; color:var(--ink);
  transition:border-color .2s,box-shadow .2s;
}
.adm-input:focus{outline:none; border-color:var(--m5); box-shadow:0 0 0 3px rgba(123,34,54,.15)}
textarea.adm-input{resize:vertical; min-height:90px}
.adm-hint{font-size:.8rem; color:var(--mute); margin:0}
.adm-preview{max-width:240px; border-radius:10px; border:1px solid var(--c200); margin:.3rem 0; display:block}
.adm-form-actions{display:flex; gap:.75rem; padding-top:.5rem}

/* ---------- tech picker ---------- */
.adm-tech-bar{display:flex; gap:.5rem; align-items:center}
.adm-tech-count{font-size:.85rem; color:var(--mute); white-space:nowrap}
.adm-tech-grid{
  display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:.4rem;
  max-height:220px; overflow-y:auto; padding:.5rem; border:1px solid var(--c200);
  border-radius:10px; background:#fff;
}
.adm-tech{
  display:inline-flex; align-items:center; gap:.5rem; padding:.45rem .7rem; border-radius:8px;
  border:1px solid var(--c200); background:var(--c50); color:var(--ink);
  font:inherit; font-size:.82rem; cursor:pointer; transition:all .15s; text-align:left;
}
.adm-tech:hover{border-color:var(--m5); background:var(--c100)}
.adm-tech[aria-pressed="true"]{background:var(--m7); color:var(--c50); border-color:var(--m7)}
.adm-tech[aria-pressed="true"] i{color:var(--c200)}

/* ---------- inbox pesan ---------- */
.adm-msg{padding:1.25rem; border-bottom:1px solid var(--c200); display:grid; gap:.5rem}
.adm-msg:last-child{border-bottom:none}
.adm-msg.is-unread{background:rgba(86,20,37,.03)}
.adm-msg__head{display:flex; justify-content:space-between; align-items:baseline; gap:.75rem; flex-wrap:wrap}
.adm-msg__from{font-weight:600; color:var(--m9)}
.adm-msg__email{color:var(--mute); font-size:.85rem; margin-left:.5rem}
.adm-msg__time{color:var(--mute); font-size:.8rem}
.adm-msg__body{white-space:pre-wrap; margin:0; font-size:.92rem; color:var(--ink)}
.adm-msg__actions{display:flex; gap:.4rem; justify-content:flex-end}
`;

