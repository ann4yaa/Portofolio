// techStack.js - daftar teknologi + ikon untuk form admin.
// Admin adalah aplikasi terpisah dari website, jadi daftar ini adalah SALINAN dari daftar di TechMarquee.
// Ganti isinya dengan daftar yang sama persis dengan yang kamu pakai di marquee (name harus sama dengan nama di database).
// `icon` = className ikon (contoh di sini pakai Devicon, sesuaikan dengan library ikon kamu).
export const TECH_STACK = [
  { name: 'HTML', icon: 'devicon-html5-plain colored' },
  { name: 'CSS', icon: 'devicon-css3-plain colored' },
  { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
  { name: 'React', icon: 'devicon-react-original colored' },
  { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
  { name: 'PHP', icon: 'devicon-php-plain colored' },
  { name: 'Laravel', icon: 'devicon-laravel-plain colored' },
  { name: 'MySQL', icon: 'devicon-mysql-plain colored' },
  { name: 'Bootstrap', icon: 'devicon-bootstrap-plain colored' },
  { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-original colored' },
  { name: 'GSAP', icon: 'devicon-javascript-plain' },
  { name: 'Git', icon: 'devicon-git-plain colored' },
  { name: 'GitHub', icon: 'devicon-github-original' },
  { name: 'Figma', icon: 'devicon-figma-plain colored' },
];

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// Cari ikon berdasarkan nama teknologi dari database (tidak peka huruf besar/kecil).
export function iconFor(name) {
  const hit = TECH_STACK.find((t) => norm(t.name) === norm(name));
  return hit ? hit.icon : 'fas fa-code';
}