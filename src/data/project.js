export const PROJECT = {
  name: 'PROJECT_001',
  creator: 'KARTIK DHIMAN',
  system: 'INSERT_NAME®',
  fps: 24,
  resolution: { w: 3840, h: 2160 },
  resolutionLabel: '4K',
  duration: '00:00:18:12',
};

export const CLIPS = [
  { id: 'CLIP_001', filename: 'CLIP_001.RAW', duration: '00:02:34', meta: '3840×2160', keep: false, color: '#64AFDB' }, // Blue - discarded
  { id: 'CLIP_002', filename: 'CLIP_002.RAW', duration: '00:03:17', meta: '3840×2160', keep: true, color: '#CE1818' },  // Red - kept (active)
  { id: 'CLIP_003', filename: 'CLIP_003.RAW', duration: '00:04:12', meta: '3840×2160', keep: false, color: '#64AFDB' }, // Blue - discarded
  { id: 'CLIP_004', filename: 'CLIP_004.RAW', duration: '00:02:58', meta: '3840×2160', keep: true, color: '#CE1818' },  // Red - kept (active)
  { id: 'CLIP_005', filename: 'CLIP_005.RAW', duration: '00:05:01', meta: '3840×2160', keep: false, color: '#64AFDB' }, // Blue - discarded
  { id: 'CLIP_006', filename: 'CLIP_006.RAW', duration: '00:03:44', meta: '3840×2160', keep: true, color: '#CE1818' },  // Red - kept (active)
];

export const TOOLS = [
  { id: 'select', label: 'SELECT', shortcut: 'V' },
  { id: 'move', label: 'MOVE', shortcut: 'M' },
  { id: 'cut', label: 'CUT', shortcut: 'C' },
  { id: 'play', label: 'PLAY', shortcut: 'SPACE' },
];

export const PHASES = {
  BOOT: 'boot',
  EDITOR_APPEAR: 'editor-appear',
  IMPORT: 'import',
  SELECT: 'select',
  REJECT: 'reject',
  ASSEMBLE: 'assemble',
  CUT: 'cut',
  FINISH: 'finish',
  READY: 'ready',
  PLAY: 'play',
  REVEAL: 'reveal',
  END: 'end',
};
