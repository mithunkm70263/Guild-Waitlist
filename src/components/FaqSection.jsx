import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const faqItems = [
  {
    question: 'How does the matching process work?',
    answer:
      'You will fill out a short profile about your skills, goals, and what you want to build. Guild uses that to match you with people who have complementary skills, aligned goals, and similar working styles.',
  },
  {
    question: "What's the time commitment?",
    answer:
      'Most pods work best with 4-10 hours per week. That usually means one weekly check-in, a small shipping goal, and async support during the week.',
  },
  {
    question: "What happens if my pod isn't a good fit?",
    answer:
      'You are not locked in. If the energy, schedule, or goals feel wrong, we help you reset expectations or move into a better matched pod.',
  },
  {
    question: 'Is there a cost to join Guild?',
    answer:
      'The first cohort can be joined through the application flow. Pricing and cohort access are shown before you commit, so there are no surprise steps.',
  },
  {
    question: 'What kinds of projects do pods build?',
    answer:
      'Pods build apps, portfolios, AI tools, open-source projects, learning roadmaps, startup prototypes, and anything that benefits from steady feedback and accountability.',
  },
  {
    question: 'How do pod meetings and check-ins work?',
    answer:
      'Each pod gets a simple weekly rhythm: set goals, share progress, unblock each other, and ship something visible before the next check-in.',
  },
  {
    question: 'Can I join more than one pod?',
    answer:
      'Yes, but we recommend starting with one focused pod first. Once your schedule is steady, you can join another pod for a different goal or project.',
  },
];

const facts = [
  {
    label: 'Pods',
    value: '2-6 members',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="17" cy="17" r="7" />
        <circle cx="32" cy="15" r="6" />
        <path d="M6 39c1-9 7-13 14-13s13 4 14 13" />
        <path d="M26 27c6 0 11 4 12 12" />
      </svg>
    ),
  },
  {
    label: 'Commitment',
    value: '4-10 hrs/week',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="17" />
        <path d="M24 13v12l8 6" />
      </svg>
    ),
  },
  {
    label: 'Focus',
    value: 'Shipping together',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M32 5c-11 2-20 10-24 24l11 11c14-4 22-13 24-24 1-7-4-12-11-11Z" />
        <circle cx="31" cy="17" r="4" />
        <path d="M15 32 7 40" />
        <path d="M25 39 18 46" />
      </svg>
    ),
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <motion.section
      id="faq"
      className="faq-section"
      aria-labelledby="faq-title"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <span className="faq-orbit faq-orbit-one" aria-hidden="true" />
      <span className="faq-orbit faq-orbit-two" aria-hidden="true" />

      <div className="faq-layout">
        <motion.div
          className="faq-copy"
          variants={{
            hidden: { opacity: 0, x: -54, filter: 'blur(10px)' },
            visible: {
              opacity: 1,
              x: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.78, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          <motion.p
            className="faq-kicker"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.48 }}
          >
            FINAL CHECK
          </motion.p>
          <h2 id="faq-title" className="faq-title">
            Frequently
            <span>Asked</span>
            Questions
          </h2>
          <p className="faq-subtitle">Everything you need to know before joining a pod.</p>
          <span className="faq-title-mark" aria-hidden="true" />

          <div className="faq-facts" aria-label="Guild pod details">
            {facts.map((fact, index) => (
              <motion.div
                className="faq-fact"
                key={fact.label}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.48, delay: 0.18 + index * 0.08 }}
              >
                <span className="faq-fact-icon">{fact.icon}</span>
                <span className="faq-fact-label">{fact.label}</span>
                <span className="faq-fact-divider" />
                <span className="faq-fact-value">{fact.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="faq-list">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.article
                className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}
                key={item.question}
                variants={{
                  hidden: {
                    opacity: 0,
                    x: 72,
                    y: 26,
                    rotateX: -12,
                    filter: 'blur(10px)',
                  },
                  visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotateX: 0,
                    filter: 'blur(0px)',
                    transition: {
                      duration: 0.72,
                      delay: 0.14 + index * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                whileHover={{ y: isOpen ? 0 : -4, scale: 1.01 }}
              >
                <button
                  className="faq-question"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="faq-question-text">{item.question}</span>
                  <motion.span
                    className="faq-toggle"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.22 }}
                    aria-hidden="true"
                  >
                    {isOpen ? '-' : '+'}
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>

      <motion.div
        className="faq-cta-panel"
        initial={{ opacity: 0, y: 54, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.72, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="faq-cta-icon"
          animate={{ rotate: [0, -4, 0], y: [0, -5, 0] }}
          transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 56 56" aria-hidden="true">
            <path d="M14 42 42 14" />
            <path d="M21 14h21v21" />
          </svg>
        </motion.div>
        <div className="faq-cta-copy">
          <h3>Still have questions?</h3>
          <p>Jump in and start building with the right people.</p>
        </div>
        <motion.a
          href="/apply"
          className="faq-cta-button"
          whileHover={{ y: -5, scale: 1.04, rotate: -0.5 }}
          whileTap={{ scale: 0.96 }}
        >
          GET STARTED <span>-&gt;</span>
        </motion.a>
        <div className="faq-social-proof">
          <div className="faq-avatar-stack" aria-hidden="true">
            {[1, 2, 3, 4].map((avatar) => (
              <img key={avatar} src={`/avatar-${avatar}.png`} alt="" />
            ))}
          </div>
          <p>
            <strong>180+ builders</strong>
            already shipping in pods
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}
