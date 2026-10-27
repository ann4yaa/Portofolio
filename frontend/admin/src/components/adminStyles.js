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
.adm-btn--primary:disabled{opacity:.6; cursor:wait}
.adm-btn--ghost{background:transparent; color:var(--m7); border-color:var(--c300)}
.adm-btn--ghost:hover{background:var(--c100); border-color:var(--m5)}
.adm-btn--danger{background:transparent; color:var(--danger); border-color:rgba(163,38,48,.35)}
.adm-btn--danger:hover{background:var(--danger); color:#fff; border-color:var(--danger)}
.adm-btn--sm{padding:.35rem .8rem; font-size:.82rem}

/* ---------- notice ---------- */
.adm-notice{
  display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:1.25rem;
  padding:.75rem 1rem; border-radius:12px; background:var(--m7); color:var(--c50);
}
.adm-notice--error{background:var(--danger)}
.adm-notice button{background:none; border:0; color:inherit; font-size:1.3rem; line-height:1; cursor:pointer}

/* ---------- project table ---------- */
.adm-table-wrap{overflow-x:auto}
.adm-table{width:100%; border-collapse:collapse; min-width:640px}
.adm-table th{
  text-align:left; padding:.85rem 1.1rem; font-size:.82rem; font-weight:600; color:var(--mute);
  border-bottom:1px solid var(--c200);
}
.adm-table td{padding:.85rem 1.1rem; border-bottom:1px solid var(--c200); vertical-align:middle}
.adm-table tbody tr:last-child td{border-bottom:0}
.adm-table tbody tr:hover{background:rgba(231,212,180,.28)}
.adm-thumb{width:72px; height:48px; object-fit:cover; border-radius:8px; border:1px solid var(--c200); display:block}
.adm-chips{display:flex; flex-wrap:wrap; gap:.3rem}
.adm-chip{
  display:inline-flex; align-items:center; gap:.35rem; padding:.15rem .65rem; border-radius:999px;
  background:var(--c100); border:1px solid var(--c200); font-size:.78rem; font-weight:500; color:var(--m7);
}
.adm-actions{display:flex; gap:.5rem; flex-wrap:wrap}
.adm-muted{color:var(--mute)}
.adm-empty{padding:3.5rem 1.5rem; text-align:center; color:var(--mute)}
.adm-empty h2{margin:0 0 .35rem; font-family:'Fraunces',Georgia,serif; color:var(--m9); font-size:1.25rem}
.adm-empty p{margin:0 0 1.25rem}

/* ---------- form ---------- */
.adm-form{padding:clamp(1.25rem,3vw,2rem); display:grid; gap:1.25rem; max-width:760px}
.adm-field label,.adm-field .adm-label{display:block; margin-bottom:.35rem; font-weight:600; font-size:.9rem; color:var(--m7)}
.adm-input{
  width:100%; padding:.65rem .85rem; border-radius:10px; border:1px solid var(--c300); background:#fffdf8;
  font:inherit; color:var(--ink);
}
.adm-input:focus{outline:none; border-color:var(--m5); box-shadow:0 0 0 3px rgba(123,34,54,.18)}
textarea.adm-input{resize:vertical; min-height:110px}
.adm-hint{margin:.3rem 0 0; font-size:.8rem; color:var(--mute)}
.adm-preview{display:block; max-width:260px; max-height:160px; margin-bottom:.6rem; border-radius:10px; border:1px solid var(--c200); object-fit:cover}
.adm-form-actions{display:flex; gap:.6rem; padding-top:.5rem}

/* ---------- tech picker ---------- */
.adm-tech-bar{display:flex; gap:.6rem; align-items:center; margin-bottom:.7rem; flex-wrap:wrap}
.adm-tech-bar .adm-input{flex:1; min-width:180px}
.adm-tech-count{font-size:.82rem; color:var(--mute)}
.adm-tech-grid{display:flex; flex-wrap:wrap; gap:.45rem; max-height:300px; overflow:auto; padding:2px}
.adm-tech{
  display:inline-flex; align-items:center; gap:.45rem; padding:.4rem .8rem; border-radius:999px;
  border:1px solid var(--c300); background:#fffdf8; color:var(--ink); font:inherit; font-size:.85rem; cursor:pointer;
  transition:background .15s,color .15s,border-color .15s;
}
.adm-tech i{font-size:1.1rem}
.adm-tech:hover{border-color:var(--m5)}
.adm-tech[aria-pressed="true"]{background:var(--m7); border-color:var(--m7); color:var(--c50)}
.adm-tech[aria-pressed="true"] i{color:inherit !important}

/* ---------- inbox ---------- */
.adm-inbox{display:grid; grid-template-columns:minmax(260px,360px) 1fr; min-height:540px; overflow:hidden}
.adm-inbox-list{border-right:1px solid var(--c200); display:flex; flex-direction:column; min-width:0}
.adm-filter{display:flex; gap:.35rem; padding:.75rem; border-bottom:1px solid var(--c200)}
.adm-filter button{
  flex:1; padding:.4rem .6rem; border-radius:8px; border:1px solid transparent; background:transparent;
  font:inherit; font-size:.85rem; font-weight:500; color:var(--mute); cursor:pointer;
}
.adm-filter button.is-on{background:var(--c100); border-color:var(--c200); color:var(--m7); font-weight:600}
.adm-msgs{list-style:none; margin:0; padding:0; overflow:auto; flex:1}
.adm-msg{
  display:grid; grid-template-columns:.7rem 1fr auto; gap:.2rem .7rem; width:100%; text-align:left;
  padding:.85rem 1rem; border:0; border-bottom:1px solid var(--c200); background:transparent; font:inherit; cursor:pointer; color:inherit;
}
.adm-msg:hover{background:rgba(231,212,180,.3)}
.adm-msg.is-active{background:var(--c100); box-shadow:inset 3px 0 0 var(--m5)}
.adm-dot{width:.55rem; height:.55rem; border-radius:50%; margin-top:.5rem; background:transparent}
.adm-msg.is-unread .adm-dot{background:var(--m5)}
.adm-msg-name{font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.adm-msg.is-unread .adm-msg-name{font-weight:700}
.adm-msg-time{font-size:.75rem; color:var(--mute); white-space:nowrap}
.adm-msg-snip{grid-column:2 / 4; font-size:.85rem; color:var(--mute); overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.adm-read{padding:clamp(1.25rem,3vw,2rem); min-width:0}
.adm-read-back{display:none; margin-bottom:1rem}
.adm-read h2{margin:0; font-family:'Fraunces',Georgia,serif; font-size:1.5rem; color:var(--m9); letter-spacing:-.01em}
.adm-read-meta{margin:.25rem 0 1.25rem; color:var(--mute); font-size:.9rem}
.adm-read-meta a{color:var(--m5)}
.adm-read-body{
  white-space:pre-wrap; overflow-wrap:anywhere; padding:1.1rem 1.25rem; border-radius:12px;
  background:#fffdf8; border:1px solid var(--c200); line-height:1.65; margin-bottom:1.25rem;
}
.adm-read-empty{display:grid; place-items:center; height:100%; min-height:320px; color:var(--mute); text-align:center; padding:2rem}

.adm-shell .sr-only{position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap}

@media (max-width:760px){
  .adm-top{flex-wrap:wrap; gap:.6rem 1rem}
  .adm-site{display:none}
  .adm-inbox{grid-template-columns:1fr}
  .adm-inbox.has-selection .adm-inbox-list{display:none}
  .adm-inbox:not(.has-selection) .adm-read{display:none}
  .adm-read-back{display:inline-flex}
}
@media (prefers-reduced-motion:reduce){
  .adm-shell *{transition:none !important; animation:none !important}
}
`;