let gsapPromise;

export function loadGsap() {
  if (!gsapPromise) {
    gsapPromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([gsapModule, scrollTriggerModule]) => {
        const { gsap } = gsapModule;
        const { ScrollTrigger } = scrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });
        return { gsap, ScrollTrigger };
      })
      .catch((error) => {
        gsapPromise = undefined;
        throw error;
      });
  }

  return gsapPromise;
}
