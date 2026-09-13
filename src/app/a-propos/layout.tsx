import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos de Sunubiblio | Apprendre, réviser et progresser',
  description:
    'Découvrez Sunubiblio, une bibliothèque numérique pensée pour accompagner les apprenants dans leurs études, leurs révisions et la préparation de leurs concours au Sénégal.',
  openGraph: {
    title: 'À propos de Sunubiblio | Apprendre, réviser et progresser',
    description:
      'Sunubiblio réunit manuels scolaires, annales officielles de concours et exercices dans un espace unique, simple et accessible.',
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
