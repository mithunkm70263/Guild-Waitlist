import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ApplicationSubmittedCard from './ApplicationSubmittedCard';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import '../styles/ai-saas-apply.css';

const STORAGE_KEY = 'guild-ai-saas-application';
const FORM_STEP_COUNT = 7;
const CONFIRMATION_STEP = 7;

const SPARKLE_CHARS = ['✦', '✧', '★', '⋆', '✶', '·'];

function FloatingSparkles({ count = 16 }) {
  const [sparkles, setSparkles] = useState([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const items = Array.from({ length: count }, (_, i) => ({
      id: i,
      char: SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 14,
      delay: Math.random() * 5,
      dur: 3 + Math.random() * 5,
      opacity: 0.12 + Math.random() * 0.3,
    }));
    setSparkles(items);
  }, [count]);

  if (reduceMotion) return null;

  return (
    <div className="as-sparkles-layer" aria-hidden="true">
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="as-sparkle"
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

const COUNTRY_OPTIONS = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Brazil',
  'Japan',
  'South Korea',
  'Nigeria',
  'South Africa',
  'UAE',
  'Singapore',
  'Other',
];

const TIMEZONE_OPTIONS = [
  { value: 'IST', label: 'IST – India (UTC+5:30)' },
  { value: 'PST', label: 'PST – Pacific (UTC−8)' },
  { value: 'MST', label: 'MST – Mountain (UTC−7)' },
  { value: 'CST', label: 'CST – Central (UTC−6)' },
  { value: 'EST', label: 'EST – Eastern (UTC−5)' },
  { value: 'GMT', label: 'GMT – London (UTC+0)' },
  { value: 'CET', label: 'CET – Europe (UTC+1)' },
  { value: 'JST', label: 'JST – Japan (UTC+9)' },
  { value: 'KST', label: 'KST – Korea (UTC+9)' },
  { value: 'AEST', label: 'AEST – Australia (UTC+10)' },
  { value: 'Other', label: 'Other' },
];

const STAGE_OPTIONS = [
  'Just an idea',
  'Building the MVP',
  'Have a working version',
  'Already have some users',
  'Trying to get first paying customers',
];

const GOAL_OPTIONS = [
  'Finish and launch the MVP',
  'Get first 10–50 users',
  'Get first paying customers',
  'Improve the product based on feedback',
  'Validate if people actually want it',
];

const HOURS_OPTIONS = [
  '4–6 hrs',
  '7–10 hrs',
  '10–15 hrs',
  '15+',
];

const AI_BUILD_OPTIONS = [
  'Using existing APIs (OpenAI, Claude, Gemini, etc.)',
  'Fine-tuning or training my own models',
  'Mostly no-code / low-code AI tools',
  'Mix of both',
];

const EXPERIENCE_OPTIONS = [
  'First AI SaaS',
  'Built one or two before',
  'Have experience shipping AI products',
];

const STEPS = [
  { id: 'id', title: 'Builder ID' },
  { id: 'product', title: 'Your Product' },
  { id: 'stage', title: 'Stage' },
  { id: 'goals', title: 'Goals' },
  { id: 'commitment', title: 'Commitment' },
  { id: 'ai-stack', title: 'AI Stack' },
  { id: 'experience', title: 'Experience' },
];

const INITIAL_FORM = {
  fullName: '',
  email: '',
  country: '',
  timezone: '',
  productDescription: '',
  stage: '',
  goals: [],
  weeklyHours: '',
  liveSessionWindows: '',
  aiBuildApproach: '',
  experienceLevel: '',
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 45 : -45,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.36,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -45 : 45,
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.24,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function AISaaSApplicationPage() {
  const reduceMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM);

  const scrollToWizard = useCallback(
    (top = 120) => {
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    },
    [reduceMotion]
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);
      if (parsed.submittedAt) {
        setFormData(parsed);
        setCurrentStep(CONFIRMATION_STEP);
        return;
      }

      setFormData((prev) => ({ ...prev, ...parsed }));
    } catch {
      /* ignore corrupt drafts */
    }
  }, []);

  useEffect(() => {
    if (currentStep >= CONFIRMATION_STEP) return;

    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch {
        /* ignore quota errors */
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [formData, currentStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setChoice = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === val ? '' : val,
    }));
  };

  const toggleGoal = (goal) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goal);
      const next = exists
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal];
      return { ...prev, goals: next };
    });
  };

  const isStepValid = useMemo(() => {
    if (currentStep === 0) {
      return (
        formData.fullName.trim() !== '' &&
        isValidEmail(formData.email) &&
        formData.country.trim() !== '' &&
        formData.timezone.trim() !== ''
      );
    }
    if (currentStep === 1) {
      return formData.productDescription.trim().length >= 10;
    }
    if (currentStep === 2) {
      return formData.stage !== '';
    }
    if (currentStep === 3) {
      return formData.goals.length > 0;
    }
    if (currentStep === 4) {
      return formData.weeklyHours !== '' && formData.liveSessionWindows.trim().length >= 10;
    }
    if (currentStep === 5) {
      return formData.aiBuildApproach !== '';
    }
    if (currentStep === 6) {
      return formData.experienceLevel !== '';
    }
    return true;
  }, [currentStep, formData]);

  const goNext = () => {
    setErrorMessage('');
    if (currentStep < FORM_STEP_COUNT - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      scrollToWizard();
    } else if (currentStep === FORM_STEP_COUNT - 1) {
      handleSubmit();
    }
  };

  const goBack = () => {
    setErrorMessage('');
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
      scrollToWizard();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    if (!isSupabaseConfigured()) {
      setErrorMessage(
        'Supabase credentials are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel and .env.local.',
      );
      setIsSubmitting(false);
      return;
    }

    const submittedAt = new Date().toISOString();

    try {
      const { error } = await supabase.from('ai_saas_applications').insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          country: formData.country,
          timezone: formData.timezone,
          product_description: formData.productDescription,
          stage: formData.stage,
          goals: formData.goals,
          weekly_hours: formData.weeklyHours,
          live_session_windows: formData.liveSessionWindows,
          ai_build_approach: formData.aiBuildApproach,
          experience_level: formData.experienceLevel,
          submitted_at: submittedAt,
        },
      ]);

      if (error) {
        throw error;
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...formData,
          submittedAt,
        })
      );

      setDirection(1);
      setCurrentStep(CONFIRMATION_STEP);
      scrollToWizard(100);
    } catch (err) {
      console.error('Error submitting AI SaaS application to Supabase:', err);
      setErrorMessage(err.message || 'Failed to submit your AI SaaS application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = useMemo(() => {
    if (currentStep >= CONFIRMATION_STEP) return 100;
    return Math.round(((currentStep + 1) / FORM_STEP_COUNT) * 100);
  }, [currentStep]);

  const timezoneLabel =
    TIMEZONE_OPTIONS.find((tz) => tz.value === formData.timezone)?.label || formData.timezone;

  return (
    <main className="as-apply-page">
      <FloatingSparkles count={20} />
      <div className="as-wizard-shell">
        <header className="as-upper-header">
          <div className="as-top-nav">
            <Link to="/" className="as-brand" aria-label="Guild Home">
              <img src="/guild-logo.png" alt="Guild" />
              <span>Guild</span>
            </Link>

            <Link to="/builder" className="as-back-to-builder">
              ← Back to Lanes
            </Link>
          </div>

          <div className="as-pod-banner">
            <span className="as-banner-pill">3 founders</span>
            <span className="as-banner-dot" />
            <span>1 weekly ship ritual</span>
            <span className="as-banner-dot" />
            <span>Zero excuses</span>
          </div>

          <h1 className="as-wizard-title">
            AI SaaS Builder <em>Pod Application</em>
          </h1>
          <p className="as-wizard-subtitle">
            Answer the 7 quick checks below. Kairos curates tight 3-person pods of AI SaaS founders shipping revenue-ready products every single Sunday.
          </p>

          {currentStep < CONFIRMATION_STEP && (
            <div className="as-tracker-wrap">
              <div className="as-progress-line-track" aria-hidden="true">
                <motion.span
                  className="as-progress-line-fill"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
                />
              </div>

              <div className="as-step-tabs">
                {STEPS.map((s, idx) => {
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`as-step-tab${isActive ? ' is-active' : ''}${isCompleted ? ' is-completed' : ''}`}
                      onClick={() => {
                        if (idx < currentStep) {
                          setDirection(-1);
                          setCurrentStep(idx);
                        }
                      }}
                      disabled={idx > currentStep}
                    >
                      <span>{isCompleted ? '✓' : `0${idx + 1}`}</span>
                      <span>{s.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </header>

        <div className="as-card-stage">
          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === 0 && (
              <motion.div
                key="card-0"
                className="as-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="as-card-header">
                  <div className="as-card-header-copy">
                    <span className="as-card-badge">Card 01 of 07</span>
                    <h2>Builder Identification</h2>
                    <p>Tell us who you are and what time zone you operate in.</p>
                  </div>
                  <span className="as-step-count-pill">Basic Info</span>
                </div>

                <div className="as-card-body">
                  <div className="as-grid-2">
                    <div className="as-field">
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="e.g. Maya Lin"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        autoFocus
                      />
                    </div>

                    <div className="as-field">
                      <label htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. maya@saas.ai"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="as-field">
                      <label htmlFor="country">Country</label>
                      <select
                        id="country"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleChange}
                      >
                        <option value="">Select your country</option>
                        {COUNTRY_OPTIONS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="as-field">
                      <label htmlFor="timezone">Time Zone</label>
                      <select
                        id="timezone"
                        name="timezone"
                        required
                        value={formData.timezone}
                        onChange={handleChange}
                      >
                        <option value="">Select your time zone</option>
                        {TIMEZONE_OPTIONS.map((tz) => (
                          <option key={tz.value} value={tz.value}>{tz.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="as-card-footer">
                  <span style={{ fontSize: '0.82rem', color: '#78716c' }}>
                    Step 1 of 7 • All fields required
                  </span>

                  <button
                    type="button"
                    className="as-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Your Product  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="card-1"
                className="as-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="as-card-header">
                  <div className="as-card-header-copy">
                    <span className="as-card-badge">Card 02 of 07</span>
                    <h2>What You&apos;re Building</h2>
                    <p>Paint a clear picture of the AI SaaS you&apos;re shipping in the next 5–6 weeks.</p>
                  </div>
                  <span className="as-step-count-pill">Product Vision</span>
                </div>

                <div className="as-card-body">
                  <div className="as-field">
                    <label htmlFor="productDescription">
                      What AI SaaS are you building (or planning to build) in the next 5–6 weeks?
                    </label>
                    <p className="as-field-hint">
                      Be specific — e.g. &quot;AI tool that helps freelancers write proposals&quot;, &quot;AI customer support chatbot for Shopify stores&quot;, &quot;AI resume optimizer&quot;
                    </p>
                    <textarea
                      id="productDescription"
                      name="productDescription"
                      required
                      placeholder="Describe your AI SaaS idea, who it's for, and the core problem it solves..."
                      value={formData.productDescription}
                      onChange={handleChange}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="as-card-footer">
                  <button type="button" className="as-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="as-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Current Stage  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="card-2"
                className="as-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="as-card-header">
                  <div className="as-card-header-copy">
                    <span className="as-card-badge">Card 03 of 07</span>
                    <h2>Where You Are Today</h2>
                    <p>We match founders at similar stages so peer feedback lands immediately.</p>
                  </div>
                  <span className="as-step-count-pill">Stage Check</span>
                </div>

                <div className="as-card-body">
                  <div className="as-choice-group">
                    <span className="as-choice-label">
                      <span>✦ What stage are you currently at?</span>
                    </span>
                    <div className="as-chip-grid">
                      {STAGE_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`as-chip-btn${formData.stage === opt ? ' is-active' : ''}`}
                          onClick={() => setChoice('stage', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="as-card-footer">
                  <button type="button" className="as-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="as-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Your Goals  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="card-3"
                className="as-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="as-card-header">
                  <div className="as-card-header-copy">
                    <span className="as-card-badge">Card 04 of 07</span>
                    <h2>Goals for the Next 5–6 Weeks</h2>
                    <p>What does winning look like for you before the pod cycle ends?</p>
                  </div>
                  <span className="as-step-count-pill">North Star</span>
                </div>

                <div className="as-card-body">
                  <div className="as-choice-group">
                    <span className="as-choice-label">
                      <span>✦ What&apos;s your main goal? (select all that apply)</span>
                    </span>
                    <div className="as-tags-group">
                      {GOAL_OPTIONS.map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          className={`as-tag-pill${formData.goals.includes(goal) ? ' is-active' : ''}`}
                          onClick={() => toggleGoal(goal)}
                        >
                          <span>{formData.goals.includes(goal) ? '✓' : '+'}</span>
                          <span>{goal}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="as-card-footer">
                  <button type="button" className="as-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="as-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Time Commitment  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="card-4"
                className="as-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="as-card-header">
                  <div className="as-card-header-copy">
                    <span className="as-card-badge">Card 05 of 07</span>
                    <h2>Time Commitment & Availability</h2>
                    <p>Pods run on focused hours and short live sessions — be realistic.</p>
                  </div>
                  <span className="as-step-count-pill">Schedule</span>
                </div>

                <div className="as-card-body">
                  <div className="as-choice-group">
                    <span className="as-choice-label">
                      <span>✦ How many focused hours per week can you realistically give this?</span>
                    </span>
                    <div className="as-chip-grid">
                      {HOURS_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`as-chip-btn${formData.weeklyHours === opt ? ' is-active' : ''}`}
                          onClick={() => setChoice('weeklyHours', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="as-field">
                    <label htmlFor="liveSessionWindows">
                      What&apos;s your timezone and which time windows usually work for short live sessions?
                      {formData.timezone && (
                        <span className="opt">Your TZ: {formData.timezone}</span>
                      )}
                    </label>
                    <p className="as-field-hint">
                      e.g. &quot;Weekday evenings 7–9pm IST&quot;, &quot;Saturday mornings 9–11am EST&quot;
                    </p>
                    <textarea
                      id="liveSessionWindows"
                      name="liveSessionWindows"
                      required
                      placeholder="List the days and time blocks when you can join 30–45 min pod sessions..."
                      value={formData.liveSessionWindows}
                      onChange={handleChange}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="as-card-footer">
                  <button type="button" className="as-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="as-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: AI Stack  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="card-5"
                className="as-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="as-card-header">
                  <div className="as-card-header-copy">
                    <span className="as-card-badge">Card 06 of 07</span>
                    <h2>How You Build the AI</h2>
                    <p>Your stack shapes the kind of pod mates who can actually help you ship.</p>
                  </div>
                  <span className="as-step-count-pill">Tech Approach</span>
                </div>

                <div className="as-card-body">
                  <div className="as-choice-group">
                    <span className="as-choice-label">
                      <span>✦ How are you building the AI part?</span>
                    </span>
                    <div className="as-chip-grid as-chip-grid--wide">
                      {AI_BUILD_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`as-chip-btn${formData.aiBuildApproach === opt ? ' is-active' : ''}`}
                          onClick={() => setChoice('aiBuildApproach', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="as-card-footer">
                  <button type="button" className="as-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="as-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Experience  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="card-6"
                className="as-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="as-card-header">
                  <div className="as-card-header-copy">
                    <span className="as-card-badge">Card 07 of 07</span>
                    <h2>Your AI Product Experience</h2>
                    <p>Honest self-assessment helps Kairos balance each pod.</p>
                  </div>
                  <span className="as-step-count-pill">Background</span>
                </div>

                <div className="as-card-body">
                  <div className="as-choice-group">
                    <span className="as-choice-label">
                      <span>✦ What&apos;s your experience level with building AI products?</span>
                    </span>
                    <div className="as-chip-grid">
                      {EXPERIENCE_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`as-chip-btn${formData.experienceLevel === opt ? ' is-active' : ''}`}
                          onClick={() => setChoice('experienceLevel', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="as-card-footer">
                  <button type="button" className="as-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  {errorMessage && (
                    <p className="as-submit-error" role="alert">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="button"
                    className="as-btn-next"
                    disabled={!isStepValid || isSubmitting}
                    onClick={handleSubmit}
                  >
                    <span>{isSubmitting ? 'Curating Match...' : 'Submit AI SaaS Application  →'}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === CONFIRMATION_STEP && (
              <motion.div
                key="card-confirm"
                className="as-card as-confirm-card"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <ApplicationSubmittedCard
                  theme="as"
                  title="Application received — you're on the list."
                  subtitle="Thanks for trusting Guild."
                  description={
                    <>
                      Kairos is reviewing your product vision (<strong>{formData.stage || 'Recorded'}</strong>), goals, and weekly commitment. We match AI SaaS founders on ship velocity and revenue intent — not random chat energy.
                    </>
                  }
                  summaryRows={[
                    { label: 'Founder', value: formData.fullName || 'Registered Founder' },
                    { label: 'Pod Size', value: '3 founders per pod' },
                    { label: 'Stage', value: formData.stage || 'Standard tier' },
                    { label: 'Weekly Hours', value: formData.weeklyHours || 'Committed' },
                    { label: 'AI Stack', value: formData.aiBuildApproach || 'Recorded' },
                    { label: 'Timezone', value: timezoneLabel || 'Recorded' },
                  ]}
                  primaryBtnClass="as-btn-primary"
                  backBtnClass="as-btn-back"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
