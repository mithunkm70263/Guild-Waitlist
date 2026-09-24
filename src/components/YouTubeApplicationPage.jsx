import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ApplicationSubmittedCard from './ApplicationSubmittedCard';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import '../styles/youtube-apply.css';

const STORAGE_KEY = 'guild-yt-application';
const CONFIRMATION_STEP = 6;

/* ---- Sparkle Star Component ---- */
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
    <div className="yt-sparkles-layer" aria-hidden="true">
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="yt-sparkle"
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

const SUBSCRIBER_OPTIONS = [
  '< 1,000',
  '1K – 10K',
  '10K – 50K',
  '50K – 100K',
  '100K+',
];

const VIEW_OPTIONS = [
  '< 5,000 / mo',
  '5K – 25K / mo',
  '25K – 100K / mo',
  '100K – 500K / mo',
  '500K+ / mo',
];

const VIDEO_COUNT_OPTIONS = [
  '1 – 5 videos',
  '6 – 20 videos',
  '21 – 50 videos',
  '50+ videos',
];

const TIMELINE_OPTIONS = [
  '< 3 months',
  '3 – 6 months',
  '6 – 12 months',
  '1+ years',
];

const HOURS_OPTIONS = [
  '4–6 hrs',
  '7–10 hrs',
  '10–15 hrs',
  '15+',
];

const POD_MEMBER_TRAITS = [
  'Brutal honesty on cuts',
  'Weekly script reviews',
  'Thumbnail & title A/B testing',
  'High work ethic',
  'Data & retention driven',
  'Zero excuses on deadlines',
  'Cinematic editing nerd',
  'Viral ideation partner',
];

const STEPS = [
  { id: 'id', title: 'Creator ID', badge: 'Step 01 / 06' },
  { id: 'niche', title: 'Niche & Metrics', badge: 'Step 02 / 06' },
  { id: 'velocity', title: 'History & Velocity', badge: 'Step 03 / 06' },
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

export default function YouTubeApplicationPage() {
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
    niche: '',
    channelUrl: '',
    subscribers: '',
    monthlyViews: '',
    videosPosted: '',
    timeline: '',
    uploadCadence: '',
    motivationAndSacrifice: '',
    weeklyHours: '',
    liveSessionWindows: '',
    expectedTraits: ['Brutal honesty on cuts', 'Thumbnail & title A/B testing'],
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
    setErrorMessage('');
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setChoice = (field, val) => {
    setErrorMessage('');
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === val ? '' : val,
    }));
  };

  const toggleTrait = (trait) => {
    setErrorMessage('');
    setFormData((prev) => {
      const exists = prev.expectedTraits.includes(trait);
      const next = exists
        ? prev.expectedTraits.filter((t) => t !== trait)
        : [...prev.expectedTraits, trait];
      return { ...prev, expectedTraits: next };
    });
  };

  // Check validation per step
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
      return formData.niche.trim() !== '' && formData.subscribers !== '' && formData.monthlyViews !== '';
    }
    if (currentStep === 2) {
      return formData.videosPosted !== '' && formData.timeline !== '';
    }
    if (currentStep === 3) {
      return formData.motivationAndSacrifice.trim().length >= 10;
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
    if (currentStep < 5) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      scrollToWizard();
    } else if (currentStep === 5) {
      handleSubmit();
    }
  };

  const goBack = () => {
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
      const { error } = await supabase.from('youtube_creator_applications').insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          country: formData.country,
          timezone: formData.timezone,
          niche: formData.niche,
          channel_url: formData.channelUrl,
          subscribers: formData.subscribers,
          monthly_views: formData.monthlyViews,
          videos_posted: formData.videosPosted,
          timeline: formData.timeline,
          upload_cadence: formData.uploadCadence,
          motivation_and_sacrifice: formData.motivationAndSacrifice,
          weekly_hours: formData.weeklyHours,
          live_session_windows: formData.liveSessionWindows,
          expected_traits: formData.expectedTraits,
          pod_expectations: formData.podExpectations,
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
      console.error('Error submitting YouTube application to Supabase:', err);
      setErrorMessage(err.message || 'Failed to submit your YouTube application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = useMemo(() => {
    if (currentStep >= CONFIRMATION_STEP) return 100;
    return Math.round(((currentStep + 1) / 6) * 100);
  }, [currentStep]);

  return (
    <main className="yt-apply-page">
      <FloatingSparkles count={20} />
      <div className="yt-wizard-shell">
        {/* Upper Section */}
        <header className="yt-upper-header">
          <div className="yt-top-nav">
            <Link to="/" className="yt-brand" aria-label="Guild Home">
              <img src="/guild-logo.png" alt="Guild" />
              <span>Guild</span>
            </Link>

            <Link to="/builder" className="yt-back-to-builder">
              ← Back to Lanes
            </Link>
          </div>

          {/* 3 Creators & 1 Weekly Upload Banner */}
          <div className="yt-pod-banner">
            <span className="yt-banner-pill">3 creators</span>
            <span className="yt-banner-dot" />
            <span>1 weekly upload ritual</span>
            <span className="yt-banner-dot" />
            <span>Zero excuses</span>
          </div>

          {/* Main Headline */}
          <h1 className="yt-wizard-title">
            YouTube Creator <em>Pod Application</em>
          </h1>
          <p className="yt-wizard-subtitle">
            Answer the 6 quick checks below. We curate tight 3-person pods at your subscriber tier who hold you accountable every single Sunday.
          </p>

          {/* Progress Tracker Bar & Steps (Only if not in final card) */}
          {currentStep < CONFIRMATION_STEP && (
            <div className="yt-tracker-wrap">
              <div className="yt-progress-line-track" aria-hidden="true">
                <motion.span
                  className="yt-progress-line-fill"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
                />
              </div>

              <div className="yt-step-tabs">
                {STEPS.map((s, idx) => {
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`yt-step-tab${isActive ? ' is-active' : ''}${isCompleted ? ' is-completed' : ''}`}
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

        {/* Card Stage */}
        <div className="yt-card-stage">
          <AnimatePresence mode="wait" custom={direction}>
            {/* CARD 0: Creator Identification */}
            {currentStep === 0 && (
              <motion.div
                key="card-0"
                className="yt-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="yt-card-header">
                  <div className="yt-card-header-copy">
                    <span className="yt-card-badge">Card 01 of 06</span>
                    <h2>Creator Identification</h2>
                    <p>Tell us who you are and what time zone you operate in.</p>
                  </div>
                  <span className="yt-step-count-pill">Basic Info</span>
                </div>

                <div className="yt-card-body">
                  <div className="yt-grid-2">
                    <div className="yt-field">
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

                    <div className="yt-field">
                      <label htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. maya@youtube.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="yt-field">
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

                    <div className="yt-field">
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

                <div className="yt-card-footer">
                  <span style={{ fontSize: '0.82rem', color: '#78716c' }}>
                    Step 1 of 5 • All fields required
                  </span>

                  <button
                    type="button"
                    className="yt-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Channel Niche & Metrics  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* CARD 1: Channel Niche & Audience Metrics */}
            {currentStep === 1 && (
              <motion.div
                key="card-1"
                className="yt-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="yt-card-header">
                  <div className="yt-card-header-copy">
                    <span className="yt-card-badge">Card 02 of 06</span>
                    <h2>Channel Niche & Audience Metrics</h2>
                    <p>We match channels in compatible stages so peer feedback is immediately useful.</p>
                  </div>
                  <span className="yt-step-count-pill">Audience Data</span>
                </div>

                <div className="yt-card-body">
                  <div className="yt-grid-2">
                    <div className="yt-field">
                      <label htmlFor="niche">What is your niche on YouTube?</label>
                      <input
                        id="niche"
                        name="niche"
                        type="text"
                        placeholder="e.g. AI tools breakdown, Tech documentaries, Gaming essays"
                        required
                        value={formData.niche}
                        onChange={handleChange}
                        autoFocus
                      />
                    </div>

                    <div className="yt-field">
                      <label htmlFor="channelUrl">
                        Channel URL or @Handle
                        <span className="opt">Recommended</span>
                      </label>
                      <input
                        id="channelUrl"
                        name="channelUrl"
                        type="text"
                        placeholder="e.g. @mayacreates or youtube.com/c/..."
                        value={formData.channelUrl}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Subscriber Count Buttons */}
                  <div className="yt-choice-group">
                    <span className="yt-choice-label">
                      <span>✦ How many subscribers have you got?</span>
                    </span>
                    <div className="yt-chip-grid">
                      {SUBSCRIBER_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`yt-chip-btn${formData.subscribers === opt ? ' is-active' : ''}`}
                          onClick={() => setChoice('subscribers', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Views Buttons */}
                  <div className="yt-choice-group">
                    <span className="yt-choice-label">
                      <span>✦ Monthly channel views (approx):</span>
                    </span>
                    <div className="yt-chip-grid">
                      {VIEW_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`yt-chip-btn${formData.monthlyViews === opt ? ' is-active' : ''}`}
                          onClick={() => setChoice('monthlyViews', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="yt-card-footer">
                  <button type="button" className="yt-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="yt-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Publishing Velocity  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* CARD 2: Publishing History & Velocity */}
            {currentStep === 2 && (
              <motion.div
                key="card-2"
                className="yt-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="yt-card-header">
                  <div className="yt-card-header-copy">
                    <span className="yt-card-badge">Card 03 of 06</span>
                    <h2>Publishing History & Velocity</h2>
                    <p>How many videos have you published, and over what timeline?</p>
                  </div>
                  <span className="yt-step-count-pill">Output Velocity</span>
                </div>

                <div className="yt-card-body">
                  {/* Videos posted buttons */}
                  <div className="yt-choice-group">
                    <span className="yt-choice-label">
                      <span>✦ Total public videos published so far:</span>
                    </span>
                    <div className="yt-chip-grid">
                      {VIDEO_COUNT_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`yt-chip-btn${formData.videosPosted === opt ? ' is-active' : ''}`}
                          onClick={() => setChoice('videosPosted', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Over what time buttons */}
                  <div className="yt-choice-group">
                    <span className="yt-choice-label">
                      <span>✦ Over what time period?</span>
                    </span>
                    <div className="yt-chip-grid">
                      {TIMELINE_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`yt-chip-btn${formData.timeline === opt ? ' is-active' : ''}`}
                          onClick={() => setChoice('timeline', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="yt-field">
                    <label htmlFor="uploadCadence">
                      Current or target upload cadence:
                      <span className="opt">e.g. 1 video every 7 days</span>
                    </label>
                    <input
                      id="uploadCadence"
                      name="uploadCadence"
                      type="text"
                      placeholder="e.g. 1 polished essay every Sunday evening"
                      value={formData.uploadCadence}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="yt-card-footer">
                  <button type="button" className="yt-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="yt-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Motivation & Sacrifice  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* CARD 3: Raw Motivation & Sacrifice */}
            {currentStep === 3 && (
              <motion.div
                key="card-3"
                className="yt-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="yt-card-header">
                  <div className="yt-card-header-copy">
                    <span className="yt-card-badge">Card 04 of 06</span>
                    <h2>Raw Motivation & Sacrifice</h2>
                    <p>Pods only thrive when all 3 creators show up with the exact same fire.</p>
                  </div>
                  <span className="yt-step-count-pill">Commitment Check</span>
                </div>

                <div className="yt-card-body">
                  <div className="yt-field">
                    <label htmlFor="motivationAndSacrifice">
                      How motivated are you and what are you willing to sacrifice? Give me your raw words.
                    </label>
                    <textarea
                      id="motivationAndSacrifice"
                      name="motivationAndSacrifice"
                      required
                      placeholder="Give it to us straight. What are you sacrificing (weekends, gaming, social outings) to make this channel work? Why does this matter so deeply to you right now?"
                      value={formData.motivationAndSacrifice}
                      onChange={handleChange}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="yt-card-footer">
                  <button type="button" className="yt-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="yt-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Availability  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* CARD 4: Time Commitment & Availability */}
            {currentStep === 4 && (
              <motion.div
                key="card-4"
                className="yt-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="yt-card-header">
                  <div className="yt-card-header-copy">
                    <span className="yt-card-badge">Card 05 of 06</span>
                    <h2>Time Commitment & Availability</h2>
                    <p>Pods run on focused hours and short live sessions — be realistic.</p>
                  </div>
                  <span className="yt-step-count-pill">Schedule</span>
                </div>

                <div className="yt-card-body">
                  <div className="yt-choice-group">
                    <span className="yt-choice-label">
                      <span>✦ How many focused hours per week can you realistically give this?</span>
                    </span>
                    <div className="yt-chip-grid">
                      {HOURS_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`yt-chip-btn${formData.weeklyHours === opt ? ' is-active' : ''}`}
                          onClick={() => setChoice('weeklyHours', opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="yt-field">
                    <label htmlFor="liveSessionWindows">
                      What&apos;s your timezone and which time windows usually work for short live sessions?
                      {formData.timezone && (
                        <span className="opt">Your TZ: {formData.timezone}</span>
                      )}
                    </label>
                    <p className="yt-field-hint">
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

                <div className="yt-card-footer">
                  <button type="button" className="yt-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="yt-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Pod Expectations  →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* CARD 5: Ideal Pod & Mutual Expectations */}
            {currentStep === 5 && (
              <motion.div
                key="card-5"
                className="yt-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="yt-card-header">
                  <div className="yt-card-header-copy">
                    <span className="yt-card-badge">Card 06 of 06</span>
                    <h2>Ideal Pod & Mutual Expectations</h2>
                    <p>What do you want your pod members to be, and what do you expect from them?</p>
                  </div>
                  <span className="yt-step-count-pill">Pod Pairing</span>
                </div>

                <div className="yt-card-body">
                  <div className="yt-choice-group">
                    <span className="yt-choice-label">
                      <span>✦ Traits you want in your 2 pod mates (select all that apply):</span>
                    </span>
                    <div className="yt-tags-group">
                      {POD_MEMBER_TRAITS.map((trait) => (
                        <button
                          key={trait}
                          type="button"
                          className={`yt-tag-pill${formData.expectedTraits.includes(trait) ? ' is-active' : ''}`}
                          onClick={() => toggleTrait(trait)}
                        >
                          <span>{formData.expectedTraits.includes(trait) ? '✓' : '+'}</span>
                          <span>{trait}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="yt-field">
                    <label htmlFor="podExpectations">
                      What do you want your pod members to be, how should they be, and what do you expect from them?
                    </label>
                    <textarea
                      id="podExpectations"
                      name="podExpectations"
                      required
                      placeholder="Tell us how you expect your pod mates to show up. Do you want them tearing down your thumbnail drafts? Auditing your retention graphs on Tuesday? Keeping you to the Sunday deadline?"
                      value={formData.podExpectations}
                      onChange={handleChange}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="yt-card-footer">
                  <button type="button" className="yt-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  {errorMessage && (
                    <p className="yt-submit-error" role="alert">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="button"
                    className="yt-btn-next"
                    disabled={!isStepValid || isSubmitting}
                    onClick={handleSubmit}
                  >
                    <span>{isSubmitting ? 'Curating Match...' : 'Submit YouTube Application  →'}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* CARD 5: FINAL CONFIRMATION CARD */}
            {currentStep === CONFIRMATION_STEP && (
              <motion.div
                key="card-5"
                className="yt-card yt-confirm-card"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <ApplicationSubmittedCard
                  theme="yt"
                  title="Application received — you're on the list."
                  subtitle="Thanks for trusting Guild."
                  description={
                    <>
                      Kairos is reviewing your channel niche (<strong>{formData.niche || 'YouTube'}</strong>), subscriber range (<strong>{formData.subscribers || 'Recorded'}</strong>), and weekly rhythm. We match creators on output velocity, not random chat energy.
                    </>
                  }
                  summaryRows={[
                    { label: 'Creator', value: formData.fullName || 'Registered Creator' },
                    { label: 'Pod Size', value: '3 creators per pod' },
                    { label: 'Subscribers', value: formData.subscribers || 'Standard tier' },
                    { label: 'Views', value: formData.monthlyViews || 'Standard tier' },
                    { label: 'Target Cadence', value: formData.uploadCadence || '1 weekly upload (Sunday)' },
                    { label: 'Weekly Hours', value: formData.weeklyHours || 'Committed' },
                  ]}
                  primaryBtnClass="yt-btn-primary"
                  backBtnClass="yt-btn-back"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
