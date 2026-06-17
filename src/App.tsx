import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Spotlight from './components/Spotlight';
import SmoothScroll from './components/SmoothScroll';
import Dashboard from './components/admin/Dashboard';

import {
  initialHero, initialAbout, initialProjects,
  initialExperience, initialSkills, initialStats, initialSettings
} from './data/initialData';
import type {
  HeroData, AboutData, ProjectData, ExperienceData, SkillData, StatData, SettingsData
} from './data/initialData';

export default function App() {
  // Locale state - Indonesian as default
  const [lang, setLang] = useState<'en' | 'id'>('id');
  // Theme state ('dark' or 'light')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  // Admin view toggle state (activated via /admin or #admin url path)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(
    window.location.pathname === '/admin' || window.location.hash === '#admin'
  );

  // Portfolio states
  const [hero, setHero] = useState<HeroData>(initialHero);
  const [about, setAbout] = useState<AboutData>(initialAbout);
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [experiences, setExperiences] = useState<ExperienceData[]>(initialExperience);
  const [skills, setSkills] = useState<SkillData[]>(initialSkills);
  const [stats, setStats] = useState<StatData[]>(initialStats);
  const [settings, setSettings] = useState<SettingsData>(initialSettings);

  const [loading, setLoading] = useState(true);

  const apiHost = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

  const fetchPortfolioData = async () => {
    try {
      const res = await fetch(`${apiHost}/api/portfolio`);
      if (res.ok) {
        const data = await res.json();
        if (data.hero) setHero(data.hero);
        if (data.about) setAbout(data.about);
        if (data.projects && data.projects.length > 0) setProjects(data.projects);
        if (data.experiences && data.experiences.length > 0) setExperiences(data.experiences);
        if (data.skills && data.skills.length > 0) setSkills(data.skills);
        if (data.stats && data.stats.length > 0) setStats(data.stats);
        if (data.settings) setSettings(data.settings);
      }
    } catch (err) {
      console.warn('Backend server not reachable, using offline default/cached data.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  useEffect(() => {
    const handleUrlChange = () => {
      setIsAdminMode(
        window.location.pathname === '/admin' || window.location.hash === '#admin'
      );
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // Initial check
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">
            Loading Portofolio...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface select-none relative">
      {/* Background Static Grid */}
      <div id="bg-grid" />

      {/* Interactive Cursor Spotlight */}
      <Spotlight />

      {/* Floating Header */}
      <Navbar
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        settings={settings}
      />

      {/* Main Container */}
      <AnimatePresence mode="wait">
        {isAdminMode ? (
          <motion.main
            key="admin-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Dashboard
              portfolioData={{ hero, about, projects, experiences, skills, stats, settings }}
              refreshData={fetchPortfolioData}
              lang={lang}
            />
          </motion.main>
        ) : (
          <motion.main
            key="portfolio-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Lenis Smooth Inertial Scroll wrapper */}
            <SmoothScroll>
              <Hero data={hero} lang={lang} />
              <About data={about} lang={lang} />
              <Skills skills={skills} lang={lang} settings={settings} />
              <Projects projects={projects} lang={lang} settings={settings} />
              <Experience experiences={experiences} lang={lang} settings={settings} />
              <Stats stats={stats} lang={lang} />
              <Contact lang={lang} settings={settings} />
              <Footer lang={lang} settings={settings} />
            </SmoothScroll>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
