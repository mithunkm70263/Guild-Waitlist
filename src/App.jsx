import Header from './components/Header';
import FaqSection from './components/FaqSection';
import HeroSection from './components/HeroSection';
import HowGuildWorksSection from './components/HowGuildWorksSection';
import ProblemSolutionSection from './components/ProblemSolutionSection';

/**
 * App - Main application component
 * Structure matches the reference image exactly:
 * 1. Header (logo + nav buttons)
 * 2. Hero section (illustration + text)
 * 3. Problem / solution section
 * 4. How Guild works section
 * 5. FAQ section
 */
export default function App() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-cream)' }}
    >
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProblemSolutionSection />
        <HowGuildWorksSection />
        <FaqSection />
      </main>
    </div>
  );
}
