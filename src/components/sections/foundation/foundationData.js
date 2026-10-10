/**
 * foundationData — content for the InnoSpeak Global Foundation.
 * Aligned with the Foundation positioning document.
 */

export const FOUNDATION_HERO = {
  eyebrow: 'InnoSpeak Global Foundation',
  title: 'Opening Doors to',
  highlight: 'Learning, Skills & Opportunity.',
  description:
    'We support learners and communities by helping remove the barriers that stand between people and opportunity — education, technology, STEM and community development.',
  primaryCta: { label: 'Explore Our Programs', to: '#foundation-programs' },
  secondaryCta: { label: 'Apply for Support', to: '/apply?division=foundation' },
  tertiaryCta: { label: 'Support a Program', to: '#ways-to-give' },
};

export const FOUNDATION_STATS = [
  {
    id: 'learners',
    value: 0,
    suffix: '',
    label: 'Learners Supported',
    description: 'Across all Foundation programs',
  },
  {
    id: 'communities',
    value: 0,
    suffix: '',
    label: 'Communities Reached',
    description: 'Urban and rural locations',
  },
  {
    id: 'digital',
    value: 0,
    suffix: '',
    label: 'Digital Access Provided',
    description: 'Devices, data and digital learning',
  },
  {
    id: 'projects',
    value: 0,
    suffix: '',
    label: 'Projects Supported',
    description: 'Community-led initiatives funded',
  },
];

/**
 * FOCUS AREAS — the four flagship Foundation programs.
 * Additional programs can be added here without changing the layout.
 */
export const FOCUS_AREAS = [
  {
    id: 'education-access',
    name: 'Education Access Fund',
    short: 'Support for learners facing financial barriers.',
    description:
      'We help learners who have the ability and desire to pursue education but face financial barriers — from tuition to learning materials and other essential costs.',
    icon: 'award',
    supports: [
      'Tuition and school fees',
      'Examination fees',
      'Learning materials',
      'Accommodation and transport',
      'Technical and TVET costs',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=education-access',
  },
  {
    id: 'digital-access',
    name: 'Digital Access Initiative',
    short: 'Reducing digital inequality.',
    description:
      'We help learners and communities access the technology and digital learning they need to participate fully in a digital world.',
    icon: 'laptop',
    supports: [
      'Laptops and tablets',
      'Internet and data support',
      'Digital learning resources',
      'Digital literacy training',
      'Community digital access',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=digital-access',
  },
  {
    id: 'girls-in-stem',
    name: 'Girls in STEM',
    short: 'Supporting girls and young women in Science, Technology, Engineering and Mathematics.',
    description:
      'We support girls and young women pursuing STEM fields — through education support, mentorship, technical equipment and career exposure.',
    icon: 'sparkles',
    supports: [
      'Education support',
      'STEM learning materials',
      'Technical equipment',
      'Mentorship and workshops',
      'Innovation projects and career exposure',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=girls-in-stem',
  },
  {
    id: 'community-grants',
    name: 'Community Impact Grants',
    short: 'Supporting community-led initiatives.',
    description:
      'We support carefully selected community-led projects that improve education, digital access, skills development or local problem-solving.',
    icon: 'heart',
    supports: [
      'Community digital learning centres',
      'School science and technical equipment',
      'Youth skills workshops',
      'Community learning programs',
      'Technology and local innovation initiatives',
    ],
    canApply: true,
    applyTo: '/apply?division=foundation&program=community-grants',
  },
];

/**
 * INITIATIVES — live funded projects with progress tracking.
 * These are the operational campaigns that sponsors can support.
 */
export const FOUNDATION_INITIATIVES = [
  {
    id: 'girls-in-tech',
    title: 'Girls in Tech Scholarship',
    category: 'Girls in STEM',
    description:
      'Full scholarships for young women entering InnoSpeak Labs software, AI or data tracks — covering tuition, materials and mentorship.',
    raised: 0,
    goal: 5000,
    currency: 'USD',
    beneficiaries: 20,
    status: 'recruiting',
  },
  {
    id: 'community-digital',
    title: 'Community Digital Literacy',
    category: 'Digital Access Initiative',
    description:
      'Free digital literacy courses for adult learners in rural and underserved communities — with devices and data provided.',
    raised: 0,
    goal: 3000,
    currency: 'USD',
    beneficiaries: 100,
    status: 'recruiting',
  },
  {
    id: 'education-access-fund',
    title: 'Education Access Fund',
    category: 'Education Access Fund',
    description:
      'Direct tuition support for InnoSpeak Academy and Labs learners who cannot afford fees — from short courses to full programs.',
    raised: 0,
    goal: 8000,
    currency: 'USD',
    beneficiaries: 50,
    status: 'recruiting',
  },
  {
    id: 'community-grants-2026',
    title: 'Community Impact Grants 2026',
    category: 'Community Impact Grants',
    description:
      'Seed funding for up to 5 community-led projects that improve education, digital access or local problem-solving.',
    raised: 0,
    goal: 4000,
    currency: 'USD',
    beneficiaries: 5,
    status: 'recruiting',
  },
];

/**
 * HOW IT WORKS — six transparent steps.
 */
export const SUPPORT_STEPS = [
  {
    number: '01',
    title: 'Apply or Express Interest',
    description:
      'Complete a short application through your InnoSpeak account, telling us what support you need and why.',
  },
  {
    number: '02',
    title: 'Verification',
    description:
      'Our Foundation team verifies the information you provide and the documents you upload.',
  },
  {
    number: '03',
    title: 'Assessment',
    description:
      'Each application is assessed against the criteria of the relevant Foundation program.',
  },
  {
    number: '04',
    title: 'Selection',
    description:
      'Approved applicants are selected based on need, program fit and available funding.',
  },
  {
    number: '05',
    title: 'Support',
    description:
      'Approved support is allocated — tuition, materials, digital access or project funding.',
  },
  {
    number: '06',
    title: 'Follow-up & Impact',
    description:
      'We follow up on progress and, with consent, share impact with our supporters.',
  },
];

/**
 * WAYS TO GIVE — sponsor a Program, not an individual.
 */
export const WAYS_TO_GIVE = [
  {
    id: 'education-access',
    title: 'Education Access Fund',
    description:
      'Support learners who face financial barriers — tuition, materials and essential education costs.',
    icon: 'award',
    cta: 'Support This Program',
    to: '/contact?interest=foundation-donate-education-access',
  },
  {
    id: 'digital-access',
    title: 'Digital Access Initiative',
    description:
      'Provide devices, internet and digital learning resources to learners and communities.',
    icon: 'laptop',
    cta: 'Support This Program',
    to: '/contact?interest=foundation-donate-digital-access',
  },
  {
    id: 'girls-in-stem',
    title: 'Girls in STEM',
    description:
      'Open STEM pathways for girls and young women through education support, mentorship and equipment.',
    icon: 'sparkles',
    cta: 'Support This Program',
    to: '/contact?interest=foundation-donate-girls-in-stem',
  },
  {
    id: 'community-grants',
    title: 'Community Impact Grants',
    description:
      'Fund community-led projects that improve education, digital access or local skills development.',
    icon: 'heart',
    cta: 'Support This Program',
    to: '/contact?interest=foundation-donate-community-grants',
  },
];

export const TRANSPARENCY = {
  summary: 'Where every dollar goes',
  items: [
    { category: 'Direct learner support', percentage: 75, description: 'Tuition, materials, digital access' },
    { category: 'Community projects', percentage: 15, description: 'Grants and community initiatives' },
    { category: 'Program administration', percentage: 8, description: 'Verification, coordination, reporting' },
    { category: 'Bank & platform fees', percentage: 2, description: 'Payment processing' },
  ],
  commitment:
    'At least 90% of every contribution reaches learners and communities. We publish a full impact report every year.',
};

export const FOUNDATION_FAQ = [
  {
    q: 'Who can apply for Foundation support?',
    a: 'Learners and communities facing financial, digital or access barriers. You can be an InnoSpeak learner or applying to become one. Each Foundation program has its own eligibility criteria.',
  },
  {
    q: 'How do I apply?',
    a: 'Sign in to your InnoSpeak account and go to your portal. Select Foundation → My Applications → Start Application. Choose the program that fits your situation, complete the form and upload any required documents.',
  },
  {
    q: 'How long does the review take?',
    a: 'Most applications receive a decision within 10 working days after verification. Complex cases may take slightly longer. You will receive notifications at each stage.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes. Approved Foundation support does not require repayment. Depending on the program, we may cover tuition, materials, digital access or project funding.',
  },
  {
    q: 'What certificate do Foundation-supported learners receive?',
    a: 'A Foundation-branded InnoSpeak certificate — issued with the Foundation seal and clearly marked as a Foundation-supported award. It carries the same weight as any InnoSpeak certificate.',
  },
  {
    q: 'Can I support a specific learner?',
    a: 'Our default is to support programs — this lets our team allocate funds where the need is greatest. If you already know a learner you wish to support, you can provide their admission number when you give, and our team will allocate your contribution to them after verification.',
  },
  {
    q: 'Can I contact the learner I support?',
    a: 'For privacy and safeguarding, no direct contact is allowed. Our Foundation team shares progress reports with supporters and relays any messages. This protects learners and their families.',
  },
  {
    q: 'Is my contribution tax-deductible?',
    a: 'Depends on your country and our registration status there. Contact us before contributing if you need a specific receipt.',
  },
];

export const FOUNDATION_CLOSING = {
  title: 'Opportunity should not depend on circumstance.',
  subtitle:
    'Help us remove the barriers that stand between people and opportunity. Every contribution reaches a learner or a community.',
  primaryCta: { label: 'Apply for Support', to: '/apply?division=foundation' },
  secondaryCta: { label: 'Support a Program', to: '#ways-to-give' },
};