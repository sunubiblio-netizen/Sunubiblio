import { NextResponse } from 'next/server';
import {
  MOCK_COMMUNITIES,
  MOCK_STUDY_GROUPS,
  MOCK_FEED_POSTS,
  MOCK_PEER_USERS,
  MOCK_DISCUSSIONS,
} from '@/data/mockCommunityData';

/**
 * Route API Serveur pour le module Communauté
 * Prête pour l'intégration avec Prisma Client / PostgreSQL
 * et la validation des permissions et sessions serveur.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'all';

    if (tab === 'communities') {
      return NextResponse.json({ success: true, data: MOCK_COMMUNITIES });
    }
    if (tab === 'groups') {
      return NextResponse.json({ success: true, data: MOCK_STUDY_GROUPS });
    }
    if (tab === 'feed') {
      return NextResponse.json({ success: true, data: MOCK_FEED_POSTS });
    }
    if (tab === 'peers') {
      return NextResponse.json({ success: true, data: MOCK_PEER_USERS });
    }
    if (tab === 'discussions') {
      return NextResponse.json({ success: true, data: MOCK_DISCUSSIONS });
    }

    return NextResponse.json({
      success: true,
      data: {
        communities: MOCK_COMMUNITIES,
        groups: MOCK_STUDY_GROUPS,
        feedPosts: MOCK_FEED_POSTS,
        peers: MOCK_PEER_USERS,
        discussions: MOCK_DISCUSSIONS,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erreur interne lors de la récupération des données communautaires.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    // Simulation de validation des permissions côté serveur
    if (!action || !payload) {
      return NextResponse.json(
        { success: false, message: 'Données de requête incomplètes ou invalides.' },
        { status: 400 }
      );
    }

    if (action === 'create_community') {
      if (!payload.name || payload.name.trim().length < 3) {
        return NextResponse.json(
          { success: false, message: 'Le nom de la communauté doit comporter au moins 3 caractères.' },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Communauté créée avec succès côté serveur.',
        data: payload,
      });
    }

    if (action === 'create_group') {
      if (!payload.name || payload.name.trim().length < 3) {
        return NextResponse.json(
          { success: false, message: 'Le nom du groupe d’études doit comporter au moins 3 caractères.' },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Groupe d’études créé avec succès côté serveur.',
        data: payload,
      });
    }

    return NextResponse.json({ success: true, message: 'Action communautaire enregistrée.' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erreur lors du traitement de la requête communautaire.' },
      { status: 500 }
    );
  }
}
