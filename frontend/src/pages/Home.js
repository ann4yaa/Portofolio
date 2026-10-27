// Home.js - Hero (gambar 2) → About → Tech stack berjalan → 3 project terbaru → Contact
// Animasi: GSAP + ScrollTrigger. Install: npm i gsap
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TechMarquee from '../components/TechMarquee';
import ProjectCard from '../components/ProjectCard';
import ProjectCardSkeleton from '../components/ProjectCardSkeleton';
import ContactForm from '../components/ContactForm';
import { PROFILE, SOCIALS, SKILLS } from '../data/siteData';
import { fetchHomeProjects } from '../utils/projectData';
import { loadGsap } from '../utils/gsap';
import { isValidProject } from '../utils/projectHelpers';
import '../styles/portfolio.css';

// Pecah teks jadi huruf-huruf bermasker untuk animasi masuk
function Letters({ text }) {
  return (
    <>
      {text.split('').map((c, i) => (
        <span className="pf-mask" key={i} aria-hidden="true">
          <span className="pf-char">{c}</span>
        </span>
      ))}
    </>
  );
}

export default function Home() {
  const location = useLocation();
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const heroVideoRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return undefined;

    let isInView = false;
    let startTimer;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncPlayback = () => {
      const shouldPlay =
        isInView && document.visibilityState === 'visible' && !motionPreference.matches;

      if (!shouldPlay) {
        window.clearTimeout(startTimer);
        startTimer = undefined;
        video.pause();
        return;
      }

      if (video.paused && startTimer === undefined) {
        startTimer = window.setTimeout(() => {
          startTimer = undefined;
          if (!isInView || document.visibilityState !== 'visible' || motionPreference.matches) return;
          video.play().catch((error) => {
            if (error.name !== 'AbortError') console.error('Failed to play hero video:', error);
          });
        }, 180);
      }
    };

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
          isInView = entry.isIntersecting;
          syncPlayback();
        }, { rootMargin: '100px 0px' })
      : null;

    if (observer) observer.observe(video);
    else {
      isInView = true;
      syncPlayback();
    }

    document.addEventListener('visibilitychange', syncPlayback);
    motionPreference.addEventListener('change', syncPlayback);

    return () => {
      window.clearTimeout(startTimer);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      motionPreference.removeEventListener('change', syncPlayback);
      video.pause();
    };
  }, []);

  /* ---------- scroll ke section saat ada hash (#about, #contact, ...) ---------- */
  useEffect(() => {
    const id = location.hash.replace('#', '');
    if (!id) {
      window.scrollTo(0, 0);
      return undefined;
    }
    const t = setTimeout(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById(id)?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 60);
    return () => clearTimeout(t);
  }, [location.key, location.hash]);

  /* ---------- data project ---------- */
  useEffect(() => {
    const controller = new AbortController();
    fetchHomeProjects({ signal: controller.signal })
      .then(({ projects: list, total: projectCount }) => {
        const valid = list.filter(isValidProject);
        setProjects(valid.slice(0, 3));
        setTotal(projectCount);
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Failed to load projects:', err);
        setStatus('error');
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (status !== 'ready') return undefined;
    let cancelled = false;
    let frame;
    loadGsap()
      .then(({ ScrollTrigger }) => {
        if (cancelled) return;
        frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      })
      .catch((error) => console.error('Failed to refresh scroll triggers:', error));
    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
    };
  }, [status]);

  /* ---------- animasi hero ---------- */
  useEffect(() => {
    let cancelled = false;
    let mm;
    let animationContext;
    loadGsap()
      .then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return;
        mm = gsap.matchMedia(rootRef);
        animationContext = gsap.context(() => {
          mm.add(
            {
              motion: '(prefers-reduced-motion: no-preference)',
              finePointer: '(hover: hover) and (pointer: fine)',
            },
            (mediaContext) => {
              const { motion, finePointer } = mediaContext.conditions;
              if (!motion) return undefined;

              const intro = gsap
                .timeline({
                  defaults: { ease: 'power4.out' },
                })
                .from('.pf-hero__portfolio .pf-char', { yPercent: 110, duration: 1.1, stagger: 0.05 })
                .from('.pf-hero__word .pf-char', { yPercent: 120, duration: 1, stagger: 0.04 }, '-=0.8')
                .from('.pf-hero__photo', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.2, ease: 'power3.inOut' }, '-=1.1')
                .from('.pf-hero__roles li', { x: -28, duration: 0.7, stagger: 0.1 }, '-=0.5')
                .from('.pf-hero__side > *, .pf-hero__links li', { y: 12, duration: 0.6, stagger: 0.06 }, '-=0.5');

              if (window.location.hash && window.location.hash !== '#home') intro.progress(1);

              const outro = gsap
                .timeline({ paused: true, defaults: { ease: 'power2.in', duration: 0.45 } })
                .to('.pf-hero__portfolio, .pf-hero__word, .pf-hero__photo', {
                  y: -24,
                  opacity: 0,
                  stagger: 0.06,
                })
                .to('.pf-hero__roles li, .pf-hero__side > *, .pf-hero__links li', {
                  x: -18,
                  opacity: 0,
                  stagger: 0.04,
                }, '<');

              ScrollTrigger.create({
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom 30%',
                onLeave: () => outro.play(0),
                onEnterBack: () => outro.reverse(),
                onLeaveBack: () => intro.restart(),
              });

              const scrub = { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true };
              gsap.to('.pf-hero__portfolio', { yPercent: -18, ease: 'none', scrollTrigger: scrub });
              gsap.to('.pf-hero__word', { yPercent: 14, ease: 'none', scrollTrigger: scrub });
              gsap.to('.pf-hero__photo', { yPercent: -15, ease: 'none', scrollTrigger: scrub });

              if (finePointer) {
                const hero = heroRef.current;
                const photoX = gsap.quickTo('.pf-hero__photo', 'x', { duration: 0.9, ease: 'power3' });
                const onMove = (e) => {
                  const ratio = e.clientX / window.innerWidth - 0.5;
                  photoX(ratio * -26);
                };
                hero.addEventListener('pointermove', onMove);
                return () => hero.removeEventListener('pointermove', onMove);
              }
              return undefined;
            }
          );
        }, rootRef);
      })
      .catch((error) => console.error('Failed to initialize hero animations:', error));

    return () => {
      cancelled = true;
      mm?.revert();
      animationContext?.revert();
    };
  }, []);

  /* Judul, teks, dan foto masuk saat About terlihat, lalu kembali saat discroll ke atas. */
  useEffect(() => {
    let cancelled = false;
    let mm;
    let animationContext;
    loadGsap()
      .then(({ gsap }) => {
        if (cancelled) return;
        mm = gsap.matchMedia(rootRef);
        animationContext = gsap.context(() => {
          mm.add('(prefers-reduced-motion: no-preference)', () => {
            const reveal = (target, from, trigger, endState = {}, start = 'top 82%') =>
              gsap.fromTo(target, from, {
                x: 0,
                y: 0,
                opacity: 1,
                ...endState,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger,
                  start,
                  once: true,
                },
              });

            reveal('.pf-about__title', { x: -36, opacity: 0 }, '.pf-about');
            reveal(
              '.pf-about__photo',
              { x: -84, clipPath: 'inset(0% 100% 0% 0%)', opacity: 0 },
              '.pf-about',
              { clipPath: 'inset(0% 0% 0% 0%)' }
            );
            gsap.fromTo(
              '.pf-about__content > *',
              { x: 32, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.75,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: '.pf-about__content',
                  start: 'top 82%',
                  once: true,
                },
              }
            );
          });
        }, rootRef);
      })
      .catch((error) => console.error('Failed to initialize section animations:', error));
    return () => {
      cancelled = true;
      mm?.revert();
      animationContext?.revert();
    };
  }, []);

  const github = SOCIALS.find((s) => s.label === 'GitHub');
  const instagram = SOCIALS.find((s) => s.label === 'Instagram');
  const { about } = PROFILE;

  return (
    <div className="site" ref={rootRef}>
      <Navbar />

      <main>
        {/* ======================= HERO ======================= */}
        <section id="home" className="pf-hero" ref={heroRef}>
          <div className="pf-hero__stage">
            <h1 className="pf-hero__portfolio" aria-label={`${PROFILE.name}, Portfolio`}>
              <Letters text="Portfolio" />
            </h1>

            <ul className="pf-hero__roles" aria-label="What I build">
              {PROFILE.roles.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>

            <p className="pf-hero__word" aria-hidden="true">
              <Letters text="DEVELOPER" />
            </p>

            <figure className={`pf-hero__photo ${PROFILE.photoIsCutout ? 'pf-hero__photo--cutout' : ''}`}>
              <video
                ref={heroVideoRef}
                src="/assets/hagia.mp4"
                poster="/assets/hagiaS.jpg"
                aria-label={`${PROFILE.name} video`}
                muted
                loop
                playsInline
                preload="none"
                disablePictureInPicture
                disableRemotePlayback
                tabIndex="-1"
                onError={(event) => console.error('Failed to load hero video:', event.currentTarget.error)}
              />
            </figure>

            <div className="pf-hero__side">
              <p className="pf-hero__name">{PROFILE.name}</p>
              <p className="pf-hero__intro">{PROFILE.intro}</p>
            </div>

          </div>

          {/* tampil hanya di layar kecil */}
          <div className="pf-hero__foot">
            <p className="pf-hero__name">{PROFILE.name}</p>
            <p className="pf-hero__intro">{PROFILE.intro}</p>
            <ul className="pf-socials">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                    <i className={s.icon} aria-hidden="true"></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ======================= ABOUT ======================= */}
        <section id="about" className="pf-about pf-on-cream">
          <div className="pf-wrap pf-about__grid">
            <div className="pf-about__left">
              <h2 className="pf-about__title">About me</h2>
              <figure className="pf-about__photo">
                <img src={PROFILE.aboutPhoto || PROFILE.photo} alt={PROFILE.name} loading="lazy" />
              </figure>
            </div>

            <div className="pf-about__content">
              <p className="pf-about__lead">{about.lead}</p>
              {about.paragraphs.map((p) => (
                <p className="pf-about__text" key={p}>
                  {p}
                </p>
              ))}

              <dl className="pf-facts">
                {about.facts.map((f) => (
                  <div className="pf-facts__row" key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
                <div className="pf-facts__row">
                  <dt>Published</dt>
                  <dd>
                    {status === 'ready'
                      ? `${total} projects, built with ${SKILLS.length} technologies`
                      : `Built with ${SKILLS.length} technologies`}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ======================= TECH STACK ======================= */}
        <section id="skills" className="pf-skills pf-on-cream" aria-labelledby="skills-title">
          <div className="pf-wrap">
            <h2 id="skills-title" className="pf-skills__title">Tools I work with</h2>
          </div>
          <TechMarquee items={SKILLS} />
        </section>

        {/* ======================= PROJECTS ======================= */}
        <section className="pf-projects pf-on-cream">
          <div className="pf-wrap">
            <div id="projects" className="pf-projects__head">
              <h2 className="pf-h2">Latest projects</h2>
              {status === 'ready' && total > 0 && (
                <Link to="/project" className="pf-more">
                  See all {total} projects
                  <i className="fas fa-arrow-right" aria-hidden="true"></i>
                </Link>
              )}
            </div>

            {status === 'loading' && <ProjectCardSkeleton />}
            {status === 'error' && (
              <p className="pf-empty">Projects could not be loaded. Refresh the page to try again.</p>
            )}
            {status === 'ready' && projects.length === 0 && (
              <p className="pf-empty">No projects published yet.</p>
            )}
            {status === 'ready' && projects.length > 0 && (
              <div className="pf-projects__grid">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} tone="dark" clamp maxTags={3} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ======================= CONTACT ======================= */}
        <section id="contact" className="pf-contact">
          <div className="pf-wrap pf-contact__grid">
            <div>
              <h2 className="pf-contact__title">Have a project or a role in mind?</h2>
              <p className="pf-contact__note">
                Send a message and it goes straight to me. I reply by email.
              </p>
              <ul className="pf-contact__links">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer">
                      <i className={s.icon} aria-hidden="true"></i>
                      {s.label}: {s.handle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}