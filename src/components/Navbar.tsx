import { useState, useEffect } from 'react';
import { LogOut, Menu, X, Globe, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  lang: 'en' | 'id';
  setLang: (lang: 'en' | 'id') => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  settings: any;
}

export default function Navbar({ isAdminMode, setIsAdminMode, lang, setLang, theme, setTheme, settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['work', 'experience', 'skills', 'contact', 'about'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const targetElement = document.getElementById(id);
    if (targetElement) {
      const navHeight = 80;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  };

  const navLinks = [
    { id: 'work', labelEn: 'Work', labelId: 'Proyek' },
    { id: 'experience', labelEn: 'Experience', labelId: 'Pengalaman' },
    { id: 'skills', labelEn: 'Skills', labelId: 'Keahlian' },
    { id: 'contact', labelEn: 'Contact', labelId: 'Hubungi' },
  ];

  return (
    <nav
      className="fixed top-0 w-full z-50 bg-background/40 backdrop-blur-md border-b border-white/5 transition-all duration-300 h-16 md:h-20"
      id="navbar"
    >
      <div className={`flex justify-between items-center px-gutter py-md ${isAdminMode ? 'max-w-[1500px]' : 'max-w-container-max'} mx-auto h-full`}>
        {/* Logo */}
        <div 
          onClick={() => {
            if (isAdminMode) {
              setIsAdminMode(false);
              window.history.pushState({}, '', '/');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-headline-md font-bold text-on-surface cursor-pointer select-none tracking-tight hover:text-primary transition-colors flex items-center gap-2"
        >
          <span className="text-gradient font-extrabold font-display">{settings.logo_text || 'PortoNaila'}</span>
        </div>

        {/* Desktop Links */}
        {!isAdminMode && (
          <div className="hidden md:flex items-center gap-xl font-body-md text-body-md">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                className={`transition-colors font-medium ${
                  activeSection === link.id
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {lang === 'en' ? link.labelEn : link.labelId}
              </button>
            ))}
          </div>
        )}

        {/* Global Controls */}
        <div className="flex items-center gap-md">
          {/* Language Selector */}
          <button
            onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
            className="flex items-center gap-1 text-on-surface-variant hover:bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 transition-all hover:border-primary/20 text-xs font-semibold uppercase"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'EN' : 'ID'}</span>
          </button>

          {/* Theme Selector */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center text-on-surface-variant hover:bg-white/5 p-2 rounded-lg border border-white/5 transition-all hover:border-primary/20"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Admin Toggle - Only visible when in admin mode to allow exiting */}
          {isAdminMode && (
            <button
              onClick={() => {
                setIsAdminMode(false);
                window.history.pushState({}, '', '/');
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border text-xs font-bold transition-all bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit CMS</span>
            </button>
          )}

          {/* Mobile Menu Icon */}
          {!isAdminMode && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-on-surface hover:bg-white/5 rounded-lg transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {!isAdminMode && mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-background/95 backdrop-blur-lg border-b border-white/5 flex flex-col p-lg gap-md md:hidden animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScrollTo(link.id)}
              className={`text-left py-2 font-medium text-lg ${
                activeSection === link.id ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {lang === 'en' ? link.labelEn : link.labelId}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
