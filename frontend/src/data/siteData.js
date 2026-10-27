// siteData.js - semua teks & link yang sering diganti ada di sini.

export const PROFILE = {
  name: 'Hagia Sofiana',
  brand: '4naa',
  photo: '/assets/hagiaS.jpg',
  // true  -> foto PNG transparan (cutout), tampil menimpa tulisan DEVELOPER seperti gambar 2
  // false -> foto biasa, dipotong berbentuk lengkung (arch)
  photoIsCutout: false,
  intro: 'Full stack developer building web, mobile, and desktop apps.',
  roles: ['Web', 'Mobile', 'Desktop'],
  about: {
    lead:
    'Full-Stack Web Developer who builds functional, user-focused web applications.',
  paragraphs: [
    'I studied Software Engineering (Rekayasa Perangkat Lunak), which sparked my interest in programming and problem-solving. I enjoy turning ideas into working products, from designing databases and writing backend logic to building responsive, intuitive interfaces.',
    'My main stack is Laravel, React, and MySQL. Outside of web development, I explore Python automation and machine learning through personal projects. I value clean, maintainable code and keep learning to build practical solutions.',
  ],
  facts: [
    { label: 'Focus', value: 'Full-stack web development' },
    { label: 'Main stack', value: 'PHP, Laravel, JavaScript, React, MySQL' },
    { label: 'Additional interests', value: 'Python, Automation, Machine Learning' },
    { label: 'Background', value: 'Software Engineering (RPL)' },
  ],
  },
};

export const NAV_ITEMS = [
  { label: 'Home', hash: 'home' },
  { label: 'About', hash: 'about' },
  { label: 'Skills', hash: 'skills' },
  { label: 'Projects', hash: 'projects' },
  { label: 'Contact', hash: 'contact' },
];

export const SOCIALS = [
  { label: 'GitHub', handle: 'ann4yaa', href: 'https://github.com/ann4yaa', icon: 'fab fa-github' },
  { label: 'LinkedIn', handle: 'hagia-sofiana', href: 'https://www.linkedin.com/in/hagia-sofiana', icon: 'fab fa-linkedin-in' },
  { label: 'Instagram', handle: 'ann4yaa_', href: 'https://www.instagram.com/ann4yaa_', icon: 'fab fa-instagram' },
  { label: 'Threads', handle: 'ann4yaa_', href: 'https://www.threads.com/@ann4yaa_', icon: 'fab fa-threads' },
];

export const SKILLS = [
  { name: 'React', icon: 'fa-brands fa-react' },
  { name: 'Vite', icon: 'fa-solid fa-bolt' },
  { name: 'Laravel', icon: 'fa-brands fa-laravel' },
  { name: 'HTML', icon: 'fa-brands fa-html5' },
  { name: 'CSS', icon: 'fa-brands fa-css3-alt' },
  { name: 'JavaScript', icon: 'fa-brands fa-js' },
  { name: 'PHP', icon: 'fa-brands fa-php' },
  { name: 'MySQL', icon: 'fa-solid fa-database' },
  { name: 'Python', icon: 'fa-brands fa-python' },
  { name: 'Bootstrap', icon: 'fa-brands fa-bootstrap' },
  { name: 'Java', icon: 'fa-brands fa-java' },
];