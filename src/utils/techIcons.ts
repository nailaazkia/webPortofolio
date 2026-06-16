/**
 * Maps common technology names to their Devicon slug for auto logo resolution.
 * Devicon CDN: https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/
 * 
 * When a user types a skill name (e.g. "React"), we look it up here
 * and return the appropriate Devicon SVG URL.
 */

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

// Map of lowercase skill name → { folder, file } in Devicon repo
const techMap: Record<string, { folder: string; file: string }> = {
  // Frontend
  'html': { folder: 'html5', file: 'html5-original' },
  'html5': { folder: 'html5', file: 'html5-original' },
  'css': { folder: 'css3', file: 'css3-original' },
  'css3': { folder: 'css3', file: 'css3-original' },
  'javascript': { folder: 'javascript', file: 'javascript-original' },
  'js': { folder: 'javascript', file: 'javascript-original' },
  'typescript': { folder: 'typescript', file: 'typescript-original' },
  'ts': { folder: 'typescript', file: 'typescript-original' },
  'react': { folder: 'react', file: 'react-original' },
  'reactjs': { folder: 'react', file: 'react-original' },
  'react native': { folder: 'react', file: 'react-original' },
  'vue': { folder: 'vuejs', file: 'vuejs-original' },
  'vuejs': { folder: 'vuejs', file: 'vuejs-original' },
  'vue.js': { folder: 'vuejs', file: 'vuejs-original' },
  'angular': { folder: 'angularjs', file: 'angularjs-original' },
  'angularjs': { folder: 'angularjs', file: 'angularjs-original' },
  'svelte': { folder: 'svelte', file: 'svelte-original' },
  'nextjs': { folder: 'nextjs', file: 'nextjs-original' },
  'next.js': { folder: 'nextjs', file: 'nextjs-original' },
  'next': { folder: 'nextjs', file: 'nextjs-original' },
  'nuxt': { folder: 'nuxtjs', file: 'nuxtjs-original' },
  'nuxtjs': { folder: 'nuxtjs', file: 'nuxtjs-original' },
  'tailwind': { folder: 'tailwindcss', file: 'tailwindcss-original' },
  'tailwindcss': { folder: 'tailwindcss', file: 'tailwindcss-original' },
  'bootstrap': { folder: 'bootstrap', file: 'bootstrap-original' },
  'sass': { folder: 'sass', file: 'sass-original' },
  'scss': { folder: 'sass', file: 'sass-original' },
  'jquery': { folder: 'jquery', file: 'jquery-original' },

  // Backend
  'nodejs': { folder: 'nodejs', file: 'nodejs-original' },
  'node': { folder: 'nodejs', file: 'nodejs-original' },
  'node.js': { folder: 'nodejs', file: 'nodejs-original' },
  'express': { folder: 'express', file: 'express-original' },
  'expressjs': { folder: 'express', file: 'express-original' },
  'python': { folder: 'python', file: 'python-original' },
  'django': { folder: 'django', file: 'django-plain' },
  'flask': { folder: 'flask', file: 'flask-original' },
  'php': { folder: 'php', file: 'php-original' },
  'laravel': { folder: 'laravel', file: 'laravel-original' },
  'ruby': { folder: 'ruby', file: 'ruby-original' },
  'rails': { folder: 'rails', file: 'rails-original' },
  'ruby on rails': { folder: 'rails', file: 'rails-original' },
  'java': { folder: 'java', file: 'java-original' },
  'spring': { folder: 'spring', file: 'spring-original' },
  'go': { folder: 'go', file: 'go-original' },
  'golang': { folder: 'go', file: 'go-original' },
  'rust': { folder: 'rust', file: 'rust-original' },
  'kotlin': { folder: 'kotlin', file: 'kotlin-original' },
  'swift': { folder: 'swift', file: 'swift-original' },

  // Game & Creative
  'unity': { folder: 'unity', file: 'unity-original' },
  'unreal': { folder: 'unrealengine', file: 'unrealengine-original' },
  'unreal engine': { folder: 'unrealengine', file: 'unrealengine-original' },
  'godot': { folder: 'godot', file: 'godot-original' },
  'blender': { folder: 'blender', file: 'blender-original' },

  // Languages
  'c': { folder: 'c', file: 'c-original' },
  'c++': { folder: 'cplusplus', file: 'cplusplus-original' },
  'cpp': { folder: 'cplusplus', file: 'cplusplus-original' },
  'c#': { folder: 'csharp', file: 'csharp-original' },
  'csharp': { folder: 'csharp', file: 'csharp-original' },
  'r': { folder: 'r', file: 'r-original' },
  'lua': { folder: 'lua', file: 'lua-original' },
  'dart': { folder: 'dart', file: 'dart-original' },
  'scala': { folder: 'scala', file: 'scala-original' },

  // Databases
  'mysql': { folder: 'mysql', file: 'mysql-original' },
  'postgresql': { folder: 'postgresql', file: 'postgresql-original' },
  'postgres': { folder: 'postgresql', file: 'postgresql-original' },
  'mongodb': { folder: 'mongodb', file: 'mongodb-original' },
  'mongo': { folder: 'mongodb', file: 'mongodb-original' },
  'redis': { folder: 'redis', file: 'redis-original' },
  'sqlite': { folder: 'sqlite', file: 'sqlite-original' },
  'firebase': { folder: 'firebase', file: 'firebase-original' },
  'supabase': { folder: 'supabase', file: 'supabase-original' },

  // DevOps & Cloud
  'docker': { folder: 'docker', file: 'docker-original' },
  'kubernetes': { folder: 'kubernetes', file: 'kubernetes-original' },
  'aws': { folder: 'amazonwebservices', file: 'amazonwebservices-original-wordmark' },
  'azure': { folder: 'azure', file: 'azure-original' },
  'gcp': { folder: 'googlecloud', file: 'googlecloud-original' },
  'google cloud': { folder: 'googlecloud', file: 'googlecloud-original' },
  'linux': { folder: 'linux', file: 'linux-original' },
  'nginx': { folder: 'nginx', file: 'nginx-original' },
  'vercel': { folder: 'vercel', file: 'vercel-original' },
  'netlify': { folder: 'netlify', file: 'netlify-original' },
  'heroku': { folder: 'heroku', file: 'heroku-original' },

  // Tools
  'git': { folder: 'git', file: 'git-original' },
  'github': { folder: 'github', file: 'github-original' },
  'gitlab': { folder: 'gitlab', file: 'gitlab-original' },
  'vscode': { folder: 'vscode', file: 'vscode-original' },
  'figma': { folder: 'figma', file: 'figma-original' },
  'photoshop': { folder: 'photoshop', file: 'photoshop-original' },
  'illustrator': { folder: 'illustrator', file: 'illustrator-plain' },
  'xd': { folder: 'xd', file: 'xd-original' },
  'canva': { folder: 'canva', file: 'canva-original' },
  'npm': { folder: 'npm', file: 'npm-original-wordmark' },
  'yarn': { folder: 'yarn', file: 'yarn-original' },
  'webpack': { folder: 'webpack', file: 'webpack-original' },
  'vite': { folder: 'vitejs', file: 'vitejs-original' },
  'babel': { folder: 'babel', file: 'babel-original' },
  'jest': { folder: 'jest', file: 'jest-plain' },
  'postman': { folder: 'postman', file: 'postman-original' },
  'jira': { folder: 'jira', file: 'jira-original' },
  'trello': { folder: 'trello', file: 'trello-original' },
  'slack': { folder: 'slack', file: 'slack-original' },
  'notion': { folder: 'notion', file: 'notion-original' },

  // Mobile
  'flutter': { folder: 'flutter', file: 'flutter-original' },
  'android': { folder: 'android', file: 'android-original' },
  'ios': { folder: 'apple', file: 'apple-original' },
  'apple': { folder: 'apple', file: 'apple-original' },

  // Misc / Framework
  'graphql': { folder: 'graphql', file: 'graphql-plain' },
  'threejs': { folder: 'threejs', file: 'threejs-original' },
  'three.js': { folder: 'threejs', file: 'threejs-original' },
  'electron': { folder: 'electron', file: 'electron-original' },
  'wordpress': { folder: 'wordpress', file: 'wordpress-original' },
  'markdown': { folder: 'markdown', file: 'markdown-original' },

  // UI/UX as design tools
  'ui/ux': { folder: 'figma', file: 'figma-original' },
  'uiux': { folder: 'figma', file: 'figma-original' },
};

/**
 * Get the Devicon SVG URL for a technology name.
 * Returns null if the tech is not found in the mapping.
 */
export function getTechIconUrl(name: string): string | null {
  const key = name.toLowerCase().trim();
  const entry = techMap[key];
  if (!entry) return null;
  return `${DEVICON_BASE}/${entry.folder}/${entry.file}.svg`;
}

/**
 * Check if a given technology name has a known icon.
 */
export function hasTechIcon(name: string): boolean {
  return techMap[name.toLowerCase().trim()] !== undefined;
}

/**
 * Get all supported tech names for reference.
 */
export function getSupportedTechs(): string[] {
  return Object.keys(techMap);
}
