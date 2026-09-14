import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Religion & Spiritualités | Sunubiblio',
  description:
    'Explorez les grandes traditions spirituelles du monde et découvrez les ressources religieuses et spirituelles du Sénégal : Islam, Christianisme, Judaïsme, sagesses et textes authentiques.',
  openGraph: {
    title: 'Religion & Spiritualités — Sunubiblio',
    description:
      'Explorez les grandes traditions spirituelles du monde et découvrez les ressources religieuses et spirituelles du Sénégal sur Sunubiblio.',
    url: 'https://sunubiblio.sn/religion',
    siteName: 'Sunubiblio',
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function ReligionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
