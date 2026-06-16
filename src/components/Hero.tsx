import { motion } from 'framer-motion';
import type { HeroData } from '../data/initialData';

interface HeroProps {
  data: HeroData;
  lang: 'en' | 'id';
}

export default function Hero({ data, lang }: HeroProps) {
  const handleScrollTo = (id: string) => {
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

  return (
    <section className="min-h-screen flex items-center px-gutter pt-24 md:pt-32 pb-16 overflow-hidden relative">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-xxl lg:gap-16 xl:gap-20 items-center w-full">
        {/* Hero Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 md:order-1 flex flex-col items-start z-10"
        >
          <span className="font-headline-md text-headline-md mb-2 text-on-surface-variant font-medium select-none">
            {lang === 'en' ? `Hi, I'm ${data.name}` : `Halo, Saya ${data.name}`}
          </span>
          
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.05] tracking-tight mb-6 select-none">
            {lang === 'en' ? 'Crafting Digital' : 'Merancang'}{' '}
            <br />
            <span className="text-gradient fuchsia-gradient font-display">
              {lang === 'en' ? 'Experiences.' : 'Pengalaman Digital.'}
            </span>
          </h1>

          {/* Tags Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {data.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-4 py-1.5 bg-surface-container rounded-full text-xs font-bold border border-white/5 text-on-surface-variant hover:text-primary hover:border-primary/20 transition-all select-none"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg lg:max-w-xl xl:max-w-2xl mb-10 leading-relaxed font-normal">
            {lang === 'en' ? data.description_en : data.description_id}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => handleScrollTo('work')}
              className="fuchsia-gradient px-8 py-3.5 rounded-xl font-semibold text-white hover:brightness-110 shadow-[0_0_20px_rgba(217,70,239,0.35)] transition-all flex items-center justify-center text-center select-none w-full sm:w-auto"
            >
              {lang === 'en' ? 'See Projects' : 'Lihat Proyek'}
            </button>
            
            <button
              onClick={() => handleScrollTo('contact')}
              className="glass-card px-8 py-3.5 rounded-xl font-semibold text-on-surface border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center text-center select-none w-full sm:w-auto"
            >
              {lang === 'en' ? 'Contact Me' : 'Hubungi Saya'}
            </button>
          </div>
        </motion.div>

        {/* Hero Right: Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="order-1 md:order-2 flex justify-center z-10"
        >
          <div className="relative w-full aspect-square max-w-[360px] md:max-w-[440px] lg:max-w-[520px] xl:max-w-[600px] glass-card rounded-full overflow-hidden p-2 group shadow-[0_0_50px_rgba(217,70,239,0.05)]">
            {/* Background Glow */}
            <div className="absolute inset-0 fuchsia-gradient opacity-10 group-hover:opacity-25 transition-opacity duration-700 rounded-full blur-2xl" />
            
            {/* Portrait Image Container */}
            <div className="w-full h-full rounded-full overflow-hidden relative z-10 border border-white/5">
              <img
                alt={`${data.name} Portrait`}
                className="w-full h-full object-cover hover:scale-105 transition-all duration-700 ease-out"
                src={data.portrait_url}
                loading="eager"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Blur Background Ball */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 filter blur-[120px] pointer-events:none z-0" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] rounded-full bg-secondary/5 filter blur-[100px] pointer-events:none z-0" />
    </section>
  );
}
