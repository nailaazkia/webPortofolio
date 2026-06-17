export interface Translations {
  en: string;
  id: string;
}

export interface HeroData {
  name: string;
  title_en: string;
  title_id: string;
  description_en: string;
  description_id: string;
  tags: string[];
  portrait_url: string;
}

export interface AboutData {
  subtitle_en: string;
  subtitle_id: string;
  title_en: string;
  title_id: string;
  vision_title_en: string;
  vision_title_id: string;
  vision_desc_en: string;
  vision_desc_id: string;
  foundation_title_en: string;
  foundation_title_id: string;
  foundation_desc_en: string;
  foundation_desc_id: string;
}

export interface ProjectData {
  id?: number;
  title: string;
  description_en: string;
  description_id: string;
  tags: string[];
  image_url: string;
  demo_url?: string;
  case_study_en?: string;
  case_study_id?: string;
}

export interface ExperienceData {
  id?: number;
  period: string;
  role_en: string;
  role_id: string;
  company: string;
  description_en?: string;
  description_id?: string;
}

export interface SkillData {
  id?: number;
  name: string;
  icon_name: string;
  category: string;
  proficiency: number; // 0 to 100
}

export interface StatData {
  id?: number;
  value: string;
  label_en: string;
  label_id: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export const initialHero: HeroData = {
  name: "Naila",
  title_en: "Crafting Digital Experiences.",
  title_id: "Merancang Pengalaman Digital.",
  description_en: "A versatile developer bridging the gap between technical precision and creative design. Specializing in high-performance web applications and immersive interactive games.",
  description_id: "Pengembang serbabisa yang menghubungkan ketepatan teknis dengan desain kreatif. Spesialisasi dalam aplikasi web berkinerja tinggi dan game interaktif yang imersif.",
  tags: ["Full CMS CRUD", "Game Dev", "Web Dev", "UI/UX"],
  portrait_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzrgBB_Utr4FFe1CASbkLz8hLlcYJQNwj4HFqQWMbv8YhlBR50AarYDV-9PNHif87uuO7J2o0e3pjmApsbdi2P0qxC4pUasOzhHjLS_BBTFx0VIQiak05Ia2HJejmSBijjCVEvZkGiuMR53ZYrKVkLOxWhDgbHHJDi7uUJ9AextINl_LObtX2FTnm9evxtYSYRKCyZxZyXblG2ia4H3HsvJmPXH7I03BZ5ikcNzdlCx9XvPLJKfBost_I8qf-W3pZ-Cup0ZaDMylgQ"
};

export const initialAbout: AboutData = {
  subtitle_en: "The Background",
  subtitle_id: "Latar Belakang",
  title_en: "Passionate About Problem Solving.",
  title_id: "Berdedikasi untuk Memecahkan Masalah.",
  vision_title_en: "Career Vision",
  vision_title_id: "Visi Karir",
  vision_desc_en: "My journey began at the intersection of logic and art. I strive to build applications that are not only functional but also tell a story through seamless user experiences. My goal is to work at the forefront of web technology and game engines, creating tools that empower users and entertainment that inspires.",
  vision_desc_id: "Perjalanan saya dimulai di titik temu antara logika dan seni. Saya berupaya membangun aplikasi yang tidak hanya berfungsi tetapi juga menceritakan sebuah kisah melalui pengalaman pengguna yang mulus. Tujuan saya adalah bekerja di garis depan teknologi web dan engine game, menciptakan alat yang memberdayakan pengguna dan hiburan yang menginspirasi.",
  foundation_title_en: "Technical Foundation",
  foundation_title_id: "Pondasi Teknis",
  foundation_desc_en: "With a strong foundation in both front-end and back-end development, I navigate complex database structures as easily as I do aesthetic layout designs. My experience in Unity allows me to bring a gamified perspective to web interfaces, focusing on engagement and fluid motion.",
  foundation_desc_id: "Dengan fondasi yang kuat dalam pengembangan front-end dan back-end, saya menavigasi struktur database yang kompleks semudah merancang tata letak estetis. Pengalaman saya di Unity memungkinkan saya membawa perspektif gamifikasi ke antarmuka web, dengan fokus pada keterlibatan dan gerakan yang dinamis."
};

export const initialSkills: SkillData[] = [
  { name: "HTML5", icon_name: "html", category: "frontend", proficiency: 95 },
  { name: "CSS3", icon_name: "css", category: "frontend", proficiency: 90 },
  { name: "JavaScript", icon_name: "javascript", category: "frontend", proficiency: 92 },
  { name: "React", icon_name: "dynamic_form", category: "frontend", proficiency: 88 },
  { name: "Laravel", icon_name: "database", category: "backend", proficiency: 80 },
  { name: "Python", icon_name: "code", category: "backend", proficiency: 85 },
  { name: "Unity", icon_name: "sports_esports", category: "game", proficiency: 82 }
];

export const initialProjects: ProjectData[] = [
  {
    title: "Nova Dashboard",
    description_en: "Real-time analytics engine with custom CMS integration.",
    description_id: "Mesin analisis real-time dengan integrasi CMS kustom.",
    tags: ["React", "Firebase"],
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmSSXBs8YljXHirPkEtb3yk5RbhWnaugUN33r9t_x7wRvdbcpRRWvjrCdtHHtgL7UzGrkUPHfaj8wdAzuen-BXXfyoIURFYEUsl7nRNwA1lunRXd9tLE13A3t5UOo4gALJjtWtP-iOjfRAIsLin6ZPhfZUckW8IMvqdqzeeW6BUY8IR1_DI9lKe51-L-Pjh7GhANFbWDNth7HLgnpO7WrFPGDNcrmcVqqYfRU5X4ziDs6TBZmQt7LDliV9D03nYG9QGaNgybre7Szl",
    demo_url: "https://nova-dashboard.dev",
    case_study_en: "Nova Dashboard provides real-time metrics visualisations using chart widgets, featuring secure authentication and custom telemetry ingestion paths.",
    case_study_id: "Nova Dashboard menyediakan visualisasi metrik secara real-time menggunakan widget grafik, menampilkan autentikasi aman dan jalur konsumsi telemetri kustom."
  },
  {
    title: "CyberRunners",
    description_en: "Fast-paced 3D runner built in Unity with procedural levels.",
    description_id: "Runner 3D bertempo cepat yang dibuat di Unity dengan level prosedural.",
    tags: ["Unity", "C#"],
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAG0AebhOvl2-QHRF8V0tqNvxpN4SEouXVZzFYC-neAZ8VxwaeILQT7NpRMEiDp8rnEOJi-vhvJt5_4mswYkgwwP4eR4wC8BZNbalubW5M41mG0VmQJ1oDzMhP8jiHG7xSucmK71D3rBCEsfrZidGKu1j6HcogaEW4p1zb_63QSmbBfME-cOhA2_DHdlNPNaq6NYXzWhq0ROGnVm1nNkaI9HIh4WFyaK_qAAPCxy47vq-wiaBOGok4-cTnR9qyP-jEeOyn0pUmLENwP",
    demo_url: "https://cyberrunners.game",
    case_study_en: "Built using C# scripts and ECS architectures, implementing dynamic path generation, modular obstacle components, and GPU-instanced environmental animations.",
    case_study_id: "Dibuat menggunakan skrip C# dan arsitektur ECS, menerapkan pembuatan jalur dinamis, komponen rintangan modular, dan animasi lingkungan instansi GPU."
  },
  {
    title: "Echo Studio",
    description_en: "Complete design system for a premium audio platform.",
    description_id: "Sistem desain lengkap untuk platform audio premium.",
    tags: ["UI/UX", "Figma"],
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsmiSVghoi-le9TZLO7D_ioesZVlIjlOIdTv_nsEsXuk6_zZ0L-oBFLxnlRN5rXBrkyTM0gJKpgizTcGYu0RhhPLrZTtp5Ja_SgvUqXrynpU0pAColyL4AWKtojx7p4tWsW1wt-PUPkBvf_Qe5zBL4IEm0K1MHtuxdYtrRRZtaVeWQ0A_wYk0KdNfJphfqBaonQXs6HTwvAeQhJ7up3EATO_sovfdfUhN1Ty91rZGHPr-rU3UGl2HEf30L0yVZIrFfZILVsdiYY6u5",
    demo_url: "https://figma.com/file/echo-studio",
    case_study_en: "Designed a dark-themed visual design system with robust typography tokens, high-fidelity responsive components, layout grids, and motion micro-interactions.",
    case_study_id: "Merancang sistem desain visual bertema gelap dengan token tipografi yang kuat, komponen responsif fidelitas tinggi, kisi tata letak, dan mikro-interaksi gerakan."
  }
];

export const initialExperience: ExperienceData[] = [
  {
    period: "2022 - Present",
    role_en: "Senior Web Developer",
    role_id: "Developer Web Senior",
    company: "Nexus Tech Solutions",
    description_en: "Led high-impact frontend products, optimized page load-times, and integrated full-scale CMS structures for regional clients.",
    description_id: "Memimpin produk frontend berdampak tinggi, mengoptimalkan waktu muat halaman, dan mengintegrasikan struktur CMS skala penuh untuk klien regional."
  },
  {
    period: "2020 - 2022",
    role_en: "Junior Game Developer",
    role_id: "Developer Game Junior",
    company: "Arcade Dream Studio",
    description_en: "Contributed to runner games development, built procedural generation tools in Unity, and maintained C# scripts codebase.",
    description_id: "Berkontribusi pada pengembangan game runner, membuat alat pembuatan prosedural di Unity, dan memelihara basis kode skrip C#."
  },
  {
    period: "2016 - 2020",
    role_en: "B.Sc. Computer Science",
    role_id: "Sarjana Ilmu Komputer",
    company: "Global Institute of Technology",
    description_en: "Acquired deep technical competencies in algorithms, web design architectures, database systems, and object-oriented designs.",
    description_id: "Memperoleh kompetensi teknis yang mendalam dalam algoritma, arsitektur desain web, sistem database, dan desain berorientasi objek."
  }
];

export const initialStats: StatData[] = [
  { value: "50+", label_en: "Projects Completed", label_id: "Proyek Selesai" },
  { value: "10+", label_en: "Awards Won", label_id: "Penghargaan Diraih" },
  { value: "5k+", label_en: "Coffee Cups", label_id: "Cangkir Kopi" },
  { value: "12", label_en: "Tech Stacks", label_id: "Tech Stacks" }
];

export interface SettingsData {
  logo_text: string;
  skills_title_en: string;
  skills_title_id: string;
  skills_desc_en: string;
  skills_desc_id: string;
  projects_title_en: string;
  projects_title_id: string;
  projects_desc_en: string;
  projects_desc_id: string;
  experience_title_en: string;
  experience_title_id: string;
  experience_desc_en: string;
  experience_desc_id: string;
  contact_email: string;
  contact_phone: string;
  contact_linkedin: string;
  contact_title_en: string;
  contact_title_id: string;
  contact_desc_en: string;
  contact_desc_id: string;
  footer_text_en: string;
  footer_text_id: string;
}

export const initialSettings: SettingsData = {
  logo_text: 'PortoNaila',
  skills_title_en: 'Technical Stack',
  skills_title_id: 'Keahlian Teknis',
  skills_desc_en: 'Mastering the tools that build the modern web.',
  skills_desc_id: 'Menguasai alat-alat yang membangun web modern.',
  projects_title_en: 'Featured Projects',
  projects_title_id: 'Proyek Unggulan',
  projects_desc_en: 'A selection of my recent development work.',
  projects_desc_id: 'Pilihan karya pengembangan terbaru saya.',
  experience_title_en: 'Experience & Education',
  experience_title_id: 'Pengalaman & Pendidikan',
  experience_desc_en: 'The milestones of my professional journey.',
  experience_desc_id: 'Tonggak sejarah perjalanan profesional saya.',
  contact_email: 'hello@portonaila.dev',
  contact_phone: '',
  contact_linkedin: '',
  contact_title_en: 'Get In Touch.',
  contact_title_id: 'Hubungi Saya.',
  contact_desc_en: "Have a project in mind or just want to say hi? I'm always open to discussing new opportunities.",
  contact_desc_id: 'Punya proyek dalam pikiran atau hanya ingin menyapa? Saya selalu terbuka untuk mendiskusikan peluang baru.',
  footer_text_en: 'Crafted with precision.',
  footer_text_id: 'Dibuat dengan presisi.',
};
