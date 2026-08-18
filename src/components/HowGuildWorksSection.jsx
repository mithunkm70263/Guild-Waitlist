import { motion } from 'framer-motion';

const titleWords = ['How', 'Guild', 'Works'];

const steps = [
  {
    src: '/works-step-1.png',
    alt: 'Step 01: Apply for a cohort by sharing goals and current level.',
  },
  {
    src: '/works-step-2.png',
    alt: 'Step 02: Get matched into a pod with shared goals and weekly check-ins.',
  },
  {
    src: '/works-step-3.png',
    alt: 'Step 03: Ship together while tracking progress and supporting each other.',
  },
];

export default function HowGuildWorksSection() {
  return (
    <motion.section
      id="how-guild-works"
      className="how-works"
      aria-labelledby="how-works-title"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
    >
      <span className="how-works-rail how-works-rail-left" aria-hidden="true" />
      <span className="how-works-rail how-works-rail-right" aria-hidden="true" />
      <motion.h2
        id="how-works-title"
        className="how-works-title"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.08,
            },
          },
        }}
      >
        {titleWords.map((word, index) => (
          <motion.span
            key={word}
            className="how-works-word"
            variants={{
              hidden: {
                opacity: 0,
                y: 86,
                rotateX: -42,
                rotateZ: index === 1 ? 2 : -2,
                scale: 0.86,
                filter: 'blur(14px)',
              },
              visible: {
                opacity: 1,
                y: 0,
                rotateX: 0,
                rotateZ: 0,
                scale: 1,
                filter: 'blur(0px)',
                transition: {
                  type: 'spring',
                  stiffness: 210,
                  damping: 17,
                  mass: 0.72,
                },
              },
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.h2>

      <div className="how-works-cards">
        {steps.map((step, index) => (
          <motion.article
            className="how-card"
            key={step.src}
            variants={{
              hidden: {
                opacity: 0,
                y: 96,
                rotate: index === 1 ? 0 : index === 0 ? -4 : 4,
                rotateY: index === 1 ? 0 : index === 0 ? -18 : 18,
                clipPath: 'inset(18% 8% 24% 8%)',
                filter: 'blur(8px)',
              },
              visible: {
                opacity: 1,
                y: 0,
                rotate: 0,
                rotateY: 0,
                clipPath: 'inset(0% 0% 0% 0%)',
                filter: 'blur(0px)',
                transition: {
                  duration: 0.82,
                  delay: 0.34 + index * 0.16,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            viewport={{ once: true, amount: 0.28 }}
            whileHover={{
              y: -14,
              scale: 1.035,
              rotate: index === 1 ? 0 : index === 0 ? -0.8 : 0.8,
              transition: { duration: 0.18 },
            }}
          >
            <motion.img
              src={step.src}
              alt={step.alt}
              draggable="false"
              animate={{ y: [0, index === 1 ? -5 : -8, 0] }}
              transition={{ duration: 5 + index * 0.45, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="how-card-step" aria-hidden="true">
              0{index + 1}
            </span>
            <span className="how-card-shine" />
            <span className="how-card-trace" aria-hidden="true" />
            <motion.span
              className="how-card-spark"
              animate={{
                scale: [1, 1.24, 1],
                opacity: [0.45, 1, 0.45],
                rotate: [0, 12, 0],
              }}
              transition={{ duration: 2.4 + index * 0.25, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.article>
        ))}
      </div>

      <motion.div
        id="get-started"
        className="how-works-cta-wrap"
        variants={{
          hidden: { opacity: 0, y: 36, scale: 0.96 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.7, delay: 0.78, ease: [0.16, 1, 0.3, 1] },
          },
        }}
      >
        <motion.a
          href="/apply"
          className="how-works-cta"
          whileHover={{ y: -8, scale: 1.06, rotate: -0.6 }}
          whileTap={{ scale: 0.95 }}
        >
          GET STARTED <span>→</span>
        </motion.a>
      </motion.div>

      <motion.p
        className="how-works-proof"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.55, delay: 0.92 },
          },
        }}
      >
        180+ builders already shipping in active pods
      </motion.p>
    </motion.section>
  );
}
