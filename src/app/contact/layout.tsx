import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Sunubiblio | Besoin d’aide ?',
  description:
    'Contactez Sunubiblio pour toute question concernant la bibliothèque numérique, les concours, les abonnements, les paiements ou votre compte.',
  openGraph: {
    title: 'Contact Sunubiblio | Besoin d’aide ?',
    description:
      'Notre équipe vous répond par téléphone au +221 78 439 63 26, par email ou via notre formulaire de contact.',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
