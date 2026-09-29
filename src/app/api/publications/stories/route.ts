import { NextRequest, NextResponse } from 'next/server';
import { PublicationStory } from '@/types/publication';
import { MOCK_STORIES } from '@/data/mockPublicationsData';

let storiesDb: PublicationStory[] = [...MOCK_STORIES];

export async function GET() {
  const now = new Date();
  // Règle stricte des 24 h : filtrer les stories expirées côté serveur
  const activeStories = storiesDb.filter((s) => new Date(s.expiresAt) > now);

  return NextResponse.json({
    success: true,
    data: activeStories,
    total: activeStories.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const caption = typeof body.caption === 'string' ? body.caption.trim() : '';
    if (caption.length > 280) {
      return NextResponse.json(
        { success: false, error: 'La légende ne peut excéder 280 caractères.' },
        { status: 400 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 3600 * 1000); // 24 heures

    const newStory: PublicationStory = {
      id: `story-${Date.now()}`,
      authorName: body.authorName || 'Moi',
      authorAvatar: body.authorAvatar || '/avatar_mamadou.jpg',
      mediaType: body.mediaType || 'image',
      mediaUrl: body.mediaUrl || '/vid_fonctions.jpg',
      caption: caption || undefined,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      isViewed: false,
      viewsCount: 0,
    };

    storiesDb = [newStory, ...storiesDb];

    return NextResponse.json({
      success: true,
      data: newStory,
      message: 'Story publiée pour 24 heures.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la publication de la story.' },
      { status: 500 }
    );
  }
}
