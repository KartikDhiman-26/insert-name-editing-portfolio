export interface ShortFormWork {
  id: string;
  title: string;
  videoUrl: string | null;
  role: string;
  type: string;
  duration: string;
  year: string;
  tools: string;
}

export const SHORT_FORM_WORK: ShortFormWork[] = [
  {
    id: '001',
    title: 'REEL 001',
    videoUrl: 'https://res.cloudinary.com/dtldduhmc/video/upload/v1790569149/Reel_001_gm8kqq.mp4',
    role: 'EDITOR',
    type: 'SHORT FORM',
    duration: '00:15',
    year: '2026',
    tools: 'PREMIERE PRO / AE',
  },
  {
    id: '002',
    title: 'REEL 002',
    videoUrl: 'https://res.cloudinary.com/dtldduhmc/video/upload/v1790570998/Reel_002_rdxwk0.mp4',
    role: 'EDITOR',
    type: 'SHORT FORM',
    duration: '00:15',
    year: '2026',
    tools: 'PREMIERE PRO / AE',
  },
  {
    id: '003',
    title: 'REEL 003',
    videoUrl: 'https://res.cloudinary.com/dtldduhmc/video/upload/v1790571048/Reel_003_iriupj.mp4',
    role: 'EDITOR',
    type: 'SHORT FORM',
    duration: '00:15',
    year: '2026',
    tools: 'PREMIERE PRO / AE',
  },
  {
    id: '004',
    title: 'REEL 004',
    videoUrl: 'https://res.cloudinary.com/dtldduhmc/video/upload/v1790571596/Reel_004_n9bock.mp4',
    role: 'EDITOR',
    type: 'SHORT FORM',
    duration: '00:15',
    year: '2026',
    tools: 'PREMIERE PRO / AE',
  },
  {
    id: '005',
    title: 'REEL 005',
    videoUrl: 'https://res.cloudinary.com/dtldduhmc/video/upload/v1790571614/Reel_005_ef15f1.mp4',
    role: 'EDITOR',
    type: 'SHORT FORM',
    duration: '00:15',
    year: '2026',
    tools: 'PREMIERE PRO / AE',
  },
  {
    id: '006',
    title: 'REEL 006',
    videoUrl: 'https://res.cloudinary.com/dtldduhmc/video/upload/v1790580817/Reel_006_ab9cuw.mp4',
    role: 'EDITOR',
    type: 'SHORT FORM',
    duration: '00:15',
    year: '2026',
    tools: 'PREMIERE PRO / AE',
  },
  {
    id: '007',
    title: 'REEL 007',
    videoUrl: 'https://res.cloudinary.com/dtldduhmc/video/upload/v1790581176/Reel_007_k9hpms.mp4',
    role: 'EDITOR',
    type: 'SHORT FORM',
    duration: '00:15',
    year: '2026',
    tools: 'PREMIERE PRO / AE',
  },
  {
    id: '008',
    title: 'REEL 008',
    videoUrl: 'https://res.cloudinary.com/dtldduhmc/video/upload/v1790580614/Reel_008_bmdo8l.mp4',
    role: 'EDITOR',
    type: 'SHORT FORM',
    duration: '00:15',
    year: '2026',
    tools: 'PREMIERE PRO / AE',
  },
];

export interface LongFormWork {
  id: string;
  title: string;
  videoUrl: string | null;
  role: string;
  type: string;
  duration: string;
  year: string;
  tools: string;
  description: string;
}

export const LONG_FORM_WORK: LongFormWork[] = [
  {
    id: 'LF_001',
    title: 'LONG 001',
    videoUrl: 'https://res.cloudinary.com/dtldduhmc/video/upload/v1790742721/Long_001_nbbwlk.mp4',
    role: 'EDITOR',
    type: 'LONG FORM',
    duration: '12:00',
    year: '2026',
    tools: 'PREMIERE PRO / RESOLVE',
    description: 'A long form cinematic project.',
  },
  {
    id: 'LF_002',
    title: 'LONG 002',
    videoUrl: 'https://res.cloudinary.com/dtldduhmc/video/upload/v1790742679/Long_002_c8bxtu.mp4',
    role: 'EDITOR',
    type: 'LONG FORM',
    duration: '12:00',
    year: '2026',
    tools: 'PREMIERE PRO / RESOLVE',
    description: 'A long form cinematic project.',
  },
  {
    id: 'LF_003',
    title: 'LONG 003',
    videoUrl: 'https://res.cloudinary.com/dtldduhmc/video/upload/v1790742688/Long_003_aiu7ks.mp4',
    role: 'EDITOR',
    type: 'LONG FORM',
    duration: '12:00',
    year: '2026',
    tools: 'PREMIERE PRO / RESOLVE',
    description: 'A long form cinematic project.',
  },
  {
    id: 'LF_004',
    title: 'LONG 004',
    videoUrl: 'https://res.cloudinary.com/dtldduhmc/video/upload/v1790742750/Long_004_tofzvz.mp4',
    role: 'EDITOR',
    type: 'LONG FORM',
    duration: '12:00',
    year: '2026',
    tools: 'PREMIERE PRO / RESOLVE',
    description: 'A long form cinematic project.',
  },
];

export interface PortfolioSection {
  id: string;
  label: string;
  index: string;
}

export const PORTFOLIO_SECTIONS: PortfolioSection[] = [
  { id: 'intro', label: 'INTRO', index: '01' },
  { id: 'work', label: 'WORK', index: '02' },
  { id: 'longform', label: 'LONG FORM', index: '03' },
  { id: 'about', label: 'ABOUT', index: '04' },
  { id: 'contact', label: 'CONTACT', index: '05' },
];
