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
    language?: string;
  }): Promise<AIMessage> {
    // Simulation du temps de traitement réseau (1.2s)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hasAttachments = params.attachments && params.attachments.length > 0;
    const attachmentContext = hasAttachments
      ? params.attachments!.map(a => `« ${a.name} » (${a.type === 'library' ? 'Ressource Bibliothèque' : 'Document'})`).join(', ')
      : '';

    const lang = params.language || 'fr';
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

    // Réponse multilingue native selon la langue choisie par l'utilisateur
    if (lang === 'en') {
      switch (params.mode) {
        case 'resumer':
          generatedText = `### 📋 Summary & Key Points\n\n` +
            (hasAttachments ? `> **Analyzed Document:** ${attachmentContext}\n\n` : '') +
            `Here is the structured summary of your request:\n\n` +
            `1. **Core Subject:** The primary concepts highlight foundational academic principles and practical takeaways.\n` +
            `2. **Key Arguments:**\n` +
            `   - Rigorous definition of critical terms and methodological context.\n` +
            `   - Articulation of main arguments supported by concrete examples.\n` +
            `   - Synthesis of conclusions with exam-oriented focus.\n\n` +
            `3. **Study Recommendation:** Prioritize reviewing foundational formulas and key definitions.`;
          break;
        case 'expliquer':
          generatedText = `### 💡 Clear Pedagogical Explanation\n\n` +
            `To fully understand **${params.content.slice(0, 50)}...**, let's unpack this concept step by step:\n\n` +
            `* **Core Principle:** Think of this notion like a structured hierarchy where each premise validates the next.\n` +
            `* **Why It Matters:** In the curriculum, this topic serves as a recurring question in exams and competitive tests.\n` +
            `* **Concrete Example:** In practice, start by cataloging the given variables, then apply the theorem systematically.\n\n` +
            `*Would you like a step-by-step guided exercise or an illustrative diagram?*`;
          break;
        case 'qcm':
          generatedText = `### 📝 Practice Quiz & Self-Assessment\n\n` +
            (hasAttachments ? `> **Source reference:** ${attachmentContext}\n\n` : '') +
            `Here are 3 practice questions to evaluate your understanding:\n\n` +
            `**Question 1:** What is the primary foundational rule in this context?\n` +
            `- [ ] A) Inverse proportionality principle\n` +
            `- [x] B) Law of equilibrium and conservation *(Correct answer)*\n` +
            `- [ ] C) Thermal dispersion hypothesis\n\n` +
            `**Question 2:** Under which condition does this standard theorem hold?\n` +
            `- [x] A) Steady-state or stationary conditions only *(Correct answer)*\n` +
            `- [ ] B) Under arbitrary fluctuations\n` +
            `- [ ] C) Without domain restrictions`;
          break;
        case 'exercices':
          generatedText = `### 🎯 Practice Exercises\n\n` +
            `Here is a progressive exercise set tailored for exam preparation:\n\n` +
            `**Exercise 1 (Foundational - 10 min):**\n` +
            `Check key definitions and compute the baseline nominal value from given parameters.\n\n` +
            `**Exercise 2 (Intermediate - 25 min):**\n` +
            `Analyze an applied case study involving two interdependent variables.\n\n` +
            `**Exercise 3 (Exam Level - 40 min):**\n` +
            `Comprehensive synthesis problem combining data analysis and essay argumentation.`;
          break;
        case 'corriger':
          generatedText = `### ✍️ Detailed Correction & Analysis\n\n` +
            `Here is the pedagogical feedback on your submitted work:\n\n` +
            `* **Strengths:** Logical structure and clear understanding of the core question.\n` +
            `* **Points for Improvement:** Clarify transitions and ensure all units or citations are explicitly stated.\n` +
            `* **Recommended Score / Grade:** 16 / 20. Very good academic foundation!`;
          break;
        case 'antiplagiat':
          generatedText = `### 🔍 Similarity & Plagiarism Audit\n\n` +
            (hasAttachments ? `> **File inspected:** ${attachmentContext}\n\n` : '') +
            `**Similarity Index:** **4.2%** *(Academic standard < 10% — Fully Approved)*\n\n` +
            `* **Identified Sources:** Standard bibliographic citations and common technical terminology.\n` +
            `* **Originality:** 95.8% original drafting. Document is ready for academic submission.`;
          break;
        default:
          generatedText = `Hello! 😊 I have received your request.` +
            (hasAttachments ? ` I also analyzed the attached files: **${attachmentContext}**.\n\n` : `\n\n`) +
            `I am your BAAT AI Assistant. How can I best help you succeed in your studies or academic writing today?`;
          break;
      }
    } else if (lang === 'es') {
      switch (params.mode) {
        case 'resumer':
          generatedText = `### 📋 Resumen y Puntos Clave\n\n` +
            (hasAttachments ? `> **Documento analizado:** ${attachmentContext}\n\n` : '') +
            `Aquí tienes el resumen estructurado de tu solicitud:\n\n` +
            `1. **Tema Principal:** Conceptos esenciales y sus aplicaciones metodológicas.\n` +
            `2. **Líneas Directrices:** Definición rigurosa, argumentos centrales y síntesis práctica.\n` +
            `3. **Recomendación:** Repasa las fórmulas fundamentales y las definiciones clave.`;
          break;
        default:
          generatedText = `¡Hola! 😊 He recibido tu consulta.` +
            (hasAttachments ? ` También he analizado los documentos adjuntos: **${attachmentContext}**.\n\n` : `\n\n`) +
            `Soy tu asistente BAAT IA. ¿En qué tema o ejercicio te gustaría trabajar hoy?`;
          break;
      }
    } else if (lang === 'pt') {
      generatedText = `### 🎓 Assistente BAAT IA (Português)\n\n` +
        `Olá! 😊 Recebi a sua mensagem e estou pronto para ajudar nos seus estudos e redação acadêmica.\n\n` +
        (hasAttachments ? `> **Arquivo anexado:** ${attachmentContext}\n\n` : '') +
        `Posso resumir conteúdos, explicar conceitos passo a passo ou propor exercícios práticos. Como prefere começar?`;
    } else if (lang === 'de') {
      generatedText = `### 🎓 BAAT KI-Assistent (Deutsch)\n\n` +
        `Hallo! 😊 Ich habe Ihre Anfrage erhalten und unterstütze Sie gerne bei Ihrem Studium und Ihren akademischen Arbeiten.\n\n` +
        (hasAttachments ? `> **Angehängte Datei:** ${attachmentContext}\n\n` : '') +
        `Ich kann Konzepte zusammenfassen, Schritt für Schritt erklären oder Übungen erstellen. Womit möchten Sie fortfahren?`;
    } else if (lang === 'ar') {
      generatedText = `### 🎓 المساعد الذكي BAAT (العربية)\n\n` +
        `مرحباً بك! 😊 تم استلام طلبك وأنا على أتم الاستعداد لمساعدتك في دراستك وبحوثك الأكاديمية.\n\n` +
        (hasAttachments ? `> **المستند المرفق:** ${attachmentContext}\n\n` : '') +
        `يمكنني تلخيص الدروس، وشرح المفاهيم المعقدة خطوة بخطوة، أو إنشاء اختبارات وتمارين تدريبية. كيف تحب أن نبدأ؟`;
    } else if (lang === 'zh') {
      generatedText = `### 🎓 BAAT 智能学术助手 (中文)\n\n` +
        `您好！😊 已收到您的请求。我随时准备协助您的学业学习与学术写作。\n\n` +
        (hasAttachments ? `> **附件文件：** ${attachmentContext}\n\n` : '') +
        `我可以为您提炼总结核心要点、逐步讲解复杂概念，或生成备考练习题。请问我们先从哪一项开始？`;
    } else if (lang === 'hi') {
      generatedText = `### 🎓 BAAT AI सहायक (हिन्दी)\n\n` +
        `नमस्ते! 😊 आपका संदेश प्राप्त हुआ। मैं आपकी पढ़ाई और शैक्षणिक तैयारी में सहायता के लिए तैयार हूँ।\n\n` +
        (hasAttachments ? `> **संलग्न दस्तावेज़:** ${attachmentContext}\n\n` : '') +
        `मैं किसी भी विषय को संक्षेप में प्रस्तुत कर सकता हूँ, चरण-दर-चरण समझा सकता हूँ या अभ्यास प्रश्न तैयार कर सकता हूँ।`;
    } else if (lang === 'ru') {
      generatedText = `### 🎓 ИИ-Ассистент BAAT (Русский)\n\n` +
        `Здравствуйте! 😊 Ваш запрос успешно принят. Я готов помочь вам в учебе и исследовательской работе.\n\n` +
        (hasAttachments ? `> **Прикрепленный файл:** ${attachmentContext}\n\n` : '') +
        `Я могу составить краткое резюме, подробно объяснить тему или подготовить проверочные тесты. С чего начнем?`;
    } else if (lang === 'ja') {
      generatedText = `### 🎓 BAAT AI アシスタント (日本語)\n\n` +
        `こんにちは！😊 メッセージを受け付けました。学習や学術レポートの作成をサポートいたします。\n\n` +
        (hasAttachments ? `> **添付ファイル：** ${attachmentContext}\n\n` : '') +
        `要点の要約、段階的な概念の解説、試験対策の練習問題の作成など、どのようなサポートをご希望ですか？`;
    } else if (lang === 'it') {
      generatedText = `### 🎓 Assistente IA BAAT (Italiano)\n\n` +
        `Ciao! 😊 Ho ricevuto la tua richiesta e sono pronto ad aiutarti nello studio e nella redazione accademica.\n\n` +
        (hasAttachments ? `> **Documento allegato:** ${attachmentContext}\n\n` : '') +
        `Posso riassumere i tuoi testi, spiegare concetti complessi passo dopo passo o preparare quiz ed esercizi. Da dove vorresti iniziare?`;
    } else if (lang === 'tr') {
      generatedText = `### 🎓 BAAT Yapay Zeka Asistanı (Türkçe)\n\n` +
        `Merhaba! 😊 Mesajınızı aldım ve derslerinizde, akademik çalışmalarınızda size yardımcı olmaya hazırım.\n\n` +
        (hasAttachments ? `> **Eklenen dosya:** ${attachmentContext}\n\n` : '') +
        `Konuları özetleyebilir, adım adım açıklayabilir veya test ve alıştırmalar hazırlayabilirim. Nasıl başlayalım?`;
    } else if (lang === 'ko') {
      generatedText = `### 🎓 BAAT AI 학습 어시스턴트 (한국어)\n\n` +
        `안녕하세요! 😊 요청을 확인했습니다. 학업 및 연구 문서 작성에 최선을 다해 도움을 드리겠습니다.\n\n` +
        (hasAttachments ? `> **첨부 파일:** ${attachmentContext}\n\n` : '') +
        `핵심 요약, 단계별 개념 설명, 실전 연습 문제 생성 등 어떤 작업을 진행하시겠습니까?`;
    } else if (lang === 'nl') {
      generatedText = `### 🎓 BAAT AI-Assistent (Nederlands)\n\n` +
        `Hallo! 😊 Ik heb je bericht ontvangen en help je graag bij je studie en academisch werk.\n\n` +
        (hasAttachments ? `> **Bijgevoegd bestand:** ${attachmentContext}\n\n` : '') +
        `Ik kan teksten samenvatten, concepten stap voor stap uitleggen of oefeningen maken.`;
    } else if (lang === 'id') {
      generatedText = `### 🎓 Asisten AI BAAT (Bahasa Indonesia)\n\n` +
        `Halo! 😊 Pesan Anda telah diterima. Saya siap mendampingi studi dan penulisan akademis Anda.\n\n` +
        (hasAttachments ? `> **Lampiran:** ${attachmentContext}\n\n` : '') +
        `Saya dapat merangkum materi, menjelaskan konsep secara terperinci, atau membuat latihan soal.`;
    } else if (lang === 'pl') {
      generatedText = `### 🎓 Asystent AI BAAT (Polski)\n\n` +
        `Cześć! 😊 Otrzymałem Twoją wiadomość i chętnie pomogę w nauce oraz pracach naukowych.\n\n` +
        (hasAttachments ? `> **Załącznik:** ${attachmentContext}\n\n` : '') +
        `Mogę podsumować tekst, wyjaśnić trudne zagadnienia lub przygotować ćwiczenia.`;
    } else if (lang === 'vi') {
      generatedText = `### 🎓 Trợ lý AI BAAT (Tiếng Việt)\n\n` +
        `Xin chào! 😊 Tôi đã nhận được yêu cầu của bạn và sẵn sàng hỗ trợ việc học tập và nghiên cứu.\n\n` +
        (hasAttachments ? `> **Tệp đính kèm:** ${attachmentContext}\n\n` : '') +
        `Tôi có thể tóm tắt nội dung, giải thích khái niệm chi tiết hoặc tạo bài tập ôn luyện.`;
    } else if (lang === 'sw') {
      generatedText = `### 🎓 Msaidizi wa AI BAAT (Kiswahili)\n\n` +
        `Hujambo! 😊 Nimepokea ujumbe wako na niko tayari kukusaidia katika masomo yako na uandishi wa kitaaluma.\n\n` +
        (hasAttachments ? `> **Faili iliyoambatishwa:** ${attachmentContext}\n\n` : '') +
        `Naweza kufanya muhtasari, kueleza mada kwa hatua, au kutengeneza maswali ya mazoezi.`;
    } else if (lang === 'fa') {
      generatedText = `### 🎓 دستیار هوش مصنوعی BAAT (فارسی)\n\n` +
        `سلام! 😊 پیام شما دریافت شد و آماده‌ام در مطالعات و نگارش دانشگاهی به شما کمک کنم.\n\n` +
        (hasAttachments ? `> **فایل پیوست:** ${attachmentContext}\n\n` : '') +
        `می‌توانم مطالب را خلاصه کنم، مفاهیم را گام به گام شرح دهم یا تمرینات آموزشی طراحی کنم.`;
    } else if (lang === 'sv') {
      generatedText = `### 🎓 BAAT AI-Assistent (Svenska)\n\n` +
        `Hej! 😊 Jag har tagit emot ditt meddelande och är redo att hjälpa dig med dina studier och uppsatser.\n\n` +
        (hasAttachments ? `> **Bifogad fil:** ${attachmentContext}\n\n` : '') +
        `Jag kan sammanfatta texter, förklara begrepp steg för steg eller skapa övningsfrågor.`;
    } else {
      // Français (par défaut)
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

      // --- SUITE BUREAUTIQUE & OUTILS DOCUMENTS ---
      case 'doc_pdf':
        generatedText = `### 📄 Documents PDF — Créer · Modifier · Convertir\n\n` +
          (hasAttachments ? `> **Fichier PDF / Document joint :** ${attachmentContext}\n\n` : '') +
          `L'assistant de gestion PDF est actif avec toutes les opérations disponibles :\n\n` +
          `1. **Création assistée :** Génération de documents officiels, attestations, rapports formatés prêts pour impression haute résolution (300 DPI).\n` +
          `2. **Modification & Annotations :** Ajout de zones de texte, visa, annotations, suppression ou réorganisation de pages.\n` +
          `3. **Conversion universelle :** Convertir fidèlement un document Word/Image en PDF, ou extraire un PDF vers un format éditable.\n\n` +
          `*Action immédiate : Indiquez ce que vous souhaitez rédiger, ou glissez votre fichier PDF pour le modifier.*`;
        break;

      case 'doc_word':
        generatedText = `### 📝 Documents Word (.docx) — Créer · Modifier · Insérer\n\n` +
          (hasAttachments ? `> **Fichier Word joint :** ${attachmentContext}\n\n` : '') +
          `Outil d'assistance éditoriale Word complet :\n\n` +
          `1. **Création de document :** Rédaction de plans types, modèles de lettres administratives, contrats, synthèses et devoirs scolaires structurés.\n` +
          `2. **Modification & Insertion :** Importez votre fichier .docx ou .doc pour corriger la grammaire, enrichir les sections, insérer des tableaux ou reformuler les passages.\n` +
          `3. **Export propre :** Mise en page automatique avec styles de titres (H1, H2, H3), puces et sommaire.\n\n` +
          `*Tapez votre consigne ou insérez votre fichier Word pour commencer la rédaction.*`;
        break;

      case 'doc_excel':
        generatedText = `### 📊 Feuilles Excel (.xlsx) — Créer · Modifier · Calculer\n\n` +
          (hasAttachments ? `> **Tableur joint :** ${attachmentContext}\n\n` : '') +
          `Hub de calcul et tableur intelligent :\n\n` +
          `1. **Création de tableur :** Génération de grilles budgétaires, suivis de notes scolaires, plannings, tableaux d'amortissement et inventaires.\n` +
          `2. **Formules & Fonctions :** Conception et explication de formules complexes (\`RECHERCHEV\`, \`INDEX/EQUIV\`, \`SOMME.SI.ENS\`, \`SI\`, etc.).\n` +
          `3. **Analyse & Modification :** Importez un fichier .xlsx pour nettoyer des données, détecter des anomalies ou générer des synthèses statistiques.\n\n` +
          `*Décrivez le tableau à concevoir ou joignez votre feuille Excel pour l'enrichir.*`;
        break;

      case 'doc_powerpoint':
        generatedText = `### 📑 Présentations PowerPoint (.pptx) — Créer · Modifier · Diapos\n\n` +
          (hasAttachments ? `> **Support de présentation :** ${attachmentContext}\n\n` : '') +
          `Concepteur de diaporamas et présentations percutantes :\n\n` +
          `1. **Création complète :** Élaboration du plan de soutenance, découpage diapositive par diapositive (titre, messages clés, points d'accroche).\n` +
          `2. **Insertion & Enrichissement :** Transformez un cours ou un rapport Word en diaporama prêt à être projeté devant un jury ou une classe.\n` +
          `3. **Notes de l'orateur :** Rédaction des argumentaires à prononcer à l'oral pour chaque slide.\n\n` +
          `*Indiquez le sujet de votre présentation, le nombre de slides souhaité ou joignez votre document source.*`;
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
    }

    return {
      id: 'msg-' + Date.now(),
      role: 'assistant',
      content: generatedText,
      timestamp,
      mode: params.mode,
      isWebSearch: params.isWebSearch,
      language: lang,
      sources,
      status: 'complete',
      isDevPreview: true
    };
  }
};
