import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { religionService } from '@/services/religionService';
import {
  RELIGION_TRADITIONS,
  RELIGION_BRANCHES,
  INITIAL_RELIGION_RESOURCES,
} from '@/data/mockReligion';
import { TraditionClientPage } from './TraditionClientPage';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = religionService.getAllPedagogicalSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await religionService.getPedagogicalData(params.slug);
  const traditionId =
    params.slug === 'spiritualites-africaines'
      ? 'religions-traditionnelles-africaines'
      : params.slug;
  const tradition = RELIGION_TRADITIONS.find((t) => t.id === traditionId);

  const title = tradition ? tradition.title : data?.hero.title || 'Tradition Spirituelle';
  const desc = tradition ? tradition.description : data?.hero.tagline || 'Ressources et ouvrages sacrés.';

  return {
    title: `${title} — Livres, Traités, Exégèses & Patrimoine | Sunubiblio`,
    description: `${desc} Consultez les manuscrits, traités historiques et textes de référence sur Sunubiblio.`,
    openGraph: {
      title: `${title} — Sunubiblio`,
      description: desc,
      url: `https://sunubiblio.sn/religion/${params.slug}`,
      siteName: 'Sunubiblio',
      locale: 'fr_FR',
      type: 'website',
    },
  };
}

export default async function ReligionTraditionPage({ params }: PageProps) {
  const slug = params.slug.toLowerCase().trim();
  const traditionId =
    slug === 'spiritualites-africaines'
      ? 'religions-traditionnelles-africaines'
      : slug;

  const tradition = RELIGION_TRADITIONS.find((t) => t.id === traditionId);

  if (!tradition) {
    notFound();
  }

  // Get pedagogical data (may be null if not defined yet)
  const pedagogicalData = await religionService.getPedagogicalData(slug);

  // Get branches for this tradition
  const branches = RELIGION_BRANCHES.filter((b) => b.traditionId === traditionId);

  // Get resources specifically for this tradition
  const traditionResources = INITIAL_RELIGION_RESOURCES.filter(
    (r) => r.traditionId === traditionId
  );

  return (
    <TraditionClientPage
      tradition={tradition}
      branches={branches}
      resources={traditionResources}
      pedagogicalData={pedagogicalData}
    />
  );
}
