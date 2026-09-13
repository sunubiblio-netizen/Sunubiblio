import { NextRequest, NextResponse } from 'next/server';
import { CONTACT_CATEGORIES } from '@/data/contactData';
import { ContactApiResponse, ContactCategory } from '@/types/contact';

// Basic email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function sanitizeString(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json<ContactApiResponse>(
        {
          success: false,
          message: 'Format de requête invalide.',
        },
        { status: 400 }
      );
    }

    // 1. Anti-spam Honeypot check
    if (body.honeypot && String(body.honeypot).trim().length > 0) {
      // Silently accept spam bot submissions without processing
      return NextResponse.json<ContactApiResponse>({
        success: true,
        message: 'Message reçu avec succès.',
        messageId: `bot_${Date.now()}`,
      });
    }

    const name = sanitizeString(body.name);
    const email = sanitizeString(body.email).toLowerCase();
    const subject = sanitizeString(body.subject);
    const category = body.category as ContactCategory;
    const message = sanitizeString(body.message);

    const errors: Record<string, string> = {};

    // 2. Validate Name
    if (!name || name.length < 2) {
      errors.name = 'Veuillez renseigner votre nom.';
    } else if (name.length > 100) {
      errors.name = 'Le nom ne peut pas dépasser 100 caractères.';
    }

    // 3. Validate Email
    if (!email) {
      errors.email = 'Veuillez entrer une adresse email valide.';
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Format d’adresse email invalide (ex: contact@exemple.sn).';
    }

    // 4. Validate Subject
    if (!subject || subject.length < 3) {
      errors.subject = 'Veuillez renseigner un sujet.';
    } else if (subject.length > 150) {
      errors.subject = 'Le sujet ne peut pas dépasser 150 caractères.';
    }

    // 5. Validate Category
    if (!category || !CONTACT_CATEGORIES.includes(category)) {
      errors.category = 'Veuillez sélectionner une catégorie valide.';
    }

    // 6. Validate Message
    if (!message || message.length < 10) {
      errors.message = 'Votre message est trop court (minimum 10 caractères).';
    } else if (message.length > 3000) {
      errors.message = 'Votre message est trop long (maximum 3 000 caractères).';
    }

    // If validation errors exist, return 400 with details
    if (Object.keys(errors).length > 0) {
      return NextResponse.json<ContactApiResponse>(
        {
          success: false,
          message: 'Veuillez corriger les erreurs ci-dessous.',
          errors,
        },
        { status: 400 }
      );
    }

    // In a production setup, save to database and/or send email notifications here
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // Return success response
    return NextResponse.json<ContactApiResponse>(
      {
        success: true,
        message: 'Merci pour votre message. Nous vous répondrons dès que possible.',
        messageId,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Contact API Error:', err);
    return NextResponse.json<ContactApiResponse>(
      {
        success: false,
        message: 'Une erreur est survenue lors de l’envoi. Veuillez réessayer dans quelques instants.',
      },
      { status: 500 }
    );
  }
}
