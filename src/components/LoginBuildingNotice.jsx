import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LoginBuildingNotice() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: 'var(--bg-cream, #FAF6EE)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '36px 32px',
          background: '#ffffff',
          border: '3px solid #121212',
          borderRadius: '24px',
          boxShadow: '8px 8px 0 #F6B13B, 3px 3px 0 #121212',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(232, 111, 44, 0.1)',
            border: '1.5px solid #E86F2C',
            borderRadius: '999px',
            fontFamily: "var(--font-label, 'JetBrains Mono', monospace)",
            fontSize: '0.74rem',
            fontWeight: 800,
            color: '#E86F2C',
            letterSpacing: '0.06em',
            marginBottom: '18px',
          }}
        >
          <span>🚧 UNDER CONSTRUCTION</span>
        </div>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#121212',
            lineHeight: 1.25,
            marginBottom: '12px',
            letterSpacing: '-0.02em',
          }}
        >
          We are currently building this!
        </h1>

        <p
          style={{
            fontSize: '0.96rem',
            color: '#57534e',
            lineHeight: 1.6,
            marginBottom: '28px',
          }}
        >
          Member login and dedicated pod rooms will go live once pod matching is complete. Join the waitlist today to get matched with your 3/5 person circle.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Link
            to="/get-started"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              minHeight: '56px',
              padding: '16px 28px',
              background: '#121212',
              color: '#ffffff',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '1.02rem',
              textDecoration: 'none',
              border: '2px solid #121212',
              boxShadow: '4px 4px 0 #E86F2C',
              letterSpacing: '0.02em',
            }}
          >
            Join the Waitlist <span>→</span>
          </Link>

          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '52px',
              padding: '14px 28px',
              background: '#ffffff',
              color: '#121212',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '0.94rem',
              textDecoration: 'none',
              border: '2px solid #121212',
              boxShadow: '3px 3px 0 #121212',
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
