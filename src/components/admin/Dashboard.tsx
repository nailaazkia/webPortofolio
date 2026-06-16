import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Briefcase, Award, Sparkles, Mail, Trash2, 
  Edit, Save, Upload, ShieldAlert, KeyRound, Loader2,
  Settings
} from 'lucide-react';
import type { HeroData, AboutData, ProjectData, ExperienceData, SkillData, StatData, ContactMessage, SettingsData } from '../../data/initialData';
import confetti from 'canvas-confetti';
import { getTechIconUrl, hasTechIcon } from '../../utils/techIcons';

interface DashboardProps {
  portfolioData: {
    hero: HeroData;
    about: AboutData;
    projects: ProjectData[];
    experiences: ExperienceData[];
    skills: SkillData[];
    stats: StatData[];
    settings: SettingsData;
  };
  refreshData: () => Promise<void>;
  lang: 'en' | 'id';
}

export default function Dashboard({ portfolioData, refreshData, lang }: DashboardProps) {
  // Passcode gate state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab state
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'projects' | 'experiences' | 'skills' | 'stats' | 'messages' | 'settings'>('hero');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // General loader state for actions
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form states for edits
  const [heroForm, setHeroForm] = useState<HeroData>(portfolioData.hero);
  const [aboutForm, setAboutForm] = useState<AboutData>(portfolioData.about);
  const [settingsForm, setSettingsForm] = useState<SettingsData>(portfolioData.settings);
  
  // Projects editing
  const [projectForm, setProjectForm] = useState<Partial<ProjectData>>({
    title: '', description_en: '', description_id: '', tags: [], image_url: '', demo_url: '', case_study_en: '', case_study_id: ''
  });
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [newTagInput, setNewTagInput] = useState('');

  // Experiences editing
  const [expForm, setExpForm] = useState<Partial<ExperienceData>>({
    period: '', role_en: '', role_id: '', company: '', description_en: '', description_id: ''
  });
  const [editingExpId, setEditingExpId] = useState<number | null>(null);

  // Skills editing
  const [skillForm, setSkillForm] = useState<Partial<SkillData>>({
    name: '', icon_name: '', category: 'frontend', proficiency: 0
  });
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);

  // Stats editing
  const [statForm, setStatForm] = useState<Partial<StatData>>({
    value: '', label_en: '', label_id: ''
  });
  const [editingStatId, setEditingStatId] = useState<number | null>(null);

  // Setup initial form values when portfolioData updates
  useEffect(() => {
    if (portfolioData.hero) setHeroForm(portfolioData.hero);
    if (portfolioData.about) setAboutForm(portfolioData.about);
    if (portfolioData.settings) setSettingsForm(portfolioData.settings);
  }, [portfolioData]);

  // Load messages if tab is messages
  useEffect(() => {
    if (activeTab === 'messages' && isAuthenticated) {
      fetchMessages();
    }
  }, [activeTab, isAuthenticated]);

  const apiHost = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`${apiHost}/api/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const msgUint8 = new TextEncoder().encode(passcode);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // SHA-256 hash of 'Pandacute1234'
      if (hashHex === '8dc8a385d3161c31a4195a5cb7b0aea23d09bc7413ffda802ecc7a9d926557fe') {
        setIsAuthenticated(true);
        setAuthError('');
        // Dynamic success trigger
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.6 },
          colors: ['#d946ef', '#f472b6'],
        });
      } else {
        setAuthError(lang === 'en' ? 'Incorrect passcode.' : 'Kode akses salah.');
      }
    } catch (err) {
      setAuthError(lang === 'en' ? 'Encryption error occurred.' : 'Terjadi kesalahan enkripsi.');
    }
  };

  // Base64 helper for local file uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'hero' | 'project') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (target === 'hero') {
          setHeroForm(prev => ({ ...prev, portrait_url: base64String }));
        } else {
          setProjectForm(prev => ({ ...prev, image_url: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // SAVE Hero Details
  const saveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setActionError(null);
    try {
      const res = await fetch(`${apiHost}/api/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroForm),
      });
      if (res.ok) {
        await refreshData();
        triggerConfetti();
      } else {
        throw new Error('Failed to update hero details');
      }
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // SAVE About Details
  const saveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setActionError(null);
    try {
      const res = await fetch(`${apiHost}/api/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutForm),
      });
      if (res.ok) {
        await refreshData();
        triggerConfetti();
      } else {
        throw new Error('Failed to update About details');
      }
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // CREATE / UPDATE Project
  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description_en) return;
    setSaving(true);
    setActionError(null);
    try {
      const url = editingProjectId 
        ? `${apiHost}/api/projects/${editingProjectId}`
        : `${apiHost}/api/projects`;
      const method = editingProjectId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm),
      });
      if (res.ok) {
        await refreshData();
        setProjectForm({
          title: '', description_en: '', description_id: '', tags: [], image_url: '', demo_url: '', case_study_en: '', case_study_id: ''
        });
        setEditingProjectId(null);
        triggerConfetti();
      } else {
        throw new Error('Failed to save project');
      }
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm(lang === 'en' ? 'Are you sure you want to delete this project?' : 'Apakah Anda yakin ingin menghapus proyek ini?')) return;
    try {
      const res = await fetch(`${apiHost}/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // CREATE / UPDATE Experience
  const saveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.period || !expForm.role_en || !expForm.company) return;
    setSaving(true);
    setActionError(null);
    try {
      const url = editingExpId 
        ? `${apiHost}/api/experiences/${editingExpId}`
        : `${apiHost}/api/experiences`;
      const method = editingExpId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expForm),
      });
      if (res.ok) {
        await refreshData();
        setExpForm({ period: '', role_en: '', role_id: '', company: '', description_en: '', description_id: '' });
        setEditingExpId(null);
        triggerConfetti();
      } else {
        throw new Error('Failed to save experience');
      }
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteExperience = async (id: number) => {
    if (!confirm(lang === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?')) return;
    try {
      const res = await fetch(`${apiHost}/api/experiences/${id}`, { method: 'DELETE' });
      if (res.ok) await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // CREATE / UPDATE Skill
  const saveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name) return;
    // Auto-set icon_name from skill name for backward compatibility
    const autoIconName = skillForm.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    setSaving(true);
    setActionError(null);
    try {
      const url = editingSkillId 
        ? `${apiHost}/api/skills/${editingSkillId}`
        : `${apiHost}/api/skills`;
      const method = editingSkillId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...skillForm, icon_name: autoIconName, proficiency: skillForm.proficiency || 0 }),
      });
      if (res.ok) {
        await refreshData();
        setSkillForm({ name: '', icon_name: '', category: 'frontend', proficiency: 0 });
        setEditingSkillId(null);
        triggerConfetti();
      } else {
        throw new Error('Failed to save skill');
      }
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async (id: number) => {
    if (!confirm(lang === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?')) return;
    try {
      const res = await fetch(`${apiHost}/api/skills/${id}`, { method: 'DELETE' });
      if (res.ok) await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // CREATE / UPDATE Stat
  const saveStat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statForm.value || !statForm.label_en) return;
    setSaving(true);
    setActionError(null);
    try {
      const url = editingStatId 
        ? `${apiHost}/api/stats/${editingStatId}`
        : `${apiHost}/api/stats`;
      const method = editingStatId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statForm),
      });
      if (res.ok) {
        await refreshData();
        setStatForm({ value: '', label_en: '', label_id: '' });
        setEditingStatId(null);
        triggerConfetti();
      } else {
        throw new Error('Failed to save stat');
      }
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteStat = async (id: number) => {
    if (!confirm(lang === 'en' ? 'Are you sure?' : 'Apakah Anda yakin?')) return;
    try {
      const res = await fetch(`${apiHost}/api/stats/${id}`, { method: 'DELETE' });
      if (res.ok) await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete message
  const deleteMessage = async (id: number) => {
    try {
      const res = await fetch(`${apiHost}/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  // SAVE Settings Details
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setActionError(null);
    try {
      const res = await fetch(`${apiHost}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        await refreshData();
        triggerConfetti();
      } else {
        throw new Error('Failed to update Settings');
      }
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#d946ef', '#f472b6', '#ffffff']
    });
  };

  // RENDER PASSCODE GATE
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-gutter pt-20 pb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/10 bg-zinc-950/50 shadow-[0_0_35px_rgba(217,70,239,0.06)]"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="font-display text-2xl font-bold text-on-surface">
              {lang === 'en' ? 'CMS Auth Gate' : 'Gerbang CMS'}
            </h2>
            <p className="text-on-surface-variant text-xs mt-1">
              {lang === 'en' ? 'Please authorize to open the editor dashboard' : 'Harap verifikasi untuk membuka dashboard editor'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant ml-1">
                {lang === 'en' ? 'Passcode' : 'Kode Akses'}
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-center tracking-[0.2em] font-bold"
                required
              />
            </div>

            {authError && (
              <div className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg flex items-center gap-1.5 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full fuchsia-gradient py-3.5 rounded-xl font-bold text-white hover:brightness-110 shadow-[0_0_15px_rgba(217,70,239,0.25)] transition-all cursor-pointer text-xs uppercase tracking-wider"
            >
              {lang === 'en' ? 'Verify Code' : 'Verifikasi'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // RENDER MAIN DASHBOARD INTERFACE
  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 px-gutter max-w-[1500px] mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Side Menu Tab Selector */}
      <div className="lg:col-span-1 space-y-2">
        <div className="glass-card p-4 rounded-xl border border-white/5 bg-zinc-950/20">
          <div className="mb-4 px-3 py-2 border-b border-white/5">
            <h3 className="font-display font-black text-sm text-gradient fuchsia-gradient uppercase tracking-widest">
              CMS Dashboard
            </h3>
            <p className="text-[10px] text-on-surface-variant">
              {lang === 'en' ? 'Edit live content' : 'Ubah konten langsung'}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            {[
              { id: 'hero', icon: User, label: 'Hero / Portrait' },
              { id: 'about', icon: Sparkles, label: 'About Info' },
              { id: 'projects', icon: Award, label: 'Projects CRUD' },
              { id: 'experiences', icon: Briefcase, label: 'Timeline CRUD' },
              { id: 'skills', icon: Sparkles, label: 'Technical Stack' },
              { id: 'stats', icon: Award, label: 'Stats Counter' },
              { id: 'messages', icon: Mail, label: 'Inbox Messages' },
              { id: 'settings', icon: Settings, label: 'Contact & Settings' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setActionError(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-xs font-bold transition-all border ${
                    activeTab === tab.id
                      ? 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_10px_rgba(217,70,239,0.1)]'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        <div className="glass-card p-8 rounded-2xl border border-white/5 bg-zinc-950/20 min-h-[500px]">
          
          {/* Action Notification Area */}
          {actionError && (
            <div className="mb-6 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-lg font-semibold">
              Error: {actionError}
            </div>
          )}

          {/* TAB 1: HERO / PORTRAIT EDITOR */}
          {activeTab === 'hero' && (
            <div>
              <h2 className="font-display text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <span>Hero & Portrait Editor</span>
              </h2>

              <form onSubmit={saveHero} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Name</label>
                    <input
                      type="text"
                      value={heroForm.name}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={heroForm.tags.join(', ')}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Tagline (EN)</label>
                    <input
                      type="text"
                      value={heroForm.title_en}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, title_en: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Tagline (ID)</label>
                    <input
                      type="text"
                      value={heroForm.title_id}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, title_id: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Description (EN)</label>
                    <textarea
                      value={heroForm.description_en}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, description_en: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50"
                      rows={4}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Description (ID)</label>
                    <textarea
                      value={heroForm.description_id}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, description_id: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <label className="text-[10px] font-bold uppercase text-on-surface-variant block mb-2">Portrait Image</label>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    {heroForm.portrait_url && (
                      <img 
                        src={heroForm.portrait_url} 
                        alt="Hero preview" 
                        className="w-24 h-24 rounded-full object-cover border border-white/10" 
                      />
                    )}
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={heroForm.portrait_url.startsWith('data:') ? 'Base64 Encoded Image Data' : heroForm.portrait_url}
                        onChange={(e) => !e.target.value.includes('Base64') && setHeroForm(prev => ({ ...prev, portrait_url: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      />
                      <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-white/10 rounded-xl hover:bg-white/5 cursor-pointer text-xs font-bold text-on-surface-variant transition-all">
                        <Upload className="w-4 h-4" />
                        <span>Upload Custom Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'hero')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 fuchsia-gradient text-white rounded-xl font-bold hover:brightness-110 shadow-lg text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ABOUT EDITOR */}
          {activeTab === 'about' && (
            <div>
              <h2 className="font-display text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>About Info Editor</span>
              </h2>

              <form onSubmit={saveAbout} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Section Subtitle (EN)</label>
                    <input
                      type="text"
                      value={aboutForm.subtitle_en}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, subtitle_en: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Section Subtitle (ID)</label>
                    <input
                      type="text"
                      value={aboutForm.subtitle_id}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, subtitle_id: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Section Title (EN)</label>
                    <input
                      type="text"
                      value={aboutForm.title_en}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, title_en: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Section Title (ID)</label>
                    <input
                      type="text"
                      value={aboutForm.title_id}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, title_id: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 space-y-4">
                  <h3 className="font-display font-semibold text-sm text-on-surface">Career Vision Card</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Card Title (EN)</label>
                      <input
                        type="text"
                        value={aboutForm.vision_title_en}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, vision_title_en: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Card Title (ID)</label>
                      <input
                        type="text"
                        value={aboutForm.vision_title_id}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, vision_title_id: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Card Body (EN)</label>
                      <textarea
                        value={aboutForm.vision_desc_en}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, vision_desc_en: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs"
                        rows={4}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Card Body (ID)</label>
                      <textarea
                        value={aboutForm.vision_desc_id}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, vision_desc_id: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 space-y-4">
                  <h3 className="font-display font-semibold text-sm text-on-surface">Technical Foundation Card</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Card Title (EN)</label>
                      <input
                        type="text"
                        value={aboutForm.foundation_title_en}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, foundation_title_en: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Card Title (ID)</label>
                      <input
                        type="text"
                        value={aboutForm.foundation_title_id}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, foundation_title_id: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Card Body (EN)</label>
                      <textarea
                        value={aboutForm.foundation_desc_en}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, foundation_desc_en: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs"
                        rows={4}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Card Body (ID)</label>
                      <textarea
                        value={aboutForm.foundation_desc_id}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, foundation_desc_id: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 fuchsia-gradient text-white rounded-xl font-bold hover:brightness-110 shadow-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save About Content</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: PROJECTS CRUD */}
          {activeTab === 'projects' && (
            <div>
              <h2 className="font-display text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span>Featured Projects CRUD Manager</span>
              </h2>

              {/* PROJECT FORM */}
              <form onSubmit={saveProject} className="glass-card p-6 rounded-xl border border-white/5 bg-zinc-950/45 mb-8 space-y-4">
                <h3 className="font-display text-xs font-bold text-primary uppercase tracking-wider">
                  {editingProjectId ? 'Edit Project Details' : 'Create New Project'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Title</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      placeholder="Nova Dashboard"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Demo Link URL</label>
                    <input
                      type="text"
                      value={projectForm.demo_url}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, demo_url: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Description (EN)</label>
                    <textarea
                      value={projectForm.description_en}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, description_en: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      rows={2}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Description (ID)</label>
                    <textarea
                      value={projectForm.description_id}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, description_id: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      rows={2}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Case Study (EN)</label>
                    <textarea
                      value={projectForm.case_study_en}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, case_study_en: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase">Case Study (ID)</label>
                    <textarea
                      value={projectForm.case_study_id}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, case_study_id: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">Tags</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {projectForm.tags?.map((tag) => (
                      <span key={tag} className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span>{tag}</span>
                        <button type="button" onClick={() => setProjectForm(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) }))} className="text-red-400 font-black">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Add tag (e.g. React)"
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-1 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTagInput.trim() && !projectForm.tags?.includes(newTagInput.trim())) {
                          setProjectForm(prev => ({ ...prev, tags: [...(prev.tags || []), newTagInput.trim()] }));
                          setNewTagInput('');
                        }
                      }}
                      className="px-4 py-1 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/5"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <label className="text-[10px] font-bold uppercase text-on-surface-variant block mb-2">Project Image</label>
                  <div className="flex items-center gap-4">
                    {projectForm.image_url && (
                      <img src={projectForm.image_url} alt="Project Preview" className="w-20 h-14 object-cover rounded border border-white/5" />
                    )}
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={projectForm.image_url?.startsWith('data:') ? 'Base64 Encoded Image Data' : projectForm.image_url}
                        onChange={(e) => !e.target.value.includes('Base64') && setProjectForm(prev => ({ ...prev, image_url: e.target.value }))}
                        className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs"
                      />
                      <label className="w-full flex items-center justify-center gap-1.5 px-4 py-2 border border-dashed border-white/10 rounded-xl hover:bg-white/5 cursor-pointer text-xs font-bold text-on-surface-variant transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Project Cover</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'project')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 fuchsia-gradient text-white rounded-xl font-bold hover:brightness-110 shadow-lg text-xs flex items-center gap-1"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{editingProjectId ? 'Save Changes' : 'Create Project'}</span>
                  </button>
                  
                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProjectId(null);
                        setProjectForm({
                          title: '', description_en: '', description_id: '', tags: [], image_url: '', demo_url: '', case_study_en: '', case_study_id: ''
                        });
                      }}
                      className="px-6 py-2 bg-white/5 text-on-surface-variant hover:text-on-surface rounded-xl font-bold border border-white/5 text-xs"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              {/* PROJECTS LIST */}
              <div className="space-y-3">
                <h3 className="font-display text-xs font-bold uppercase text-on-surface-variant">Live Projects Grid</h3>
                {portfolioData.projects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      {p.image_url && <img src={p.image_url} className="w-12 h-9 object-cover rounded border border-white/5" alt="" />}
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">{p.title}</h4>
                        <span className="text-[9px] font-bold text-on-surface-variant tracking-wider uppercase bg-white/5 px-2 py-0.5 rounded">
                          {p.tags.join(', ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProjectId(p.id!);
                          setProjectForm(p);
                        }}
                        className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded border border-blue-500/10"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProject(p.id!)}
                        className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded border border-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE CRUD */}
          {activeTab === 'experiences' && (
            <div>
              <h2 className="font-display text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <span>Experience & Education Timeline Editor</span>
              </h2>

              <form onSubmit={saveExperience} className="glass-card p-6 rounded-xl border border-white/5 bg-zinc-950/45 mb-8 space-y-4">
                <h3 className="font-display text-xs font-bold text-primary uppercase tracking-wider">
                  {editingExpId ? 'Edit Milestone' : 'Add New Milestone'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Period (e.g. 2022 - Present)</label>
                    <input
                      type="text"
                      value={expForm.period}
                      onChange={(e) => setExpForm(prev => ({ ...prev, period: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      placeholder="2022 - Present"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Company / Institution</label>
                    <input
                      type="text"
                      value={expForm.company}
                      onChange={(e) => setExpForm(prev => ({ ...prev, company: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      placeholder="Nexus Tech Solutions"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Role Title (EN)</label>
                    <input
                      type="text"
                      value={expForm.role_en}
                      onChange={(e) => setExpForm(prev => ({ ...prev, role_en: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      placeholder="Senior Web Developer"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Role Title (ID)</label>
                    <input
                      type="text"
                      value={expForm.role_id}
                      onChange={(e) => setExpForm(prev => ({ ...prev, role_id: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      placeholder="Developer Web Senior"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Description (EN)</label>
                    <textarea
                      value={expForm.description_en}
                      onChange={(e) => setExpForm(prev => ({ ...prev, description_en: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs"
                      rows={2}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Description (ID)</label>
                    <textarea
                      value={expForm.description_id}
                      onChange={(e) => setExpForm(prev => ({ ...prev, description_id: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="px-6 py-2 fuchsia-gradient text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer">
                    <Save className="w-3.5 h-3.5" />
                    <span>{editingExpId ? 'Save Changes' : 'Add Milestone'}</span>
                  </button>
                  {editingExpId && (
                    <button type="button" onClick={() => { setEditingExpId(null); setExpForm({ period: '', role_en: '', role_id: '', company: '', description_en: '', description_id: '' }); }} className="px-6 py-2 bg-white/5 text-on-surface-variant rounded-xl font-bold border border-white/5 text-xs">
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="space-y-3">
                {portfolioData.experiences.map((e) => (
                  <div key={e.id} className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-xl border border-white/5">
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{e.role_en} @ {e.company}</h4>
                      <p className="text-[10px] text-primary font-semibold">{e.period}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingExpId(e.id!); setExpForm(e); }} className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded border border-blue-500/10">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteExperience(e.id!)} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded border border-red-500/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SKILLS EDITOR */}
          {activeTab === 'skills' && (
            <div>
              <h2 className="font-display text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Technical Stack Manager</span>
              </h2>

              <form onSubmit={saveSkill} className="glass-card p-6 rounded-xl border border-white/5 bg-zinc-950/45 mb-8 space-y-4">
                <h3 className="font-display text-xs font-bold text-primary uppercase tracking-wider">
                  {editingSkillId ? 'Edit Skill Details' : 'Add New Skill'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Skill / Technology Name</label>
                    <input
                      type="text"
                      value={skillForm.name}
                      onChange={(e) => setSkillForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      placeholder="e.g. React, Python, Unity, Figma..."
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Category</label>
                    <select
                      value={['frontend', 'backend', 'game'].includes(skillForm.category || '') ? skillForm.category : '__custom__'}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setSkillForm(prev => ({ ...prev, category: '' as any }));
                        } else {
                          setSkillForm(prev => ({ ...prev, category: e.target.value as any }));
                        }
                      }}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none text-on-surface"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="game">Game Dev</option>
                      <option value="__custom__">Other / Custom...</option>
                    </select>
                    {!['frontend', 'backend', 'game'].includes(skillForm.category || '') && (
                      <input
                        type="text"
                        value={skillForm.category === '__custom__' ? '' : (skillForm.category || '')}
                        onChange={(e) => setSkillForm(prev => ({ ...prev, category: e.target.value as any }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none mt-1.5"
                        placeholder="Ketik nama kategori, misal: Design, DevOps..."
                        autoFocus
                      />
                    )}
                  </div>
                </div>

                {/* Live Logo Preview */}
                {skillForm.name && (
                  <div className="flex items-center gap-3 p-3 bg-zinc-900/60 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-white/5 overflow-hidden">
                      {getTechIconUrl(skillForm.name || '') ? (
                        <img
                          src={getTechIconUrl(skillForm.name || '')!}
                          alt={skillForm.name}
                          className="w-7 h-7 object-contain"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-lg text-on-surface-variant">code</span>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-on-surface">{skillForm.name}</p>
                      {hasTechIcon(skillForm.name || '') ? (
                        <span className="text-[9px] font-bold text-emerald-400">✓ Logo ditemukan otomatis</span>
                      ) : (
                        <span className="text-[9px] font-bold text-amber-400">⚠ Logo tidak ditemukan, akan pakai ikon default</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button type="submit" className="px-6 py-2 fuchsia-gradient text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer">
                    <Save className="w-3.5 h-3.5" />
                    <span>{editingSkillId ? 'Save Changes' : 'Add Skill'}</span>
                  </button>
                  {editingSkillId && (
                    <button type="button" onClick={() => { setEditingSkillId(null); setSkillForm({ name: '', icon_name: '', category: 'frontend', proficiency: 0 }); }} className="px-6 py-2 bg-white/5 text-on-surface-variant rounded-xl font-bold border border-white/5 text-xs">
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {portfolioData.skills.map((s) => {
                  const logoUrl = getTechIconUrl(s.name);
                  return (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center border border-white/5 overflow-hidden">
                          {logoUrl ? (
                            <img src={logoUrl} alt={s.name} className="w-5 h-5 object-contain" />
                          ) : (
                            <span className="material-symbols-outlined text-lg text-primary">code</span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-on-surface">{s.name}</h4>
                          <span className="text-[8px] font-bold text-on-surface-variant uppercase bg-white/5 px-2 py-0.5 rounded">{s.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingSkillId(s.id!); setSkillForm(s); }} className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded border border-blue-500/10">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteSkill(s.id!)} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded border border-red-500/10">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: STATS EDITOR */}
          {activeTab === 'stats' && (
            <div>
              <h2 className="font-display text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span>Achievements Stats Editor</span>
              </h2>

              <form onSubmit={saveStat} className="glass-card p-6 rounded-xl border border-white/5 bg-zinc-950/45 mb-8 space-y-4">
                <h3 className="font-display text-xs font-bold text-primary uppercase tracking-wider">
                  {editingStatId ? 'Edit Stat Value' : 'Add New Stat Card'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Stat Value (e.g. 50+)</label>
                    <input
                      type="text"
                      value={statForm.value}
                      onChange={(e) => setStatForm(prev => ({ ...prev, value: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      placeholder="50+"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Label (EN)</label>
                    <input
                      type="text"
                      value={statForm.label_en}
                      onChange={(e) => setStatForm(prev => ({ ...prev, label_en: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      placeholder="Projects Completed"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">Label (ID)</label>
                    <input
                      type="text"
                      value={statForm.label_id}
                      onChange={(e) => setStatForm(prev => ({ ...prev, label_id: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-xs focus:outline-none"
                      placeholder="Proyek Selesai"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="px-6 py-2 fuchsia-gradient text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer">
                    <Save className="w-3.5 h-3.5" />
                    <span>{editingStatId ? 'Save Changes' : 'Add Stat'}</span>
                  </button>
                  {editingStatId && (
                    <button type="button" onClick={() => { setEditingStatId(null); setStatForm({ value: '', label_en: '', label_id: '' }); }} className="px-6 py-2 bg-white/5 text-on-surface-variant rounded-xl font-bold border border-white/5 text-xs">
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="space-y-3">
                {portfolioData.stats.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-xl border border-white/5">
                    <div>
                      <h4 className="text-xs font-bold text-primary">{s.value}</h4>
                      <p className="text-[10px] text-on-surface-variant font-medium">{s.label_en} / {s.label_id}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingStatId(s.id!); setStatForm(s); }} className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded border border-blue-500/10">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteStat(s.id!)} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded border border-red-500/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: MESSAGES / INBOX SUBMISSIONS */}
          {activeTab === 'messages' && (
            <div>
              <h2 className="font-display text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <span>Contact Messages Inbox</span>
              </h2>

              {loadingMessages ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-on-surface-variant text-sm font-medium">
                  {lang === 'en' ? 'Your message box is empty.' : 'Kotak masuk pesan Anda kosong.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-5 rounded-xl border border-white/5 bg-zinc-900/40 space-y-3 relative group">
                      <button 
                        onClick={() => deleteMessage(msg.id!)}
                        className="absolute top-4 right-4 p-1.5 bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded border border-red-500/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs border-b border-white/5 pb-2">
                        <div>
                          <span className="font-bold text-on-surface mr-2">{msg.name}</span>
                          <span className="text-on-surface-variant">&lt;{msg.email}&gt;</span>
                        </div>
                        <span className="text-[10px] text-on-surface-variant font-medium mt-1 sm:mt-0">
                          {msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}
                        </span>
                      </div>
                      
                      <p className="text-xs text-on-surface-variant leading-relaxed font-normal whitespace-pre-line pr-6">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: CONTACT & GLOBAL SETTINGS EDITOR */}
          {activeTab === 'settings' && settingsForm && (
            <div>
              <h2 className="font-display text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                <span>{lang === 'en' ? 'Contact & Global Settings' : 'Kontak & Pengaturan Global'}</span>
              </h2>

              <form onSubmit={saveSettings} className="space-y-6">
                
                {/* Contact Settings Card */}
                <div className="glass-card p-6 rounded-xl border border-white/5 bg-zinc-950/45 space-y-4">
                  <h3 className="font-display text-sm font-bold text-primary uppercase tracking-wider">
                    {lang === 'en' ? 'Contact Information' : 'Informasi Kontak'}
                  </h3>
                  
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                      {lang === 'en' ? 'Contact Email' : 'Email Kontak'}
                    </label>
                    <input
                      type="email"
                      value={settingsForm.contact_email || ''}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, contact_email: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-on-surface"
                      placeholder="hello@example.com"
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                      {lang === 'en' ? 'Contact Title (Indonesian - Auto-translated)' : 'Judul Kontak (Bahasa Indonesia - Diterjemahkan Otomatis)'}
                    </label>
                    <input
                      type="text"
                      value={settingsForm.contact_title_id || ''}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, contact_title_id: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-on-surface"
                      placeholder="Hubungi Saya."
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                      {lang === 'en' ? 'Contact Description (Indonesian - Auto-translated)' : 'Deskripsi Kontak (Bahasa Indonesia - Diterjemahkan Otomatis)'}
                    </label>
                    <textarea
                      value={settingsForm.contact_desc_id || ''}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, contact_desc_id: e.target.value }))}
                      className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-on-surface"
                      rows={3}
                      placeholder="Punya proyek dalam pikiran atau hanya ingin menyapa?..."
                      required
                    />
                  </div>
                </div>

                {/* General Brand / UI Settings Card */}
                <div className="glass-card p-6 rounded-xl border border-white/5 bg-zinc-950/45 space-y-4">
                  <h3 className="font-display text-sm font-bold text-primary uppercase tracking-wider">
                    {lang === 'en' ? 'General & Brand Settings' : 'Pengaturan Umum & Brand'}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">Logo Text</label>
                      <input
                        type="text"
                        value={settingsForm.logo_text || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, logo_text: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-on-surface"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                        {lang === 'en' ? 'Footer Copyright Message (Indonesian)' : 'Pesan Hak Cipta Footer (Bahasa Indonesia)'}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.footer_text_id || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, footer_text_id: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-on-surface"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                        {lang === 'en' ? 'Skills Section Title (Indonesian)' : 'Judul Bagian Keahlian (Bahasa Indonesia)'}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.skills_title_id || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, skills_title_id: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-on-surface"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                        {lang === 'en' ? 'Skills Section Description (Indonesian)' : 'Deskripsi Bagian Keahlian (Bahasa Indonesia)'}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.skills_desc_id || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, skills_desc_id: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-on-surface"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                        {lang === 'en' ? 'Projects Section Title (Indonesian)' : 'Judul Bagian Proyek (Bahasa Indonesia)'}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.projects_title_id || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, projects_title_id: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-on-surface"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                        {lang === 'en' ? 'Projects Section Description (Indonesian)' : 'Deskripsi Bagian Proyek (Bahasa Indonesia)'}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.projects_desc_id || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, projects_desc_id: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-on-surface"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                        {lang === 'en' ? 'Experience Section Title (Indonesian)' : 'Judul Bagian Pengalaman (Bahasa Indonesia)'}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.experience_title_id || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, experience_title_id: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-on-surface"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                        {lang === 'en' ? 'Experience Section Description (Indonesian)' : 'Deskripsi Bagian Pengalaman (Bahasa Indonesia)'}
                      </label>
                      <input
                        type="text"
                        value={settingsForm.experience_desc_id || ''}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, experience_desc_id: e.target.value }))}
                        className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-on-surface"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 fuchsia-gradient text-white rounded-xl font-bold hover:brightness-110 shadow-lg text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{lang === 'en' ? 'Save Settings' : 'Simpan Pengaturan'}</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
