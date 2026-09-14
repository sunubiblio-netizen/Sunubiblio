import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { religionService } from '@/services/religionService';
import { INITIAL_RELIGION_RESOURCES } from '@/data/mockReligion';
import { PedagogyClientView } from './PedagogyClientView';

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
  if (!data) {
    return {
      title: 'Tradition introuvable | Sunubiblio',
    };
  }

  return {
    title: `${data.hero.title} — Histoire, Textes, Croyances & Ressources | Sunubiblio`,
    description: `${data.hero.tagline} Découvrez les fondements, les figures majeures et explorez les ressources numériques sur Sunubiblio.`,
    openGraph: {
      title: `${data.hero.title} — Sunubiblio`,
      description: data.hero.tagline,
      url: `https://sunubiblio.sn/religion/${data.slug}`,
      siteName: 'Sunubiblio',
      locale: 'fr_FR',
      type: 'website',
    },
  };
}

export default async function ReligionPedagogyPage({ params }: PageProps) {
  const data = await religionService.getPedagogicalData(params.slug);

  if (!data) {
    notFound();
  }

  // Get resources specifically for this tradition
  const traditionResources = INITIAL_RELIGION_RESOURCES.filter(
    (r) => r.traditionId === data.traditionId
  );

  return (
    <PedagogyClientView
      data={data}
      resources={traditionResources}
    />
  );
}
