import { motion } from 'framer-motion';
import HeroIllustration from './HeroIllustration';

/**
 * HeroSection — Matches page_1.png reference exactly
 * 
 * Layout: 55% illustration left | 45% text right
 * 
 * Right side content (top to bottom):
 * 1. "Find your pod.\n Build in public." — massive bold headline
 * 2. Subtext paragraph
 * 3. Avatar stack + "180+ builders already in active pods"
 * 4. GET STARTED → button (black, orange accent bar underneath)
 * 5. "See how matching works →" underlined link
 */
export default function HeroSection() {
  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const headlineLine = {
    hidden: { opacity: 0, y: 48, rotateX: -22, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const avatars = [
    '/avatar-1.png',
    '/avatar-2.png',
    '/avatar-3.png',
    '/avatar-4.png',
    '/avatar-5.png',
  ];

  return (
    <section className="hero" aria-labelledby="hero-heading">
      {/* LEFT — Illustration */}
      <HeroIllustration />

      {/* RIGHT — Text content */}
      <motion.div
        className="hero-right"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Headline */}
        <motion.h1 id="hero-heading" className="hero-headline" variants={fadeUp}>
          <motion.span className="hero-headline-line" variants={headlineLine}>
            Find your pod.
          </motion.span>
          <motion.span className="hero-headline-line hero-headline-line-accent" variants={headlineLine}>
            Build in public.
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p className="hero-subtext" variants={fadeUp}>
          <span>Get matched into a <strong>5-person learning pod.</strong></span>
          <br />
          <span>Same goals. <strong>Real accountability.</strong></span>
          <br />
          <span><strong>Ship together</strong> instead of learning alone.</span>
        </motion.p>

        {/* Social proof — avatars + count */}
        <motion.div className="social-proof" variants={fadeUp}>
          <div className="avatar-stack">
            {avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Builder ${i + 1}`}
                width={38}
                height={38}
              />
            ))}
          </div>
          <span className="social-proof-text">
            180+ builders already in active pods
          </span>
        </motion.div>

        {/* CTA button */}
        <motion.div variants={fadeUp}>
          <motion.a
            href="/apply"
            className="btn-cta"
            whileHover={{ scale: 1.08, y: -7, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            GET STARTED <span>→</span>
          </motion.a>
        </motion.div>

        {/* Secondary link */}
        <motion.div variants={fadeUp}>
          <a href="#how-it-works" className="link-secondary">
            See how matching works <span>→</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
