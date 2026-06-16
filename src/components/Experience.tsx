import { motion } from 'framer-motion';
import type { ExperienceData } from '../data/initialData';

interface ExperienceProps {
  experiences: ExperienceData[];
  lang: 'en' | 'id';
  settings?: any;
}

export default function Experience({ experiences, lang }: ExperienceProps) {
  return (
    <section className="py-xxl px-gutter relative overflow-hidden" id="experience">
      <div className="max-w-container-max mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-headline-lg text-3xl sm:text-4xl md:text-headline-lg font-bold text-on-surface mb-3 break-words"
          >
            {lang === 'en' ? 'Experience & Education' : 'Pengalaman & Pendidikan'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-on-surface-variant font-body-md text-base"
          >
            {lang === 'en' ? 'The milestones of my professional journey.' : 'Tonggak sejarah perjalanan profesional saya.'}
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">

          {/* ===== CONTINUOUS VERTICAL LINE ===== */}
          {/* Mobile: pinned left at 9px center of 18px dot */}
          {/* Desktop: center of container */}
          <div 
            className="absolute top-0 bottom-0 left-[9px] md:left-1/2 md:-translate-x-[1px]"
            style={{ width: '2px', background: 'linear-gradient(to bottom, transparent 0%, rgba(217,70,239,0.3) 40px, rgba(217,70,239,0.3) calc(100% - 40px), transparent 100%)' }}
          />

          {experiences.map((exp, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div key={exp.id || idx} className="relative mb-12 last:mb-0">
                
                {/* ===== MOBILE LAYOUT ===== */}
                <div className="block md:hidden">
                  <div className="flex items-start gap-5">
                    {/* Dot — aligned with the continuous line */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring' as const, stiffness: 200, damping: 10 }}
                      className="w-[18px] h-[18px] rounded-full fuchsia-gradient shadow-[0_0_15px_rgba(217,70,239,0.7)] flex-shrink-0 z-10 mt-5"
                    />
                    {/* Card */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring' as const, stiffness: 70, damping: 14 }}
                      className="flex-1 min-w-0"
                    >
                      <div className="glass-card p-5 rounded-2xl border border-white/5 bg-zinc-900/10 hover:border-primary/10 transition-colors">
                        <span className="text-primary font-bold text-xs tracking-wider mb-2 block select-none">
                          {exp.period}
                        </span>
                        <h3 className="font-display text-base font-bold text-on-surface mb-1 leading-snug">
                          {lang === 'en' ? exp.role_en : exp.role_id}
                        </h3>
                        <h4 className="text-on-surface-variant text-sm font-semibold mb-2">
                          {exp.company}
                        </h4>
                        {exp.description_en && (
                          <p className="text-on-surface-variant font-body-md text-xs leading-relaxed font-normal">
                            {lang === 'en' ? exp.description_en : exp.description_id}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* ===== DESKTOP LAYOUT ===== */}
                <div className="hidden md:flex items-start">
                  {/* Left column */}
                  <div className="w-[calc(50%-20px)] pr-8">
                    {isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring' as const, stiffness: 70, damping: 14 }}
                        className="text-right"
                      >
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10 hover:border-primary/10 transition-colors">
                          <span className="text-primary font-bold text-xs tracking-wider mb-2 block select-none">
                            {exp.period}
                          </span>
                          <h3 className="font-display text-lg font-bold text-on-surface mb-1 leading-snug">
                            {lang === 'en' ? exp.role_en : exp.role_id}
                          </h3>
                          <h4 className="text-on-surface-variant text-sm font-semibold mb-3">
                            {exp.company}
                          </h4>
                          {exp.description_en && (
                            <p className="text-on-surface-variant font-body-md text-xs leading-relaxed font-normal">
                              {lang === 'en' ? exp.description_en : exp.description_id}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="flex justify-center flex-shrink-0" style={{ width: '40px' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring' as const, stiffness: 200, damping: 10, delay: 0.1 }}
                      className="w-[18px] h-[18px] rounded-full fuchsia-gradient shadow-[0_0_15px_rgba(217,70,239,0.7)] z-10 mt-5"
                    />
                  </div>

                  {/* Right column */}
                  <div className="w-[calc(50%-20px)] pl-8">
                    {!isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring' as const, stiffness: 70, damping: 14 }}
                        className="text-left"
                      >
                        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10 hover:border-primary/10 transition-colors">
                          <span className="text-primary font-bold text-xs tracking-wider mb-2 block select-none">
                            {exp.period}
                          </span>
                          <h3 className="font-display text-lg font-bold text-on-surface mb-1 leading-snug">
                            {lang === 'en' ? exp.role_en : exp.role_id}
                          </h3>
                          <h4 className="text-on-surface-variant text-sm font-semibold mb-3">
                            {exp.company}
                          </h4>
                          {exp.description_en && (
                            <p className="text-on-surface-variant font-body-md text-xs leading-relaxed font-normal">
                              {lang === 'en' ? exp.description_en : exp.description_id}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
      
      {/* Decorative Lights */}
      <div className="absolute top-1/4 left-10 w-[300px] h-[300px] rounded-full bg-secondary/2 filter blur-[100px] pointer-events:none z-0" />
    </section>
  );
}
