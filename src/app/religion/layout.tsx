import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Religion, Spiritualité & Philosophie | Sunubiblio',
  description:
    'Explorez des ressources patrimoniales et authentiques pour approfondir vos connaissances, votre réflexion et votre spiritualité : Islam, Christianisme, Judaïsme, Philosophie, Histoire des religions et Traditions.',
  openGraph: {
    title: 'Religion, Spiritualité & Philosophie — Sunubiblio',
    description:
      'Textes de référence, traités spirituels, philosophie et sagesses universelles en accès libre et guidé.',
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
