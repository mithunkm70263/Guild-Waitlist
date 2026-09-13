import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import '../styles/ai-app-apply.css';

const STORAGE_KEY = 'guild-ai-app-application';
const CONFIRMATION_STEP = 6;

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
    <div className="aa-sparkles-layer" aria-hidden="true">
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="aa-sparkle"
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

const APP_STATUS_OPTIONS = [
  'Live with users',
  'Stalled mid-build',
  'Never shipped',
  'Building now',
];

const READINESS_OPTIONS = [
  'Yes — shipping in 90 days',
  'Maybe — need accountability',
  'Not yet — still exploring',
];

const HOURS_OPTIONS = [
  '4–6 hrs',
  '7–10 hrs',
  '10–15 hrs',
  '15+',
];

const POD_MEMBER_TRAITS = [
  'Brutal code reviews',
  'Weekly ship deadlines',
  'Prompt engineering nerd',
  'High work ethic',
  'User feedback obsessed',
  'Zero excuses on deadlines',
  'Agent architecture geek',
  'Eval & metrics driven',
];

const STEPS = [
  { id: 'id', title: 'Builder ID', badge: 'Step 01 / 06' },
  { id: 'app', title: 'App & Status', badge: 'Step 02 / 06' },
  { id: 'history', title: 'History & Launch', badge: 'Step 03 / 06' },
  { id: 'sacrifice', title: 'Drive & Sacrifice', badge: 'Step 04 / 06' },
  { id: 'availability', title: 'Availability', badge: 'Step 05 / 06' },
  { id: 'expectations', title: 'Pod Expectations', badge: 'Step 06 / 06' },
];

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

export default function AIAppApplicationPage() {
  const reduceMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const scrollToWizard = useCallback(
    (top = 120) => {
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    },
    [reduceMotion]
  );

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    timezone: '',
    appDescription: '',
    appStatus: '',
    whyStopped: '',
    launchExperience: '',
    threeMonthReady: '',
    motivationAndSacrifice: '',
    weeklyHours: '',
    liveSessionWindows: '',
    expectedTraits: ['Brutal code reviews', 'Weekly ship deadlines'],
    podExpectations: '',
  });

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

  const toggleTrait = (trait) => {
    setFormData((prev) => {
      const exists = prev.expectedTraits.includes(trait);
      const next = exists
        ? prev.expectedTraits.filter((t) => t !== trait)
        : [...prev.expectedTraits, trait];
      return { ...prev, expectedTraits: next };
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
      return formData.appDescription.trim().length >= 10 && formData.appStatus !== '';
    }
    if (currentStep === 2) {
      const needsWhyStopped =
        formData.appStatus === 'Stalled mid-build' || formData.appStatus === 'Never shipped';
      const whyValid = needsWhyStopped
        ? formData.whyStopped.trim().length >= 10
        : true;
      return whyValid && formData.launchExperience.trim().length >= 10;
    }
    if (currentStep === 3) {
      return (
        formData.threeMonthReady !== '' &&
        formData.motivationAndSacrifice.trim().length >= 10
      );
    }
    if (currentStep === 4) {
      return formData.weeklyHours !== '' && formData.liveSessionWindows.trim().length >= 10;
    }
    if (currentStep === 5) {
      return formData.podExpectations.trim().length >= 10;
    }
    return true;
  }, [currentStep, formData]);

  const goNext = () => {
    setErrorMessage('');
    if (currentStep < 5) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      scrollToWizard();
    } else if (currentStep === 5) {
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
      const { error } = await supabase.from('ai_app_applications').insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          country: formData.country,
          timezone: formData.timezone,
          app_description: formData.appDescription,
          app_status: formData.appStatus,
          why_stopped: formData.whyStopped || null,
          launch_experience: formData.launchExperience,
          three_month_ready: formData.threeMonthReady,
          motivation_and_sacrifice: formData.motivationAndSacrifice,
          weekly_hours: formData.weeklyHours,
          live_session_windows: formData.liveSessionWindows,
          expected_traits: formData.expectedTraits,
          pod_expectations: formData.podExpectations || null,
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
      console.error('Error submitting AI App application to Supabase:', err);
      setErrorMessage(err.message || 'Failed to submit your AI App application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = useMemo(() => {
    if (currentStep >= CONFIRMATION_STEP) return 100;
    return Math.round(((currentStep + 1) / 6) * 100);
  }, [currentStep]);

  const showWhyStopped =
    formData.appStatus === 'Stalled mid-build' || formData.appStatus === 'Never shipped';

  return (
    <main className="aa-apply-page">
      <FloatingSparkles count={20} />
      <div className="aa-wizard-shell">
        <header className="aa-upper-header">
          <div className="aa-top-nav">
            <Link to="/" className="aa-brand" aria-label="Guild Home">
              <img src="/guild-logo.png" alt="Guild" />
              <span>Guild</span>
            </Link>

            <Link to="/builder" className="aa-back-to-builder">
              ← Back to Lanes
            </Link>
          </div>

          <div className="aa-pod-banner">
            <span className="aa-banner-pill">3 builders</span>
            <span className="aa-banner-dot" />
            <span>1 weekly ship ritual</span>
            <span className="aa-banner-dot" />
            <span>Zero excuses</span>
          </div>

          <h1 className="aa-wizard-title">
            AI App Builder <em>Pod Application</em>
          </h1>
          <p className="aa-wizard-subtitle">
            Answer the 6 quick checks below. Kairos curates tight 3-person pods of AI builders who ship real products every single Sunday.
          </p>

          {currentStep < CONFIRMATION_STEP && (
            <div className="aa-tracker-wrap">
              <div className="aa-progress-line-track" aria-hidden="true">
                <motion.span
                  className="aa-progress-line-fill"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
                />
              </div>

              <div className="aa-step-tabs">
                {STEPS.map((s, idx) => {
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`aa-step-tab${isActive ? ' is-active' : ''}${isCompleted ? ' is-completed' : ''}`}
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

        <div className="aa-card-stage">
          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === 0 && (
              <motion.div
                key="card-0"
                className="aa-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="aa-card-header">
                  <div className="aa-card-header-copy">
                    <span className="aa-card-badge">Card 01 of 06</span>
                    <h2>Builder Identification</h2>
                    <p>Tell us who you are and what time zone you operate in.</p>
                  </div>
                  <span className="aa-step-count-pill">Basic Info</span>
                </div>

                <div className="aa-card-body">
                  <div className="aa-grid-2">
                    <div className="aa-field">
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

                    <div className="aa-field">
                      <label htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. maya@build.ai"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="aa-field">
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

                    <div className="aa-field">
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

                <div className="aa-card-footer">
                  <span style={{ fontSize: '0.82rem', color: '#78716c' }}>
                    Step 1 of 5 • All fields required
                  </span>

                  <button
                    type="button"
                    className="aa-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: App & Status  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="card-1"
                className="aa-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="aa-card-header">
                  <div className="aa-card-header-copy">
                    <span className="aa-card-badge">Card 02 of 06</span>
                    <h2>Your App & Current Status</h2>
                    <p>What have you tried to build, and where does it stand right now?</p>
                  </div>
                  <span className="aa-step-count-pill">App Context</span>
                </div>

                <div className="aa-card-body">
                  <div className="aa-field">
                    <label htmlFor="appDescription">
                      What app have you tried to build? Is it live, or did it stall?
                    </label>
                    <textarea
                      id="appDescription"
                      name="appDescription"
                      required
                      placeholder="Describe the AI app, agent, or tool you&apos;ve been working on. What does it do? Is it deployed, in a repo, or stuck in your head?"
                      value={formData.appDescription}
                      onChange={handleChange}
                      autoFocus
                    />
                  </div>

                  <div className="aa-choice-group">
                    <span className="aa-choice-label">
                      <span>✦ Where does this project stand today?</span>
                    </span>
                    <div className="aa-chip-grid">
                      {APP_STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`aa-chip-btn${formData.appStatus === opt ? ' is-active' : ''}`}
                          onClick={() => setChoice('appStatus', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="aa-card-footer">
                  <button type="button" className="aa-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="aa-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: History & Launch  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="card-2"
                className="aa-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="aa-card-header">
                  <div className="aa-card-header-copy">
                    <span className="aa-card-badge">Card 03 of 06</span>
                    <h2>Blockers & Launch Experience</h2>
                    <p>We match builders who&apos;ve felt the friction of shipping — and want to break through it.</p>
                  </div>
                  <span className="aa-step-count-pill">Builder History</span>
                </div>

                <div className="aa-card-body">
                  <div className="aa-field">
                    <label htmlFor="whyStopped">
                      What made you stop working on it, if you did?
                      {!showWhyStopped && <span className="opt">Optional</span>}
                    </label>
                    <textarea
                      id="whyStopped"
                      name="whyStopped"
                      placeholder="Lost momentum? Hit a technical wall? Ran out of time? No users showed up? Be honest — pods are built on real talk."
                      value={formData.whyStopped}
                      onChange={handleChange}
                      autoFocus
                    />
                  </div>

                  <div className="aa-field">
                    <label htmlFor="launchExperience">
                      Have you ever launched something to real users, even a handful? What was that like?
                    </label>
                    <textarea
                      id="launchExperience"
                      name="launchExperience"
                      required
                      placeholder="A side project, a beta, a weekend hack — anything that left the building. What happened when real people touched it?"
                      value={formData.launchExperience}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="aa-card-footer">
                  <button type="button" className="aa-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="aa-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Drive & Sacrifice  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="card-3"
                className="aa-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="aa-card-header">
                  <div className="aa-card-header-copy">
                    <span className="aa-card-badge">Card 04 of 06</span>
                    <h2>Drive, Readiness & Sacrifice</h2>
                    <p>Pods only thrive when all 3 builders show up with the exact same fire.</p>
                  </div>
                  <span className="aa-step-count-pill">Commitment Check</span>
                </div>

                <div className="aa-card-body">
                  <div className="aa-choice-group">
                    <span className="aa-choice-label">
                      <span>✦ Are you ready to show something real to users within the next 3 months?</span>
                    </span>
                    <div className="aa-chip-grid">
                      {READINESS_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`aa-chip-btn${formData.threeMonthReady === opt ? ' is-active' : ''}`}
                          onClick={() => setChoice('threeMonthReady', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="aa-field">
                    <label htmlFor="motivationAndSacrifice">
                      How motivated are you and what are you willing to sacrifice? Give me your raw words.
                    </label>
                    <textarea
                      id="motivationAndSacrifice"
                      name="motivationAndSacrifice"
                      required
                      placeholder="Give it to us straight. What are you sacrificing (weekends, gaming, social outings) to ship this app? Why does building with AI matter so deeply to you right now?"
                      value={formData.motivationAndSacrifice}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="aa-card-footer">
                  <button type="button" className="aa-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="aa-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Availability  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="card-4"
                className="aa-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="aa-card-header">
                  <div className="aa-card-header-copy">
                    <span className="aa-card-badge">Card 05 of 06</span>
                    <h2>Time Commitment & Availability</h2>
                    <p>Pods run on focused hours and short live sessions — be realistic.</p>
                  </div>
                  <span className="aa-step-count-pill">Schedule</span>
                </div>

                <div className="aa-card-body">
                  <div className="aa-choice-group">
                    <span className="aa-choice-label">
                      <span>✦ How many focused hours per week can you realistically give this?</span>
                    </span>
                    <div className="aa-chip-grid">
                      {HOURS_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`aa-chip-btn${formData.weeklyHours === opt ? ' is-active' : ''}`}
                          onClick={() => setChoice('weeklyHours', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="aa-field">
                    <label htmlFor="liveSessionWindows">
                      What&apos;s your timezone and which time windows usually work for short live sessions?
                      {formData.timezone && (
                        <span className="opt">Your TZ: {formData.timezone}</span>
                      )}
                    </label>
                    <p className="aa-field-hint">
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

                <div className="aa-card-footer">
                  <button type="button" className="aa-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="aa-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Pod Expectations  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="card-5"
                className="aa-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="aa-card-header">
                  <div className="aa-card-header-copy">
                    <span className="aa-card-badge">Card 06 of 06</span>
                    <h2>Ideal Pod & Mutual Expectations</h2>
                    <p>What do you expect from pod members and the Guild? How should they be?</p>
                  </div>
                  <span className="aa-step-count-pill">Pod Pairing</span>
                </div>

                <div className="aa-card-body">
                  <div className="aa-choice-group">
                    <span className="aa-choice-label">
                      <span>✦ Traits you want in your 2 pod mates (select all that apply):</span>
                    </span>
                    <div className="aa-tags-group">
                      {POD_MEMBER_TRAITS.map((trait) => (
                        <button
                          key={trait}
                          type="button"
                          className={`aa-tag-pill${formData.expectedTraits.includes(trait) ? ' is-active' : ''}`}
                          onClick={() => toggleTrait(trait)}
                        >
                          <span>{formData.expectedTraits.includes(trait) ? '✓' : '+'}</span>
                          <span>{trait}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="aa-field">
                    <label htmlFor="podExpectations">
                      What do you expect from pod members and the Guild? How should they be, and what do you expect from them?
                    </label>
                    <textarea
                      id="podExpectations"
                      name="podExpectations"
                      required
                      placeholder="Tell us how you expect your pod mates to show up. Do you want them tearing apart your eval pipeline? Keeping you to the Sunday ship deadline? Pushing you to talk to users before adding features?"
                      value={formData.podExpectations}
                      onChange={handleChange}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="aa-card-footer">
                  <button type="button" className="aa-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  {errorMessage && (
                    <p className="aa-submit-error" role="alert">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="button"
                    className="aa-btn-next"
                    disabled={!isStepValid || isSubmitting}
                    onClick={handleSubmit}
                  >
                    <span>{isSubmitting ? 'Curating Match...' : 'Submit AI App Application  →'}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === CONFIRMATION_STEP && (
              <motion.div
                key="card-5"
                className="aa-card aa-confirm-card"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="aa-confirm-spark">✓</div>

                <h2 className="aa-confirm-title">
                  We will match you with three builders within 24 hours.
                </h2>
                <p className="aa-confirm-subtitle">
                  Thanks for trusting Guild.
                </p>

                <p className="aa-confirm-desc">
                  Kairos is reviewing your app context (<strong>{formData.appStatus || 'Recorded'}</strong>), launch history, and 90-day readiness. We match builders on ship velocity, not random chat energy.
                </p>

                <div className="aa-confirm-summary">
                  <h4>✦ Matched Pod Specifications:</h4>
                  <div className="aa-confirm-grid">
                    <div className="aa-confirm-row">
                      <strong>Builder:</strong>
                      <span>{formData.fullName || 'Registered Builder'}</span>
                    </div>
                    <div className="aa-confirm-row">
                      <strong>Pod Size:</strong>
                      <span>3 builders per pod</span>
                    </div>
                    <div className="aa-confirm-row">
                      <strong>App Status:</strong>
                      <span>{formData.appStatus || 'Standard tier'}</span>
                    </div>
                    <div className="aa-confirm-row">
                      <strong>90-Day Ready:</strong>
                      <span>{formData.threeMonthReady || 'Committed'}</span>
                    </div>
                    <div className="aa-confirm-row">
                      <strong>Weekly Hours:</strong>
                      <span>{formData.weeklyHours || 'Committed'}</span>
                    </div>
                    <div className="aa-confirm-row">
                      <strong>Pod Review Time:</strong>
                      <span>Within 24 hours</span>
                    </div>
                  </div>
                </div>

                <div className="aa-confirm-actions">
                  <Link to="/dashboard" className="aa-btn-dashboard">
                    Enter Builder Dashboard →
                  </Link>
                  <Link to="/builder" className="aa-btn-back">
                    Explore Other Builder Tracks
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
