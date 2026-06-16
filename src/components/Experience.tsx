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

        {/* Timeline Container */}
        <div className="relative max-w-3xl mx-auto pl-4 pr-4 md:px-0">
          {/* Vertical center bar */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/5 md:-translate-x-1/2" />

          {experiences.map((exp, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={exp.id || idx}
                className={`relative mb-16 last:mb-0 flex flex-col md:flex-row ${
                  isEven ? 'md:justify-start' : 'md:justify-end'
                }`}
              >
                {/* Timeline node dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ type: 'spring' as const, stiffness: 200, damping: 10, delay: 0.1 }}
                  className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full fuchsia-gradient shadow-[0_0_15px_rgba(217,70,239,0.7)] z-10"
                />

                {/* Card wrapper */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ type: 'spring' as const, stiffness: 70, damping: 14 }}
                  className={`w-[calc(100%-2.5rem)] md:w-[45%] ml-10 md:ml-0 ${
                    isEven ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'
                  }`}
                >
                  <div className="glass-card p-6 rounded-2xl border border-white/5 bg-zinc-900/10 hover:border-primary/10">
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
