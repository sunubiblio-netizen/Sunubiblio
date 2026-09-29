import { NextRequest, NextResponse } from 'next/server';
import { CreatePublicationInput, PublicationItem } from '@/types/publication';
import { MOCK_PUBLICATIONS } from '@/data/mockPublicationsData';

// Mémoire locale pour les tests serveur ou injection DB
let publicationsDb: PublicationItem[] = [...MOCK_PUBLICATIONS];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: publicationsDb,
    total: publicationsDb.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<CreatePublicationInput>;

    // 1. Validation de sécurité côté serveur
    if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Le contenu de la publication est obligatoire.' },
        { status: 400 }
      );
    }

    if (body.content.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Le contenu ne peut pas dépasser 5 000 caractères.' },
        { status: 400 }
      );
    }

    const validFormats = ['text', 'image', 'video', 'resource'];
    if (!body.format || !validFormats.includes(body.format)) {
      return NextResponse.json(
        { success: false, error: 'Format de publication non supporté.' },
        { status: 400 }
      );
    }

    const validVisibilities = ['public', 'abonnes', 'prive'];
    const visibility = body.visibility && validVisibilities.includes(body.visibility)
      ? body.visibility
      : 'public';

    // 2. Validation spécifique du format Ressource
    if (body.format === 'resource') {
      if (!body.resourceTitle || body.resourceTitle.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: 'Le titre de la ressource est requis pour ce format.' },
          { status: 400 }
        );
      }
    }

    // 3. Validation de média éventuel
    let mediaList = undefined;
    if (body.mediaUrls && Array.isArray(body.mediaUrls) && body.mediaUrls.length > 0) {
      mediaList = body.mediaUrls.slice(0, 4).map((url, idx) => ({
        id: `media-${Date.now()}-${idx}`,
        type: (body.format === 'video' ? 'video' : 'image') as 'image' | 'video',
        url: url.trim(),
        caption: body.content?.slice(0, 100),
      }));
    } else if (body.mediaUrl && body.mediaUrl.trim().length > 0) {
      mediaList = [
        {
          id: `media-${Date.now()}`,
          type: (body.format === 'video' ? 'video' : 'image') as 'image' | 'video',
          url: body.mediaUrl.trim(),
          thumbnailUrl: body.format === 'video' ? '/vid_bac.jpg' : undefined,
          caption: body.content?.slice(0, 100),
        },
      ];
    }

    // 4. Création de l'entité
    const now = new Date();
    const newPublication: PublicationItem = {
      id: `pub-${Date.now()}`,
      authorName: body.authorName || 'Mamadou Diop',
      authorRole: body.authorRole || 'Membre Sunubiblio',
      authorBadge: body.authorBadge || 'Membre Vérifié',
      authorAvatar: '/avatar_mamadou.jpg',
      createdAt: now.toISOString(),
      timeAgo: 'À l’instant',
      format: body.format,
      visibility,
      content: body.content.trim(),
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      comments: [],
      media: mediaList,
      sharedResource:
        body.format === 'resource' && body.resourceTitle
          ? {
              id: `res-${Date.now()}`,
              title: body.resourceTitle.trim(),
              type: body.resourceType || 'cours',
              href: body.resourceHref?.trim() || '/education',
              badge: 'Document Sunubiblio',
            }
          : undefined,
    };

    publicationsDb = [newPublication, ...publicationsDb];

    return NextResponse.json({
      success: true,
      data: newPublication,
      message: 'Publication créée avec succès.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Erreur interne lors de la création de la publication.' },
      { status: 400 }
    );
  }
}
