interface FooterProps {
  lang: 'en' | 'id';
  settings?: any;
}

export default function Footer({ lang, settings }: FooterProps) {
  const logoText = settings?.logo_text || 'PortoNaila';
  const footerText = settings
    ? (lang === 'en' ? settings.footer_text_en : settings.footer_text_id)
    : (lang === 'en' ? 'Crafted with precision.' : 'Dibuat dengan presisi.');

  return (
    <footer className="w-full py-12 border-t border-white/5 bg-background relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center px-gutter max-w-container-max mx-auto gap-6 relative z-10">
        <div className="font-display text-lg font-bold text-on-surface">
          <span className="text-gradient fuchsia-gradient font-black">{logoText}</span>
        </div>
        <div className="text-on-surface-variant font-body-md text-xs font-medium tracking-wide">
          © {new Date().getFullYear()} {logoText}. {footerText}
        </div>
      </div>
    </footer>
  );
}
