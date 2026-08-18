import { motion } from 'framer-motion';

/**
 * HeroIllustration — The workspace scene from the reference
 * Uses the actual reference illustration which already includes
 * the "APPLY FOR COHORT →" banner drawn into the image.
 * We just wrap it with subtle animation.
 */
export default function HeroIllustration() {
  return (
    <motion.div
      className="hero-left"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {/* Main illustration — gentle float */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src="/hero-illustration.png"
          alt="Isometric workspace showing 5 diverse builders collaborating in a pod — typing on laptops, writing notes, pointing at a whiteboard with Pod Goals and IDEA → BUILD → SHIP flow, surrounded by books, Guild mugs, and a BUILD TOGETHER GO FURTHER poster"
          className="hero-illustration-img"
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>
    </motion.div>
  );
}
