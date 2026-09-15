import { AIMode, AIAttachment, AIMessage, AIQuotaInfo } from '@/types/ai';

const DEFAULT_QUOTA: AIQuotaInfo = {
  dailyLimit: 30,
  usedToday: 3,
  remainingToday: 27,
  maxFileSizeMB: 15,
  supportedFormats: ['.pdf', '.docx', '.txt', '.png', '.jpg', '.jpeg', '.webp']
};

export const AIService = {
  getQuota(): AIQuotaInfo {
    return { ...DEFAULT_QUOTA };
  },

  validateAttachment(file: File): { valid: boolean; error?: string } {
    const maxBytes = DEFAULT_QUOTA.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return {
        valid: false,
        error: `Le fichier dépasse la taille maximale autorisée de ${DEFAULT_QUOTA.maxFileSizeMB} Mo.`
      };
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!DEFAULT_QUOTA.supportedFormats.includes(extension)) {
      return {
        valid: false,
        error: `Format non pris en charge (${extension}). Formats acceptés : ${DEFAULT_QUOTA.supportedFormats.join(', ')}`
      };
    }

    return { valid: true };
  },

  async processRequest(params: {
    content: string;
    mode: AIMode;
    attachments?: AIAttachment[];
    isWebSearch?: boolean;
  }): Promise<AIMessage> {
    // Simulation du temps de traitement réseau (1.2s)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hasAttachments = params.attachments && params.attachments.length > 0;
    const attachmentContext = hasAttachments
      ? params.attachments!.map(a => `« ${a.name} » (${a.type === 'library' ? 'Ressource Bibliothèque' : 'Document'})`).join(', ')
      : '';

    let generatedText = '';
    const sources = params.isWebSearch ? [
      {
        title: 'Ministère de l’Éducation Nationale du Sénégal (MEN)',
        url: 'https://education.gouv.sn',
        domain: 'education.gouv.sn',
        snippet: 'Programmes officiels et référentiels pédagogiques nationaux.'
      },
      {
        title: 'Archives & Annales UEMOA — FASTEF / UCAD',
        url: 'https://ucad.edu.sn',
        domain: 'ucad.edu.sn',
        snippet: 'Sujets types et annales corrigées pour examens et concours.'
      }
    ] : undefined;

    switch (params.mode) {
      case 'resumer':
        generatedText = `### 📋 Synthèse et Points Essentiels\n\n` +
          (hasAttachments ? `> **Document analysé :** ${attachmentContext}\n\n` : '') +
          `Voici le résumé structuré de votre demande :\n\n` +
          `1. **Thématique principale :** Les concepts clés abordés mettent en avant les principes fondamentaux et leurs implications pratiques.\n` +
          `2. **Idées directrices :**\n` +
          `   - Définition rigoureuse des termes et mise en contexte méthodologique.\n` +
          `   - Articulation des arguments centraux avec des exemples applicatifs.\n` +
          `   - Synthèse des conclusions et ouverture vers les applications aux examens.\n\n` +
          `3. **Recommandation pédagogique :** Relisez en priorité les définitions et assurez-vous de maîtriser les formules ou dates clés associées.`;
        break;

      case 'expliquer':
        generatedText = `### 💡 Explication Pédagogique Claire\n\n` +
          `Pour bien comprendre **${params.content.slice(0, 50)}...**, décomposons cette notion étape par étape :\n\n` +
          `* **Le principe de base :** Imaginez cette notion comme une structure où chaque élément dépend du précédent. L'objectif est de simplifier sans perdre la précision.\n` +
          `* **Pourquoi c'est important :** Dans le programme académique, cette notion constitue un pivot fréquemment évalué au Baccalauréat et aux concours nationaux.\n` +
          `* **Exemple concret :** En pratique, l'application directe consiste à identifier d'abord les données de départ, puis à dérouler la méthode standard.\n\n` +
          `*Souhaitez-vous un exercice d'application guidé ou un schéma explicatif ?*`;
        break;

      case 'qcm':
        generatedText = `### 📝 QCM d'Entraînement & Auto-évaluation\n\n` +
          (hasAttachments ? `> **Basé sur le support :** ${attachmentContext}\n\n` : '') +
          `Voici 3 questions types pour vérifier vos acquis :\n\n` +
          `**Question 1 :** Quelle est la règle fondamentale applicable dans ce cas d'étude ?\n` +
          `- [ ] A) La règle de proportionnalité inverse\n` +
          `- [x] B) Le principe d'équilibre et de conservation *(Bonne réponse)*\n` +
          `- [ ] C) L'hypothèse de dispersion thermique\n\n` +
          `**Question 2 :** Dans quel cas précis cette formule s'applique-t-elle ?\n` +
          `- [x] A) Uniquement en régime permanent ou stationnaire *(Bonne réponse)*\n` +
          `- [ ] B) En condition de variation instable\n` +
          `- [ ] C) Sans restriction de domaine\n\n` +
          `**Question 3 :** Quelle démarche méthodologique est prioritaire lors de l'examen ?\n` +
          `- [ ] A) Répondre directement sans poser les hypothèses\n` +
          `- [x] B) Poser les hypothèses, citer le théorème puis appliquer numériquement *(Bonne réponse)*\n` +
          `- [ ] C) Utiliser des valeurs approchées non justifiées`;
        break;

      case 'exercices':
        generatedText = `### 🎯 Série d'Exercices Recommandés\n\n` +
          `Voici une progression d'exercices calibrée pour s'entraîner efficacement :\n\n` +
          `**Exercice 1 (Niveau Découverte - 10 min) :**\n` +
          `Vérification des définitions et calcul direct d'une valeur nominale à partir des données fournies.\n\n` +
          `**Exercice 2 (Niveau Approfondissement - 25 min) :**\n` +
          `Cas d'étude avec deux paramètres interdépendants. Démontrer la relation entre les variables et interpréter le résultat physique ou littéraire.\n\n` +
          `**Exercice 3 (Type Examen / Concours - 40 min) :**\n` +
          `Problème de synthèse combinant analyse de texte / données et rédaction d'une argumentation structurée.`;
        break;

      case 'corriger':
        generatedText = `### ✍️ Correction & Analyse Détaillée\n\n` +
          `Voici le retour pédagogique sur le travail soumis :\n\n` +
          `* **Points forts :** La démarche générale est bien comprise et le raisonnement suit une structure logique appréciable.\n` +
          `* **Points à corriger :**\n` +
          `   - Attention à la précision des termes techniques : employez la terminologie exacte du programme officiel.\n` +
          `   - Pensez à toujours vérifier les unités ou la concordance des temps avant de conclure.\n` +
          `* **Note indicative d'évaluation :** 15 / 20 (Très bon potentiel, des détails de rigueur à ajuster).`;
        break;

      case 'antiplagiat':
        generatedText = `### 🔎 Analyse & Vérification de Similarité Documentaire\n\n` +
          (hasAttachments ? `> **Document soumis :** ${attachmentContext}\n\n` : '') +
          `Pour effectuer une vérification complète avec calcul de **score de similarité**, détection des passages comparés et génération d'un rapport certifié Sunubiblio, accédez à notre module dédié :\n\n` +
          `👉 **[Accéder à l'espace complet Vérification Antiplagiat](/ia/antiplagiat)**\n\n` +
          `*Ce que le module vérifie pour vous :*\n` +
          `- Comparaison avec le fonds académique et documentaire de Sunubiblio (cours, mémoires, annales).\n` +
          `- Score de similarité indicatif avec identification des citations légitimes.\n` +
          `- Rapport téléchargeable pour vos soutenances, mémoires et publications universitaires.`;
        break;

      case 'assistant':
      default:
        const lowerContent = params.content.toLowerCase();
        const isPlagiarismIntent = lowerContent.includes('plagiat') || 
          lowerContent.includes('similarit') || 
          lowerContent.includes('mémoire') || 
          lowerContent.includes('thèse') || 
          lowerContent.includes('vérifi');

        if (isPlagiarismIntent && hasAttachments) {
          generatedText = `J'ai bien reçu votre document **${attachmentContext}**.\n\n` +
            `Souhaitez-vous lancer une **vérification de similarité documentaire (antiplagiat)** sur ce fichier ?\n\n` +
            `Notre outil dédié analyse les passages et calcule un score de similarité par rapport aux ressources pédagogiques et institutionnelles de Sunubiblio.\n\n` +
            `👉 **[Ouvrir l'outil Vérification Antiplagiat](/ia/antiplagiat)**`;
        } else {
          generatedText = `Bonjour ! J'ai bien analysé votre demande :\n\n` +
            `> "${params.content}"\n\n` +
            (hasAttachments ? `J'ai également pris en compte les pièces jointes associées : **${attachmentContext}**.\n\n` : '') +
            `Je suis configuré pour vous assister de façon optimale sur la plateforme Sunubiblio. Que souhaitez-vous approfondir maintenant ? Vous pouvez me demander d'élaborer une fiche de révision, d'extraire les définitions clés, de vérifier la similarité d'un document ou de préparer une évaluation sur mesure.`;
        }
        break;
    }

    return {
      id: 'msg-' + Date.now(),
      role: 'assistant',
      content: generatedText,
      timestamp,
      mode: params.mode,
      isWebSearch: params.isWebSearch,
      sources,
      status: 'complete',
      isDevPreview: true
    };
  }
};
