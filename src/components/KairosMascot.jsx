import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const DEFAULT_MESSAGES = [
  "Hey! I'm Kairos — your Guild gateway is open.",
  'Find your pod. Build in public.',
  "I'll connect you with the finest people in the world.",
];

const DEFAULT_POSES = [
  { src: '/kairos.png', label: 'Kairos greeting you' },
  { src: '/kairos-focus.png', label: 'Kairos building at a laptop' },
  { src: '/kairos-cheer.png', label: 'Kairos cheering you on' },
];

export default function KairosMascot({
  messages = DEFAULT_MESSAGES,
  poses = DEFAULT_POSES,
  wrapperClassName = 'kairos-wrapper-brutal',
  tone = 'dark',
  cycleMessages = false,
  cyclePoses = false,
  cycleInterval = 4200,
  bubbleDelay = 800,
}) {
  const reduceMotion = useReducedMotion();
  const [msgIndex, setMsgIndex] = useState(0);
  const [poseIndex, setPoseIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const shouldCycle = !reduceMotion && (cycleMessages || cyclePoses);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      setShowBubble(true);
    }, reduceMotion ? 0 : bubbleDelay);

    return () => window.clearTimeout(initialTimer);
  }, [bubbleDelay, reduceMotion]);

  useEffect(() => {
    if (!shouldCycle || !showBubble) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      if (cycleMessages && messages.length > 1) {
        setMsgIndex((current) => (current + 1) % messages.length);
      }
      if (cyclePoses && poses.length > 1) {
        setPoseIndex((current) => (current + 1) % poses.length);
      }
    }, cycleInterval);

    return () => window.clearInterval(interval);
  }, [cycleInterval, cycleMessages, cyclePoses, messages.length, poses.length, shouldCycle, showBubble]);

  const pose = poses[poseIndex] ?? poses[0];

  return (
    <div className={`kairos-mascot kairos-mascot--${tone} ${wrapperClassName}`}>
      <span className="kairos-orbit kairos-orbit-one" aria-hidden="true" />
      <span className="kairos-orbit kairos-orbit-two" aria-hidden="true" />
      <span className="kairos-spark kairos-spark-one" aria-hidden="true" />
      <span className="kairos-spark kairos-spark-two" aria-hidden="true" />
      <span className="kairos-spark kairos-spark-three" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {showBubble && (
          <motion.div
            className="kairos-speech-bubble-brutal"
            key={msgIndex}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.72, y: 18, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.86, y: -8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22, mass: 0.9 }}
          >
            <span>{messages[msgIndex]}</span>
            <div className="bubble-tail-brutal" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="kairos-stage-brutal"
        initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.86 }}
        animate={
          reduceMotion
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 1, y: [0, -10, 0], scale: 1, rotate: [-0.6, 0.8, -0.6] }
        }
        transition={
          reduceMotion
            ? { duration: 0.2 }
            : {
                opacity: { duration: 0.55, type: 'spring', bounce: 0.42 },
                y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
              }
        }
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={pose.src}
            src={pose.src}
            alt={pose.label}
            className="kairos-avatar-brutal"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, x: 18 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.94, x: -16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            draggable={false}
          />
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
