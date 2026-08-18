import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const DEFAULT_MESSAGES = ["I'm Kairos. Your Guild gateway is open."];

export default function KairosMascot({
  messages = DEFAULT_MESSAGES,
  wrapperClassName = 'kairos-wrapper-brutal',
  cycleMessages = false,
  cycleInterval = 4200,
  bubbleDelay = 800,
}) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      setShowBubble(true);
    }, bubbleDelay);

    return () => window.clearTimeout(initialTimer);
  }, [bubbleDelay]);

  useEffect(() => {
    if (!cycleMessages || messages.length <= 1 || !showBubble) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setMsgIndex((current) => (current + 1) % messages.length);
    }, cycleInterval);

    return () => window.clearInterval(interval);
  }, [cycleMessages, cycleInterval, messages.length, showBubble]);

  return (
    <div className={wrapperClassName}>
      <motion.div
        className="kairos-orbit kairos-orbit-one"
        aria-hidden="true"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="kairos-orbit kairos-orbit-two"
        aria-hidden="true"
        animate={{ rotate: -360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />
      <AnimatePresence mode="wait">
        {showBubble && (
          <motion.div
            className="kairos-speech-bubble-brutal"
            key={msgIndex}
            initial={{ opacity: 0, scale: 0.2, y: 30, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: -10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20, mass: 1 }}
          >
            <span>{messages[msgIndex]}</span>
            <div className="bubble-tail-brutal" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="kairos-stage-brutal"
        initial={{ opacity: 0, y: 60, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
      >
        <img
          src="/kairos.png"
          alt="Kairos avatar"
          className="kairos-avatar-brutal"
        />
        <span className="kairos-face-glow" aria-hidden="true" />
        <span className="kairos-blink kairos-blink-left" aria-hidden="true" />
        <span className="kairos-blink kairos-blink-right" aria-hidden="true" />
        <span className="kairos-scanline" aria-hidden="true" />
      </motion.div>
    </div>
  );
}
