import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactProps {
  lang: 'en' | 'id';
  settings?: any;
}

export default function Contact({ lang, settings }: ContactProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError(lang === 'en' ? 'Please fill out all fields.' : 'Harap isi semua kolom.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const apiHost = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const response = await fetch(`${apiHost}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });

      // Trigger premium micro-animation: confetti explosion!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#d946ef', '#f472b6', '#ec4899', '#ffffff'],
      });
    } catch (err: any) {
      setError(lang === 'en' ? 'Something went wrong. Please try again.' : 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-xxl px-gutter bg-surface-container-lowest/30 relative overflow-hidden" id="contact">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-xxl lg:gap-16 xl:gap-24 relative z-10 w-full items-center">
        
        {/* Left Side: Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-headline-lg text-3xl sm:text-4xl md:text-headline-lg font-bold text-on-surface mb-4 break-words">
            {(() => {
              const contactTitle = settings
                ? (lang === 'en' ? settings.contact_title_en : settings.contact_title_id)
                : (lang === 'en' ? 'Get In Touch.' : 'Hubungi Saya.');
              const titleWords = contactTitle.split(' ');
              const lastWord = titleWords.length > 1 ? titleWords[titleWords.length - 1] : '';
              const mainTitle = titleWords.length > 1 ? titleWords.slice(0, -1).join(' ') : contactTitle;
              return (
                <>
                  {mainTitle}{' '}
                  {lastWord && (
                    <span className="text-gradient fuchsia-gradient">
                      {lastWord}
                    </span>
                  )}
                </>
              );
            })()}
          </h2>
          <p className="text-on-surface-variant font-body-md text-base mb-10 leading-relaxed font-normal max-w-md">
            {settings
              ? (lang === 'en' ? settings.contact_desc_en : settings.contact_desc_id)
              : (lang === 'en'
                ? "Have a project in mind or just want to say hi? I'm always open to discussing new opportunities."
                : 'Punya proyek dalam pikiran atau hanya ingin menyapa? Saya selalu terbuka untuk mendiskusikan peluang baru.')}
          </p>

          <div className="space-y-6">
            {/* Email Contact Detail */}
            <div className="flex items-center gap-4 group cursor-pointer w-fit">
              <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-primary group-hover:bg-primary/10 border border-white/5 transition-colors">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  {lang === 'en' ? 'Email Me' : 'Kirim Email'}
                </p>
                <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                  {settings?.contact_email || 'hello@portonaila.dev'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form Container */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 md:p-10 rounded-2xl border border-white/5 bg-zinc-900/10"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-2 flex flex-col">
                    <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wide">
                      {lang === 'en' ? 'Name' : 'Nama'}
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-surface-container/60 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface transition-all"
                      placeholder={lang === 'en' ? 'Your Name' : 'Nama Anda'}
                      type="text"
                      required
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2 flex flex-col">
                    <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wide">
                      Email
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-surface-container/60 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface transition-all"
                      placeholder={lang === 'en' ? 'Your Email' : 'Email Anda'}
                      type="email"
                      required
                    />
                  </div>
                </div>

                {/* Message field */}
                <div className="space-y-2 flex flex-col">
                  <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wide">
                    {lang === 'en' ? 'Message' : 'Pesan'}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-surface-container/60 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-on-surface transition-all"
                    placeholder={lang === 'en' ? 'Tell me about your project' : 'Ceritakan proyek Anda...'}
                    rows={4}
                    required
                  />
                </div>

                {/* Feedback Alerts */}
                {error && (
                  <div className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full fuchsia-gradient py-3.5 rounded-xl font-bold text-white hover:brightness-110 transition-all shadow-[0_0_15px_rgba(217,70,239,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === 'en' ? 'Sending...' : 'Mengirim...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{lang === 'en' ? 'Send Message' : 'Kirim Pesan'}</span>
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-8"
              >
                <CheckCircle2 className="w-16 h-16 text-primary mb-6 animate-bounce" />
                <h3 className="font-display text-2xl font-bold text-on-surface mb-2">
                  {lang === 'en' ? 'Message Sent!' : 'Pesan Terkirim!'}
                </h3>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                  {lang === 'en'
                    ? 'Thank you for reaching out. I will get back to you as soon as possible.'
                    : 'Terima kasih telah menghubungi. Saya akan membalas Anda secepat mungkin.'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="glass-card px-6 py-2.5 rounded-xl text-xs font-bold text-on-surface hover:bg-white/5 border border-white/10"
                >
                  {lang === 'en' ? 'Send Another Message' : 'Kirim Pesan Lain'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Decorative Lights */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/2 filter blur-[120px] pointer-events:none z-0" />
    </section>
  );
}
