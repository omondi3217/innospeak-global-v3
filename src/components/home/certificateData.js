/**
 * certificateData — content for the homepage certificate preview.
 * The certificate mock itself is rendered by CertificateMock.jsx.
 */

export const CERTIFICATE_INTRO = {
  eyebrow: 'Earned, Not Just Learned',
  title: 'A Certificate That Opens Real Doors',
  subtitle:
    'Every InnoSpeak course issues a verifiable certificate. Proof of the skills you built — shareable on LinkedIn, CV and portfolio.',
};

export const CERTIFICATE_SAMPLE = {
  learnerName: 'Jane Wanjiru Kamau',
  courseName: 'Python Programming',
  courseCode: 'PY101',
  division: 'InnoSpeak Global Academy',
  issuedOn: '12 October 2026',
  certificateId: 'IS-2026-000148',
  signature: 'Fred Omondi',
  signatureTitle: 'Founder & CEO',
};

export const CERTIFICATE_TRUST_POINTS = [
  {
    id: 'verifiable',
    label: 'Verifiable',
    title: 'Anyone can verify it',
    description:
      'Every certificate carries a unique ID and QR code. Employers and institutions can confirm authenticity in seconds.',
  },
  {
    id: 'shareable',
    label: 'Shareable',
    title: 'Built for LinkedIn & CV',
    description:
      'One-click add to LinkedIn, download a PDF, or link it from your portfolio and CV.',
  },
  {
    id: 'division',
    label: 'Division-aware',
    title: 'Issued by the right division',
    description:
      'Academy, Labs and Foundation each issue their own certificate — clearly showing which programme you completed.',
  },
];

export const CERTIFICATE_FEATURES = [
  { id: 'courses', label: '346+ courses issue certificates' },
  { id: 'verify', label: 'Publicly verifiable' },
  { id: 'divisions', label: 'Academy · Labs · Foundation' },
  { id: 'share', label: 'LinkedIn & CV ready' },
];