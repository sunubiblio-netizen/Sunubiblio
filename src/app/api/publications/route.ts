import { NextRequest, NextResponse } from 'next/server';
import { ProfilePost, ProfilePostImage } from '@/types/profile';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo
const MAX_IMAGES_COUNT = 6;
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

interface IncomingPostPayload {
  content: string;
  groupTag?: string;
  images?: {
    id?: string;
    url: string;
    caption?: string;
    name?: string;
    size?: number;
    type?: string;
  }[];
}

export async function POST(req: NextRequest) {
  try {
    const body: IncomingPostPayload = await req.json();
    const { content, groupTag, images = [] } = body;

    // 1. Validation du contenu textuel
    if (!content || typeof content !== 'string' || content.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Le texte de la publication doit comporter au moins 2 caractères.',
        },
        { status: 400 }
      );
    }

    if (content.trim().length > 2500) {
      return NextResponse.json(
        {
          success: false,
          error: 'Le texte de la publication ne peut pas dépasser 2500 caractères.',
        },
        { status: 400 }
      );
    }

    // 2. Validation des images
    if (!Array.isArray(images)) {
      return NextResponse.json(
        { success: false, error: 'Format de la liste des images invalide.' },
        { status: 400 }
      );
    }

    if (images.length > MAX_IMAGES_COUNT) {
      return NextResponse.json(
        {
          success: false,
          error: `Vous ne pouvez pas publier plus de ${MAX_IMAGES_COUNT} images à la fois.`,
        },
        { status: 400 }
      );
    }

    const validatedImages: ProfilePostImage[] = [];

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const imgNumber = i + 1;

      // URL de l'image obligatoire
      if (!img.url || typeof img.url !== 'string') {
        return NextResponse.json(
          {
            success: false,
            error: `L'image #${imgNumber} ne possède pas d'URL ou de données valides.`,
          },
          { status: 400 }
        );
      }

      // Contrôle du type MIME (si renseigné ou via header data:image/...)
      if (img.type && !ALLOWED_MIME_TYPES.includes(img.type.toLowerCase())) {
        return NextResponse.json(
          {
            success: false,
            error: `Le format du fichier "${img.name || `Image #${imgNumber}`}" (${img.type}) n'est pas autorisé. Formats acceptés : JPG, PNG, WebP, GIF.`,
          },
          { status: 400 }
        );
      }

      // Si dataURL, vérification du préfixe MIME
      if (img.url.startsWith('data:')) {
        const mimeMatch = img.url.match(/^data:([^;]+);/);
        const detectedMime = mimeMatch ? mimeMatch[1].toLowerCase() : '';
        if (detectedMime && !ALLOWED_MIME_TYPES.includes(detectedMime)) {
          return NextResponse.json(
            {
              success: false,
              error: `Format d'image non pris en charge (${detectedMime}). Utilisez JPG, PNG, WebP ou GIF.`,
            },
            { status: 400 }
          );
        }
      }

      // Contrôle de la taille du fichier (max 5 Mo)
      if (img.size && img.size > MAX_IMAGE_SIZE_BYTES) {
        const sizeInMb = (img.size / (1024 * 1024)).toFixed(1);
        return NextResponse.json(
          {
            success: false,
            error: `L'image "${img.name || `#${imgNumber}`}" fait ${sizeInMb} Mo, ce qui dépasse la limite autorisée de 5 Mo.`,
          },
          { status: 400 }
        );
      }

      // Contrôle de la longueur de la légende (max 300 caractères)
      if (img.caption && img.caption.trim().length > 300) {
        return NextResponse.json(
          {
            success: false,
            error: `La légende de l'image #${imgNumber} ne doit pas dépasser 300 caractères.`,
          },
          { status: 400 }
        );
      }

      validatedImages.push({
        id: img.id || `img-srv-${Date.now()}-${i}`,
        url: img.url,
        caption: img.caption ? img.caption.trim() : undefined,
        name: img.name || `image_${i + 1}.jpg`,
        size: img.size || 0,
      });
    }

    // 3. Construction de la publication validée
    const sanitizedPost: ProfilePost = {
      id: `post-srv-${Date.now()}`,
      authorName: 'Mamadou Diop',
      authorGrade: 'Professeur de Mathématiques • Lycée de Dakar',
      authorAvatar: '/avatar_mamadou.jpg',
      timeAgo: 'À l’instant',
      groupTag: groupTag && typeof groupTag === 'string' ? groupTag.trim() : 'Communauté Sunubiblio',
      content: content.trim(),
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      images: validatedImages.length > 0 ? validatedImages : undefined,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Publication créée avec succès.',
        post: sanitizedPost,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('Erreur API /api/publications:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur interne est survenue lors de la validation de la publication.',
      },
      { status: 500 }
    );
  }
}
