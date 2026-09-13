import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Header() {
  const [showBuildingToast, setShowBuildingToast] = useState(false);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowBuildingToast(true);
    setTimeout(() => {
      setShowBuildingToast(false);
    }, 4500);
  };

  return (
    <>
      <motion.header
        className="header"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link to="/" className="header-logo" aria-label="Guild home">
          <img
            src="/guild-logo.png"
            alt="Guild"
            className="header-logo-icon"
            width="72"
            height="72"
          />
          <span className="header-logo-text">Guild</span>
        </Link>

        <nav className="header-nav" aria-label="Primary navigation">
          <motion.a
            href="#how-guild-works"
            className="btn-how"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            SEE HOW GUILD WORKS
          </motion.a>
          <motion.a
            href="#faq"
            className="btn-faq"
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            FAQ
          </motion.a>
          <motion.div
            whileHover={{ y: -2, scale: 1.03, rotate: -0.5 }}
            whileTap={{ scale: 0.96 }}
            style={{ display: 'inline-flex' }}
          >
            <button
              type="button"
              onClick={handleLoginClick}
              className="btn-login"
              style={{
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
              }}
              title="Click to check login status"
            >
              LOG IN
            </button>
          </motion.div>
          <motion.div
            whileHover={{ y: -2, scale: 1.03, rotate: 0.5 }}
            whileTap={{ scale: 0.96 }}
            style={{ display: 'inline-flex' }}
          >
            <Link
              to="/get-started"
              className="btn-join"
            >
              JOIN THE GUILD
            </Link>
          </motion.div>
        </nav>
      </motion.header>

      {/* Building Notice Toast / Modal */}
      <AnimatePresence>
        {showBuildingToast && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 26 }}
            style={{
              position: 'fixed',
              top: '84px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              maxWidth: '92vw',
              width: '460px',
              background: '#ffffff',
              border: '2.5px solid #121212',
              borderRadius: '16px',
              padding: '16px 20px',
              boxShadow: '6px 6px 0 #F6B13B, 2px 2px 0 #121212',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🚧</span>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    color: '#121212',
                    fontFamily: "var(--font-heading, 'Plus Jakarta Sans', sans-serif)",
                  }}
                >
                  We are currently building it!
                </p>
                <p
                  style={{
                    margin: '3px 0 0',
                    fontSize: '0.8rem',
                    color: '#57534e',
                    lineHeight: 1.4,
                  }}
                >
                  Member login and pod rooms will open once matching begins. Reserve your spot by joining the waitlist!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBuildingToast(false)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.1rem',
                color: '#78716c',
                padding: '4px',
                flexShrink: 0,
              }}
              aria-label="Close notification"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
