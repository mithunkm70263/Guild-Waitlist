import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/builder-tracks.css';

/* ---- Sparkle Star Component ---- */
const SPARKLE_CHARS = ['✦', '✧', '★', '⋆', '✶', '·'];

function FloatingSparkles({ count = 18 }) {
  const [sparkles, setSparkles] = useState([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const items = Array.from({ length: count }, (_, i) => ({
      id: i,
      char: SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 16,
      delay: Math.random() * 4,
      dur: 3 + Math.random() * 5,
      opacity: 0.15 + Math.random() * 0.35,
    }));
    setSparkles(items);
  }, [count]);

  if (reduceMotion) return null;

  return (
    <div className="bt-sparkles-layer" aria-hidden="true">
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="bt-sparkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, s.opacity, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {s.char}
        </motion.span>
      ))}
    </div>
  );
}

const TRACKS = [
  {
    id: 'youtube',
    label: 'Content & Media',
    title: 'YouTube',
    shortName: 'YouTube',
    subtitle: 'Creator / Filmmaker',
    description: 'Build your audience with long-form storytelling, video essays, cinematic edits, and tight weekly upload rituals.',
    rhythm: ['Script', 'Shoot', 'Edit', 'Ship'],
    buttonText: 'Choose YouTube',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="4" y="8" width="24" height="16" rx="5" />
        <path d="m13 12 8 4-8 4Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'ai-app',
    label: 'Intelligence & Tooling',
    title: 'AI app',
    shortName: 'AI app',
    subtitle: 'Full-Stack AI Engineer',
    description: 'Ship functional AI products: agentic systems, local model wrappers, multimodal workflows, and tools that solve painful daily friction.',
    rhythm: ['Prompt', 'Pipeline', 'Eval', 'Ship'],
    buttonText: 'Choose AI app',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="8" y="8" width="16" height="16" rx="4" />
        <path d="M12 4v4M20 4v4M12 24v4M20 24v4M4 12h4M4 20h4M24 12h4M24 20h4" />
        <circle cx="16" cy="16" r="3" />
      </svg>
    ),
  },
  {
    id: 'ai-saas',
    label: 'Revenue & Products',
    title: 'AI SaaS',
    shortName: 'AI SaaS',
    subtitle: 'Micro-SaaS Founder',
    description: 'Turn LLMs into sustainable MRR. Build auth, Postgres, Stripe subscriptions, and ship your commercial launch in 30 days.',
    rhythm: ['Spec', 'Build', 'Stripe', 'Ship'],
    buttonText: 'Choose AI SaaS',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M8 21.5h16a4 4 0 0 0 .2-8A7 7 0 0 0 10.7 12 5 5 0 0 0 8 21.5Z" />
        <path d="M11 25h10M14 28h4" />
        <path d="m14 16 2-2 2 2M16 14v5" />
      </svg>
    ),
  },
  {
    id: 'vibecoder',
    label: 'Speed & Intuition',
    title: 'vibecoder',
    shortName: 'vibecoder',
    subtitle: 'Vibe Coder / Hacker',
    description: 'Zero boilerplate friction. Cursor-native speed, radical micro-tools, wild web experiments, and pure flow-state shipping.',
    rhythm: ['Idea', 'Flow', 'Polish', 'Ship'],
    buttonText: 'Choose vibecoder',
    icon: (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m11 9-6 7 6 7M21 9l6 7-6 7M18 6l-4 20" />
        <path d="M23 7h.01M26 10h.01" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
    },
  },
};

function resolveStoredTrackId(stored) {
  if (!stored) return '';
  const byId = TRACKS.find((t) => t.id === stored);
  if (byId) return byId.id;
  const byTitle = TRACKS.find((t) => t.title === stored || t.shortName === stored);
  return byTitle?.id || '';
}

export default function BuilderTracksPage() {
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState(() => {
    return resolveStoredTrackId(localStorage.getItem('guild-builder-craft'));
  });
  const reduceMotion = useReducedMotion();

  const handleSelect = (id) => {
    setSelectedTrack(id);
    localStorage.setItem('guild-builder-craft', id);

    const routes = {
      youtube: '/builder/youtube',
      'ai-app': '/builder/ai-app',
      'ai-saas': '/builder/ai-saas',
      vibecoder: '/builder/vibecoder',
    };

    if (routes[id]) {
      navigate(routes[id]);
    }
  };

  return (
    <main className="bt-page" aria-labelledby="builder-title">
      <div className="bt-orbit bt-orbit--one" aria-hidden="true" />
      <div className="bt-orbit bt-orbit--two" aria-hidden="true" />
      <FloatingSparkles count={22} />

      {/* Header */}
      <motion.header
        className="bt-header"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link to="/" className="bt-brand" aria-label="Guild Home">
          <span className="bt-brand-mark">
            <img src="/guild-logo.png" alt="" />
          </span>
          <span>Guild</span>
        </Link>

        <div className="bt-header-actions">
          <span className="bt-step-badge">Step 02 / 03 • The Craft</span>
          <Link to="/get-started" className="bt-back-link">
            ← Back
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="bt-main">
        {/* Intro */}
        <motion.div
          className="bt-intro"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          <div className="bt-eyebrow-wrap">
            <span>✦ CHOOSE YOUR ARENA</span>
          </div>

          <h1 id="builder-title" className="bt-title">
            What do you want to <em>be?</em>
          </h1>

          <p className="bt-subtitle">
            Every craft needs a circle. Choose your arena — we’ll match you into a 3-person pod shipping real things every Sunday.
          </p>
        </motion.div>

        {/* 4 Cards Grid */}
        <motion.div
          className="bt-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {TRACKS.map((track) => {
            const isSelected = selectedTrack === track.id;
            return (
              <motion.article
                key={track.id}
                className={`bt-card bt-card--${track.id}${isSelected ? ' is-selected' : ''}`}
                variants={itemVariants}
                onClick={() => handleSelect(track.id)}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                whileTap={{ scale: 0.985 }}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(track.id);
                  }
                }}
              >
                <div>
                  {/* Top Bar */}
                  <div className="bt-card-top">
                    <span className="bt-card-badge">{track.label}</span>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          className="bt-card-check"
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Icon */}
                  <div className="bt-card-icon-wrap">
                    {track.icon}
                  </div>

                  {/* Titles */}
                  <h2 className="bt-card-title">{track.title}</h2>
                  <p className="bt-card-desc">{track.description}</p>
                </div>

                <div>
                  {/* Pod Rhythm */}
                  <div className="bt-rhythm-strip">
                    <span className="bt-rhythm-label">Pod Shipping Loop</span>
                    <div className="bt-rhythm-flow">
                      {track.rhythm.map((step, idx) => (
                        <span key={step}>
                          {step}
                          {idx < track.rhythm.length - 1 && ' → '}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Button */}
                  <motion.button
                    type="button"
                    className="bt-card-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(track.id);
                    }}
                  >
                    <span>{isSelected ? `${track.title} Selected  ✓` : `${track.buttonText}  →`}</span>
                  </motion.button>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </main>
  );
}
