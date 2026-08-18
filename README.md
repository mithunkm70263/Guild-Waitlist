<p align="center">
  <img src="public/favicon.svg" alt="Guild Logo" width="72" />
</p>

<h1 align="center">Guild</h1>

<p align="center">
  <strong>Find your pod. Build in public. Ship together.</strong>
</p>

<p align="center">
  <a href="#-what-is-guild">What is Guild?</a> •
  <a href="#-the-problem">The Problem</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

---

## 🧭 What is Guild?

**Guild** is a peer-accountability platform designed for ambitious builders, learners, and creators who are tired of learning alone and never finishing what they start.

Guild matches you into a **5-person learning pod** — a small, focused group of people with shared goals, compatible schedules, and complementary skills. Together, you check in weekly, hold each other accountable, and **actually ship**.

> *"Most ambitious builders start alone… and most of them never finish."*
>
> Guild exists to change that.

---

## 🔥 The Problem

The stats paint a clear picture:

| Insight | Stat |
|---|---|
| Solo learners quit within 3 months | **87%** |
| Side projects that actually get finished | **12%** |
| Completion increase with accountability | **3×** |
| Shipping rate for builders in pods | **2.4×** more |

Learning alone means no feedback, no accountability, and invisible progress. Guild solves this by surrounding you with people who care about the same things you do.

---

## ⚙️ How It Works

Guild follows a simple three-step process:

### 01 → Apply
Share your goals, current skill level, and what you're building. Guild uses this to find your ideal pod.

### 02 → Get Matched
Our matching algorithm groups you with builders who share your ambitions, timeline, and energy. You'll meet your pod within days.

### 03 → Ship Together
Weekly check-ins, shared progress, real accountability. Your pod keeps you honest — and keeps you building.

---

## ✨ Features

- **🎯 Smart Pod Matching** — Matched by goals, skill level, and schedule compatibility
- **📅 Daily Momentum** — Your goals are broken into small, achievable daily tasks
- **🔁 Accountability Loop** — Weekly check-ins keep the pod honest without turning learning into homework
- **👥 5-Person Pods** — Small enough to build real trust, large enough for diverse perspectives
- **🚀 Build in Public** — Track progress, share wins, and ship alongside your pod
- **📊 Progress Tracking** — Visible, tangible progress that keeps motivation alive

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion 13](https://www.framer.com/motion/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Linting** | [OxLint](https://oxc-project.github.io/docs/guide/usage/linter.html) |
| **Fonts** | Sora, Hanken Grotesk, JetBrains Mono (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/mithunkm70263/Guild-MVP.git

# Navigate into the project
cd Guild-MVP/guild-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
guild-app/
├── public/                  # Static assets (illustrations, avatars, favicons)
├── src/
│   ├── assets/              # App-level assets (hero image, icons)
│   ├── components/
│   │   ├── Header.jsx           # Navigation bar with logo
│   │   ├── HeroSection.jsx      # Landing hero with CTA
│   │   ├── HeroIllustration.jsx # Animated hero artwork
│   │   ├── ProblemSolutionSection.jsx  # Problem stats + solution panels
│   │   ├── HowGuildWorksSection.jsx    # 3-step process cards
│   │   ├── FaqSection.jsx       # Frequently asked questions
│   │   └── ApplicationForm.jsx  # Multi-step pod application form
│   ├── App.jsx              # Root component & layout
│   ├── main.jsx             # Entry point with router setup
│   └── index.css            # Global styles & design tokens
├── index.html               # HTML shell
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies & scripts
```

---

## 🎨 Design Philosophy

Guild's interface is crafted with intention:

- **Warm cream backgrounds** — approachable, not cold
- **Bold typography** (Sora) — confidence without aggression
- **Micro-animations** — every element breathes and responds to interaction
- **Illustration-first storytelling** — the product explains itself visually before you read a word
- **Accessibility-first** — semantic HTML, ARIA labels, keyboard-navigable

---

<p align="center">
  <strong>Stop learning alone. Find your pod.</strong>
  <br />
  <a href="https://github.com/mithunkm70263/Guild-MVP">⭐ Star this repo</a> if you believe in building together.
</p>
