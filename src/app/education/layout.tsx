import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Éducation — Cours, ressources et apprentissage | Sunubiblio',
  description:
    'Découvrez les ressources éducatives de Sunubiblio pour apprendre, réviser et progresser à votre rythme. Du préscolaire au supérieur, retrouvez des cours, exercices corrigés et annales conformes aux programmes sénégalais.',
  openGraph: {
    title: 'Éducation — Cours, ressources et apprentissage | Sunubiblio',
    description:
      'Accédez aux ressources éducatives adaptées à chaque niveau : préscolaire, primaire, collège, lycée, université et formation professionnelle au Sénégal.',
    url: 'https://sunubiblio.sn/education',
    siteName: 'Sunubiblio',
    locale: 'fr_SN',
    type: 'website',
  },
};

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
