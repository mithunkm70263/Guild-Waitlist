import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/get-started.css';

const BUILDER_TRACKS = [
  { id: 'youtube', label: 'YouTube', name: 'YouTube channel', icon: 'youtube' },
  { id: 'ai-app', label: 'AI app', name: 'AI app', icon: 'ai' },
  { id: 'saas', label: 'SaaS', name: 'SaaS product', icon: 'saas' },
  { id: 'vibe-code', label: 'Vibe code', name: 'Vibe coder', icon: 'code' },
];

const LEARNER_TRACKS = [
  { id: 'aiml', label: 'AI / ML', name: 'AI & Machine Learning', icon: 'ai' },
  { id: 'cybersecurity', label: 'Cyber', name: 'Cybersecurity', icon: 'shield' },
  { id: 'web-development', label: 'Web dev', name: 'Web Development', icon: 'web' },
  { id: 'devops', label: 'DevOps', name: 'DevOps & Cloud', icon: 'devops' },
  { id: 'dsa', label: 'DSA', name: 'Programming & DSA', icon: 'nodes' },
];

const MOMENTUM_MARKERS = [
  { value: '01', label: 'Pick your lane' },
  { value: '02', label: 'Meet your pod' },
  { value: '03', label: 'Ship every week' },
];

const panelTransition = { type: 'spring', stiffness: 220, damping: 25 };
const popTransition = { type: 'spring', stiffness: 360, damping: 22 };

function TrackIcon({ type }) {
  if (type === 'youtube') return <svg viewBox="0 0 28 28" aria-hidden="true"><rect x="3" y="7" width="22" height="14" rx="4" /><path d="m12 11 6 3-6 3Z" /></svg>;
  if (type === 'ai') return <svg viewBox="0 0 28 28" aria-hidden="true"><rect x="7" y="7" width="14" height="14" rx="3" /><path d="M11 4v3M17 4v3M11 21v3M17 21v3M4 11h3M4 17h3M21 11h3M21 17h3M11 13h6M11 16h4" /></svg>;
  if (type === 'saas') return <svg viewBox="0 0 28 28" aria-hidden="true"><path d="M7 18.5h14a3.6 3.6 0 0 0 .2-7.2A6.2 6.2 0 0 0 9.4 10 4.4 4.4 0 0 0 7 18.5Z" /><path d="M10 21.5h8M12 24h4" /></svg>;
  if (type === 'code') return <svg viewBox="0 0 28 28" aria-hidden="true"><path d="m10 8-5 6 5 6M18 8l5 6-5 6M16 5l-4 18" /></svg>;
  if (type === 'shield') return <svg viewBox="0 0 28 28" aria-hidden="true"><path d="M14 3 23 7v6c0 5.8-3.7 9.4-9 12-5.3-2.6-9-6.2-9-12V7Z" /><rect x="11" y="12" width="6" height="6" rx="1" /><path d="M12.5 12v-2a1.5 1.5 0 0 1 3 0v2" /></svg>;
  if (type === 'web') return <svg viewBox="0 0 28 28" aria-hidden="true"><rect x="3.5" y="5.5" width="21" height="17" rx="2" /><path d="M3.5 10h21M7 8h.1M10 8h.1M13 8h.1M11 15l-2 2 2 2M17 15l2 2-2 2" /></svg>;
  if (type === 'devops') return <svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="8" cy="14" r="3" /><circle cx="20" cy="8" r="3" /><circle cx="20" cy="20" r="3" /><path d="m10.7 12.7 6.5-3.4M10.7 15.3l6.5 3.4" /></svg>;
  return <svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="7" cy="8" r="2.7" /><circle cx="21" cy="8" r="2.7" /><circle cx="14" cy="20" r="2.7" /><path d="m9.2 9.6 3.1 7.1M18.8 9.6l-3.1 7.1M10 8h8" /></svg>;
}

function SunMarks() {
  return <span className="gs-sun-marks" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>;
}

function KineticField() {
  return <div className="gs-kinetic-field" aria-hidden="true">
    <span className="gs-field-line gs-field-line--one" />
    <span className="gs-field-line gs-field-line--two" />
    <span className="gs-field-line gs-field-line--three" />
    <span className="gs-field-spark gs-field-spark--one" />
    <span className="gs-field-spark gs-field-spark--two" />
    <span className="gs-field-spark gs-field-spark--three" />
  </div>;
}

function TrackSelector({ track, selected, onSelect, tone }) {
  const toggleProps = typeof selected === 'boolean' ? { 'aria-pressed': selected } : {};
  return <motion.button
    type="button"
    className={`gs-track gs-track--${tone}${selected ? ' is-selected' : ''}`}
    {...toggleProps}
    onClick={onSelect}
    whileHover={{ y: -3, rotate: selected ? 0 : -1 }}
    whileTap={{ scale: 0.95 }}
    transition={panelTransition}
  >
    <span className="gs-track-icon"><TrackIcon type={track.icon} /></span>
    <span>{track.label}</span>
    <AnimatePresence>{selected && <motion.span className="gs-track-check" initial={{ scale: 0, rotate: -18 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }} transition={popTransition}>✓</motion.span>}</AnimatePresence>
  </motion.button>;
}

export default function GetStartedPage() {
  const navigate = useNavigate();
  const [selectedBuilder, setSelectedBuilder] = useState('');
  const reduceMotion = useReducedMotion();

  const chooseBuilder = (id) => {
    setSelectedBuilder((prev) => (prev === id ? '' : id));
  };

  const startBuilderForm = (trackName) => {
    const track = trackName || (selectedBuilder ? BUILDER_TRACKS.find((item) => item.id === selectedBuilder)?.name : '');
    if (track) {
      localStorage.setItem('guild-builder-craft', track);
    }
    navigate('/builder');
  };

  const startLearnerForm = (skill) => {
    const query = skill ? `?path=learner&skill=${encodeURIComponent(skill)}` : '?path=learner';
    navigate(`/apply${query}`);
  };

  return <main className="gs-page" aria-labelledby="path-title">
    <div className="gs-paper-noise" aria-hidden="true" />
    <div className="gs-orbit gs-orbit--one" aria-hidden="true" />
    <div className="gs-orbit gs-orbit--two" aria-hidden="true" />
    <KineticField />

    <motion.header className="gs-header" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
      <Link to="/" className="gs-brand" aria-label="Guild home">
        <span className="gs-brand-mark"><img src="/guild-logo.png" alt="" /></span>
        <span>Guild</span>
      </Link>
      <p className="gs-welcome">
        Welcome to Guild — let&apos;s find your <em>people</em>.
      </p>
    </motion.header>

    <section className="gs-main">
      <motion.div className="gs-intro" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.095, delayChildren: 0.08 } } }}>
        <motion.span className="gs-eyebrow" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>A small decision. A better kind of momentum.</motion.span>
        <motion.div className="gs-title-wrap" variants={{ hidden: { opacity: 0, y: 16, scale: 0.985 }, visible: { opacity: 1, y: 0, scale: 1, transition: panelTransition } }}>
          <SunMarks />
          <h1 id="path-title">How do you want to <em>grow?</em></h1>
        </motion.div>
        <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>Choose your path. Guild helps you find people who will make the work feel less lonely — and more likely to happen.</motion.p>
        <motion.div className="gs-momentum-strip" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.28 } } }}>
          {MOMENTUM_MARKERS.map((marker) => (
            <motion.span
              key={marker.value}
              className="gs-momentum-pill"
              variants={{ hidden: { opacity: 0, y: 8, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: popTransition } }}
            >
              <strong>{marker.value}</strong>{marker.label}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      <div className="gs-path-grid">
        <motion.article className="gs-path-card gs-path-card--builder" initial={{ opacity: 0, x: reduceMotion ? 0 : -28, y: 18 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ ...panelTransition, delay: 0.28 }} whileHover={reduceMotion ? undefined : { y: -6, rotate: -0.35 }}>
          <div className="gs-card-wash" aria-hidden="true" />
          <div className="gs-card-stickers" aria-hidden="true">
            <span>Build</span>
            <span>Test</span>
            <span>Launch</span>
          </div>
          <div className="gs-card-copy">
            <span className="gs-card-label">I&apos;m a builder / creator</span>
            <h2>I want to <em>build</em><br />with people.</h2>
            <p>Create a YouTube channel, an AI app, a SaaS product, or vibe-code your next strange and brilliant thing.</p>
          </div>
          <div className="gs-track-grid gs-track-grid--builder" aria-label="Builder focus">
            {BUILDER_TRACKS.map((track) => <TrackSelector key={track.id} track={track} tone="builder" selected={selectedBuilder === track.id} onSelect={() => chooseBuilder(track.id)} />)}
          </div>
          <motion.div className="gs-illustration gs-illustration--builder" animate={reduceMotion ? undefined : { y: [0, -5, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}>
            <span className="gs-image-shine" aria-hidden="true" />
            <img src="/onboarding-builder-pod.png" alt="Three creators collaborating around a table" />
          </motion.div>
          <motion.button
            type="button"
            className="gs-path-cta gs-path-cta--builder"
            onClick={() => startBuilderForm()}
            whileTap={{ scale: 0.985 }}
          >
            I am a builder/creator.
          </motion.button>
          <p className="gs-learner-note">Choose your focus in the next step. We&apos;ll use it to find your pod.</p>
        </motion.article>

        <motion.article className="gs-path-card gs-path-card--learner" initial={{ opacity: 0, x: reduceMotion ? 0 : 28, y: 18 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ ...panelTransition, delay: 0.36 }} whileHover={reduceMotion ? undefined : { y: -6, rotate: 0.35 }}>
          <div className="gs-card-wash" aria-hidden="true" />
          <div className="gs-card-stickers gs-card-stickers--learner" aria-hidden="true">
            <span>Learn</span>
            <span>Practice</span>
            <span>Grow</span>
          </div>
          <div className="gs-card-copy">
            <span className="gs-card-label">I&apos;m a learner</span>
            <h2>I want to <em>learn</em><br />with people.</h2>
            <p>Learn job-ready skills with a pod that shares your pace, keeps you honest, and celebrates the work you ship.</p>
          </div>
          <div className="gs-track-grid gs-track-grid--learner" aria-label="Learner skills">
            {LEARNER_TRACKS.map((track) => <TrackSelector key={track.id} track={track} tone="learner" onSelect={() => startLearnerForm(track.name)} />)}
          </div>
          <motion.div className="gs-illustration gs-illustration--learner" animate={reduceMotion ? undefined : { y: [0, -5, 0] }} transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}>
            <span className="gs-image-shine" aria-hidden="true" />
            <img src="/onboarding-learner-pod.png" alt="Five learners studying together at a table" />
          </motion.div>
          <motion.button type="button" className="gs-path-cta gs-path-cta--learner" onClick={() => startLearnerForm()} whileTap={{ scale: 0.985 }}>
            I&apos;m a learner  →
          </motion.button>
          <p className="gs-learner-note">Choose your skill in the next step. We&apos;ll use it to find your pod.</p>
        </motion.article>
      </div>

      <motion.p className="gs-footer-note" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }}><span>Not sure yet?</span> You can switch paths anytime. <Link to="/">Return home</Link></motion.p>
    </section>
  </main>;
}
