import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ArrowUpRight } from 'lucide-react';
import type { ProjectData } from '../data/initialData';

interface ProjectsProps {
  projects: ProjectData[];
  lang: 'en' | 'id';
  settings?: any;
}

export default function Projects({ projects, lang }: ProjectsProps) {
  const [filter, setFilter] = useState('All');
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  // Extract all unique tags to build dynamic filters
  const categories = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags)))];

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => p.tags.includes(filter));

  return (
    <section className="py-xxl px-gutter bg-surface-container-lowest/30 relative" id="work">
      <div className="max-w-container-max mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-headline-lg text-3xl sm:text-4xl md:text-headline-lg font-bold text-on-surface mb-3 break-words"
            >
              {lang === 'en' ? 'Featured Projects' : 'Proyek Unggulan'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-on-surface-variant font-body-md text-base"
            >
              {lang === 'en' ? 'A selection of my recent development work.' : 'Pilihan karya pengembangan terbaru saya.'}
            </motion.p>
          </div>
        </div>

        {/* Categories Filters */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold border transition-all ${
                filter === cat
                  ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(217,70,239,0.3)]'
                  : 'bg-surface-container border-white/5 text-on-surface-variant hover:text-on-surface hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id || project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between cursor-pointer border border-white/5"
                onClick={() => setActiveProject(project)}
              >
                <div>
                  {/* Project Image */}
                  <div className="relative h-56 overflow-hidden border-b border-white/5 bg-zinc-950">
                    <img
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={project.image_url}
                      loading="lazy"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white text-black font-semibold text-xs tracking-wider uppercase px-6 py-2.5 rounded-full flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {lang === 'en' ? 'Explore Case' : 'Pelajari Detail'}
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-display text-xl font-bold mb-2 text-on-surface group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed font-normal">
                      {lang === 'en' ? project.description_en : project.description_id}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/85 backdrop-blur-md"
              onClick={() => setActiveProject(null)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring' as const, damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/80 text-on-surface hover:text-primary rounded-full transition-all border border-white/5"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto">
                {/* Image */}
                <div className="h-64 md:h-80 w-full relative bg-zinc-900 border-b border-white/10">
                  <img
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                    src={activeProject.image_url}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-3xl font-black text-on-surface mb-3">
                    {activeProject.title}
                  </h3>

                  {/* Case Study Details */}
                  <div className="prose prose-invert max-w-none text-on-surface-variant leading-relaxed text-base font-normal space-y-4 mb-8">
                    <p className="font-medium text-on-surface">
                      {lang === 'en' ? activeProject.description_en : activeProject.description_id}
                    </p>
                    <div className="h-[1px] bg-white/5 my-4" />
                    <h4 className="font-bold text-on-surface uppercase text-xs tracking-wider">
                      {lang === 'en' ? 'Detailed Case Study' : 'Studi Kasus Lengkap'}
                    </h4>
                    <p className="text-sm">
                      {lang === 'en' 
                        ? (activeProject.case_study_en || 'Case study details are being compiled for this project.') 
                        : (activeProject.case_study_id || 'Detail studi kasus sedang disusun untuk proyek ini.')}
                    </p>
                  </div>

                  {/* Action Link */}
                  {activeProject.demo_url && (
                    <a
                      href={activeProject.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fuchsia-gradient px-6 py-3 rounded-xl font-bold text-white hover:brightness-110 shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-all inline-flex items-center gap-2"
                    >
                      {lang === 'en' ? 'Launch Project' : 'Kunjungi Proyek'}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
