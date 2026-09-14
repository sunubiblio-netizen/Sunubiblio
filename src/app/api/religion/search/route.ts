import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_RELIGION_RESOURCES, RELIGION_TRADITIONS, RELIGION_BRANCHES } from '@/data/mockReligion';
import { RELIGION_PEDAGOGICAL_DATA } from '@/data/religionPedagogy';
import { ReligionResource } from '@/types/religion';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const traditionParam = searchParams.get('tradition')?.toLowerCase().trim() || '';
    const branchParam = searchParams.get('branch')?.toLowerCase().trim() || '';
    const qParam = searchParams.get('q')?.toLowerCase().trim() || '';
    const limitParam = parseInt(searchParams.get('limit') || '8', 10);

    if (!traditionParam) {
      return NextResponse.json(
        { error: 'Le paramètre tradition est obligatoire pour la recherche contextuelle.' },
        { status: 400 }
      );
    }

    // Normalisation du slug de tradition
    let normalizedTradition = traditionParam;
    if (normalizedTradition === 'religions-traditionnelles-africaines' || normalizedTradition === 'spiritualites-africaines') {
      normalizedTradition = 'spiritualites-africaines';
    }

    // 1. Filtrage strict côté serveur : uniquement la tradition demandée
    let resources = INITIAL_RELIGION_RESOURCES.filter((r) => {
      if (normalizedTradition === 'spiritualites-africaines') {
        return r.traditionId === 'religions-traditionnelles-africaines';
      }
      return r.traditionId === normalizedTradition;
    });

    // 2. Filtrage par branche / courant si spécifié
    if (branchParam && branchParam !== 'all') {
      resources = resources.filter((r) => r.branchId === branchParam);
    }

    // 3. Filtrage textuel contextuel si une requête est saisie
    if (qParam) {
      resources = resources.filter(
        (r) =>
          r.titre.toLowerCase().includes(qParam) ||
          r.auteur.toLowerCase().includes(qParam) ||
          r.description.toLowerCase().includes(qParam) ||
          r.tags.some((t) => t.toLowerCase().includes(qParam))
      );
    }

    // 4. Recherche contextuelle dans les textes sacrés de cette religion
    const pedagogicalData = RELIGION_PEDAGOGICAL_DATA[normalizedTradition];
    let matchingSacredTexts: { name: string; subtitle: string }[] = [];
    if (pedagogicalData && qParam) {
      matchingSacredTexts = pedagogicalData.sacredTexts
        .filter(
          (t) =>
            t.name.toLowerCase().includes(qParam) ||
            t.subtitle.toLowerCase().includes(qParam) ||
            (t.arabicOrOriginalName && t.arabicOrOriginalName.toLowerCase().includes(qParam)) ||
            t.keyThemes.some((th) => th.title.toLowerCase().includes(qParam) || th.description.toLowerCase().includes(qParam))
        )
        .map((t) => ({ name: t.name, subtitle: t.subtitle }));
    }

    // 5. Recherche contextuelle dans les courants de cette tradition
    let matchingBranches: { id: string; title: string; subtitle: string }[] = [];
    if (qParam) {
      const traditionBranches = RELIGION_BRANCHES.filter((b) => {
        if (normalizedTradition === 'spiritualites-africaines') {
          return b.traditionId === 'religions-traditionnelles-africaines';
        }
        return b.traditionId === normalizedTradition;
      });

      matchingBranches = traditionBranches
        .filter(
          (b) =>
            b.title.toLowerCase().includes(qParam) ||
            b.subtitle.toLowerCase().includes(qParam) ||
            b.description.toLowerCase().includes(qParam)
        )
        .map((b) => ({ id: b.id, title: b.title, subtitle: b.subtitle }));
    }

    // 6. Suggestions dynamiques de complétion
    const suggestionsSet = new Set<string>();
    if (qParam) {
      matchingSacredTexts.forEach((t) => suggestionsSet.add(t.name));
      matchingBranches.forEach((b) => suggestionsSet.add(b.title));
      resources.slice(0, 5).forEach((r) => {
        suggestionsSet.add(r.titre);
        if (r.auteur) suggestionsSet.add(r.auteur);
      });
    }

    return NextResponse.json({
      tradition: normalizedTradition,
      branch: branchParam || null,
      query: qParam,
      total: resources.length,
      resources: resources.slice(0, limitParam),
      matchingSacredTexts,
      matchingBranches,
      suggestions: Array.from(suggestionsSet).slice(0, 6),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la recherche contextuelle.' },
      { status: 500 }
    );
  }
}
