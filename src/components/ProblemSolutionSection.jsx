import { motion } from 'framer-motion';

const panelVariants = {
  hidden: { opacity: 0, y: 44, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const statCards = [
  {
    icon: 'down',
    tone: 'alone',
    tag: 'Learning alone',
    text: (
      <>
        <strong>87%</strong> of solo
        <br />
        learners quit
        <br />
        within 3 months
      </>
    ),
  },
  {
    icon: 'pie',
    tone: 'alone',
    tag: 'Learning alone',
    text: (
      <>
        Only <strong>12%</strong>
        <br />
        finish their
        <br />
        side project
      </>
    ),
  },
  {
    icon: 'growth',
    tone: 'team',
    tag: 'Learning with team',
    text: (
      <>
        Accountability
        <br />
        increases
        <br />
        completion by <strong>3x</strong>
      </>
    ),
  },
  {
    icon: 'rocket',
    tone: 'team',
    tag: 'Learning with team',
    text: (
      <>
        Builders in
        <br />
        pods ship
        <br />
        <strong>2.4x</strong> more
      </>
    ),
  },
];

function StatIcon({ type }) {
  if (type === 'down') {
    return (
      <svg viewBox="0 0 92 74" aria-hidden="true">
        <path d="M10 12 35 39 50 25 82 58" />
        <path d="M63 58h19V39" />
      </svg>
    );
  }

  if (type === 'pie') {
    return (
      <svg viewBox="0 0 92 74" aria-hidden="true">
        <path className="pie-fill" d="M46 8a28 28 0 1 0 28 28H46Z" />
        <path d="M52 6v27h28A28 28 0 0 0 52 6Z" />
      </svg>
    );
  }

  if (type === 'growth') {
    return (
      <svg viewBox="0 0 92 74" aria-hidden="true">
        <path d="M10 58 33 35l15 13 33-36" />
        <path d="M58 12h23v23" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 92 74" aria-hidden="true">
      <path className="rocket-body" d="M58 9c-18 3-32 15-39 36l14 14c21-7 33-21 36-39 1-6-5-12-11-11Z" />
      <path d="M22 47 10 58l4 4 13-7" />
      <path d="M40 64 31 71l-4-4 11-12" />
      <circle cx="52" cy="26" r="7" />
    </svg>
  );
}

export default function ProblemSolutionSection() {
  return (
    <section id="how-it-works" className="problem-solution" aria-labelledby="problem-title">
      <motion.div
        className="problem-copy"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.h2
          id="problem-title"
          className="problem-title"
          initial={{ opacity: 0, letterSpacing: '0.02em', scale: 0.96 }}
          whileInView={{ opacity: 1, letterSpacing: '0em', scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="problem-title-line"
            initial={{ opacity: 0, y: 54, rotateX: -18, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            The Problem of
          </motion.span>
          <motion.span
            className="problem-title-line problem-title-accent"
            initial={{ opacity: 0, y: 58, rotateX: -18, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.78, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            Learning Alone
          </motion.span>
        </motion.h2>
        <motion.p
          className="problem-subtitle"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, delay: 0.16 }}
        >
          Most ambitious builders start alone... and most of them never finish.
        </motion.p>
      </motion.div>

      <div className="story-panels">
        <motion.article
          className="story-panel story-panel-problem"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.28 }}
          whileHover={{ y: -8, rotate: -0.6 }}
        >
          <img src="/problem-panel.png" alt="The problem: a solo builder learning alone with no feedback, no accountability, and invisible progress." />
          <span className="panel-glow panel-glow-problem" />
        </motion.article>

        <motion.article
          className="story-panel story-panel-solution"
          variants={panelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.28 }}
          transition={{ delay: 0.12 }}
          whileHover={{ y: -8, rotate: 0.6 }}
        >
          <img src="/solution-panel.png" alt="The solution: builders working together with feedback, shared goals, weekly check-ins, and shipping." />
          <span className="panel-glow panel-glow-solution" />
        </motion.article>
      </div>

      <div className="stat-grid" aria-label="Learning alone compared with building in pods">
        {statCards.map((card, index) => (
          <motion.div
            className={`stat-card stat-card-${card.tone}`}
            key={card.icon}
            initial={{ opacity: 0, y: 32, rotate: index % 2 ? 0.8 : -0.8 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.03 }}
          >
            <span className="stat-tag">{card.tag}</span>
            <motion.div
              className={`stat-icon stat-icon-${card.icon}`}
              animate={{ y: [0, -5, 0], rotate: [0, index % 2 ? 2 : -2, 0] }}
              transition={{ duration: 2.8 + index * 0.24, repeat: Infinity, ease: 'easeInOut' }}
            >
              <StatIcon type={card.icon} />
            </motion.div>
            <p>{card.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
