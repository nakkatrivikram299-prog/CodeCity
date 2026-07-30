export const DOMAINS = [
  { id: 'all', label: 'All Projects', color: '#38BDF8' },
  { id: 'ai', label: 'AI & ML', color: '#A78BFA', icon: 'Cpu' },
  { id: 'healthcare', label: 'Healthcare', color: '#10B981', icon: 'HeartPulse' },
  { id: 'fintech', label: 'FinTech', color: '#F59E0B', icon: 'Landmark' },
  { id: 'cybersecurity', label: 'Cybersecurity', color: '#F43F5E', icon: 'ShieldCheck' },
  { id: 'agriculture', label: 'Agriculture', color: '#84CC16', icon: 'Sprout' },
  { id: 'education', label: 'Education', color: '#6366F1', icon: 'GraduationCap' },
  { id: 'environment', label: 'Environment', color: '#14B8A6', icon: 'Trees' },
  { id: 'gaming', label: 'Gaming', color: '#EC4899', icon: 'Gamepad2' },
  { id: 'space', label: 'Space Tech', color: '#8B5CF6', icon: 'Rocket' },
  { id: 'robotics', label: 'Robotics & IoT', color: '#06B6D4', icon: 'Bot' },
];

export const HACKATHON_PROJECTS = [
  {
    id: 'proj-1',
    name: 'MediVision AI',
    domain: 'healthcare',
    domainLabel: 'Healthcare',
    buildingType: 'hospital',
    teamName: 'Neural Medics',
    teamLogo: 'https://api.dicebear.com/7.x/bottts/svg?seed=neuralmedics',
    college: 'Stanford University',
    hackathonBadge: 'HealthTech Hack 2026',
    award: '🥇 1st Place Grand Winner',
    gridPos: [-24, -24], // Top-Left Quadrant (Strictly |X|>=24, |Z|>=24)
    width: 4.5,
    depth: 4.5,
    height: 18,
    color: '#10B981',
    bridgeColor: '#F59E0B',
    votes: 1420,
    stars: 384,
    description: 'Autonomous AI radiology assistant delivering early tumor detection with 99.4% accuracy from MRI scans in under 5 seconds.',
    teamMembers: [
      { name: 'Dr. Sarah Chen', role: 'AI Lead', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sarah' },
      { name: 'Alex Rivera', role: 'Full Stack Dev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alex' },
      { name: 'Elena Rostova', role: 'Data Scientist', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=elena' },
    ],
    githubUrl: 'https://github.com/neuralmedics/medivision-ai',
    liveDemoUrl: 'https://medivision.ai-demo.org',
    techStack: ['Python', 'PyTorch', 'FastAPI', 'React', 'Three.js', 'DICOM'],
    judgesScores: { innovation: 98, codeQuality: 96, ux: 94, impact: 99 },
    pptUrl: 'https://slides.com/medivision-pitch',
    videoUrl: 'https://youtube.com/watch?v=demo-medivision',
    comments: [
      { user: 'Judge Dr. Vance', text: 'Remarkable inference latency and UI clarity! A game changer for ER triage.', time: '2 hours ago' },
      { user: '@dev_hacker', text: 'The 3D volumetric MRI viewer in Three.js is incredible.', time: '5 hours ago' }
    ]
  },
  {
    id: 'proj-2',
    name: 'NeuroPulse Core',
    domain: 'ai',
    domainLabel: 'AI & ML',
    buildingType: 'research_lab',
    teamName: 'Cyber Mind Labs',
    teamLogo: 'https://api.dicebear.com/7.x/bottts/svg?seed=cybermind',
    college: 'MIT Technology Institute',
    hackathonBadge: 'Global AI Summit 2026',
    award: '🏆 Best Technical Architecture',
    gridPos: [24, -24], // Top-Right Quadrant (Strictly |X|>=24, |Z|>=24)
    width: 5,
    depth: 5,
    height: 22,
    color: '#A78BFA',
    bridgeColor: '#F59E0B',
    votes: 2180,
    stars: 512,
    description: 'Real-time multi-agent LLM orchestrator running 100B parameter neural models locally with quantized GPU acceleration.',
    teamMembers: [
      { name: 'Marcus Vance', role: 'ML Researcher', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=marcus' },
      { name: 'Priya Sharma', role: 'Backend Engineer', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=priya' }
    ],
    githubUrl: 'https://github.com/cybermind/neuropulse-core',
    liveDemoUrl: 'https://neuropulse.dev',
    techStack: ['Rust', 'CUDA', 'C++', 'Python', 'WebGPU', 'React'],
    judgesScores: { innovation: 99, codeQuality: 98, ux: 92, impact: 96 },
    pptUrl: 'https://slides.com/neuropulse-pitch',
    videoUrl: 'https://youtube.com/watch?v=demo-neuropulse',
    comments: [
      { user: 'Judge Prof. Lee', text: 'Sub-50ms token generation locally on edge devices is astounding.', time: '1 day ago' }
    ]
  },
  {
    id: 'proj-3',
    name: 'AgriSense IoT',
    domain: 'agriculture',
    domainLabel: 'Agriculture',
    buildingType: 'smart_farm',
    teamName: 'Green Tech Pioneers',
    teamLogo: 'https://api.dicebear.com/7.x/bottts/svg?seed=greentech',
    college: 'UC Davis Agriculture',
    hackathonBadge: 'EcoHack Sprint 2026',
    award: '🌿 Best Sustainability Impact',
    gridPos: [-36, -24], // Top-Left Outer Quadrant
    width: 4.5,
    depth: 4.5,
    height: 16,
    color: '#84CC16',
    bridgeColor: '#F59E0B',
    votes: 940,
    stars: 230,
    description: 'Solar-powered IoT crop telemetry sensors with autonomous drip irrigation algorithms reducing water consumption by 42%.',
    teamMembers: [
      { name: 'Liam O’Connor', role: 'Embedded Systems', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=liam' },
      { name: 'Mei Lin', role: 'Sustainability Lead', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=mei' }
    ],
    githubUrl: 'https://github.com/greentech/agrisense-iot',
    liveDemoUrl: 'https://agrisense.io',
    techStack: ['C++', 'ESP32', 'MQTT', 'Node.js', 'React', 'Tailwind'],
    judgesScores: { innovation: 94, codeQuality: 92, ux: 95, impact: 98 },
    pptUrl: 'https://slides.com/agrisense-pitch',
    videoUrl: 'https://youtube.com/watch?v=demo-agrisense',
    comments: [
      { user: 'EcoJudge Maria', text: 'Real world field testing proof of concept makes this stand out!', time: '3 hours ago' }
    ]
  },
  {
    id: 'proj-4',
    name: 'VaultPay Chain',
    domain: 'fintech',
    domainLabel: 'FinTech',
    buildingType: 'bank',
    teamName: 'Gold Vault Guild',
    teamLogo: 'https://api.dicebear.com/7.x/bottts/svg?seed=goldvault',
    college: 'Harvard Business & Tech',
    hackathonBadge: 'FinTech Disrupt 2026',
    award: '🥇 1st Place FinTech Track',
    gridPos: [36, -24], // Top-Right Outer Quadrant
    width: 4.8,
    depth: 4.8,
    height: 20,
    color: '#F59E0B',
    bridgeColor: '#F59E0B',
    votes: 1850,
    stars: 430,
    description: 'Zero-knowledge cross-border settlement ledger performing instant international payments with zero gas fees and fraud protection.',
    teamMembers: [
      { name: 'Ethan Hunt', role: 'Smart Contract Architect', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ethan' },
      { name: 'Chloe Bennett', role: 'Frontend Lead', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=chloe' }
    ],
    githubUrl: 'https://github.com/goldvault/vaultpay-chain',
    liveDemoUrl: 'https://vaultpay.finance',
    techStack: ['Solidity', 'Circom', 'TypeScript', 'Next.js', 'Ethers.js'],
    judgesScores: { innovation: 97, codeQuality: 97, ux: 96, impact: 97 },
    pptUrl: 'https://slides.com/vaultpay-pitch',
    videoUrl: 'https://youtube.com/watch?v=demo-vaultpay',
    comments: [
      { user: 'Banker Sam', text: 'ZK proof verification in 300ms is enterprise ready.', time: '4 hours ago' }
    ]
  },
  {
    id: 'proj-5',
    name: 'Aegis Guardian',
    domain: 'cybersecurity',
    domainLabel: 'Cybersecurity',
    buildingType: 'secure_data_center',
    teamName: 'Cyber Sentinel Team',
    teamLogo: 'https://api.dicebear.com/7.x/bottts/svg?seed=sentinel',
    college: 'Carnegie Mellon Cybersecurity',
    hackathonBadge: 'DefCon Hackathon 2026',
    award: '🛡️ Best Defense Innovation',
    gridPos: [24, 24], // Bottom-Right Quadrant (Strictly |X|>=24, |Z|>=24)
    width: 4.5,
    depth: 4.5,
    height: 17,
    color: '#F43F5E',
    bridgeColor: '#F59E0B',
    votes: 1290,
    stars: 310,
    description: 'AI-driven eBPF kernel intrusion prevention system blocking zero-day exploits across distributed cloud clusters in microseconds.',
    teamMembers: [
      { name: 'Viktor Krum', role: 'Kernel Dev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=viktor' },
      { name: 'Aisha Omar', role: 'Security Analyst', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=aisha' }
    ],
    githubUrl: 'https://github.com/sentinel/aegis-guardian',
    liveDemoUrl: 'https://aegis-sentinel.io',
    techStack: ['C', 'eBPF', 'Go', 'Kubernetes', 'Grafana', 'React'],
    judgesScores: { innovation: 96, codeQuality: 99, ux: 90, impact: 97 },
    pptUrl: 'https://slides.com/aegis-pitch',
    videoUrl: 'https://youtube.com/watch?v=demo-aegis',
    comments: [
      { user: 'SecEngineer Tom', text: 'eBPF kernel probes executed flawlessly in live pen-testing demo.', time: '6 hours ago' }
    ]
  },
  {
    id: 'proj-6',
    name: 'EduSphere 3D',
    domain: 'education',
    domainLabel: 'Education',
    buildingType: 'university',
    teamName: 'Future Campus',
    teamLogo: 'https://api.dicebear.com/7.x/bottts/svg?seed=futurecampus',
    college: 'Oxford Interactive Learning',
    hackathonBadge: 'EduTech Global 2026',
    award: '🎓 Best Student Experience',
    gridPos: [-24, 24], // Bottom-Left Quadrant (Strictly |X|>=24, |Z|>=24)
    width: 4.5,
    depth: 4.5,
    height: 19,
    color: '#6366F1',
    bridgeColor: '#F59E0B',
    votes: 1100,
    stars: 275,
    description: 'Spatial WebVR interactive classrooms allowing students worldwide to manipulate virtual physics, chemistry, and history artifacts in 3D.',
    teamMembers: [
      { name: 'Lucas Scott', role: 'VR Creator', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=lucas' },
      { name: 'Sophia Martinez', role: 'UX Specialist', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sophia' }
    ],
    githubUrl: 'https://github.com/futurecampus/edusphere-3d',
    liveDemoUrl: 'https://edusphere3d.org',
    techStack: ['WebXR', 'Three.js', 'React', 'Node.js', 'WebSockets'],
    judgesScores: { innovation: 95, codeQuality: 93, ux: 98, impact: 95 },
    pptUrl: 'https://slides.com/edusphere-pitch',
    videoUrl: 'https://youtube.com/watch?v=demo-edusphere',
    comments: [
      { user: 'Teacher Dave', text: 'My students loved performing virtual chemistry experiments safely!', time: '1 day ago' }
    ]
  },
  {
    id: 'proj-7',
    name: 'EcoGrid Dynamics',
    domain: 'environment',
    domainLabel: 'Environment',
    buildingType: 'eco_park',
    teamName: 'Clean Earth Alliance',
    teamLogo: 'https://api.dicebear.com/7.x/bottts/svg?seed=cleanearth',
    college: 'ETH Zurich Environmental',
    hackathonBadge: 'Climate Action Sprint 2026',
    award: '🌱 Climate Impact Champion',
    gridPos: [-36, 24], // Bottom-Left Outer Quadrant
    width: 4.5,
    depth: 4.5,
    height: 17.5,
    color: '#14B8A6',
    bridgeColor: '#F59E0B',
    votes: 1620,
    stars: 390,
    description: 'Smart renewable micro-grid balancing software dynamically routing solar and wind power to urban EV charging stations.',
    teamMembers: [
      { name: 'Hans Muller', role: 'Energy Architect', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=hans' },
      { name: 'Nina Patel', role: 'Data Engineer', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nina' }
    ],
    githubUrl: 'https://github.com/cleanearth/ecogrid-dynamics',
    liveDemoUrl: 'https://ecogrid-cleanearth.org',
    techStack: ['Python', 'Pandas', 'FastAPI', 'React', 'TailwindCSS'],
    judgesScores: { innovation: 97, codeQuality: 95, ux: 94, impact: 99 },
    pptUrl: 'https://slides.com/ecogrid-pitch',
    videoUrl: 'https://youtube.com/watch?v=demo-ecogrid',
    comments: [
      { user: 'Grid Manager', text: 'Real time micro-grid load balancing accuracy was proven in trial.', time: '2 days ago' }
    ]
  },
  {
    id: 'proj-8',
    name: 'AstroRover VR',
    domain: 'space',
    domainLabel: 'Space Tech',
    buildingType: 'space_center',
    teamName: 'Mars Explorers',
    teamLogo: 'https://api.dicebear.com/7.x/bottts/svg?seed=marsexplorers',
    college: 'Caltech Space Robotics',
    hackathonBadge: 'NASA Space Apps 2026',
    award: '🚀 1st Place Space Exploration',
    gridPos: [36, 24], // Bottom-Right Outer Quadrant
    width: 4.8,
    depth: 4.8,
    height: 23,
    color: '#8B5CF6',
    bridgeColor: '#F59E0B',
    votes: 2450,
    stars: 620,
    description: 'Low-latency teleoperation interface for planetary rovers utilizing predictive physics modeling to compensate for interplanetary signal delay.',
    teamMembers: [
      { name: 'Commander Ray', role: 'Space Systems Lead', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ray' },
      { name: 'Dr. Zoe Vance', role: 'Robotics Specialist', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=zoe' }
    ],
    githubUrl: 'https://github.com/marsexplorers/astrorover-vr',
    liveDemoUrl: 'https://astrorover-space.dev',
    techStack: ['C++', 'ROS 2', 'WebXR', 'React', 'Three.js'],
    judgesScores: { innovation: 99, codeQuality: 98, ux: 97, impact: 98 },
    pptUrl: 'https://slides.com/astrorover-pitch',
    videoUrl: 'https://youtube.com/watch?v=demo-astrorover',
    comments: [
      { user: 'NASA Engineer Mark', text: 'Predictive lag compensation model works brilliantly!', time: '1 day ago' }
    ]
  },
  {
    id: 'proj-9',
    name: 'CyberVerse Arena',
    domain: 'gaming',
    domainLabel: 'Gaming',
    buildingType: 'game_studio',
    teamName: 'Neon Byte Studio',
    teamLogo: 'https://api.dicebear.com/7.x/bottts/svg?seed=neonbyte',
    college: 'USC Interactive Media',
    hackathonBadge: 'Indie Game Jam 2026',
    award: '🎮 Best Gameplay & Graphics',
    gridPos: [-24, -36], // Top-Left Far Quadrant
    width: 4.5,
    depth: 4.5,
    height: 18,
    color: '#EC4899',
    bridgeColor: '#F59E0B',
    votes: 1980,
    stars: 490,
    description: 'Browser-based multiplayer cyberpunk arena battle game rendered at 120 FPS using WebGPU with spatial audio and customizable avatars.',
    teamMembers: [
      { name: 'Jaxson Reed', role: 'Game Engine Dev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=jaxson' },
      { name: 'Kiara Santos', role: '3D Artist', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=kiara' }
    ],
    githubUrl: 'https://github.com/neonbyte/cyberverse-arena',
    liveDemoUrl: 'https://cyberverse-game.io',
    techStack: ['WebGPU', 'Three.js', 'Rust', 'WebAssembly', 'WebSockets'],
    judgesScores: { innovation: 96, codeQuality: 95, ux: 99, impact: 92 },
    pptUrl: 'https://slides.com/cyberverse-pitch',
    videoUrl: 'https://youtube.com/watch?v=demo-cyberverse',
    comments: [
      { user: 'Gamer GamerX', text: 'Smooth 120 FPS inside Chrome! Amazing shader work.', time: '12 hours ago' }
    ]
  },
  {
    id: 'proj-10',
    name: 'BotForge Factory',
    domain: 'robotics',
    domainLabel: 'Robotics & IoT',
    buildingType: 'robotics_factory',
    teamName: 'RoboMech Engineers',
    teamLogo: 'https://api.dicebear.com/7.x/bottts/svg?seed=robomech',
    college: 'Georgia Tech Robotics',
    hackathonBadge: 'RoboHack 2026',
    award: '🤖 Best Hardware Software Sync',
    gridPos: [24, -36], // Top-Right Far Quadrant
    width: 4.5,
    depth: 4.5,
    height: 16.5,
    color: '#06B6D4',
    bridgeColor: '#F59E0B',
    votes: 1350,
    stars: 340,
    description: 'Digital twin simulation platform for industrial robotic arms with vision AI obstacle avoidance and real-time inverse kinematics.',
    teamMembers: [
      { name: 'Tariq Al-Mansoor', role: 'Robotics Engineer', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=tariq' },
      { name: 'Hanna Schmidt', role: 'Computer Vision', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=hanna' }
    ],
    githubUrl: 'https://github.com/robomech/botforge-factory',
    liveDemoUrl: 'https://botforge-robotics.org',
    techStack: ['Python', 'OpenCV', 'ROS 2', 'React', 'Three.js'],
    judgesScores: { innovation: 95, codeQuality: 96, ux: 93, impact: 96 },
    pptUrl: 'https://slides.com/botforge-pitch',
    videoUrl: 'https://youtube.com/watch?v=demo-botforge',
    comments: [
      { user: 'Industrial Tech Engineer', text: 'The inverse kinematics mathematical solver is incredibly fast.', time: '1 day ago' }
    ]
  }
];
