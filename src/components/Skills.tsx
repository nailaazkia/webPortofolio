import { motion } from 'framer-motion';
import type { SkillData } from '../data/initialData';
import { getTechIconUrl } from '../utils/techIcons';

interface SkillsProps {
  skills: SkillData[];
  lang: 'en' | 'id';
  settings?: any;
}

export default function Skills({ skills, lang }: SkillsProps) {
  // Container stagger animation
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 80, damping: 15 },
    },
  };

  return (
    <section className="py-xxl px-gutter relative" id="skills">
      <div className="max-w-container-max mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-headline-lg text-4xl md:text-headline-lg font-bold text-on-surface mb-3"
          >
            {lang === 'en' ? 'Technical Stack' : 'Keahlian Teknis'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-on-surface-variant font-body-md text-base"
          >
            {lang === 'en' ? 'Mastering the tools that build the modern web.' : 'Menguasai alat-alat yang membangun web modern.'}
          </motion.p>
        </div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 lg:gap-8"
        >
          {skills.map((skill) => {
            const iconUrl = getTechIconUrl(skill.name);
            
            return (
              <motion.div
                key={skill.id || skill.name}
                variants={itemVariants}
                className="glass-card p-6 rounded-2xl flex flex-col items-center group cursor-default select-none border border-white/5 bg-zinc-900/20"
              >
                {/* Tech Logo */}
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 border border-white/5 group-hover:shadow-[0_0_25px_rgba(217,70,239,0.3)] group-hover:border-primary/20 group-hover:scale-110 transition-all duration-300 overflow-hidden">
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt={skill.name}
                      className="w-9 h-9 object-contain drop-shadow-lg"
                      loading="lazy"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[32px] text-primary group-hover:text-secondary transition-colors">
                      {skill.icon_name || 'code'}
                    </span>
                  )}
                </div>
                
                {/* Skill Name */}
                <span className="font-label-md text-sm font-bold text-on-surface text-center">
                  {skill.name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      
      {/* Decorative background lights */}
      <div className="absolute right-10 bottom-1/4 w-[350px] h-[350px] rounded-full bg-primary/3 filter blur-[90px] pointer-events:none z-0" />
    </section>
  );
}
