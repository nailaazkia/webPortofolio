import { motion } from 'framer-motion';
import type { SkillData } from '../data/initialData';

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
          {skills.map((skill) => (
            <motion.div
              key={skill.id || skill.name}
              variants={itemVariants}
              className="glass-card p-6 rounded-2xl flex flex-col items-center group cursor-default select-none border border-white/5 bg-zinc-900/20"
            >
              {/* Icon container with hover fuchsia shadow */}
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 border border-white/5 group-hover:shadow-[0_0_25px_rgba(217,70,239,0.3)] group-hover:border-primary/20 group-hover:scale-110 transition-all duration-300">
                <span className="material-symbols-outlined text-[32px] text-primary group-hover:text-secondary transition-colors">
                  {skill.icon_name}
                </span>
              </div>
              
              {/* Skill Name */}
              <span className="font-label-md text-sm font-bold text-on-surface text-center mb-3">
                {skill.name}
              </span>

              {/* Animated Proficiency Bar */}
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.proficiency}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                  className="h-full fuchsia-gradient rounded-full"
                />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {skill.proficiency}%
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Decorative background lights */}
      <div className="absolute right-10 bottom-1/4 w-[350px] h-[350px] rounded-full bg-primary/3 filter blur-[90px] pointer-events:none z-0" />
    </section>
  );
}
