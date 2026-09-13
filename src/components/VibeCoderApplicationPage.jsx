import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import '../styles/vibe-coder-apply.css';

/* Ambient Sparkles */
const SPARKLE_CHARS = ['✦', '✧', '★', '⋆', '✶', '⚡', '·'];

function FloatingSparkles({ count = 18 }) {
  const [sparkles, setSparkles] = useState([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const items = Array.from({ length: count }, (_, i) => ({
      id: i,
      char: SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 8 + Math.random() * 14,
      delay: Math.random() * 4,
      dur: 3 + Math.random() * 5,
      opacity: 0.15 + Math.random() * 0.35,
    }));
    setSparkles(items);
  }, [count]);

  if (reduceMotion) return null;

  return (
    <div className="vc-sparkles-layer" aria-hidden="true">
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="vc-sparkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, s.opacity, 0],
            scale: [0, 1.25, 0],
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

const VIBE_CODING_STYLES = [
  {
    id: 'mostly_ai',
    title: 'I mostly accept AI code and keep prompting until it works',
    subtitle: 'Prompt-first explorer • High iteration velocity • Pure natural language flow',
  },
  {
    id: 'review_parts',
    title: 'I let AI write most of it but still review and clean important parts',
    subtitle: 'Balanced builder • Prompt-driven with careful code inspections & hygiene',
  },
  {
    id: 'heavy_ai_structure',
    title: 'I use AI heavily but still write/ structure a lot myself',
    subtitle: 'Architect & co-pilot • Deep architecture control with AI accelerator',
  },
];

const GOALS_OPTIONS = [
  {
    id: 'ship_public',
    title: 'Ship something public I can show people',
    desc: 'Get something live on the internet with a public link and proof of work.',
  },
  {
    id: 'useful_tools',
    title: 'Build useful tools just for myself',
    desc: 'Scratch my own daily itch with custom automations, scripts, and utilities.',
  },
  {
    id: 'learn_experiment',
    title: 'Learn and experiment with AI coding tools',
    desc: 'Push the boundary of what LLM tooling can do in rapid development.',
  },
  {
    id: 'creative_fun',
    title: 'Make something fun / creative',
    desc: 'Whimsical web experiments, interactive toys, games, and art.',
  },
  {
    id: 'users_money',
    title: 'Try to get users or make money from it',
    desc: 'Validate demand, launch on Product Hunt/X, and seek paying customers.',
  },
];

const EXPERIENCE_OPTIONS = [
  {
    id: 'just_started',
    title: 'Just started',
    desc: 'Curious explorer, prompt-first beginner getting feet wet.',
  },
  {
    id: 'built_few',
    title: 'Have built a few things',
    desc: 'Shipped a couple apps, hacks, or prototypes using AI tools.',
  },
  {
    id: 'comfortable',
    title: 'Pretty comfortable / do it regularly',
    desc: 'Daily driver with Cursor, Claude, Windsurf, or Bolt in complete flow state.',
  },
];

const HOURS_OPTIONS = [
  '4–6 hrs',
  '7–10 hrs',
  '10–15 hrs',
  '15+',
];

const POPULAR_TOOLS = [
  'Cursor',
  'Claude 3.7 / Sonnet',
  'Lovable',
  'Bolt.new',
  'Windsurf',
  'v0 by Vercel',
  'Replit Agent',
  'Supabase',
  'GitHub Copilot',
];

const ENERGY_OPTIONS = [
  {
    id: 'chill',
    title: 'Chill and supportive',
    desc: 'Positive encouragement, relaxed vibes, friendly check-ins, zero judgment.',
    badge: '🛋️ Relaxed Flow',
  },
  {
    id: 'direct',
    title: 'Direct and no-BS',
    desc: 'Honest code roasts, radical candor, straight-to-the-point debugging.',
    badge: '🎯 Sharp & Honest',
  },
  {
    id: 'high_energy',
    title: 'High-energy and pushy',
    desc: 'Daily hype, aggressive sprint milestones, fast feedback, push each other.',
    badge: '⚡ High Voltage',
  },
  {
    id: 'mix',
    title: 'Mix of feedback + vibes',
    desc: 'Constructive critique when stuck, celebration when shipping, fun atmosphere.',
    badge: '✨ Balanced Vibe',
  },
];

const STEPS = [
  { id: 'id', title: 'Builder ID', badge: 'Step 01 / 05' },
  { id: 'project', title: 'Project & Style', badge: 'Step 02 / 05' },
  { id: 'goals', title: 'Goals & Tools', badge: 'Step 03 / 05' },
  { id: 'time', title: 'Time & Windows', badge: 'Step 04 / 05' },
  { id: 'energy', title: 'Pod Energy', badge: 'Step 05 / 05' },
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

export default function VibeCoderApplicationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    timezone: '',
    handle: '',
    currentProject: '',
    codingStyle: 'I mostly accept AI code and keep prompting until it works',
    mainGoal: 'Ship something public I can show people',
    experienceLevel: 'Have built a few things',
    toolsUsed: ['Cursor', 'Claude 3.7 / Sonnet'],
    weeklyHours: '',
    liveSessionWindows: '',
    podEnergy: 'Mix of feedback + vibes',
    podExpectations: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setChoice = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const toggleTool = (tool) => {
    setFormData((prev) => {
      const exists = prev.toolsUsed.includes(tool);
      const next = exists
        ? prev.toolsUsed.filter((t) => t !== tool)
        : [...prev.toolsUsed, tool];
      return { ...prev, toolsUsed: next };
    });
  };

  const addProjectIdea = (ideaText) => {
    setFormData((prev) => ({
      ...prev,
      currentProject: prev.currentProject
        ? `${prev.currentProject}, ${ideaText}`
        : ideaText,
    }));
  };

  const isStepValid = useMemo(() => {
    if (currentStep === 0) {
      return (
        formData.fullName.trim() !== '' &&
        formData.email.trim() !== '' &&
        formData.country.trim() !== '' &&
        formData.timezone.trim() !== ''
      );
    }
    if (currentStep === 1) {
      return formData.currentProject.trim().length >= 8 && formData.codingStyle !== '';
    }
    if (currentStep === 2) {
      return formData.mainGoal !== '' && formData.experienceLevel !== '';
    }
    if (currentStep === 3) {
      return formData.weeklyHours !== '' && formData.liveSessionWindows.trim().length >= 10;
    }
    if (currentStep === 4) {
      return formData.podEnergy !== '';
    }
    return true;
  }, [currentStep, formData]);

  const goNext = () => {
    setErrorMessage('');
    if (currentStep < 4) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else if (currentStep === 4) {
      handleSubmit();
    }
  };

  const goBack = () => {
    setErrorMessage('');
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
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
      const { error } = await supabase.from('vibe_coder_applications').insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          country: formData.country,
          timezone: formData.timezone,
          handle: formData.handle || null,
          current_project: formData.currentProject,
          coding_style: formData.codingStyle,
          main_goal: formData.mainGoal,
          experience_level: formData.experienceLevel,
          tools_used: formData.toolsUsed,
          weekly_hours: formData.weeklyHours,
          live_session_windows: formData.liveSessionWindows,
          pod_energy: formData.podEnergy,
          pod_expectations: formData.podExpectations || null,
          submitted_at: submittedAt,
        },
      ]);

      if (error) {
        throw error;
      }

      localStorage.setItem(
        'guild-vibecoder-application',
        JSON.stringify({
          ...formData,
          submittedAt,
        })
      );

      setDirection(1);
      setCurrentStep(5);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting Vibe Coder application to Supabase:', err);
      setErrorMessage(err.message || 'Failed to submit your Vibe Coder application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = useMemo(() => {
    if (currentStep >= 5) return 100;
    return Math.round(((currentStep + 1) / 5) * 100);
  }, [currentStep]);

  return (
    <main className="vc-apply-page">
      <FloatingSparkles count={20} />
      <div className="vc-wizard-shell">
        <header className="vc-upper-header">
          <div className="vc-top-nav">
            <Link to="/" className="vc-brand" aria-label="Guild Home">
              <img src="/guild-logo.png" alt="Guild" />
              <span>Guild</span>
            </Link>

            <Link to="/builder" className="vc-back-to-builder">
              ← Back to Lanes
            </Link>
          </div>

          <div className="vc-pod-banner">
            <span className="vc-banner-pill">
              <span className="vc-pulse-dot" />
              Vibe Coder Pod
            </span>
            <span className="vc-banner-dot" />
            <span>3 Flow Hackers</span>
            <span className="vc-banner-dot" />
            <span>Zero Boilerplate</span>
          </div>

          <h1 className="vc-wizard-title">
            Vibe Coder <em>Pod Application</em>
          </h1>
          <p className="vc-wizard-subtitle">
            Skip boilerplate, build in flow state. Answer these 5 quick checks and Kairos will pair you with 2 fellow vibe coders shipping real projects every Sunday.
          </p>

          {currentStep < 5 && (
            <div className="vc-tracker-wrap">
              <div className="vc-progress-line-track" aria-hidden="true">
                <motion.span
                  className="vc-progress-line-fill"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>

              <div className="vc-step-tabs">
                {STEPS.map((s, idx) => {
                  const isActive = idx === currentStep;
                  const isCompleted = idx < currentStep;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`vc-step-tab${isActive ? ' is-active' : ''}${isCompleted ? ' is-completed' : ''}`}
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

        <div className="vc-card-stage">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 0: Basic Info Card */}
            {currentStep === 0 && (
              <motion.div
                key="card-0"
                className="vc-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="vc-card-header">
                  <div className="vc-card-header-copy">
                    <span className="vc-card-badge">Card 01 of 05 • Identification</span>
                    <h2>Builder Identification</h2>
                    <p>Tell us who you are and where you are building from.</p>
                  </div>
                  <span className="vc-step-count-pill">Basic Info</span>
                </div>

                <div className="vc-card-body">
                  <div className="vc-grid-2">
                    <div className="vc-field">
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="e.g. Alex Rivera"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        autoFocus
                      />
                    </div>

                    <div className="vc-field">
                      <label htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. alex@flowcode.dev"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="vc-field">
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
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="vc-field">
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
                          <option key={tz.value} value={tz.value}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="vc-field">
                    <label htmlFor="handle">
                      GitHub / X / Discord Handle{' '}
                      <span className="vc-field-hint">(Optional but helpful for pod pairing)</span>
                    </label>
                    <input
                      id="handle"
                      name="handle"
                      type="text"
                      placeholder="e.g. @alexvibes or alex#1234"
                      value={formData.handle}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="vc-card-footer">
                  <span style={{ fontSize: '0.82rem', color: '#78716c' }}>
                    Step 1 of 5 • All required fields marked
                  </span>

                  <button
                    type="button"
                    className="vc-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Project & Style →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 1: Project Idea & Vibe Coding Style */}
            {currentStep === 1 && (
              <motion.div
                key="card-1"
                className="vc-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="vc-card-header">
                  <div className="vc-card-header-copy">
                    <span className="vc-card-badge">Card 02 of 05 • The Sprint</span>
                    <h2>Project & Coding Style</h2>
                    <p>What are you building and how do you vibe code?</p>
                  </div>
                  <span className="vc-step-count-pill">The Build</span>
                </div>

                <div className="vc-card-body">
                  <div className="vc-field">
                    <label htmlFor="currentProject">
                      What are you currently vibe-coding (or want to vibe-code) in the next 5–6 weeks?
                    </label>
                    <p className="vc-field-hint">
                      Be specific — e.g. “A personal habit app”, “A small AI tool for X”, “A fun side project I can share”.
                    </p>
                    <textarea
                      id="currentProject"
                      name="currentProject"
                      placeholder="Describe what you want to build or prototype. What does it do? Who is it for?"
                      value={formData.currentProject}
                      onChange={handleChange}
                      autoFocus
                    />
                    <div className="vc-chips-row">
                      <span style={{ fontSize: '0.74rem', color: '#78716c', alignSelf: 'center' }}>
                        Quick inspiration:
                      </span>
                      {[
                        'Personal habit app',
                        'Small AI tool for creators',
                        'Fun side project to share on X',
                        'Chrome extension for tabs',
                        'Micro-SaaS with Stripe',
                        'Interactive audio visualizer',
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          className="vc-chip"
                          onClick={() => addProjectIdea(chip)}
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="vc-field">
                    <label>How do you usually vibe code?</label>
                    <div className="vc-choices-grid">
                      {VIBE_CODING_STYLES.map((style) => {
                        const isSelected = formData.codingStyle === style.title;
                        return (
                          <div
                            key={style.id}
                            className={`vc-choice-card${isSelected ? ' is-selected' : ''}`}
                            onClick={() => setChoice('codingStyle', style.title)}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === ' ' || e.key === 'Enter') {
                                e.preventDefault();
                                setChoice('codingStyle', style.title);
                              }
                            }}
                          >
                            <div className="vc-choice-radio">
                              {isSelected && <div className="vc-choice-radio-inner" />}
                            </div>
                            <div className="vc-choice-content">
                              <span className="vc-choice-title">{style.title}</span>
                              <span className="vc-choice-desc">{style.subtitle}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="vc-card-footer">
                  <button type="button" className="vc-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="vc-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Goals & Tools →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Goals & Experience */}
            {currentStep === 2 && (
              <motion.div
                key="card-2"
                className="vc-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="vc-card-header">
                  <div className="vc-card-header-copy">
                    <span className="vc-card-badge">Card 03 of 05 • Ambition</span>
                    <h2>Goals & Experience</h2>
                    <p>What is your north star right now, and which tools do you wield?</p>
                  </div>
                  <span className="vc-step-count-pill">Tooling</span>
                </div>

                <div className="vc-card-body">
                  <div className="vc-field">
                    <label>What’s your main goal right now?</label>
                    <div className="vc-choices-grid">
                      {GOALS_OPTIONS.map((g) => {
                        const isSelected = formData.mainGoal === g.title;
                        return (
                          <div
                            key={g.id}
                            className={`vc-choice-card${isSelected ? ' is-selected' : ''}`}
                            onClick={() => setChoice('mainGoal', g.title)}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === ' ' || e.key === 'Enter') {
                                e.preventDefault();
                                setChoice('mainGoal', g.title);
                              }
                            }}
                          >
                            <div className="vc-choice-radio">
                              {isSelected && <div className="vc-choice-radio-inner" />}
                            </div>
                            <div className="vc-choice-content">
                              <span className="vc-choice-title">{g.title}</span>
                              <span className="vc-choice-desc">{g.desc}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="vc-field">
                    <label>
                      How experienced are you with vibe coding tools (Cursor, Claude, Lovable, Bolt, Windsurf, etc.)?
                    </label>
                    <div className="vc-choices-grid">
                      {EXPERIENCE_OPTIONS.map((exp) => {
                        const isSelected = formData.experienceLevel === exp.title;
                        return (
                          <div
                            key={exp.id}
                            className={`vc-choice-card${isSelected ? ' is-selected' : ''}`}
                            onClick={() => setChoice('experienceLevel', exp.title)}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === ' ' || e.key === 'Enter') {
                                e.preventDefault();
                                setChoice('experienceLevel', exp.title);
                              }
                            }}
                          >
                            <div className="vc-choice-radio">
                              {isSelected && <div className="vc-choice-radio-inner" />}
                            </div>
                            <div className="vc-choice-content">
                              <span className="vc-choice-title">{exp.title}</span>
                              <span className="vc-choice-desc">{exp.desc}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="vc-field">
                    <label>
                      Which vibe coding tools are in your daily driver stack?{' '}
                      <span className="vc-field-hint">(Click to toggle)</span>
                    </label>
                    <div className="vc-tags-wrap">
                      {POPULAR_TOOLS.map((tool) => {
                        const active = formData.toolsUsed.includes(tool);
                        return (
                          <button
                            key={tool}
                            type="button"
                            className={`vc-tag-btn${active ? ' is-active' : ''}`}
                            onClick={() => toggleTool(tool)}
                          >
                            <span className="vc-tag-icon">{active ? '✓' : '+'}</span>
                            <span>{tool}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="vc-card-footer">
                  <button type="button" className="vc-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="vc-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Time & Windows →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Time Commitment & Live Session Windows */}
            {currentStep === 3 && (
              <motion.div
                key="card-3"
                className="vc-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="vc-card-header">
                  <div className="vc-card-header-copy">
                    <span className="vc-card-badge">Card 04 of 05 • Availability</span>
                    <h2>Time Commitment & Live Windows</h2>
                    <p>Pod matching depends on shared hours and focused cadence.</p>
                  </div>
                  <span className="vc-step-count-pill">Cadence</span>
                </div>

                <div className="vc-card-body">
                  <div className="vc-field">
                    <label>
                      How many focused hours per week can you realistically give this?
                    </label>
                    <div className="vc-tags-wrap">
                      {HOURS_OPTIONS.map((opt) => {
                        const active = formData.weeklyHours === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`vc-tag-btn${active ? ' is-active' : ''}`}
                            onClick={() => setChoice('weeklyHours', opt)}
                          >
                            <span className="vc-tag-icon">{active ? '✓' : '+'}</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="vc-field">
                    <label htmlFor="liveSessionWindows">
                      What&apos;s your timezone and which time windows usually work for short live sessions?
                      {formData.timezone && (
                        <span className="vc-field-hint"> Your TZ: {formData.timezone}</span>
                      )}
                    </label>
                    <p className="vc-field-hint">
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

                <div className="vc-card-footer">
                  <button type="button" className="vc-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="vc-btn-next"
                    disabled={!isStepValid}
                    onClick={goNext}
                  >
                    <span>Next: Pod Energy →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Pod Energy & Culture */}
            {currentStep === 4 && (
              <motion.div
                key="card-4"
                className="vc-card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <div className="vc-card-header">
                  <div className="vc-card-header-copy">
                    <span className="vc-card-badge">Card 05 of 05 • Chemistry</span>
                    <h2>Pod Energy & Expectations</h2>
                    <p>What kind of vibe do you want in your circle?</p>
                  </div>
                  <span className="vc-step-count-pill">Culture</span>
                </div>

                <div className="vc-card-body">
                  <div className="vc-field">
                    <label>What kind of energy do you want in the group?</label>
                    <div className="vc-choices-grid">
                      {ENERGY_OPTIONS.map((energy) => {
                        const isSelected = formData.podEnergy === energy.title;
                        return (
                          <div
                            key={energy.id}
                            className={`vc-choice-card${isSelected ? ' is-selected' : ''}`}
                            onClick={() => setChoice('podEnergy', energy.title)}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === ' ' || e.key === 'Enter') {
                                e.preventDefault();
                                setChoice('podEnergy', energy.title);
                              }
                            }}
                          >
                            <div className="vc-choice-radio">
                              {isSelected && <div className="vc-choice-radio-inner" />}
                            </div>
                            <div className="vc-choice-content">
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                <span className="vc-choice-title">{energy.title}</span>
                                <span style={{ fontSize: '0.72rem', color: '#8736d8', fontWeight: 700 }}>
                                  {energy.badge}
                                </span>
                              </div>
                              <span className="vc-choice-desc">{energy.desc}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="vc-field">
                    <label htmlFor="podExpectations">
                      What do you expect from your 2 pod mates and Guild?{' '}
                      <span className="vc-field-hint">(Wishlist, boundaries, or dealbreakers)</span>
                    </label>
                    <textarea
                      id="podExpectations"
                      name="podExpectations"
                      placeholder="e.g. Screen-sharing builds when stuck, testing each other's live links before Sunday ships, keeping each other accountable without ego..."
                      value={formData.podExpectations}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="vc-card-footer">
                  <button type="button" className="vc-btn-back" onClick={goBack}>
                    ← Back
                  </button>

                  {errorMessage && (
                    <p className="vc-submit-error" role="alert">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="button"
                    className="vc-btn-next"
                    disabled={!isStepValid || isSubmitting}
                    onClick={handleSubmit}
                  >
                    <span>{isSubmitting ? 'Curating Match...' : 'Submit Vibe Coder Application →'}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Success Confirmation Screen */}
            {currentStep === 5 && (
              <motion.div
                key="card-5"
                className="vc-card vc-confirm-card"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="vc-confirm-spark">⚡</div>

                <h2 className="vc-confirm-title">
                  We will match you with two vibe coders within 24 hours.
                </h2>
                <p className="vc-confirm-subtitle">
                  ✦ Welcome to the flow state circle ✦
                </p>

                <p className="vc-confirm-desc">
                  Kairos is matching you with 2 fellow builders based on your focus ({' '}
                  <strong>{formData.weeklyHours}</strong>), coding style, and shared time windows ({' '}
                  <strong>{formData.timezone}</strong>). You will receive an invitation to your dedicated pod room.
                </p>

                <div className="vc-confirm-summary">
                  <h4>✦ Your Pod Match Profile:</h4>
                  <div className="vc-confirm-grid">
                    <div className="vc-confirm-row">
                      <strong>Builder:</strong>
                      <span>{formData.fullName || 'Flow Hacker'}</span>
                    </div>
                    <div className="vc-confirm-row">
                      <strong>Pod Size:</strong>
                      <span>3 vibe coders per pod</span>
                    </div>
                    <div className="vc-confirm-row">
                      <strong>Main Goal:</strong>
                      <span>{formData.mainGoal}</span>
                    </div>
                    <div className="vc-confirm-row">
                      <strong>Weekly Hours:</strong>
                      <span>{formData.weeklyHours || 'Committed'}</span>
                    </div>
                    <div className="vc-confirm-row">
                      <strong>Pod Energy:</strong>
                      <span>{formData.podEnergy}</span>
                    </div>
                    <div className="vc-confirm-row">
                      <strong>Stack Highlight:</strong>
                      <span>{formData.toolsUsed.slice(0, 3).join(', ') || 'AI Native'}</span>
                    </div>
                  </div>
                </div>

                <div className="vc-confirm-actions">
                  <Link to="/dashboard" className="vc-btn-dashboard">
                    Enter Builder Dashboard →
                  </Link>
                  <Link to="/builder" className="vc-btn-back">
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
