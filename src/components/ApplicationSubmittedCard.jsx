import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/application-submitted.css';

const PARTICLE_CHARS = ['✦', '✧', '★', '⋆', '✶', '·', '◆'];

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  char: PARTICLE_CHARS[i % PARTICLE_CHARS.length],
  x: 8 + Math.random() * 84,
  y: 10 + Math.random() * 80,
  size: 8 + Math.random() * 10,
  delay: Math.random() * 3,
  dur: 3 + Math.random() * 3,
  opacity: 0.2 + Math.random() * 0.35,
}));

export default function ApplicationSubmittedCard({
  theme = 'aa',
  title,
  subtitle,
  description,
  summaryTitle = '✦ Matched Pod Specifications:',
  summaryRows = [],
  dashboardLabel,
  dashboardTo = '/dashboard',
  backLabel = 'Explore Other Builder Tracks',
  backTo = '/builder',
  dashboardBtnClass,
  backBtnClass,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`app-submitted app-submitted--${theme}`}>
      {!reduceMotion && (
        <div className="app-submitted-particles" aria-hidden="true">
          {PARTICLES.map((p) => (
            <span
              key={p.id}
              className="app-submitted-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                '--particle-size': `${p.size}px`,
                '--particle-delay': `${p.delay}s`,
                '--particle-dur': `${p.dur}s`,
                '--particle-opacity': p.opacity,
              }}
            >
              {p.char}
            </span>
          ))}
        </div>
      )}

      <div className="app-submitted-kairos">
        <div className="app-submitted-glow" aria-hidden="true" />

        <motion.div
          className="app-submitted-bubble"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.5, y: 12, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 480, damping: 18, delay: 0.35 }}
        >
          Noted.
        </motion.div>

        <motion.img
          src="/kairos-noted.png"
          alt="Kairos taking notes on your application"
          className="app-submitted-kairos-img"
          initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.88 }}
          animate={
            reduceMotion
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 1, y: [0, -8, 0], scale: 1 }
          }
          transition={
            reduceMotion
              ? { duration: 0.2 }
              : {
                  opacity: { duration: 0.5, delay: 0.1 },
                  y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
                  scale: { duration: 0.5, delay: 0.1, type: 'spring', stiffness: 260 },
                }
          }
          draggable={false}
        />

        <motion.span
          className="app-submitted-badge"
          initial={reduceMotion ? false : { scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 14, delay: 0.55 }}
          aria-hidden="true"
        >
          ✓
        </motion.span>
      </div>

      <motion.div
        className="app-submitted-shimmer"
        initial={reduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        aria-hidden="true"
      />

      <motion.h2
        className="app-submitted-title"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.45 }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className="app-submitted-subtitle"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
        >
          {subtitle}
        </motion.p>
      )}

      {description && (
        <motion.p
          className="app-submitted-desc"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
        >
          {description}
        </motion.p>
      )}

      {summaryRows.length > 0 && (
        <motion.div
          className="app-submitted-summary"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.75 }}
        >
          <h4>{summaryTitle}</h4>
          <div className="app-submitted-grid">
            {summaryRows.map((row) => (
              <div key={row.label} className="app-submitted-row">
                <strong>{row.label}</strong>
                <span>{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="app-submitted-actions"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.85 }}
      >
        <Link to={dashboardTo} className={dashboardBtnClass}>
          {dashboardLabel}
        </Link>
        <Link to={backTo} className={backBtnClass}>
          {backLabel}
        </Link>
      </motion.div>
    </div>
  );
}
