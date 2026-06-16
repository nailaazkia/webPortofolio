import { motion } from 'framer-motion';
import type { AboutData } from '../data/initialData';

interface AboutProps {
  data: AboutData;
  lang: 'en' | 'id';
}

export default function About({ data, lang }: AboutProps) {
  return (
    <section className="py-xxl px-gutter bg-surface-container-lowest/30 relative overflow-hidden" id="about">
      <div className="max-w-container-max mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-label-md text-label-md text-primary mb-2 uppercase tracking-widest font-semibold"
          >
            {lang === 'en' ? data.subtitle_en : data.subtitle_id}
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-headline-lg text-3xl sm:text-4xl md:text-headline-lg font-bold text-on-surface break-words"
          >
            {(() => {
              const aboutTitle = lang === 'en' ? (data.title_en || 'Passionate About Problem Solving.') : (data.title_id || 'Sangat Terobsesi dengan Pemecahan Masalah.');
              const titleWords = aboutTitle.split(' ');
              const lastWord = titleWords.length > 1 ? titleWords[titleWords.length - 1] : '';
              const mainTitle = titleWords.length > 1 ? titleWords.slice(0, -1).join(' ') : aboutTitle;
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
          </motion.h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Card 1: Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 md:p-10 rounded-2xl flex flex-col justify-between border border-white/5 bg-zinc-900/30"
          >
            <div>
              <h3 className="font-display text-2xl font-bold mb-4 text-on-surface flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary rounded-full block" />
                {lang === 'en' ? data.vision_title_en : data.vision_title_id}
              </h3>
              <p className="text-on-surface-variant font-body-md text-base leading-relaxed font-normal">
                {lang === 'en' ? data.vision_desc_en : data.vision_desc_id}
              </p>
            </div>
          </motion.div>

          {/* Card 2: Foundation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="glass-card p-8 md:p-10 rounded-2xl flex flex-col justify-between border border-white/5 bg-zinc-900/30"
          >
            <div>
              <h3 className="font-display text-2xl font-bold mb-4 text-on-surface flex items-center gap-3">
                <span className="w-1.5 h-6 bg-secondary rounded-full block" />
                {lang === 'en' ? data.foundation_title_en : data.foundation_title_id}
              </h3>
              <p className="text-on-surface-variant font-body-md text-base leading-relaxed font-normal">
                {lang === 'en' ? data.foundation_desc_en : data.foundation_desc_id}
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
      
      {/* Decorative Grid Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/3 filter blur-[100px] pointer-events:none z-0" />
    </section>
  );
}
