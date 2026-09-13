import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ApplicationForm from './components/ApplicationForm.jsx';
import GetStartedPage from './components/GetStartedPage.jsx';
import BuilderTracksPage from './components/BuilderTracksPage.jsx';
import VibeCoderApplicationPage from './components/VibeCoderApplicationPage.jsx';
import YouTubeApplicationPage from './components/YouTubeApplicationPage.jsx';
import AISaaSApplicationPage from './components/AISaaSApplicationPage.jsx';
import AIAppApplicationPage from './components/AIAppApplicationPage.jsx';
import LoginBuildingNotice from './components/LoginBuildingNotice.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/builder" element={<BuilderTracksPage />} />
        <Route path="/builder/vibecoder" element={<VibeCoderApplicationPage />} />
        <Route path="/builder/youtube" element={<YouTubeApplicationPage />} />
        <Route path="/builder/ai-saas" element={<AISaaSApplicationPage />} />
        <Route path="/builder/ai-app" element={<AIAppApplicationPage />} />
        <Route path="/login" element={<LoginBuildingNotice />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
