import { NextRequest, NextResponse } from 'next/server';
import { AgendaItem, AgendaItemType } from '@/types/agenda';

export const dynamic = 'force-dynamic';

const VALID_TYPES: AgendaItemType[] = [
  'evenement',
  'rdv',
  'cours',
  'tache',
  'rappel',
  'visio',
  'formation',
  'examen',
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      type,
      date,
      startTime = '09:00',
      durationMinutes = 60,
      description = '',
      mode = 'en_ligne',
      subject = 'Général',
      isInstant = false,
    } = body;

    // 1. Validation Titre
    if (!title || typeof title !== 'string' || title.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Le titre doit comporter au moins 2 caractères.' },
        { status: 400 }
      );
    }
    if (title.trim().length > 120) {
      return NextResponse.json(
        { success: false, error: 'Le titre ne peut pas dépasser 120 caractères.' },
        { status: 400 }
      );
    }

    // 2. Validation Type
    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Type d’activité non reconnu ou invalide.' },
        { status: 400 }
      );
    }

    // 3. Validation Date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date || !dateRegex.test(date)) {
      return NextResponse.json(
        { success: false, error: 'Format de date invalide (attendu : AAAA-MM-JJ).' },
        { status: 400 }
      );
    }

    // 4. Validation Heure
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!startTime || !timeRegex.test(startTime)) {
      return NextResponse.json(
        { success: false, error: 'Format d’heure invalide (attendu : HH:MM).' },
        { status: 400 }
      );
    }

    // 5. Validation Durée
    const dur = Number(durationMinutes);
    if (isNaN(dur) || dur < 5 || dur > 720) {
      return NextResponse.json(
        { success: false, error: 'La durée doit être comprise entre 5 et 720 minutes.' },
        { status: 400 }
      );
    }

    // Calcul de l'heure de fin
    const [h, m] = startTime.split(':').map(Number);
    const totalMin = h * 60 + m + dur;
    const endH = Math.floor(totalMin / 60) % 24;
    const endM = totalMin % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    // Attribution du sticker et du libellé selon le type
    let sticker = '📅';
    let badgeLabel = 'Événement';

    switch (type) {
      case 'evenement':
        sticker = '🔔';
        badgeLabel = 'Événement';
        break;
      case 'rdv':
        sticker = '📅';
        badgeLabel = 'Rendez-vous';
        break;
      case 'cours':
        sticker = '📚';
        badgeLabel = 'Cours / Séance';
        break;
      case 'tache':
        sticker = '✅';
        badgeLabel = 'Tâche';
        break;
      case 'rappel':
        sticker = '⏰';
        badgeLabel = 'Rappel';
        break;
      case 'visio':
        sticker = '🎥';
        badgeLabel = isInstant ? 'Visio en direct' : 'Séance Visio';
        break;
      case 'formation':
        sticker = '🎓';
        badgeLabel = 'Formation';
        break;
      case 'examen':
        sticker = '✨';
        badgeLabel = 'Examen';
        break;
    }

    const isVisio = type === 'visio' || mode === 'visio';
    const computedMode = isVisio ? 'visio' : mode === 'presentiel' ? 'presentiel' : 'en_ligne';

    const newItem: AgendaItem = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      title: title.trim(),
      subject: type === 'visio' ? 'Visioconférence' : subject.trim() || 'Personnel',
      date,
      startTime,
      endTime,
      durationMinutes: dur,
      mode: computedMode,
      status: isInstant ? 'today' : 'upcoming',
      description: description ? description.trim().slice(0, 1000) : undefined,
      canCancel: true,
      sticker,
      badgeLabel,
      visioAvailable: isVisio,
      visioLink: isVisio ? `https://visio.sunubiblio.com/session-${Date.now()}` : undefined,
    };

    return NextResponse.json({
      success: true,
      item: newItem,
      message: 'Élément d’agenda créé avec succès.',
    });
  } catch (err: any) {
    console.error('API /api/agenda/events error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Une erreur est survenue lors de la création de l’élément.' },
      { status: 500 }
    );
  }
}
