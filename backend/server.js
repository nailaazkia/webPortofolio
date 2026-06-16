const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// URL rewriting for Vercel routing compatibility
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  next();
});
app.use(express.json({ limit: '50mb' })); // Support base64 image uploads up to 50MB
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database connection
const isPostgres = true;
const pgUrl = 'postgresql://postgres.cxrsgugomkuepwjlhyju:Pandacute1234-@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres';

let db;
let pool;

if (isPostgres) {
  pool = new Pool({
    connectionString: pgUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
  console.log('Connected to online Supabase PostgreSQL database.');
  // Initialize Database
  initializeDatabase();
} else {
  const dbPath = path.join(__dirname, 'database.sqlite');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database:', err.message);
    } else {
      console.log('Connected to SQLite database at:', dbPath);
      initializeDatabase();
    }
  });
}

// Helper for running SQL promises (supporting both SQLite and PostgreSQL)
const dbRun = async (sql, params = []) => {
  if (isPostgres) {
    let index = 1;
    let postgresSql = sql.replace(/\?/g, () => `$${index++}`);
    // Replace SQLite autoincrement and column types for PostgreSQL compatibility
    postgresSql = postgresSql.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY');
    postgresSql = postgresSql.replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/gi, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    // PostgreSQL INSERT returning lastID simulation
    if (postgresSql.trim().toUpperCase().startsWith('INSERT INTO')) {
      postgresSql += ' RETURNING id';
    }
    const res = await pool.query(postgresSql, params);
    return { lastID: res.rows[0]?.id || null };
  } else {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }
};

const dbAll = async (sql, params = []) => {
  if (isPostgres) {
    let index = 1;
    let postgresSql = sql.replace(/\?/g, () => `$${index++}`);
    postgresSql = postgresSql.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY');
    postgresSql = postgresSql.replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/gi, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    const res = await pool.query(postgresSql, params);
    return res.rows;
  } else {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

const dbGet = async (sql, params = []) => {
  if (isPostgres) {
    let index = 1;
    let postgresSql = sql.replace(/\?/g, () => `$${index++}`);
    postgresSql = postgresSql.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY');
    postgresSql = postgresSql.replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/gi, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    const res = await pool.query(postgresSql, params);
    return res.rows[0];
  } else {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};

// Database Initialization & Seeding
async function initializeDatabase() {
  try {
    // 1. Hero Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS hero (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        title_en TEXT NOT NULL,
        title_id TEXT NOT NULL,
        description_en TEXT,
        description_id TEXT,
        tags TEXT, -- JSON string of tags
        portrait_url TEXT
      )
    `);

    // 2. About Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS about (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subtitle_en TEXT,
        subtitle_id TEXT,
        title_en TEXT,
        title_id TEXT,
        vision_title_en TEXT,
        vision_title_id TEXT,
        vision_desc_en TEXT,
        vision_desc_id TEXT,
        foundation_title_en TEXT,
        foundation_title_id TEXT,
        foundation_desc_en TEXT,
        foundation_desc_id TEXT
      )
    `);

    // 3. Projects Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description_en TEXT NOT NULL,
        description_id TEXT NOT NULL,
        tags TEXT, -- JSON string of tags
        image_url TEXT, -- URL or Base64 string
        demo_url TEXT,
        case_study_en TEXT,
        case_study_id TEXT
      )
    `);

    // 4. Experiences Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS experiences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        period TEXT NOT NULL,
        role_en TEXT NOT NULL,
        role_id TEXT NOT NULL,
        company TEXT NOT NULL,
        description_en TEXT,
        description_id TEXT
      )
    `);

    // 5. Skills Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon_name TEXT NOT NULL,
        category TEXT NOT NULL, -- frontend, backend, game, other
        proficiency INTEGER DEFAULT 80
      )
    `);

    // 6. Stats Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value TEXT NOT NULL,
        label_en TEXT NOT NULL,
        label_id TEXT NOT NULL
      )
    `);

    // 7. Contact Messages Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 8. Settings Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        logo_text TEXT NOT NULL,
        skills_title_en TEXT NOT NULL,
        skills_title_id TEXT NOT NULL,
        skills_desc_en TEXT NOT NULL,
        skills_desc_id TEXT NOT NULL,
        projects_title_en TEXT NOT NULL,
        projects_title_id TEXT NOT NULL,
        projects_desc_en TEXT NOT NULL,
        projects_desc_id TEXT NOT NULL,
        experience_title_en TEXT NOT NULL,
        experience_title_id TEXT NOT NULL,
        experience_desc_en TEXT NOT NULL,
        experience_desc_id TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        contact_title_en TEXT NOT NULL,
        contact_title_id TEXT NOT NULL,
        contact_desc_en TEXT NOT NULL,
        contact_desc_id TEXT NOT NULL,
        footer_text_en TEXT NOT NULL,
        footer_text_id TEXT NOT NULL
      )
    `);

    console.log('Database tables verified/created successfully.');
    await seedDefaultData();
  } catch (error) {
    console.error('Error initializing tables:', error);
  }
}

async function seedDefaultData() {
  // Check if Hero table is empty
  const heroCount = await dbGet('SELECT COUNT(*) as count FROM hero');
  if (heroCount.count === 0) {
    console.log('Seeding default Hero data...');
    await dbRun(
      `INSERT INTO hero (name, title_en, title_id, description_en, description_id, tags, portrait_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'Naila',
        'Crafting Digital Experiences.',
        'Merancang Pengalaman Digital.',
        'A versatile developer bridging the gap between technical precision and creative design. Specializing in high-performance web applications and immersive interactive games.',
        'Pengembang serbabisa yang menghubungkan ketepatan teknis dengan desain kreatif. Spesialisasi dalam aplikasi web berkinerja tinggi dan game interaktif yang imersif.',
        JSON.stringify(["Full CMS CRUD", "Game Dev", "Web Dev", "UI/UX"]),
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDzrgBB_Utr4FFe1CASbkLz8hLlcYJQNwj4HFqQWMbv8YhlBR50AarYDV-9PNHif87uuO7J2o0e3pjmApsbdi2P0qxC4pUasOzhHjLS_BBTFx0VIQiak05Ia2HJejmSBijjCVEvZkGiuMR53ZYrKVkLOxWhDgbHHJDi7uUJ9AextINl_LObtX2FTnm9evxtYSYRKCyZxZyXblG2ia4H3HsvJmPXH7I03BZ5ikcNzdlCx9XvPLJKfBost_I8qf-W3pZ-Cup0ZaDMylgQ'
      ]
    );
  }

  // Check if About is empty
  const aboutCount = await dbGet('SELECT COUNT(*) as count FROM about');
  if (aboutCount.count === 0) {
    console.log('Seeding default About data...');
    await dbRun(
      `INSERT INTO about (subtitle_en, subtitle_id, title_en, title_id, vision_title_en, vision_title_id, vision_desc_en, vision_desc_id, foundation_title_en, foundation_title_id, foundation_desc_en, foundation_desc_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'The Background', 'Latar Belakang',
        'Passionate About Problem Solving.', 'Berdedikasi untuk Memecahkan Masalah.',
        'Career Vision', 'Visi Karir',
        'My journey began at the intersection of logic and art. I strive to build applications that are not only functional but also tell a story through seamless user experiences. My goal is to work at the forefront of web technology and game engines, creating tools that empower users and entertainment that inspires.',
        'Perjalanan saya dimulai di titik temu antara logika dan seni. Saya berupaya membangun aplikasi yang tidak hanya berfungsi tetapi juga menceritakan sebuah kisah melalui pengalaman pengguna yang mulus. Tujuan saya adalah bekerja di garis depan teknologi web dan engine game, menciptakan alat yang memberdayakan pengguna dan hiburan yang menginspirasi.',
        'Technical Foundation', 'Pondasi Teknis',
        'With a strong foundation in both front-end and back-end development, I navigate complex database structures as easily as I do aesthetic layout designs. My experience in Unity allows me to bring a gamified perspective to web interfaces, focusing on engagement and fluid motion.',
        'Dengan fondasi yang kuat dalam pengembangan front-end dan back-end, saya menavigasi struktur database yang kompleks semudah merancang tata letak estetis. Pengalaman saya di Unity memungkinkan saya membawa perspektif gamifikasi ke antarmuka web, dengan fokus pada keterlibatan dan gerakan yang dinamis.'
      ]
    );
  }

  // Check if Projects is empty
  const projectCount = await dbGet('SELECT COUNT(*) as count FROM projects');
  if (projectCount.count === 0) {
    console.log('Seeding default Projects data...');
    const defaultProjects = [
      {
        title: "Nova Dashboard",
        description_en: "Real-time analytics engine with custom CMS integration.",
        description_id: "Mesin analisis real-time dengan integrasi CMS kustom.",
        tags: JSON.stringify(["React", "Firebase"]),
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmSSXBs8YljXHirPkEtb3yk5RbhWnaugUN33r9t_x7wRvdbcpRRWvjrCdtHHtgL7UzGrkUPHfaj8wdAzuen-BXXfyoIURFYEUsl7nRNwA1lunRXd9tLE13A3t5UOo4gALJjtWtP-iOjfRAIsLin6ZPhfZUckW8IMvqdqzeeW6BUY8IR1_DI9lKe51-L-Pjh7GhANFbWDNth7HLgnpO7WrFPGDNcrmcVqqYfRU5X4ziDs6TBZmQt7LDliV9D03nYG9QGaNgybre7Szl",
        demo_url: "https://nova-dashboard.dev",
        case_study_en: "Nova Dashboard provides real-time metrics visualisations using chart widgets, featuring secure authentication and custom telemetry ingestion paths.",
        case_study_id: "Nova Dashboard menyediakan visualisasi metrik secara real-time menggunakan widget grafik, menampilkan autentikasi aman dan jalur konsumsi telemetri kustom."
      },
      {
        title: "CyberRunners",
        description_en: "Fast-paced 3D runner built in Unity with procedural levels.",
        description_id: "Runner 3D bertempo cepat yang dibuat di Unity dengan level prosedural.",
        tags: JSON.stringify(["Unity", "C#"]),
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAG0AebhOvl2-QHRF8V0tqNvxpN4SEouXVZzFYC-neAZ8VxwaeILQT7NpRMEiDp8rnEOJi-vhvJt5_4mswYkgwwP4eR4wC8BZNbalubW5M41mG0VmQJ1oDzMhP8jiHG7xSucmK71D3rBCEsfrZidGKu1j6HcogaEW4p1zb_63QSmbBfME-cOhA2_DHdlNPNaq6NYXzWhq0ROGnVm1nNkaI9HIh4WFyaK_qAAPCxy47vq-wiaBOGok4-cTnR9qyP-jEeOyn0pUmLENwP",
        demo_url: "https://cyberrunners.game",
        case_study_en: "Built using C# scripts and ECS architectures, implementing dynamic path generation, modular obstacle components, and GPU-instanced environmental animations.",
        case_study_id: "Dibuat menggunakan skrip C# dan arsitektur ECS, menerapkan pembuatan jalur dinamis, komponen rintangan modular, dan animasi lingkungan instansi GPU."
      },
      {
        title: "Echo Studio",
        description_en: "Complete design system for a premium audio platform.",
        description_id: "Sistem desain lengkap untuk platform audio premium.",
        tags: JSON.stringify(["UI/UX", "Figma"]),
        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsmiSVghoi-le9TZLO7D_ioesZVlIjlOIdTv_nsEsXuk6_zZ0L-oBFLxnlRN5rXBrkyTM0gJKpgizTcGYu0RhhPLrZTtp5Ja_SgvUqXrynpU0pAColyL4AWKtojx7p4tWsW1wt-PUPkBvf_Qe5zBL4IEm0K1MHtuxdYtrRRZtaVeWQ0A_wYk0KdNfJphfqBaonQXs6HTwvAeQhJ7up3EATO_sovfdfUhN1Ty91rZGHPr-rU3UGl2HEf30L0yVZIrFfZILVsdiYY6u5",
        demo_url: "https://figma.com/file/echo-studio",
        case_study_en: "Designed a dark-themed visual design system with robust typography tokens, high-fidelity responsive components, layout grids, and motion micro-interactions.",
        case_study_id: "Merancang sistem desain visual bertema gelap dengan token tipografi yang kuat, komponen responsif fidelitas tinggi, kisi tata letak, dan mikro-interaksi gerakan."
      }
    ];
    for (const p of defaultProjects) {
      await dbRun(
        `INSERT INTO projects (title, description_en, description_id, tags, image_url, demo_url, case_study_en, case_study_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.title, p.description_en, p.description_id, p.tags, p.image_url, p.demo_url, p.case_study_en, p.case_study_id]
      );
    }
  }

  // Check if Experiences is empty
  const expCount = await dbGet('SELECT COUNT(*) as count FROM experiences');
  if (expCount.count === 0) {
    console.log('Seeding default Experience data...');
    const defaultExps = [
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
    for (const e of defaultExps) {
      await dbRun(
        `INSERT INTO experiences (period, role_en, role_id, company, description_en, description_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [e.period, e.role_en, e.role_id, e.company, e.description_en, e.description_id]
      );
    }
  }

  // Check if Skills is empty
  const skillCount = await dbGet('SELECT COUNT(*) as count FROM skills');
  if (skillCount.count === 0) {
    console.log('Seeding default Skills data...');
    const defaultSkills = [
      { name: "HTML5", icon_name: "html", category: "frontend", proficiency: 95 },
      { name: "CSS3", icon_name: "css", category: "frontend", proficiency: 90 },
      { name: "JavaScript", icon_name: "javascript", category: "frontend", proficiency: 92 },
      { name: "React", icon_name: "dynamic_form", category: "frontend", proficiency: 88 },
      { name: "Laravel", icon_name: "database", category: "backend", proficiency: 80 },
      { name: "Python", icon_name: "code", category: "backend", proficiency: 85 },
      { name: "Unity", icon_name: "sports_esports", category: "game", proficiency: 82 }
    ];
    for (const s of defaultSkills) {
      await dbRun(
        `INSERT INTO skills (name, icon_name, category, proficiency)
         VALUES (?, ?, ?, ?)`,
        [s.name, s.icon_name, s.category, s.proficiency]
      );
    }
  }

  // Check if Stats is empty
  const statCount = await dbGet('SELECT COUNT(*) as count FROM stats');
  if (statCount.count === 0) {
    console.log('Seeding default Stats data...');
    const defaultStats = [
      { value: "50+", label_en: "Projects Completed", label_id: "Proyek Selesai" },
      { value: "10+", label_en: "Awards Won", label_id: "Penghargaan Diraih" },
      { value: "5k+", label_en: "Coffee Cups", label_id: "Cangkir Kopi" },
      { value: "12", label_en: "Tech Stacks", label_id: "Tech Stacks" }
    ];
    for (const st of defaultStats) {
      await dbRun(
        `INSERT INTO stats (value, label_en, label_id)
         VALUES (?, ?, ?)`,
        [st.value, st.label_en, st.label_id]
      );
    }
  }

  // Check if Settings is empty
  const settingsCount = await dbGet('SELECT COUNT(*) as count FROM settings');
  if (settingsCount.count === 0) {
    console.log('Seeding default Settings data...');
    await dbRun(
      `INSERT INTO settings (
        logo_text,
        skills_title_en, skills_title_id, skills_desc_en, skills_desc_id,
        projects_title_en, projects_title_id, projects_desc_en, projects_desc_id,
        experience_title_en, experience_title_id, experience_desc_en, experience_desc_id,
        contact_email, contact_title_en, contact_title_id, contact_desc_en, contact_desc_id,
        footer_text_en, footer_text_id
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'PortoNaila',
        'Technical Stack', 'Keahlian Teknis', 'Mastering the tools that build the modern web.', 'Menguasai alat-alat yang membangun web modern.',
        'Featured Projects', 'Proyek Unggulan', 'A selection of my recent development work.', 'Pilihan karya pengembangan terbaru saya.',
        'Experience & Education', 'Pengalaman & Pendidikan', 'The milestones of my professional journey.', 'Tonggak sejarah perjalanan profesional saya.',
        'hello@portonaila.dev', 'Get In Touch.', 'Hubungi Saya.', 'Have a project in mind or just want to say hi? I\'m always open to discussing new opportunities.', 'Punya proyek dalam pikiran atau hanya ingin menyapa? Saya selalu terbuka untuk mendiskusikan peluang baru.',
        'Crafted with precision.', 'Dibuat dengan presisi.'
      ]
    );
  }
}

// Google Translate API helper (translates from ID to EN)
async function translateText(text) {
  if (!text || typeof text !== 'string' || text.trim() === '') return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json && json[0]) {
        return json[0].map(item => item[0]).join('');
      }
    }
  } catch (err) {
    console.error('Translation failed:', err);
  }
  return text; // Fallback to original text if API fails
}

// API Routes

// 1. Get Portfolio Data (Combined query for quick loading)
app.get('/api/portfolio', async (req, res) => {
  try {
    const hero = await dbGet('SELECT * FROM hero LIMIT 1');
    if (hero) {
      hero.tags = JSON.parse(hero.tags || '[]');
    }
    const about = await dbGet('SELECT * FROM about LIMIT 1');
    const projects = await dbAll('SELECT * FROM projects');
    projects.forEach(p => p.tags = JSON.parse(p.tags || '[]'));
    const experiences = await dbAll('SELECT * FROM experiences ORDER BY id ASC');
    const skills = await dbAll('SELECT * FROM skills');
    const stats = await dbAll('SELECT * FROM stats');
    const settings = await dbGet('SELECT * FROM settings LIMIT 1');

    res.json({
      hero: hero || {},
      about: about || {},
      projects,
      experiences,
      skills,
      stats,
      settings: settings || {}
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Hero Updates
app.put('/api/hero', async (req, res) => {
  const { name, title_id, description_id, tags, portrait_url } = req.body;
  try {
    const title_en = await translateText(title_id);
    const description_en = await translateText(description_id);
    const tagsString = JSON.stringify(tags || []);
    await dbRun(
      `UPDATE hero SET name = ?, title_en = ?, title_id = ?, description_en = ?, description_id = ?, tags = ?, portrait_url = ? WHERE id = 1`,
      [name, title_en, title_id, description_en, description_id, tagsString, portrait_url]
    );
    res.json({ message: 'Hero updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. About Updates
app.put('/api/about', async (req, res) => {
  const { subtitle_id, title_id, vision_title_id, vision_desc_id, foundation_title_id, foundation_desc_id } = req.body;
  try {
    const subtitle_en = await translateText(subtitle_id);
    const title_en = await translateText(title_id);
    const vision_title_en = await translateText(vision_title_id);
    const vision_desc_en = await translateText(vision_desc_id);
    const foundation_title_en = await translateText(foundation_title_id);
    const foundation_desc_en = await translateText(foundation_desc_id);
    await dbRun(
      `UPDATE about SET subtitle_en = ?, subtitle_id = ?, title_en = ?, title_id = ?, vision_title_en = ?, vision_title_id = ?, vision_desc_en = ?, vision_desc_id = ?, foundation_title_en = ?, foundation_title_id = ?, foundation_desc_en = ?, foundation_desc_id = ? WHERE id = 1`,
      [subtitle_en, subtitle_id, title_en, title_id, vision_title_en, vision_title_id, vision_desc_en, vision_desc_id, foundation_title_en, foundation_title_id, foundation_desc_en, foundation_desc_id]
    );
    res.json({ message: 'About section updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Projects CRUD
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await dbAll('SELECT * FROM projects');
    projects.forEach(p => p.tags = JSON.parse(p.tags || '[]'));
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  const { title, description_id, tags, image_url, demo_url, case_study_id } = req.body;
  try {
    const description_en = await translateText(description_id);
    const case_study_en = await translateText(case_study_id);
    const tagsString = JSON.stringify(tags || []);
    const result = await dbRun(
      `INSERT INTO projects (title, description_en, description_id, tags, image_url, demo_url, case_study_en, case_study_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description_en, description_id, tagsString, image_url, demo_url, case_study_en, case_study_id]
    );
    res.json({ id: result.lastID, message: 'Project created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description_id, tags, image_url, demo_url, case_study_id } = req.body;
  try {
    const description_en = await translateText(description_id);
    const case_study_en = await translateText(case_study_id);
    const tagsString = JSON.stringify(tags || []);
    await dbRun(
      `UPDATE projects SET title = ?, description_en = ?, description_id = ?, tags = ?, image_url = ?, demo_url = ?, case_study_en = ?, case_study_id = ? WHERE id = ?`,
      [title, description_en, description_id, tagsString, image_url, demo_url, case_study_en, case_study_id, id]
    );
    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await dbRun('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Experiences CRUD
app.get('/api/experiences', async (req, res) => {
  try {
    const experiences = await dbAll('SELECT * FROM experiences ORDER BY id ASC');
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/experiences', async (req, res) => {
  const { period, role_id, company, description_id } = req.body;
  try {
    const role_en = await translateText(role_id);
    const description_en = await translateText(description_id);
    const result = await dbRun(
      `INSERT INTO experiences (period, role_en, role_id, company, description_en, description_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [period, role_en, role_id, company, description_en, description_id]
    );
    res.json({ id: result.lastID, message: 'Experience added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/experiences/:id', async (req, res) => {
  const { id } = req.params;
  const { period, role_id, company, description_id } = req.body;
  try {
    const role_en = await translateText(role_id);
    const description_en = await translateText(description_id);
    await dbRun(
      `UPDATE experiences SET period = ?, role_en = ?, role_id = ?, company = ?, description_en = ?, description_id = ? WHERE id = ?`,
      [period, role_en, role_id, company, description_en, description_id, id]
    );
    res.json({ message: 'Experience updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/experiences/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await dbRun('DELETE FROM experiences WHERE id = ?', [id]);
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Skills CRUD
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await dbAll('SELECT * FROM skills');
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/skills', async (req, res) => {
  const { name, icon_name, category, proficiency } = req.body;
  try {
    const result = await dbRun(
      `INSERT INTO skills (name, icon_name, category, proficiency) VALUES (?, ?, ?, ?)`,
      [name, icon_name, category, proficiency]
    );
    res.json({ id: result.lastID, message: 'Skill created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/skills/:id', async (req, res) => {
  const { id } = req.params;
  const { name, icon_name, category, proficiency } = req.body;
  try {
    await dbRun(
      `UPDATE skills SET name = ?, icon_name = ?, category = ?, proficiency = ? WHERE id = ?`,
      [name, icon_name, category, proficiency, id]
    );
    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/skills/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await dbRun('DELETE FROM skills WHERE id = ?', [id]);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Stats CRUD
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await dbAll('SELECT * FROM stats');
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stats', async (req, res) => {
  const { value, label_id } = req.body;
  try {
    const label_en = await translateText(label_id);
    const result = await dbRun(
      `INSERT INTO stats (value, label_en, label_id) VALUES (?, ?, ?)`,
      [value, label_en, label_id]
    );
    res.json({ id: result.lastID, message: 'Stat created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/stats/:id', async (req, res) => {
  const { id } = req.params;
  const { value, label_id } = req.body;
  try {
    const label_en = await translateText(label_id);
    await dbRun(
      `UPDATE stats SET value = ?, label_en = ?, label_id = ? WHERE id = ?`,
      [value, label_en, label_id, id]
    );
    res.json({ message: 'Stat updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/stats/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await dbRun('DELETE FROM stats WHERE id = ?', [id]);
    res.json({ message: 'Stat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Settings API (GET and PUT)
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await dbGet('SELECT * FROM settings LIMIT 1');
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings', async (req, res) => {
  const {
    logo_text,
    skills_title_id, skills_desc_id,
    projects_title_id, projects_desc_id,
    experience_title_id, experience_desc_id,
    contact_email, contact_title_id, contact_desc_id,
    footer_text_id
  } = req.body;
  try {
    const skills_title_en = await translateText(skills_title_id);
    const skills_desc_en = await translateText(skills_desc_id);
    const projects_title_en = await translateText(projects_title_id);
    const projects_desc_en = await translateText(projects_desc_id);
    const experience_title_en = await translateText(experience_title_id);
    const experience_desc_en = await translateText(experience_desc_id);
    const contact_title_en = await translateText(contact_title_id);
    const contact_desc_en = await translateText(contact_desc_id);
    const footer_text_en = await translateText(footer_text_id);

    await dbRun(
      `UPDATE settings SET 
        logo_text = ?, 
        skills_title_en = ?, skills_title_id = ?, skills_desc_en = ?, skills_desc_id = ?, 
        projects_title_en = ?, projects_title_id = ?, projects_desc_en = ?, projects_desc_id = ?, 
        experience_title_en = ?, experience_title_id = ?, experience_desc_en = ?, experience_desc_id = ?, 
        contact_email = ?, contact_title_en = ?, contact_title_id = ?, contact_desc_en = ?, contact_desc_id = ?, 
        footer_text_en = ?, footer_text_id = ? 
       WHERE id = 1`,
      [
        logo_text,
        skills_title_en, skills_title_id, skills_desc_en, skills_desc_id,
        projects_title_en, projects_title_id, projects_desc_en, projects_desc_id,
        experience_title_en, experience_title_id, experience_desc_en, experience_desc_id,
        contact_email, contact_title_en, contact_title_id, contact_desc_en, contact_desc_id,
        footer_text_en, footer_text_id
      ]
    );
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Messages Operations (Contact Inbox)
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await dbAll('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const result = await dbRun(
      `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`,
      [name, email, message]
    );
    res.json({ id: result.lastID, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await dbRun('DELETE FROM messages WHERE id = ?', [id]);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend build static files in production if needed
// (But for development, we will run them concurrently)

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
