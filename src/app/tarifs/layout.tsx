import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tarifs & Abonnements | Sunubiblio',
  description:
    'Découvrez les formules d’abonnement Sunubiblio : Gratuit, Simple (3 000 FCFA), Recommandé (5 000 FCFA) et Gold (9 000 FCFA). Préparez vos cours et concours en toute liberté.',
  openGraph: {
    title: 'Tarifs & Abonnements | Sunubiblio',
    description:
      'Choisissez la formule qui vous correspond pour réussir vos études et concours au Sénégal.',
    type: 'website',
  },
};

export default function TarifsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
