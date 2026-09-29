export interface CameraFilter {
  id: string;
  name: string;
  cssFilter: string;
  previewBg: string;
  icon: string;
  badge?: string;
}

export const CAMERA_FILTERS: CameraFilter[] = [
  {
    id: 'original',
    name: 'Original',
    cssFilter: 'none',
    previewBg: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
    icon: '⚪',
  },
  {
    id: 'naturel',
    name: 'Naturel',
    cssFilter: 'contrast(1.08) saturate(1.15)',
    previewBg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    icon: '🌿',
  },
  {
    id: 'lumineux',
    name: 'Lumineux',
    cssFilter: 'brightness(1.15) contrast(1.05)',
    previewBg: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
    icon: '✨',
  },
  {
    id: 'chaud',
    name: 'Chaud',
    cssFilter: 'sepia(0.25) saturate(1.25) hue-rotate(-10deg)',
    previewBg: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    icon: '☀️',
  },
  {
    id: 'froid',
    name: 'Froid',
    cssFilter: 'hue-rotate(15deg) saturate(1.1) brightness(1.02)',
    previewBg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
    icon: '❄️',
  },
  {
    id: 'violet',
    name: 'Violet Sunu',
    cssFilter: 'hue-rotate(250deg) saturate(1.3) contrast(1.08)',
    previewBg: 'linear-gradient(135deg, #6d28d9 0%, #a855f7 100%)',
    icon: '🔮',
    badge: 'Sunu',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    cssFilter: 'sepia(0.35) saturate(1.45) hue-rotate(-20deg) brightness(1.05)',
    previewBg: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
    icon: '🌅',
  },
  {
    id: 'noir-blanc',
    name: 'Noir & Blanc',
    cssFilter: 'grayscale(1) contrast(1.2)',
    previewBg: 'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)',
    icon: '🎞️',
  },
  {
    id: 'cinema',
    name: 'Cinéma',
    cssFilter: 'contrast(1.25) saturate(0.85)',
    previewBg: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
    icon: '🎬',
  },
  {
    id: 'sunu-glow',
    name: 'Sunu Glow',
    cssFilter: 'brightness(1.08) contrast(1.15) saturate(1.2)',
    previewBg: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
    icon: '⭐',
    badge: '★',
  },
];

