import { motion } from 'framer-motion';
import type { StatData } from '../data/initialData';

interface StatsProps {
  stats: StatData[];
  lang: 'en' | 'id';
}

export default function Stats({ stats, lang }: StatsProps) {
  // Stagger container
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 60, damping: 12 },
    },
  };

  return (
    <section className="py-xxl px-gutter bg-zinc-950 relative border-y border-white/5">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.id || idx}
            variants={cardVariants}
            className="text-center p-6 rounded-2xl hover:bg-white/5 transition-all select-none group"
          >
            {/* Numeric stat with hover scale effect */}
            <span className="text-display font-display font-extrabold text-gradient fuchsia-gradient text-5xl md:text-6xl inline-block group-hover:scale-105 transition-transform duration-300">
              {stat.value}
            </span>
            <p className="text-on-surface-variant font-label-md text-xs uppercase mt-3 tracking-widest font-semibold group-hover:text-primary transition-colors">
              {lang === 'en' ? stat.label_en : stat.label_id}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
