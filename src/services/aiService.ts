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

      // --- AIDE À L'ÉCRITURE & DIAGNOSTIC ÉTHIQUE ---
      case 'memoire':
        generatedText = `### 🎓 Diagnostic & Assistance Rédactionnelle — Mémoire Universitaire (Master 1 & 2)\n\n` +
          (hasAttachments ? `> **Support analysé :** ${attachmentContext}\n\n` : '') +
          `Voici l'analyse d'excellence pour votre mémoire :\n\n` +
          `1. **Problématique & Hypothèses :** La formulation de votre question de recherche centrale doit être précise et délimitée. Vérifiez que chaque hypothèse correspond à une sous-partie de votre plan.\n` +
          `2. **Rigueur Méthodologique :** Respectez les normes académiques (citations APA ou Vancouver, état de l'art équilibré, séparation nette entre données et interprétations).\n` +
          `3. **Style & Clarté :** Éliminez le jargon inutile et les tournures passives redondantes pour valoriser vos apports personnels.\n\n` +
          `*Conseil du jury : Rédigez l'introduction générale et la conclusion générale en tout dernier pour garantir une cohérence parfaite.*`;
        break;

      case 'these':
        generatedText = `### 🏛️ Expertise & Diagnostic Éthique — Thèse de Doctorat\n\n` +
          (hasAttachments ? `> **Travail doctoral :** ${attachmentContext}\n\n` : '') +
          `Analyse approfondie pour manuscrit de thèse :\n\n` +
          `1. **Originalité & Contribution Scientifique :** Mise en valeur de votre valeur ajoutée par rapport à la littérature internationale existante.\n` +
          `2. **Diagnostic Éthique & Intégrité Académique :** Vérification stricte des attributions, absence de reformulations non sourcées et traçabilité des corpus expérimentaux.\n` +
          `3. **Cohérence Épistémologique :** Alignement strict entre cadre théorique, méthodologie de recueil et analyse critique des résultats.\n\n` +
          `*Vérification recommandée : Soumettez vos chapitres clés au module Antiplagiat avant le dépôt officiel auprès de l'école doctorale.*`;
        break;

      case 'rapport_stage':
        generatedText = `### 💼 Optimisation & Relecture — Rapport de Stage & Professionnel\n\n` +
          (hasAttachments ? `> **Document de stage :** ${attachmentContext}\n\n` : '') +
          `Recommandations pour valoriser votre mission professionnelle :\n\n` +
          `1. **Structure standard recommandée :**\n` +
          `   - Présentation de l'organisme d'accueil et du secteur d'activité.\n` +
          `   - Missions confiées, responsabilités et livrables concrets réalisés.\n` +
          `   - Bilan réflexif : compétences développées, difficultés surmontées et apports pour votre projet d'avenir.\n` +
          `2. **Livrables & Chiffres clés :** Illustrez vos réalisations avec des indicateurs mesurables (KPIs, gains de temps, statistiques).\n` +
          `3. **Confidentialité :** Assurez-vous d'avoir anonymisé les données internes sensibles de l'entreprise.`;
        break;

      case 'article_scientifique':
        generatedText = `### 📑 Évaluation Formelle — Article Scientifique & Publication\n\n` +
          (hasAttachments ? `> **Manuscrit :** ${attachmentContext}\n\n` : '') +
          `Revue formelle selon les critères des comités de lecture (Peer-Review) :\n\n` +
          `1. **Structure IMRAD :** Vérification de l'enchaînement *Introduction, Méthodologie, Résultats et Discussion*.\n` +
          `2. **Résumé (Abstract) & Mots-clés :** L'abstract doit résumer en moins de 250 mots le contexte, la méthode, le résultat majeur et la conclusion.\n` +
          `3. **Qualité des Figures & Tableaux :** Chaque graphique doit être autonome avec légende explicite et unités scientifiques standardisées.\n` +
          `4. **Intégrité des Sources :** Citez fidèlement les articles précurseurs et récents de votre domaine.`;
        break;

      case 'manuscrit_livre':
        generatedText = `### 📖 Stylistique & Correction — Manuscrit de Livre / Essai\n\n` +
          (hasAttachments ? `> **Ouvrage :** ${attachmentContext}\n\n` : '') +
          `Diagnostic éditorial et stylistique :\n\n` +
          `1. **Rythme & Narration :** Fluidité des transitions entre chapitres et maintien de l'intérêt du lecteur.\n` +
          `2. **Élimination des Scories :** Chasse aux répétitions, pléonasmes et phrases alourdies.\n` +
          `3. **Cohérence du Ton :** Harmonisation de la voix narrative ou de la posture de l'essayiste.\n\n` +
          `*Prochaine étape : Souhaitez-vous une réécriture ciblée d'un extrait ou un plan de découpage en chapitres ?*`;
        break;

      case 'autre_academique':
        generatedText = `### 📄 Structuration — Document Académique & Devoir de Recherche\n\n` +
          (hasAttachments ? `> **Document :** ${attachmentContext}\n\n` : '') +
          `Recommandations méthodologiques pour votre devoir :\n\n` +
          `1. **Plan logique en parties équilibrées :** Introduction (amorce, sujet, problématique, plan), développement argumenté, conclusion synthétique.\n` +
          `2. **Précision des références :** Chaque citation doit comporter le nom de l'auteur, l'année et la page de référence.\n` +
          `3. **Mise en page universitaire :** Police lisible (Times/Arial 12 pt), interligne 1.5 et numérotation des pages.`;
        break;

      // --- OUTILS & CONVERSION DE DOCUMENTS ---
      case 'word_to_pdf':
        generatedText = `### 🔄 Conversion Word (.docx / .doc) vers PDF Haute Définition\n\n` +
          (hasAttachments ? `> **Fichier reçu :** ${attachmentContext}\n\n` : '') +
          `La conversion vers un format PDF certifié, sécurisé et compatible avec tous les lecteurs d'écran est prête.\n\n` +
          `* **Polices vectorisées :** Rendu identique et mise en page préservée au pixel près.\n` +
          `* **Qualité d'impression :** Standard 300 DPI pour les dépôts institutionnels et soutenances.\n` +
          `* **Métadonnées et titres :** Table des matières cliquable préservée.\n\n` +
          `*(Vous pouvez glisser votre fichier Word dans la boîte de dialogue ou cliquer sur le trombone pour finaliser le traitement).*`;
        break;

      case 'pdf_to_word':
        generatedText = `### 📄 Conversion PDF vers Document Word (.docx) Modifiable\n\n` +
          (hasAttachments ? `> **Fichier PDF :** ${attachmentContext}\n\n` : '') +
          `Extraction intelligente et reconstitution du document modifiable :\n\n` +
          `* **Reconnaissance optique de texte (OCR) :** Détection des paragraphes, polices et titres.\n` +
          `* **Préservation des tableaux :** Les cellules et grilles sont converties en tableaux Word natifs.\n` +
          `* **Images & illustrations :** Extraction en résolution native dans le corps du texte.\n\n` +
          `*(Joignez votre PDF via le bouton trombone pour lancer l'extraction).*`;
        break;

      case 'modifier_pdf':
        generatedText = `### ✏️ Outil d'Édition & Annotation de PDF\n\n` +
          (hasAttachments ? `> **Fichier PDF cible :** ${attachmentContext}\n\n` : '') +
          `Fonctionnalités d'édition disponibles :\n\n` +
          `* **Annotation & Visa :** Signature électronique, mentions manuscrites, tampon et surlignage.\n` +
          `* **Organisation des pages :** Rotation, réordonnancement, suppression ou ajout de pages blanches.\n` +
          `* **Correction de texte :** Modification de coquilles et ajout de zones de texte directement sur le PDF.\n\n` +
          `*Prêt pour la modification : importez votre document pour débuter les annotations.*`;
        break;

      case 'assistant':
      default:
        const lowerContent = params.content.toLowerCase().trim();
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
        } else if (lowerContent === 'bonjour' || lowerContent === 'salut' || lowerContent === 'slt' || lowerContent === 'coucou' || lowerContent.startsWith('bonjour') || lowerContent.startsWith('bonsoir')) {
          generatedText = `Bonjour ! 😊 Comment puis-je vous aider aujourd'hui ?\n\n` +
            `Vous pouvez me demander d'expliquer une notion complexe, de résumer un document, de préparer un QCM ou d'organiser vos révisions sur Sunubiblio.`;
        } else if (lowerContent.includes('comment tu vas') || lowerContent.includes('comment vas-tu') || lowerContent.includes('comment tuvas') || lowerContent.includes('ça va')) {
          generatedText = `Je vais très bien, merci ! 😊 Je suis toujours prêt à vous accompagner dans vos études et vos recherches documentaires.\n\n` +
            `Sur quel sujet ou devoir souhaitez-vous travailler en ce moment ?`;
        } else {
          generatedText = `J'ai bien pris en compte votre message.` +
            (hasAttachments ? ` J'ai également analysé les documents joints : **${attachmentContext}**.\n\n` : `\n\n`) +
            `Je suis configuré pour vous apporter des explications rigoureuses et adaptées aux programmes éducatifs et concours. Que souhaitez-vous approfondir en priorité ?\n\n` +
            `* **Résumer** ou synthétiser les concepts clés\n` +
            `* **Expliquer** la démarche méthodologique pas à pas\n` +
            `* **Créer des exercices** d'entraînement ou un QCM d'évaluation`;
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
