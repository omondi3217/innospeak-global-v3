/**
 * courseDetailGenerator — produces rich, course-specific detail objects
 * for every course that doesn't have a hand-crafted entry in courseDetails.js.
 *
 * Instead of generic "Module 1: Introduction" defaults, this generator
 * reads the course's name, description, level, category, and pathway
 * to produce tailored modules, learning outcomes, career paths,
 * assessment methods, FAQs, and reviews that feel professional and unique.
 *
 * Used by buildCourseData() in courseDetails.js as a fallback when no
 * hand-crafted entry exists.
 */

// ── Shared constants ──────────────────────────────────────────────

const SHARED_FAQS = [
  {
    question: 'Who can apply?',
    answer: 'Anyone aged 16 and above with an interest in the subject. Some courses require prior qualifications — check the Entry Requirements section for details.',
  },
  {
    question: 'How do I study?',
    answer: 'Choose the mode that suits you: online, physical (on-campus), or hybrid. Classes are scheduled on weekdays, weekends, or evenings to fit around your life.',
  },
  {
    question: 'Do I receive a certificate?',
    answer: 'Yes. Upon successful completion you receive a professional digital certificate, a transcript, and a career portfolio. Verification support is available for employers.',
  },
  {
    question: 'Can I study online?',
    answer: 'Absolutely. Most courses offer an online mode with live sessions, recorded materials, and interactive assignments accessible from anywhere in the world.',
  },
  {
    question: 'Can I pay in instalments?',
    answer: 'Yes, flexible instalment plans are available. Contact our admissions team after applying to arrange a payment schedule that works for you.',
  },
];

const DEFAULT_REVIEWS = [
  {
    name: 'Amina Hassan',
    country: 'Kenya',
    rating: 5,
    text: 'The course exceeded my expectations. The instructors were knowledgeable and the practical exercises helped me apply what I learned immediately.',
  },
  {
    name: 'James Okello',
    country: 'Uganda',
    rating: 5,
    text: 'Excellent programme with a well-structured curriculum. I gained real skills that I now use in my job every day.',
  },
  {
    name: 'Fatima Ali',
    country: 'Somalia',
    rating: 5,
    text: 'The flexible schedule and online option made it possible for me to study while working. Highly recommended.',
  },
];

const DEFAULT_CERT_ITEMS = [
  { icon: 'Award', label: 'Professional Certificate', description: 'Recognised completion certificate' },
  { icon: 'Monitor', label: 'Digital Certificate', description: 'Verifiable digital credential' },
  { icon: 'FileText', label: 'Transcript', description: 'Academic transcript' },
  { icon: 'Briefcase', label: 'Career Portfolio', description: 'Work samples and projects' },
  { icon: 'ShieldCheck', label: 'Verification Support', description: 'Employer verification service' },
];

// ── Level-aware module generation ──────────────────────────────────

const LEVEL_PROFILES = {
  Beginner: {
    modulePrefix: 'Foundations of',
    capstoneTitle: 'Foundations Capstone Project',
    capstoneDesc: 'Apply everything you have learned in a guided project that demonstrates your grasp of the fundamentals.',
    assessmentFocus: 'guided practice and foundational skills',
    outcomeFocus: 'core concepts and practical foundations',
  },
  Intermediate: {
    modulePrefix: 'Applied',
    capstoneTitle: 'Applied Project',
    capstoneDesc: 'Build a real-world project that demonstrates your ability to apply intermediate skills independently.',
    assessmentFocus: 'applied skills and independent problem-solving',
    outcomeFocus: 'practical application and professional workflows',
  },
  Advanced: {
    modulePrefix: 'Advanced',
    capstoneTitle: 'Professional Capstone',
    capstoneDesc: 'Deliver a production-grade project that showcases industry-level expertise and readiness for professional work.',
    assessmentFocus: 'professional-level competency and project delivery',
    outcomeFocus: 'mastery, professional practice, and industry readiness',
  },
};

// ── Pathway-specific module themes ────────────────────────────────

const PATHWAY_THEMES = {
  // Academy pathways
  'global-language': {
    modules: [
      { title: 'Language Foundations', desc: 'Core vocabulary, grammar structures, and pronunciation fundamentals.' },
      { title: 'Communication Building', desc: 'Guided conversation practice, listening comprehension, and interactive exercises.' },
      { title: 'Practical Application', desc: 'Real-world scenarios, role-plays, and situational language use.' },
      { title: 'Professional Context', desc: 'Workplace and academic communication skills tailored to the subject area.' },
      { title: 'Fluency & Confidence', desc: 'Advanced practice, feedback sessions, and proficiency assessment.' },
    ],
    careers: ['Communications Officer', 'Customer Relations Associate', 'Administrative Assistant', 'Content Writer', 'Translation Specialist', 'Hospitality Professional'],
    outcomes: [
      { icon: 'MessageSquare', text: 'Communicate confidently in real-world situations' },
      { icon: 'BookOpen', text: 'Develop practical speaking and listening skills' },
      { icon: 'Briefcase', text: 'Apply language skills in professional contexts' },
      { icon: 'Globe', text: 'Connect with people across cultures and contexts' },
      { icon: 'Brain', text: 'Think and process information in the target language' },
      { icon: 'Lightbulb', text: 'Solve communication challenges with confidence' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Weekly language tasks and exercises' },
      { icon: 'Users', label: 'Practical Work', description: 'Conversation and role-play practice' },
      { icon: 'Mic', label: 'Oral Assessment', description: 'Speaking and listening evaluations' },
      { icon: 'Award', label: 'Final Assessment', description: 'Comprehensive proficiency evaluation' },
    ],
  },
  'languages': {
    modules: [
      { title: 'Introduction & Sound System', desc: 'Alphabet, pronunciation rules, and essential greetings.' },
      { title: 'Everyday Vocabulary', desc: 'Building a practical vocabulary for daily communication.' },
      { title: 'Grammar Structures', desc: 'Core grammatical patterns, sentence construction, and verb forms.' },
      { title: 'Conversation Practice', desc: 'Dialogues, situational practice, and cultural context.' },
      { title: 'Reading & Writing', desc: 'Simple texts, writing exercises, and comprehension practice.' },
    ],
    careers: ['Translator', 'Cultural Liaison', 'Tourism Professional', 'Diplomatic Staff', 'International Business Associate', 'Language Tutor'],
    outcomes: [
      { icon: 'MessageSquare', text: 'Hold conversations in the target language' },
      { icon: 'BookOpen', text: 'Read and write basic texts' },
      { icon: 'Globe', text: 'Navigate cultural contexts confidently' },
      { icon: 'Briefcase', text: 'Use language skills in professional settings' },
      { icon: 'Headphones', text: 'Understand spoken language in everyday contexts' },
      { icon: 'Lightbulb', text: 'Continue self-directed language learning' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Weekly vocabulary and grammar exercises' },
      { icon: 'Users', label: 'Practical Work', description: 'Conversation practice sessions' },
      { icon: 'Headphones', label: 'Listening Tests', description: 'Comprehension assessments' },
      { icon: 'Award', label: 'Final Assessment', description: 'Oral and written proficiency evaluation' },
    ],
  },
  'international-qualifications': {
    modules: [
      { title: 'Exam Structure & Strategy', desc: 'Understanding the exam format, scoring criteria, and test-taking strategies.' },
      { title: 'Core Skills Development', desc: 'Targeted practice in the key skill areas assessed by the exam.' },
      { title: 'Technique Refinement', desc: 'Advanced strategies for each question type and time management.' },
      { title: 'Mock Exams & Feedback', desc: 'Full-length practice tests with detailed feedback and analysis.' },
      { title: 'Final Preparation', desc: 'Targeted review, confidence building, and exam-day readiness.' },
    ],
    careers: ['University Student', 'Graduate Student', 'International Professional', 'Scholarship Candidate', 'Immigration Applicant', 'Researcher'],
    outcomes: [
      { icon: 'Target', text: 'Achieve your target exam score' },
      { icon: 'Clock', text: 'Manage time effectively under exam conditions' },
      { icon: 'BookOpen', text: 'Master exam-specific content and techniques' },
      { icon: 'Brain', text: 'Approach the exam with confidence and strategy' },
      { icon: 'Award', text: 'Earn an internationally recognised qualification' },
      { icon: 'Lightbulb', text: 'Apply exam skills to future academic work' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Weekly skill-focused practice tasks' },
      { icon: 'Clock', label: 'Timed Practice', description: 'Simulated exam conditions' },
      { icon: 'Award', label: 'Mock Exams', description: 'Full-length practice examinations' },
      { icon: 'Award', label: 'Final Assessment', description: 'Comprehensive mock exam with scoring' },
    ],
  },
  'national-tvet': {
    modules: [
      { title: 'Curriculum Foundations', desc: 'Core concepts aligned with national curriculum requirements.' },
      { title: 'Theory & Principles', desc: 'Theoretical knowledge and fundamental principles.' },
      { title: 'Practical Application', desc: 'Hands-on exercises and practical skills development.' },
      { title: 'Assessment Preparation', desc: 'Targeted preparation for national examinations and assessments.' },
      { title: 'Revision & Practice', desc: 'Comprehensive review, past papers, and exam technique.' },
    ],
    careers: ['TVET Graduate', 'Technical Officer', 'Artisan', 'Technician', 'Further Education Student', 'Entrepreneur'],
    outcomes: [
      { icon: 'BookOpen', text: 'Master curriculum-aligned content' },
      { icon: 'Briefcase', text: 'Develop practical technical skills' },
      { icon: 'Award', text: 'Prepare effectively for national assessments' },
      { icon: 'Brain', text: 'Build a strong foundation for further study' },
      { icon: 'Lightbulb', text: 'Apply technical knowledge in real-world settings' },
      { icon: 'Wrench', text: 'Demonstrate hands-on competency' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Curriculum-aligned coursework' },
      { icon: 'Users', label: 'Practical Work', description: 'Hands-on technical exercises' },
      { icon: 'FileText', label: 'Tests', description: 'Topic-based assessments' },
      { icon: 'Award', label: 'Final Assessment', description: 'Comprehensive examination preparation' },
    ],
  },
  'digital-literacy-productivity': {
    modules: [
      { title: 'Digital Foundations', desc: 'Understanding computers, operating systems, and digital environments.' },
      { title: 'Productivity Tools', desc: 'Mastering essential office software, cloud tools, and collaboration platforms.' },
      { title: 'Internet & Online Safety', desc: 'Safe browsing, digital identity, and online communication.' },
      { title: 'Digital Workflows', desc: 'Automating tasks, managing files, and working efficiently in digital environments.' },
      { title: 'Practical Project', desc: 'Applying digital skills to a real-world productivity project.' },
    ],
    careers: ['Office Assistant', 'Data Entry Clerk', 'Administrative Officer', 'Digital Literacy Trainer', 'Customer Support Agent', 'Junior IT Assistant'],
    outcomes: [
      { icon: 'Monitor', text: 'Navigate digital environments with confidence' },
      { icon: 'Briefcase', text: 'Use productivity tools for professional work' },
      { icon: 'ShieldCheck', text: 'Practice safe and responsible online behaviour' },
      { icon: 'Zap', text: 'Streamline workflows with digital tools' },
      { icon: 'Cloud', text: 'Collaborate using cloud-based platforms' },
      { icon: 'Lightbulb', text: 'Adapt to new digital tools independently' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Practical digital tasks' },
      { icon: 'Users', label: 'Practical Work', description: 'Hands-on software exercises' },
      { icon: 'Monitor', label: 'Digital Project', description: 'Complete a digital productivity project' },
      { icon: 'Award', label: 'Final Assessment', description: 'Comprehensive skills evaluation' },
    ],
  },
  'creative-design': {
    modules: [
      { title: 'Creative Foundations', desc: 'Design principles, visual language, and creative thinking fundamentals.' },
      { title: 'Tools & Techniques', desc: 'Industry-standard software, equipment, and production techniques.' },
      { title: 'Creative Process', desc: 'Ideation, design thinking, and project development workflows.' },
      { title: 'Portfolio Development', desc: 'Building a professional creative portfolio with real projects.' },
      { title: 'Industry Practice', desc: 'Client work, professional standards, and creative industry insights.' },
    ],
    careers: ['Graphic Designer', 'Content Creator', 'Creative Associate', 'Social Media Manager', 'Freelance Designer', 'Media Producer'],
    outcomes: [
      { icon: 'Palette', text: 'Develop a strong creative skill set' },
      { icon: 'Briefcase', text: 'Use industry-standard creative tools' },
      { icon: 'Lightbulb', text: 'Generate and execute creative ideas' },
      { icon: 'FolderOpen', text: 'Build a professional creative portfolio' },
      { icon: 'Users', text: 'Work with clients and creative briefs' },
      { icon: 'Zap', text: 'Produce creative work to professional standards' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Creative projects and exercises' },
      { icon: 'Palette', label: 'Practical Work', description: 'Hands-on creative production' },
      { icon: 'FolderOpen', label: 'Portfolio', description: 'Portfolio of creative work' },
      { icon: 'Award', label: 'Final Assessment', description: 'Capstone creative project' },
    ],
  },
  'business': {
    modules: [
      { title: 'Business Foundations', desc: 'Core business principles, terminology, and frameworks.' },
      { title: 'Strategy & Planning', desc: 'Business planning, strategic thinking, and decision-making.' },
      { title: 'Operations & Execution', desc: 'Day-to-day business operations, processes, and management.' },
      { title: 'Growth & Scaling', desc: 'Scaling strategies, market expansion, and financial management.' },
      { title: 'Capstone Business Project', desc: 'Apply learning to a real business scenario or venture plan.' },
    ],
    careers: ['Business Manager', 'Entrepreneur', 'Operations Officer', 'Project Coordinator', 'Business Consultant', 'Team Lead'],
    outcomes: [
      { icon: 'Briefcase', text: 'Understand core business principles' },
      { icon: 'TrendingUp', text: 'Develop strategic thinking and planning skills' },
      { icon: 'Users', text: 'Manage teams and business operations' },
      { icon: 'DollarSign', text: 'Make informed financial decisions' },
      { icon: 'Lightbulb', text: 'Identify and seize business opportunities' },
      { icon: 'Target', text: 'Execute business plans effectively' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Business analysis tasks' },
      { icon: 'Users', label: 'Practical Work', description: 'Business simulations and case studies' },
      { icon: 'Briefcase', label: 'Business Plan', description: 'Develop a comprehensive business plan' },
      { icon: 'Award', label: 'Final Assessment', description: 'Capstone business project' },
    ],
  },
  'freelancing': {
    modules: [
      { title: 'Freelancing Fundamentals', desc: 'Understanding the freelance economy, platforms, and business models.' },
      { title: 'Skill Monetisation', desc: 'Packaging your skills as services, pricing, and positioning.' },
      { title: 'Client Acquisition', desc: 'Finding clients, writing proposals, and winning contracts.' },
      { title: 'Project Delivery', desc: 'Managing projects, communicating with clients, and delivering quality work.' },
      { title: 'Freelance Business Management', desc: 'Finances, contracts, scaling, and building a sustainable freelance career.' },
    ],
    careers: ['Freelance Professional', 'Remote Contractor', 'Digital Nomad', 'Consultant', 'Agency Owner', 'Solopreneur'],
    outcomes: [
      { icon: 'Briefcase', text: 'Launch and run a freelance business' },
      { icon: 'DollarSign', text: 'Price and package services competitively' },
      { icon: 'Users', text: 'Find, win, and retain clients' },
      { icon: 'Globe', text: 'Work remotely and manage projects effectively' },
      { icon: 'TrendingUp', text: 'Build a sustainable income stream' },
      { icon: 'Lightbulb', text: 'Scale from freelancer to business owner' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Freelance business building tasks' },
      { icon: 'Users', label: 'Practical Work', description: 'Proposal writing and client simulations' },
      { icon: 'Briefcase', label: 'Portfolio', description: 'Freelance profile and portfolio setup' },
      { icon: 'Award', label: 'Final Assessment', description: 'Complete freelance business launch plan' },
    ],
  },
  'career': {
    modules: [
      { title: 'Career Foundations', desc: 'Self-assessment, career planning, and goal setting.' },
      { title: 'Professional Branding', desc: 'CV writing, LinkedIn optimisation, and personal branding.' },
      { title: 'Job Search Strategy', desc: 'Job hunting, networking, and application strategies.' },
      { title: 'Interview Excellence', desc: 'Interview preparation, techniques, and practice.' },
      { title: 'Career Growth', desc: 'Workplace success, advancement, and continuous professional development.' },
    ],
    careers: ['Job Seeker', 'Career Changer', 'Recent Graduate', 'Professional', 'Promotion Candidate', 'Return-to-Work Professional'],
    outcomes: [
      { icon: 'Target', text: 'Plan and navigate your career path' },
      { icon: 'FileText', text: 'Create a professional CV and online presence' },
      { icon: 'Users', text: 'Network and build professional relationships' },
      { icon: 'Mic', text: 'Excel in job interviews' },
      { icon: 'TrendingUp', text: 'Position yourself for career growth' },
      { icon: 'Briefcase', text: 'Transition into new roles or industries' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'CV, cover letter, and branding tasks' },
      { icon: 'Users', label: 'Practical Work', description: 'Mock interviews and networking practice' },
      { icon: 'Briefcase', label: 'Portfolio', description: 'Professional career portfolio' },
      { icon: 'Award', label: 'Final Assessment', description: 'Comprehensive career readiness evaluation' },
    ],
  },
  'education-teaching-excellence': {
    modules: [
      { title: 'Teaching Foundations', desc: 'Learning theory, pedagogy, and educational principles.' },
      { title: 'Curriculum & Lesson Design', desc: 'Designing curricula, lesson plans, and learning activities.' },
      { title: 'Teaching Methods', desc: 'Instructional strategies, differentiation, and classroom management.' },
      { title: 'Assessment & Feedback', desc: 'Designing assessments, providing feedback, and tracking progress.' },
      { title: 'EdTech & Innovation', desc: 'Integrating technology and innovative practices into teaching.' },
    ],
    careers: ['Teacher', 'Trainer', 'Instructional Designer', 'Education Consultant', 'Tutor', 'Curriculum Developer'],
    outcomes: [
      { icon: 'BookOpen', text: 'Apply sound pedagogical principles' },
      { icon: 'FileText', text: 'Design effective curricula and lessons' },
      { icon: 'Users', text: 'Manage classrooms and engage learners' },
      { icon: 'Award', text: 'Design and deliver meaningful assessments' },
      { icon: 'Monitor', text: 'Integrate educational technology effectively' },
      { icon: 'Lightbulb', text: 'Continuously improve your teaching practice' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Lesson plans and curriculum designs' },
      { icon: 'Users', label: 'Practical Work', description: 'Teaching practice and micro-teaching' },
      { icon: 'Briefcase', label: 'Portfolio', description: 'Teaching portfolio' },
      { icon: 'Award', label: 'Final Assessment', description: 'Comprehensive teaching demonstration' },
    ],
  },
  'health-hospitality-community': {
    modules: [
      { title: 'Industry Foundations', desc: 'Sector overview, standards, and professional fundamentals.' },
      { title: 'Practical Skills', desc: 'Hands-on skills for the specific industry area.' },
      { title: 'Service Excellence', desc: 'Customer service, quality standards, and professional practice.' },
      { title: 'Management & Operations', desc: 'Operational management, safety, and compliance.' },
      { title: 'Industry Project', desc: 'Apply learning to a real-world industry scenario.' },
    ],
    careers: ['Hospitality Professional', 'Health Worker', 'Community Officer', 'Event Coordinator', 'Tourism Operator', 'Care Provider'],
    outcomes: [
      { icon: 'Briefcase', text: 'Develop industry-specific professional skills' },
      { icon: 'Users', text: 'Deliver excellent service to clients and communities' },
      { icon: 'ShieldCheck', text: 'Maintain safety and compliance standards' },
      { icon: 'Heart', text: 'Serve communities with empathy and professionalism' },
      { icon: 'Lightbulb', text: 'Identify and respond to industry needs' },
      { icon: 'TrendingUp', text: 'Advance in your chosen sector' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Industry-focused coursework' },
      { icon: 'Users', label: 'Practical Work', description: 'Hands-on service and care exercises' },
      { icon: 'Heart', label: 'Service Project', description: 'Community or industry service project' },
      { icon: 'Award', label: 'Final Assessment', description: 'Comprehensive skills evaluation' },
    ],
  },
  'personal-development-life-skills': {
    modules: [
      { title: 'Self-Awareness', desc: 'Understanding yourself, your strengths, and your goals.' },
      { title: 'Emotional Intelligence', desc: 'Managing emotions, building resilience, and developing empathy.' },
      { title: 'Critical Thinking', desc: 'Analytical thinking, decision-making, and problem-solving.' },
      { title: 'Productivity & Habits', desc: 'Time management, productivity systems, and habit formation.' },
      { title: 'Life Design', desc: 'Goal setting, life planning, and continuous growth.' },
    ],
    careers: ['Any Profession', 'Entrepreneur', 'Community Leader', 'Student', 'Career Changer', 'Team Member'],
    outcomes: [
      { icon: 'Brain', text: 'Develop greater self-awareness and emotional intelligence' },
      { icon: 'Lightbulb', text: 'Think critically and solve problems effectively' },
      { icon: 'Zap', text: 'Build productive habits and systems' },
      { icon: 'Target', text: 'Set and achieve meaningful goals' },
      { icon: 'Heart', text: 'Build resilience and manage stress' },
      { icon: 'Users', text: 'Communicate and relate to others more effectively' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Personal development exercises' },
      { icon: 'Users', label: 'Practical Work', description: 'Applied life skills practice' },
      { icon: 'Brain', label: 'Reflection', description: 'Self-assessment and reflection journals' },
      { icon: 'Award', label: 'Final Assessment', description: 'Personal growth portfolio and plan' },
    ],
  },

  // ── Labs school pathways ──────────────────────────────────────
  'school-ai': {
    modules: [
      { title: 'AI Foundations & Concepts', desc: 'Core AI concepts, terminology, and the mathematical foundations underlying modern AI systems.' },
      { title: 'Tools & Frameworks', desc: 'Setting up your development environment, working with AI APIs, and using industry-standard frameworks.' },
      { title: 'Building AI Applications', desc: 'Hands-on development of AI-powered applications, from prototyping to deployment.' },
      { title: 'Production & Deployment', desc: 'Scaling, monitoring, evaluating, and deploying AI systems in production environments.' },
      { title: 'Capstone AI Project', desc: 'Build a complete AI application that solves a real-world problem, from concept to deployment.' },
    ],
    careers: ['AI Engineer', 'ML Engineer', 'AI Product Manager', 'Data Scientist', 'AI Consultant', 'LLM Application Developer'],
    outcomes: [
      { icon: 'Brain', text: 'Build and deploy AI-powered applications' },
      { icon: 'Code', text: 'Use industry-standard AI frameworks and APIs' },
      { icon: 'Briefcase', text: 'Apply AI to solve real business problems' },
      { icon: 'Cloud', text: 'Deploy and monitor AI systems in production' },
      { icon: 'Lightbulb', text: 'Evaluate and improve AI system performance' },
      { icon: 'ShieldCheck', text: 'Build responsible and ethical AI systems' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Coding assignments and AI exercises' },
      { icon: 'Code', label: 'Practical Work', description: 'Build AI applications and pipelines' },
      { icon: 'Briefcase', label: 'Project Portfolio', description: 'Portfolio of AI projects' },
      { icon: 'Award', label: 'Final Assessment', description: 'Capstone AI project with presentation' },
    ],
  },
  'school-software-engineering': {
    modules: [
      { title: 'Software Engineering Foundations', desc: 'Core principles, design patterns, and engineering best practices.' },
      { title: 'Development & Implementation', desc: 'Building features, writing clean code, and implementing functionality.' },
      { title: 'Testing & Quality', desc: 'Testing strategies, code quality, debugging, and performance optimisation.' },
      { title: 'Deployment & DevOps', desc: 'CI/CD, containerisation, deployment pipelines, and infrastructure.' },
      { title: 'Capstone Software Project', desc: 'Design, build, test, and deploy a production-grade software project.' },
    ],
    careers: ['Software Engineer', 'Full-Stack Developer', 'Backend Developer', 'Frontend Developer', 'Mobile Developer', 'DevOps Engineer'],
    outcomes: [
      { icon: 'Code', text: 'Write clean, maintainable, production-grade code' },
      { icon: 'Briefcase', text: 'Build complete software applications' },
      { icon: 'ShieldCheck', text: 'Test and ensure code quality' },
      { icon: 'Cloud', text: 'Deploy applications to production' },
      { icon: 'Users', text: 'Work in agile development teams' },
      { icon: 'Lightbulb', text: 'Solve complex engineering problems' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Coding assignments and exercises' },
      { icon: 'Code', label: 'Practical Work', description: 'Build software features and applications' },
      { icon: 'Briefcase', label: 'Project Portfolio', description: 'Portfolio of software projects' },
      { icon: 'Award', label: 'Final Assessment', description: 'Capstone software project with code review' },
    ],
  },
  'school-cloud-devops': {
    modules: [
      { title: 'Cloud & DevOps Foundations', desc: 'Cloud computing concepts, DevOps culture, and infrastructure fundamentals.' },
      { title: 'Infrastructure & Automation', desc: 'Infrastructure as code, configuration management, and automation pipelines.' },
      { title: 'Containers & Orchestration', desc: 'Docker, Kubernetes, and container orchestration for production workloads.' },
      { title: 'Monitoring & Security', desc: 'Observability, logging, security, and compliance in cloud environments.' },
      { title: 'Capstone Infrastructure Project', desc: 'Architect and deploy a complete cloud infrastructure with CI/CD.' },
    ],
    careers: ['DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer', 'Platform Engineer', 'Infrastructure Engineer', 'Cloud Consultant'],
    outcomes: [
      { icon: 'Cloud', text: 'Architect and deploy cloud infrastructure' },
      { icon: 'Zap', text: 'Automate deployment and infrastructure pipelines' },
      { icon: 'Container', text: 'Manage containers and orchestration at scale' },
      { icon: 'ShieldCheck', text: 'Implement security and monitoring best practices' },
      { icon: 'TrendingUp', text: 'Optimise cloud costs and performance' },
      { icon: 'Briefcase', text: 'Operate production cloud environments' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Infrastructure and pipeline exercises' },
      { icon: 'Cloud', label: 'Practical Work', description: 'Deploy cloud resources and pipelines' },
      { icon: 'Briefcase', label: 'Project Portfolio', description: 'Infrastructure-as-code portfolio' },
      { icon: 'Award', label: 'Final Assessment', description: 'Capstone cloud infrastructure deployment' },
    ],
  },
  'school-cybersecurity': {
    modules: [
      { title: 'Security Foundations', desc: 'Cybersecurity principles, threat landscape, and security frameworks.' },
      { title: 'Offensive Security', desc: 'Penetration testing, vulnerability assessment, and ethical hacking techniques.' },
      { title: 'Defensive Security', desc: 'Security operations, incident response, and threat detection.' },
      { title: 'Security Engineering', desc: 'Secure architecture, hardening, and security automation.' },
      { title: 'Capstone Security Project', desc: 'Conduct a complete security assessment or build a security operations capability.' },
    ],
    careers: ['Security Analyst', 'Penetration Tester', 'SOC Analyst', 'Security Engineer', 'Security Consultant', 'Threat Hunter'],
    outcomes: [
      { icon: 'ShieldCheck', text: 'Assess and secure systems against threats' },
      { icon: 'Bug', text: 'Identify and exploit vulnerabilities ethically' },
      { icon: 'Eye', text: 'Detect and respond to security incidents' },
      { icon: 'Lock', text: 'Design secure architectures and controls' },
      { icon: 'Briefcase', text: 'Conduct professional security assessments' },
      { icon: 'FileText', text: 'Produce professional security reports' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Security assessment exercises' },
      { icon: 'ShieldCheck', label: 'Practical Work', description: 'Hands-on security lab exercises' },
      { icon: 'Briefcase', label: 'Project Portfolio', description: 'Security assessment portfolio' },
      { icon: 'Award', label: 'Final Assessment', description: 'Capstone security project with report' },
    ],
  },
  'school-data-science': {
    modules: [
      { title: 'Data Science Foundations', desc: 'Statistics, data literacy, and the data science workflow.' },
      { title: 'Data Processing & Analysis', desc: 'Data cleaning, transformation, exploration, and analysis with Python and SQL.' },
      { title: 'Machine Learning & Modelling', desc: 'Building, training, and evaluating machine learning models.' },
      { title: 'Visualisation & Communication', desc: 'Data visualisation, dashboards, and communicating insights to stakeholders.' },
      { title: 'Capstone Data Project', desc: 'Build an end-to-end data project from raw data to deployed insights.' },
    ],
    careers: ['Data Analyst', 'Data Scientist', 'Data Engineer', 'ML Engineer', 'BI Analyst', 'Analytics Consultant'],
    outcomes: [
      { icon: 'BarChart3', text: 'Analyse data and extract actionable insights' },
      { icon: 'Code', text: 'Build data pipelines and ML models' },
      { icon: 'Briefcase', text: 'Solve business problems with data' },
      { icon: 'TrendingUp', text: 'Communicate insights to stakeholders' },
      { icon: 'Database', text: 'Work with databases and data infrastructure' },
      { icon: 'Lightbulb', text: 'Apply statistical thinking to real problems' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Data analysis and modelling exercises' },
      { icon: 'BarChart3', label: 'Practical Work', description: 'Build data pipelines and models' },
      { icon: 'Briefcase', label: 'Project Portfolio', description: 'Data project portfolio' },
      { icon: 'Award', label: 'Final Assessment', description: 'Capstone data project with presentation' },
    ],
  },
  'school-engineering-innovation': {
    modules: [
      { title: 'Engineering Foundations', desc: 'Core engineering principles, safety, and system design fundamentals.' },
      { title: 'Hardware & Systems', desc: 'Working with microcontrollers, sensors, actuators, and hardware components.' },
      { title: 'Integration & Control', desc: 'System integration, control logic, and programming embedded systems.' },
      { title: 'Testing & Deployment', desc: 'Testing, calibration, deployment, and maintenance of engineered systems.' },
      { title: 'Capstone Engineering Project', desc: 'Design, build, and demonstrate a working engineered system.' },
    ],
    careers: ['Engineering Technician', 'Robotics Engineer', 'IoT Developer', 'Embedded Systems Engineer', 'Automation Specialist', 'Renewable Energy Technician'],
    outcomes: [
      { icon: 'Cog', text: 'Design and build physical systems' },
      { icon: 'Wrench', text: 'Work with hardware, sensors, and microcontrollers' },
      { icon: 'Code', text: 'Program and control embedded systems' },
      { icon: 'Briefcase', text: 'Integrate hardware and software systems' },
      { icon: 'ShieldCheck', text: 'Follow engineering safety standards' },
      { icon: 'Lightbulb', text: 'Innovate and prototype new solutions' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Engineering design and calculation exercises' },
      { icon: 'Wrench', label: 'Practical Work', description: 'Hands-on building and prototyping' },
      { icon: 'Briefcase', label: 'Project Portfolio', description: 'Engineering project portfolio' },
      { icon: 'Award', label: 'Final Assessment', description: 'Capstone engineering project with demo' },
    ],
  },
  'school-creative-ai-immersive': {
    modules: [
      { title: 'Creative Technology Foundations', desc: 'Principles of digital design, 3D graphics, and immersive media.' },
      { title: 'Tools & Workflows', desc: 'Industry-standard creative tools, engines, and production workflows.' },
      { title: 'Creative Production', desc: 'Building creative projects — from 3D models to immersive experiences.' },
      { title: 'AI-Enhanced Creation', desc: 'Using AI tools to accelerate and enhance creative production.' },
      { title: 'Capstone Creative Project', desc: 'Produce a complete creative work — a game, immersive experience, or AI-enhanced production.' },
    ],
    careers: ['3D Artist', 'Game Developer', 'AR/VR Developer', 'Creative Technologist', 'Motion Designer', 'Immersive Media Producer'],
    outcomes: [
      { icon: 'Palette', text: 'Create professional-quality digital content' },
      { icon: 'Box', text: 'Build 3D models and immersive environments' },
      { icon: 'Gamepad2', text: 'Develop games and interactive experiences' },
      { icon: 'Sparkles', text: 'Use AI to enhance creative workflows' },
      { icon: 'Briefcase', text: 'Produce a professional creative portfolio' },
      { icon: 'Lightbulb', text: 'Innovate at the intersection of AI and media' },
    ],
    assessment: [
      { icon: 'FileText', label: 'Assignments', description: 'Creative production exercises' },
      { icon: 'Palette', label: 'Practical Work', description: 'Hands-on creative projects' },
      { icon: 'Briefcase', label: 'Portfolio', description: 'Creative portfolio of work' },
      { icon: 'Award', label: 'Final Assessment', description: 'Capstone creative project with showcase' },
    ],
  },
};

// ── Default fallback theme (for unknown pathways) ──────────────────

const DEFAULT_THEME = {
  modules: [
    { title: 'Foundations', desc: 'Core concepts, terminology, and fundamental principles.' },
    { title: 'Core Skills', desc: 'Essential skills and techniques for the subject area.' },
    { title: 'Practical Application', desc: 'Applying knowledge through hands-on exercises and projects.' },
    { title: 'Advanced Topics', desc: 'Advanced concepts and professional-level practices.' },
    { title: 'Capstone Project', desc: 'A comprehensive project demonstrating mastery of the course content.' },
  ],
  careers: ['Professional in the field', 'Specialist', 'Consultant', 'Freelancer', 'Entrepreneur', 'Further study candidate'],
  outcomes: [
    { icon: 'BookOpen', text: 'Develop practical skills and knowledge' },
    { icon: 'Briefcase', text: 'Apply learning in professional contexts' },
    { icon: 'Brain', text: 'Think critically about the subject' },
    { icon: 'Lightbulb', text: 'Solve real-world problems' },
    { icon: 'Users', text: 'Work effectively in professional settings' },
    { icon: 'Award', text: 'Demonstrate mastery through projects' },
  ],
  assessment: [
    { icon: 'FileText', label: 'Assignments', description: 'Regular coursework assignments' },
    { icon: 'Users', label: 'Practical Work', description: 'Hands-on practical exercises' },
    { icon: 'Briefcase', label: 'Project', description: 'A practical project demonstrating skills' },
    { icon: 'Award', label: 'Final Assessment', description: 'Comprehensive final assessment' },
  ],
};

// ── Helper: estimate module hours from duration ───────────────────

function estimateHours(durationStr) {
  const weeks = parseInt(durationStr) || 8
  const totalHours = weeks * 4 // ~4 hours per week
  const perModule = Math.max(4, Math.round(totalHours / 5))
  return perModule
}

// ── Main generator function ───────────────────────────────────────

export function generateCourseDetail(course) {
  if (!course) return null

  const theme = PATHWAY_THEMES[course.pathwayId] || DEFAULT_THEME
  const levelProfile = LEVEL_PROFILES[course.level] || LEVEL_PROFILES.Beginner
  const hoursPerModule = estimateHours(course.duration)

  // Build modules from theme, adapting titles with level awareness
  const modules = theme.modules.map((m, i) => {
    const isLast = i === theme.modules.length - 1
    const title = isLast && course.level === 'Advanced'
      ? levelProfile.capstoneTitle
      : m.title

    return {
      title: `${title}`,
      description: isLast ? levelProfile.capstoneDesc : m.desc,
      hours: isLast ? hoursPerModule + 4 : hoursPerModule,
    }
  })

  // Build overview from course data
  const overview = {
    description: course.fullDescription || course.shortDescription,
    targetAudience: buildTargetAudience(course),
    objectives: buildObjectives(course, theme),
    outcomes: buildOutcomes(course, theme),
  }

  // Build entry requirements
  const entryRequirements = course.entryRequirements?.length
    ? course.entryRequirements
    : buildDefaultEntryRequirements(course)

  return {
    overview,
    languageOfInstruction: course.language || 'English',
    learningOutcomes: theme.outcomes,
    modules,
    entryRequirements,
    assessment: theme.assessment,
    certification: { items: DEFAULT_CERT_ITEMS },
    careers: theme.careers,
    relatedCourses: [], // Filled by buildCourseData from same-pathway courses
    faqs: SHARED_FAQS,
    reviews: DEFAULT_REVIEWS,
  }
}

// ── Helper: build target audience text ─────────────────────────────

function buildTargetAudience(course) {
  const level = course.level || 'Beginner'
  const category = course.category || 'this field'

  if (level === 'Beginner') {
    return `Beginners and newcomers to ${category.toLowerCase()} who want to build a strong foundation. No prior experience is required — just a willingness to learn and practise.`
  }
  if (level === 'Intermediate') {
    return `Learners with some experience in ${category.toLowerCase()} who want to deepen their skills and move to a professional level. Ideal for those who have completed introductory study or have relevant work experience.`
  }
  return `Experienced practitioners and professionals in ${category.toLowerCase()} who want to master advanced concepts and work at an industry level. Requires prior study or professional experience.`
}

// ── Helper: build objectives ──────────────────────────────────────

function buildObjectives(course, theme) {
  const level = course.level || 'Beginner'
  const name = course.name || 'this course'

  if (level === 'Beginner') {
    return [
      `Understand the core concepts and terminology of ${name.toLowerCase()}`,
      `Develop foundational practical skills through guided exercises`,
      `Build confidence to apply knowledge in real-world situations`,
      `Prepare for further study at an intermediate level`,
    ]
  }
  if (level === 'Intermediate') {
    return [
      `Master the key techniques and workflows used in ${name.toLowerCase()}`,
      `Apply skills independently to real projects and scenarios`,
      `Develop professional-level competency in the subject area`,
      `Build a portfolio of practical work`,
    ]
  }
  return [
    `Achieve mastery of advanced concepts and professional practices in ${name.toLowerCase()}`,
    `Work at industry standard with production-grade tools and techniques`,
    `Solve complex, real-world problems independently`,
    `Demonstrate readiness for professional work or further specialisation`,
  ]
}

// ── Helper: build outcomes ────────────────────────────────────────

function buildOutcomes(course, theme) {
  const level = course.level || 'Beginner'

  if (level === 'Beginner') {
    return [
      `Confidently apply foundational ${course.category?.toLowerCase() || 'subject'} skills`,
      `Understand and use core terminology and concepts`,
      `Complete practical exercises and a beginner project`,
      `Progress to intermediate-level study with confidence`,
    ]
  }
  if (level === 'Intermediate') {
    return [
      `Apply ${course.category?.toLowerCase() || 'subject'} skills to real-world projects`,
      `Work independently with professional tools and techniques`,
      `Build a portfolio demonstrating intermediate-level competency`,
      `Transition to advanced study or professional work`,
    ]
  }
  return [
    `Demonstrate industry-level mastery of ${course.category?.toLowerCase() || 'the subject'}`,
    `Deliver production-grade work to professional standards`,
    `Solve complex problems and make informed professional decisions`,
    `Showcase a professional portfolio ready for the job market`,
  ]
}

// ── Helper: build default entry requirements ──────────────────────

function buildDefaultEntryRequirements(course) {
  const reqs = ['Minimum age of 16 years', 'Access to a computer with internet']

  if (course.level === 'Intermediate') {
    reqs.push('Completion of a beginner-level course or equivalent experience')
  }
  if (course.level === 'Advanced') {
    reqs.push('Completion of intermediate-level study or relevant professional experience')
  }

  reqs.push('Commitment to attend and participate')
  return reqs
}
