import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const featureCards = [
  {
    title: 'Daily momentum',
    text: 'Kairos turns your goal into small tasks you can actually finish.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="10" y="10" width="28" height="28" rx="4" />
        <path d="M17 24l5 5 10-12" />
        <path d="M17 6v8M31 6v8" />
      </svg>
    ),
  },
  {
    title: 'Pod matching',
    text: 'Meet builders with similar goals, useful skills, and compatible schedules.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="18" cy="18" r="7" />
        <circle cx="32" cy="16" r="6" />
        <path d="M8 40c1-10 7-15 16-15 8 0 14 5 16 15" />
      </svg>
    ),
  },
  {
    title: 'Accountability loop',
    text: 'Weekly check-ins keep the pod honest without turning learning into homework.',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 6 38 12v11c0 10-6 16-14 20-8-4-14-10-14-20V12Z" />
        <path d="M17 24l5 5 10-11" />
      </svg>
    ),
  },
];

const skills = [
  'AI & Machine Learning',
  'Web Development',
  'Programming & DSA',
  'Mobile App Development',
  'UI/UX & Product Design',
  'Cybersecurity',
  'Data Science',
  'DevOps & Cloud',
];
const levels = ['Beginner', 'Intermediate', 'Advanced'];
const weeklyTimes = ['4-6 hrs', '7-10 hrs', '10-15 hrs', '15+ hrs'];
const commitments = ['Steady', 'Serious', 'All in'];

const fieldVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, delay: 0.36 + index * 0.055, ease: [0.16, 1, 0.3, 1] },
  }),
};

function FieldIcon({ type }) {
  if (type === 'leaf') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 19c10 0 14-6 14-14-8 0-14 4-14 14Z" />
        <path d="M5 19c2-5 6-8 11-10" />
      </svg>
    );
  }

  if (type === 'signal') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 19v-4M12 19V9M19 19V4" />
      </svg>
    );
  }

  if (type === 'star') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7Z" />
      </svg>
    );
  }

  if (type === 'clock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3c5 0 8 3 8 8 0 6-8 10-8 10S4 17 4 11c0-5 3-8 8-8Z" />
      <circle cx="12" cy="11" r="3" />
    </svg>
  );
}

const VALID_SKILLS = new Set([
  'AI & Machine Learning',
  'Web Development',
  'Programming & DSA',
  'Mobile App Development',
  'UI/UX & Product Design',
  'Cybersecurity',
  'Data Science',
  'DevOps & Cloud',
]);

export default function ApplicationForm() {
  const [searchParams] = useSearchParams();
  const initialSkill = (() => {
    const skill = searchParams.get('skill');
    return skill && VALID_SKILLS.has(skill) ? skill : '';
  })();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    timezone: '',
    skill: initialSkill,
    currentLevel: 'Intermediate',
    weeklyTime: '7-10 hrs',
    commitmentLevel: 'Serious',
    whyJoin: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const completion = useMemo(() => {
    const required = [
      formData.fullName,
      formData.email,
      formData.country,
      formData.timezone,
      formData.skill,
      formData.currentLevel,
      formData.weeklyTime,
      formData.commitmentLevel,
      formData.whyJoin,
    ];
    return Math.round((required.filter(Boolean).length / required.length) * 100);
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    if (!isSupabaseConfigured()) {
      setErrorMessage(
        'Supabase credentials missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.',
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from('applications').insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          country: formData.country,
          timezone: formData.timezone,
          skill: formData.skill,
          current_level: formData.currentLevel,
          weekly_time: formData.weeklyTime,
          commitment_level: formData.commitmentLevel,
          why_join: formData.whyJoin,
        },
      ]);

      if (error) {
        throw error;
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting application to Supabase:', err);
      setErrorMessage(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const chooseValue = (name, value) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <main className="apply-page">
      <span className="apply-ambient apply-ambient-one" aria-hidden="true" />
      <span className="apply-ambient apply-ambient-two" aria-hidden="true" />
      <span className="apply-grid-light" aria-hidden="true" />

      <section className="apply-shell" aria-labelledby="apply-title">
        <motion.aside
          className="apply-story"
          initial={{ opacity: 0, x: -54, filter: 'blur(12px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/" className="apply-brand" aria-label="Back to Guild home">
            <img src="/guild-logo.png" alt="Guild" width="58" height="58" />
            <span>Guild</span>
          </Link>

          <motion.p
            className="apply-kicker"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            KAIROS ACTIVATION
          </motion.p>
          <h1 id="apply-title" className="apply-title">
            Start with the right pod, then let Kairos keep you moving.
          </h1>
          <p className="apply-subtitle">
            Tell us your goal, schedule, and skill level. We will shape a pod match around momentum, not random group chat energy.
          </p>

          <div className="apply-signal-card" aria-label="Application status">
            <div>
              <span>Application signal</span>
              <strong>{completion}% ready</strong>
            </div>
            <div className="apply-signal-track">
              <motion.span
                animate={{ width: `${completion}%` }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          <div className="apply-feature-list">
            {featureCards.map((feature, index) => (
              <motion.article
                className="apply-feature"
                key={feature.title}
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.52, delay: 0.3 + index * 0.1 }}
                whileHover={{ x: 8, scale: 1.015 }}
              >
                <motion.span
                  className="apply-feature-icon"
                  animate={{ y: [0, -5, 0], rotate: [0, index % 2 ? 3 : -3, 0] }}
                  transition={{ duration: 2.9 + index * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {feature.icon}
                </motion.span>
                <span>
                  <strong>{feature.title}</strong>
                  {feature.text}
                </span>
              </motion.article>
            ))}
          </div>

          <motion.div
            className="apply-match-card"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.56, delay: 0.72 }}
          >
            <span className="apply-match-icon"><FieldIcon type="clock" /></span>
            <p>
              Most applicants get matched within <strong>48-72 hours</strong>.
            </p>
          </motion.div>
        </motion.aside>

        <motion.section
          className="apply-card"
          initial={{ opacity: 0, x: 62, rotateY: -8, filter: 'blur(12px)' }}
          animate={{ opacity: 1, x: 0, rotateY: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.82, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="apply-card-glow" aria-hidden="true" />
          <div className="apply-card-head">
            <div>
              <p>Step 01</p>
              <h2>Tell Kairos what you are building toward.</h2>
            </div>
            <span className="apply-card-badge">3 min</span>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                className="apply-success"
                key="success"
                initial={{ opacity: 0, scale: 0.92, y: 28 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -28 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.span
                  className="apply-success-mark"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                >
                  <svg viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M14 25l7 7 14-17" />
                  </svg>
                </motion.span>
                <h2>Application sent.</h2>
                <p>Kairos has enough signal to start matching your pod. Watch your inbox for the next step.</p>
                <button type="button" className="apply-reset" onClick={() => setSubmitted(false)}>
                  Edit application
                </button>
              </motion.div>
            ) : (
              <motion.form
                className="apply-form"
                key="form"
                onSubmit={handleSubmit}
                initial="hidden"
                animate="visible"
              >
                <motion.label className="apply-field" custom={0} variants={fieldVariants}>
                  <span>Full name</span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </motion.label>

                <motion.label className="apply-field" custom={1} variants={fieldVariants}>
                  <span>Email address</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </motion.label>

                <motion.label className="apply-field" custom={2} variants={fieldVariants}>
                  <span>Country</span>
                  <select name="country" value={formData.country} onChange={handleChange} required>
                    <option value="">Select your country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </motion.label>

                <motion.label className="apply-field" custom={3} variants={fieldVariants}>
                  <span>Timezone</span>
                  <select name="timezone" value={formData.timezone} onChange={handleChange} required>
                    <option value="">Select your timezone</option>
                    <option value="IST">IST - India</option>
                    <option value="PST">PST - Pacific</option>
                    <option value="EST">EST - Eastern</option>
                    <option value="GMT">GMT - London</option>
                    <option value="CET">CET - Europe</option>
                    <option value="Other">Other</option>
                  </select>
                </motion.label>

                <motion.div className="apply-field apply-field-wide" custom={4} variants={fieldVariants}>
                  <span>What skill are you trying to learn?</span>
                  <div className="apply-chip-grid">
                    {skills.map((skill) => (
                      <button
                        className={formData.skill === skill ? 'apply-chip apply-chip-active' : 'apply-chip'}
                        key={skill}
                        type="button"
                        onClick={() => chooseValue('skill', skill)}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    name="skill"
                    value={formData.skill}
                    onChange={handleChange}
                    placeholder="Or type your own skill"
                    required
                  />
                </motion.div>

                <motion.div className="apply-field apply-field-wide" custom={5} variants={fieldVariants}>
                  <span>Current level</span>
                  <div className="apply-option-row">
                    {levels.map((level, index) => (
                      <button
                        className={formData.currentLevel === level ? 'apply-option apply-option-active' : 'apply-option'}
                        key={level}
                        type="button"
                        onClick={() => chooseValue('currentLevel', level)}
                      >
                        <FieldIcon type={index === 0 ? 'leaf' : index === 1 ? 'signal' : 'star'} />
                        {level}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div className="apply-field apply-field-wide" custom={6} variants={fieldVariants}>
                  <span>Weekly time commitment</span>
                  <div className="apply-chip-grid">
                    {weeklyTimes.map((time) => (
                      <button
                        className={formData.weeklyTime === time ? 'apply-chip apply-chip-active' : 'apply-chip'}
                        key={time}
                        type="button"
                        onClick={() => chooseValue('weeklyTime', time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div className="apply-field apply-field-wide" custom={7} variants={fieldVariants}>
                  <span>Commitment level for the next 3 months</span>
                  <div className="apply-option-row">
                    {commitments.map((commitment, index) => (
                      <button
                        className={formData.commitmentLevel === commitment ? 'apply-option apply-option-active' : 'apply-option'}
                        key={commitment}
                        type="button"
                        onClick={() => chooseValue('commitmentLevel', commitment)}
                      >
                        <FieldIcon type={index === 0 ? 'clock' : index === 1 ? 'signal' : 'star'} />
                        {commitment}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.label className="apply-field apply-field-wide" custom={8} variants={fieldVariants}>
                  <span>Why do you want to join a pod?</span>
                  <textarea
                    name="whyJoin"
                    value={formData.whyJoin}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Share your goal, what you keep procrastinating on, or what you want your pod to help with."
                    required
                  />
                </motion.label>

                {errorMessage && (
                  <div className="apply-error" role="alert">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <motion.button
                  type="submit"
                  className="apply-submit"
                  disabled={isSubmitting}
                  custom={9}
                  variants={fieldVariants}
                  whileHover={isSubmitting ? {} : { y: -5, scale: 1.018 }}
                  whileTap={isSubmitting ? {} : { scale: 0.97 }}
                  style={{ opacity: isSubmitting ? 0.75 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit application'}
                  <span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </span>
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.section>
      </section>
    </main>
  );
}
