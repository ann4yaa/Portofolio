// TechMarquee.js - tech stack berjalan kanan ke kiri (GSAP).
// Melaju lebih cepat saat halaman di-scroll, melambat saat kursor di atasnya.
import React, { useEffect, useRef } from 'react';
import { loadGsap } from '../utils/gsap';

export default function TechMarquee({ items }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let mm;
    let animationContext;
    loadGsap()
      .then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return;
        mm = gsap.matchMedia();
        animationContext = gsap.context(() => {
          mm.add('(prefers-reduced-motion: no-preference)', () => {
        const root = rootRef.current;
        const tween = gsap.to(trackRef.current, {
          xPercent: -50,
          duration: 38,
          ease: 'none',
          repeat: -1,
          paused: true,
        });
        const setSpeed = gsap.quickTo(tween, 'timeScale', {
          duration: 0.35,
          ease: 'power2.out',
        });
        let hovering = false;
        const resetSpeed = gsap
          .delayedCall(0.25, () => setSpeed(hovering ? 0.2 : 1))
          .pause();

        ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => tween.play(),
          onEnterBack: () => tween.play(),
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 5);
            setSpeed(hovering ? 0.2 : boost);
            resetSpeed.restart();
          },
          onLeave: () => {
            tween.pause();
            resetSpeed.pause();
            setSpeed(hovering ? 0.2 : 1);
          },
          onLeaveBack: () => {
            tween.pause();
            resetSpeed.pause();
            setSpeed(hovering ? 0.2 : 1);
          },
        });

        const slow = () => {
          hovering = true;
          setSpeed(0.2);
        };
        const normal = () => {
          hovering = false;
          setSpeed(1);
        };
        root.addEventListener('pointerenter', slow);
        root.addEventListener('pointerleave', normal);

        return () => {
          root.removeEventListener('pointerenter', slow);
          root.removeEventListener('pointerleave', normal);
        };
          });
        }, rootRef);
      })
      .catch((error) => console.error('Failed to initialize marquee animation:', error));

    return () => {
      cancelled = true;
      mm?.revert();
      animationContext?.revert();
    };
  }, []);

  return (
    <div className="pf-marquee" ref={rootRef}>
      <div className="pf-marquee__track" ref={trackRef}>
        {[0, 1].map((copy) => (
          <ul className="pf-marquee__group" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
            {items.map((s) => (
              <li className="pf-marquee__item" key={s.name}>
                <i className={s.icon} aria-hidden="true"></i>
                <span>{s.name}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}