interface FooterProps {
  lang: 'en' | 'id';
  settings?: any;
}

export default function Footer({ lang }: FooterProps) {
  return (
    <footer className="w-full py-12 border-t border-white/5 bg-background relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center px-gutter max-w-container-max mx-auto gap-6 relative z-10">
        <div className="font-display text-lg font-bold text-on-surface">
          <span className="text-gradient fuchsia-gradient font-black">PortoNaila</span>
        </div>
        <div className="text-on-surface-variant font-body-md text-xs font-medium tracking-wide">
          © 2026 PortoNaila. {lang === 'en' ? 'Crafted with precision.' : 'Dibuat dengan presisi.'}
        </div>
      </div>
    </footer>
  );
}
