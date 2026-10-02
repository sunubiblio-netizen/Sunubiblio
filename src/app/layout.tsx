import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export const metadata: Metadata = {
  title: 'Sunubiblio - La bibliothèque numérique pour tous vos objectifs',
  description:
    "Plateforme SaaS d'accès universel au savoir, livres numériques, annales de concours, éducation et tuteur IA personnalisé pour réussir vos études en Afrique.",
  keywords: [
    'Sunubiblio',
    'bibliothèque numérique',
    'concours Sénégal',
    'FASTEF',
    'ENA',
    'Baccalauréat',
    'EdTech',
    'cours en ligne',
    'livres scolaires',
  ],
  authors: [{ name: 'Sunubiblio' }],
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: 'Sunubiblio - La bibliothèque numérique pour tous vos objectifs',
    description:
      'Accédez à des milliers de ressources éducatives, de concours, d’exercices et de documents pour réussir vos études.',
    url: 'https://sunubiblio.com',
    siteName: 'Sunubiblio',
    locale: 'fr_FR',
    type: 'website',
  },
};

import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ScrollNavigation } from '@/components/shared/ScrollNavigation';
import { SunubiblioTopLine } from '@/components/layout/SunubiblioTopLine';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <SunubiblioTopLine />
        {children}
        <ScrollNavigation />
        <MobileBottomNav />
      </body>
    </html>
  );
}
