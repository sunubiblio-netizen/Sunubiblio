import { ReligionPedagogicalData } from '@/types/religion';

/**
 * Répertoire de données pédagogiques universelles pour le module Religion de Sunubiblio.
 * Conçu pour être neutre, rigoureux, respectueux, sans parti-pris confessionnel.
 * Prêt pour la migration Supabase / PostgreSQL.
 */

export const RELIGION_PEDAGOGICAL_DATA: Record<string, ReligionPedagogicalData> = {
  // ==========================================
  // 1. ISLAM
  // ==========================================
  islam: {
    slug: 'islam',
    traditionId: 'islam',
    hero: {
      title: "Découvrir l'Islam",
      subtitle: 'Origines, croyances, textes fondamentaux et rayonnement spirituel',
      tagline:
        "Une tradition monothéiste universelle fondée sur l'Unicité divine (Tawhid), la paix et la guidance spirituelle transmise par le Prophète Muhammad.",
      badge: 'Tradition Monothéiste',
      keyStat: '1,9 milliard de fidèles dans le monde',
      periodOrigin: 'VIIe siècle de notre ère (vers 610)',
      geographicOrigin: 'Péninsule arabique (La Mecque et Médine)',
      accentColor: '#059669',
      bgLight: 'rgba(5, 150, 105, 0.08)',
      borderColor: 'rgba(5, 150, 105, 0.25)',
      iconName: 'crescent',
    },
    introduction: {
      definition:
        "L'Islam est une religion monothéiste abrahamique qui enseigne l'adoration exclusive d'un Dieu unique (Allah en arabe) et la soumission paisible à Sa volonté bienveillante. Pour le croyant musulman, l'Islam s'inscrit dans la continuité de la lignée prophétique universelle (Adam, Noé, Abraham, Moïse, Jésus).",
      etymology:
        "Le mot « Islam » dérive de la racine sémitique trilittère « S-L-M » (س-ل-م), qui porte le double sens de « soumission confiante à Dieu » et de « paix » (Salam).",
      historicalOrigin:
        "L'Islam est né au début du VIIe siècle (610 de l'ère chrétienne) dans la ville caravanière de La Mecque, située dans la péninsule arabique, carrefour commercial et culturel entre les grands empires byzantin et sassanide.",
      historicalContext:
        "Au VIIe siècle, la péninsule arabique était habitée par des tribus sédentaires et nomades. Bien que le polythéisme fût prédominant autour du sanctuaire de la Kaaba, des communautés juives, chrétiennes et des monothéistes solitaires (appelés Hanifs) étaient également présents. La société connaissait d'importantes tensions sociales et économiques.",
      objectiveAndPurpose:
        "L'Islam vise à instaurer l'harmonie spirituelle et morale entre l'être humain, son Créateur et la communauté humaine : préserver la dignité humaine, promouvoir la justice sociale, la bienfaisance (Ihsan), la quête du savoir et préparer l'âme à la vie future.",
      keyPrinciplesSummary: [
        "Unicité absolue de Dieu (Tawhid)",
        "Transmission de la Révélation divine par les prophètes",
        "Égalité fondamentale des êtres humains devant Dieu",
        "Responsabilité morale individuelle et vie future",
        "Solidarité envers les vulnérables et justice sociale",
      ],
    },
    coreBeliefs: [
      {
        title: "L'Unicité Divine (At-Tawhid)",
        shortDesc: 'La foi en un Dieu unique, sans associé ni égal.',
        explanation:
          "Le Tawhid est le pilier central de la théologie musulmane. Dieu est Unique, Absolu, Transcendant et Omniscient, Créateur de l'univers et source ultime de toute miséricorde. Rien ne Lui est semblable.",
        icon: 'circle-dot',
        referenceQuote: {
          text: 'Dis : Il est Dieu, Unique. Dieu, le Seul à être imploré pour ce que nous désirons. Il n’a jamais engendré, n’a pas été engendré non plus. Et nul n’est égal à Lui.',
          source: 'Coran, Sourate 112 (Al-Ikhlas)',
        },
      },
      {
        title: 'Les Anges (Al-Mala’ikah)',
        shortDesc: 'Êtres de lumière au service des desseins divins.',
        explanation:
          "Les anges sont des créatures spirituelles obéissant aux ordres divins, dont l'archange Gabriel (Jibril), chargé de transmettre les révélations aux prophètes.",
        icon: 'sparkles',
      },
      {
        title: 'Les Livres Révélés (Al-Kutub)',
        shortDesc: 'Reconnaissance des écritures saintes antérieures.',
        explanation:
          "La tradition islamique reconnaît les textes révélés aux prophètes antérieurs (la Torah de Moïse, les Psaumes de David, l'Évangile de Jésus) et considère le Coran comme la parole divine finale et inaltérée.",
        icon: 'book-open',
      },
      {
        title: 'Les Messagers et Prophètes (Al-Anbiya)',
        shortDesc: 'Une chaîne ininterrompue de guides pour l’humanité.',
        explanation:
          "Dieu a envoyé des prophètes à chaque peuple pour rappeler le monothéisme et la justice. Muhammad est considéré dans la doctrine musulmane comme le Sceau des prophètes (Khatam an-Nabiyyin).",
        icon: 'users',
      },
      {
        title: 'Le Jour du Jugement et l’Au-delà (Al-Akhirah)',
        shortDesc: 'Résurrection, responsabilité morale et rétribution.',
        explanation:
          'Chaque être humain répondra de ses actes, de ses intentions et de sa conduite envers autrui dans une vie éternelle marquée par la justice et la miséricorde divines.',
        icon: 'scales',
      },
      {
        title: 'Le Décret Divin (Al-Qadr)',
        shortDesc: 'La souveraineté divine alliée au libre arbitre humain.',
        explanation:
          'Dieu connaît toute chose de toute éternité, tandis que l’être humain dispose d’un libre arbitre réel qui fonde sa responsabilité morale et éthique.',
        icon: 'compass',
      },
    ],
    keyFigures: [
      {
        name: 'Le Prophète Muhammad (PBL)',
        title: 'Le Messager de Dieu et le Sceau des Prophètes',
        role: 'Prophète, guide spirituel, réformateur moral et chef de communauté',
        mission:
          'Appeler l’humanité au monothéisme pur, réformer les mœurs de la péninsule arabique, abolir les injustices tribales (infanticide féminin, usure oppressive) et transmettre le message du Coran.',
        period: '570 – 632 de notre ère (environ 63 ans)',
        importance:
          'Pour les musulmans, Muhammad est l’exemple par excellence de droiture éthique, de compassion et de sagesse. Sa conduite (Sunnah) et ses paroles (Hadiths) constituent la deuxième source normative de l’Islam après le Coran.',
        historicalSteps: [
          {
            period: '570 – 610',
            title: 'Jeunesse et droiture',
            description:
              'Orphelin dès son enfance, élevé par son grand-père puis son oncle, il gagne à La Mecque le surnom de « Al-Amine » (l’homme intègre et digne de confiance). Il épouse Khadija bint Khuwaylid.',
          },
          {
            period: '610',
            title: 'La première Révélation au mont Hira',
            description:
              'Retiré en méditation dans la grotte de Hira, il reçoit la visite de l’archange Gabriel qui lui ordonne : « Iqra » (Lis / Récite au nom de ton Seigneur qui a créé). Début de la transmission coranique.',
          },
          {
            period: '610 – 622',
            title: 'La période mecquoise',
            description:
              'Prédication axée sur le monothéisme, la finitude du monde et la protection des faibles. Les premiers fidèles subissent brimades, persécutions et boycott de l’élite marchande mecquoise.',
          },
          {
            period: '622',
            title: 'L’Hégire (Al-Hijra)',
            description:
              'Émigration des musulmans vers la cité oasis de Yathrib (qui devient Médine, la ville du Prophète). Cet événement majeur marque l’an 1 du calendrier musulman.',
          },
          {
            period: '622 – 632',
            title: 'La période médinoise et le rayonnement',
            description:
              'Élaboration de la Constitution de Médine garantissant la coexistence des communautés. Consolidation de la communauté (Ummah), signature du traité d’Al-Hudaybiyya et pèlerinage d’adieu.',
          },
        ],
        teachingsHighlight: [
          '« Le meilleur d’entre vous est celui qui est le meilleur envers sa famille. »',
          '« Nul d’entre vous ne sera un véritable croyant tant qu’il ne souhaitera pour son frère ce qu’il souhaite pour lui-même. »',
          '« La recherche du savoir est une obligation pour chaque musulman et musulmane. »',
          '« Dieu est Beau et Il aime la beauté. »',
        ],
      },
      {
        name: 'Les Compagnons et Califes bien guidés (Al-Khulafa ar-Rashidun)',
        title: 'Abou Bakr, Omar, Othman et Ali',
        role: 'Premiers successeurs et gardiens de l’héritage communautaire',
        mission:
          'Préserver l’unité de la communauté après le décès du Prophète, compiler officiellement le Coran par écrit et accompagner l’expansion géographique pacifique.',
        period: '632 – 661',
        importance:
          'Leurs décisions collégiales et leur fidélité aux valeurs fondamentales demeurent des références historiques majeures pour la pensée politique et juridique musulmane.',
        historicalSteps: [
          {
            period: '632 – 634',
            title: 'Califat d’Abou Bakr As-Siddiq',
            description: 'Stabilisation de la communauté et début du rassemblement des feuillets coraniques.',
          },
          {
            period: '634 – 644',
            title: 'Califat d’Omar ibn Al-Khattab',
            description: 'Organisation administrative, justice sociale et instauration du calendrier de l’Hégire.',
          },
          {
            period: '644 – 656',
            title: 'Califat d’Othman ibn Affan',
            description: 'Standardisation et diffusion du texte coranique unique (Mushaf Othmani).',
          },
          {
            period: '656 – 661',
            title: 'Califat d’Ali ibn Abi Talib',
            description: 'Figure d’érudition, de piété et de justice, cousin et gendre du Prophète.',
          },
        ],
        teachingsHighlight: [
          'Poursuite de la justice collégiale (Shura)',
          'Compilation rigoureuse des textes sacrés',
        ],
      },
    ],
    sacredTexts: [
      {
        name: 'Le Saint Coran (Al-Qur’an Al-Karim)',
        arabicOrOriginalName: 'القرآن الكريم',
        subtitle: 'La Parole incréée de Dieu révélée au Prophète Muhammad',
        statusAndPlace:
          "Le Coran est le texte sacré suprême de l'Islam. Révélé de manière progressive sur une période de 23 ans (de 610 à 632), il est rédigé en langue arabe classique d'une haute éloquence poétique.",
        importance:
          "Source première du dogme, de l'éthique, de la législation, de la liturgie et de la méditation mystique pour plus d'un milliard de fidèles à travers les continents.",
        structure: {
          unitsName: 'Sourates (Chapitres)',
          subUnitsName: 'Versets (Ayats)',
          totalUnits: 114,
          totalSubUnits: 6236,
          classification:
            'Sourates mecquoises (essentiellement théologiques et métaphysiques) et médinoises (axées sur la législation communautaire et sociétale).',
        },
        keyThemes: [
          {
            title: "L'Appel à la raison et à la contemplation de la nature",
            description:
              'Le Coran invite constamment l’être humain à observer les signes de l’univers (l’alternance du jour et de la nuit, les astres, la pluie, la création de la vie).',
          },
          {
            title: 'La Justice sociale et la protection des vulnérables',
            description:
              'Condamnation de l’oppression, obligation de secourir l’orphelin, l’indigent et le voyageur.',
          },
          {
            title: 'Les Récits des prophètes antérieurs',
            description:
              'Histoires d’Adam, Noé, Abraham, Joseph, Moïse, Jonas, Marie et Jésus comme modèles de persévérance et de piété.',
          },
          {
            title: 'L’Éthique comportementale',
            description:
              'L’honnêteté dans les transactions, le respect des engagements, la maîtrise de soi et le pardon.',
          },
        ],
        howToExplore:
          'Sur Sunubiblio, vous pouvez consulter des traductions fidèles, des exégèses classiques (Tafsir) ainsi que des traités de récitation (Tajwid) disponibles dans notre bibliothèque numérique.',
        suggestedResourceIds: ['res-isl-01', 'res-isl-02', 'res-isl-04'],
      },
      {
        name: 'La Sunnah et les Hadiths',
        arabicOrOriginalName: 'السنة والحديث النبوي',
        subtitle: 'La tradition prophétique documentée',
        statusAndPlace:
          'Ensemble des paroles, actes et approbations tacites du Prophète Muhammad, transmis par des chaînes de garants authentifiés (Isnad).',
        importance:
          'Deuxième source de compréhension religieuse, elle illustre la mise en pratique concrète des enseignements coraniques dans la vie de tous les jours.',
        structure: {
          unitsName: 'Recueils canoniques (Kutub as-Sittah)',
          subUnitsName: 'Hadiths authentiques (Sahih, Hassan)',
          totalUnits: 6,
          classification: 'Sahih Al-Bukhari, Sahih Muslim, Sunan Abu Dawud, At-Tirmidhi, An-Nasa’i, Ibn Majah.',
        },
        keyThemes: [
          {
            title: 'Éducation spirituelle et purification du cœur',
            description: 'Bienveillance, sincérité des intentions et prière du cœur.',
          },
          {
            title: 'Règles de civilité et vie en société',
            description: 'Salutations, respect des voisins, propreté et écologie de vie.',
          },
        ],
        howToExplore:
          'Explorez les commentaires majeurs de Hadith et les biographies prophétiques (Sirah) pour approfondir.',
      },
    ],
    practices: [
      {
        title: 'L’Attestation de Foi (Ach-Chahada)',
        category: 'pilier',
        frequency: 'Fondement permanent',
        description:
          'Témoigner verbalement et avec conviction du cœur qu’il n’y a de divinité digne d’adoration qu’Allah et que Muhammad est Son serviteur et Messager.',
        spiritualMeaning: 'L’adhésion libre et pleine à l’Unicité divine et à l’exemplarité prophétique.',
      },
      {
        title: 'La Prière Rituelle (As-Salat)',
        category: 'pilier',
        frequency: '5 fois par jour',
        description:
          'Cinq moments quotidiens de recueillement rythmant la journée (aube, midi, après-midi, coucher du soleil, nuit), orientés vers la Kaaba à La Mecque.',
        spiritualMeaning:
          'Une halte sacrée dans le tumulte du quotidien pour renouveler le lien direct entre l’âme et son Créateur.',
      },
      {
        title: 'L’Aumône Purificatrice (Az-Zakat)',
        category: 'pilier',
        frequency: 'Annuelle (sur l’épargne)',
        description:
          'Prélèvement d’une quote-part (généralement 2,5%) sur les surplus de richesse conservés pendant une année, redistribuée aux nécessiteux.',
        spiritualMeaning:
          'Purification des biens, lutte contre la concentration excessive des richesses et solidarité fraternelle.',
      },
      {
        title: 'Le Jeûne du Mois de Ramadan (As-Sawm)',
        category: 'pilier',
        frequency: 'Un mois lunaire par an',
        description:
          'Abstinence de nourriture, de boisson et de relations conjugales de l’aube jusqu’au coucher du soleil pendant le 9e mois du calendrier lunaire.',
        spiritualMeaning:
          'Discipline de soi, compassion envers les affamés, lecture assidue du Coran et réveil de la gratitude.',
      },
      {
        title: 'Le Pèlerinage à La Mecque (Al-Hajj)',
        category: 'pilier',
        frequency: 'Une fois dans la vie (si capable)',
        description:
          'Voyage spirituel accompli au sanctuaire de La Mecque et dans la plaine d’Arafat pour celui qui en a les moyens physiques et financiers.',
        spiritualMeaning:
          'Manifestation d’universalité et d’égalité totale : tous les croyants portent le même habit blanc sans distinction de rang social ou d’origine.',
      },
      {
        title: 'L’Excellence spirituelle (Al-Ihsan / Soufisme)',
        category: 'spiritualite',
        description:
          '« Adorer Dieu comme si tu Le voyais, car si tu ne Le vois pas, Lui certes te voit ». C’est la dimension intérieure et mystique (Tasawwuf).',
        spiritualMeaning: 'La purification de l’égo (Tazkiyat an-Nafs) et l’élévation morale permanente.',
      },
    ],
    historyMilestones: [
      {
        period: '610 – 632',
        title: 'L’Ère de la Révélation et de la Prophétie',
        description:
          'Transmission du texte coranique, organisation de la première communauté à Médine et unification morale de la péninsule.',
        geography: 'La Mecque et Médine (Hedjaz)',
      },
      {
        period: '632 – 661',
        title: 'Le Califat Rachidun',
        description:
          'Diffusion vers le Proche-Orient, l’Égypte et la Perse ; mise par écrit définitive du Coran.',
        geography: 'Moyen-Orient, Égypte, Perse',
      },
      {
        period: 'VIIe – XIIIe siècle',
        title: 'L’Âge d’Or de la Civilisation Islamique',
        description:
          'Épanouissement des sciences, de la philosophie, de la médecine, des mathématiques (Ibn Sina, Al-Khwarizmi, Averroès, Ibn Khaldoun) et des universités (Al-Qarawiyyin, Al-Azhar).',
        geography: 'Bagdad, Damas, Cordoue, Le Caire, Samarcande',
      },
      {
        period: 'XIe – XVIe siècle',
        title: 'Arrivée pacifique et enracinement en Afrique de l’Ouest',
        description:
          'Diffusion par les voies caravanières transsahariennes, les lettrés commerçants et les maîtres soufis dans les empires du Ghana, du Mali et du Songhaï (Tombouctou).',
        geography: 'Sahel, Fleuve Sénégal, Tombouctou, Djenné',
      },
      {
        period: 'XVIIIe – XXIe siècle',
        title: 'Le Modèle Confrérique au Sénégal',
        description:
          'Développement de grandes confréries soufies pacifiques, autonomes et éducatives (Mouridisme, Tidjaniya, Niassène, Layène) par des figures éminentes de savoir et de résistance culturelle.',
        geography: 'Sénégal (Touba, Tivaouane, Kaolack, Yoff)',
      },
    ],
    currentsAndBranches: [
      {
        id: 'mouride-touba',
        title: 'Le Mouridisme (Touba)',
        traditionId: 'islam',
        subtitle: 'Voie de l’amour de Dieu, du savoir et de la sanctification par le travail',
        location: 'Touba, Diourbel, Sénégal',
        description:
          'Fondée à la fin du XIXe siècle par Cheikh Ahmadou Bamba Mbacké (Khadimou Rassoul), cette confrérie soufie met l’accent sur la foi inébranlable, l’adoration sincère, l’acquisition de la science utile et la dignité humaine par l’effort laborieux.',
        figures: ['Cheikh Ahmadou Bamba (1853-1927)', 'Mame Cheikh Ibrahima Fall'],
        teachingsFocus:
          'Diévote inconditionnelle envers le Prophète, refus de la violence coloniale, poésie mystique (Khassaides) et solidarité communautaire (Magal de Touba).',
        resourceCount: 5,
      },
      {
        id: 'tidiane-tivaouane',
        title: 'La Tidjaniya (Tivaouane)',
        traditionId: 'islam',
        subtitle: 'Voie de l’élévation spirituelle, de l’orthodoxie et du savoir encyclopédique',
        location: 'Tivaouane, Sénégal',
        description:
          'Introduite par Cheikh Oumar Foutiyou Tall et magnifiée par El Hadj Malick Sy (Maodo), la Tidjaniya promeut l’orthodoxie religieuse rigoureuse, la récitation méthodique du Wird (Wazifa, Hadratoul Joumou’a) et la formation académique des élites.',
        figures: ['Cheikh Ahmad Tidiane Chérif', 'El Hadj Malick Sy (1855-1922)', 'Serigne Babacar Sy'],
        teachingsFocus:
          'Célébration de la naissance du Prophète (Mawlid / Gamou), poésie hagiographique, tolérance et éducation universelle.',
        resourceCount: 4,
      },
      {
        id: 'niassene',
        title: 'La Branche Niassène (Fayda Tidjaniya - Kaolack)',
        traditionId: 'islam',
        subtitle: 'Rayonnement spirituel international et gnose mystique (Ma’rifah)',
        location: 'Médina Baye, Kaolack, Sénégal',
        description:
          'Initié par Cheikh Al-Islam El Hadj Ibrahima Niasse (Baye Niasse), ce mouvement compte des dizaines de millions d’adeptes au Nigeria, au Ghana, au Soudan et à travers le monde. Il privilégie la gnose divine accessible à tous et le panafricanisme spirituel.',
        figures: ['Cheikh El Hadj Ibrahima Niasse (1900-1975)'],
        teachingsFocus:
          'Connaissance profonde de Dieu (Ma’rifah), universalité fraternelle, diplomatie islamique internationale.',
        resourceCount: 3,
      },
      {
        id: 'layene',
        title: 'La Communauté Layène (Yoff / Cambérène)',
        traditionId: 'islam',
        subtitle: 'Appel à la pureté des cœurs, à l’égalité et à la paix',
        location: 'Yoff, Cambérène, Ngor (Dakar, Sénégal)',
        description:
          'Née de l’Appel de Seydina Limamou Laye en 1883 sur la presqu’île du Cap-Vert, cette confrérie se caractérise par le port d’habits blancs sans parure, l’abolition des castes et la dévotion intense lors des chants de louange.',
        figures: ['Seydina Limamou Laye (1843-1909)', 'Seydina Issa Rohou Laye'],
        teachingsFocus:
          'Dignité égale de tous les croyants, pureté rituelle et morale, prières communes et fraternité côtière.',
        resourceCount: 2,
      },
      {
        id: 'islam-autres',
        title: 'Autres Courants et Écoles',
        traditionId: 'islam',
        subtitle: 'Écoles juridiques (Madhhabs) et sensibilités sunnites',
        location: 'Monde musulman',
        description:
          'L’Islam sunnite comprend quatre écoles juridiques reconnues : Malikite (majoritaire en Afrique de l’Ouest et du Nord), Hanafite, Chaféite et Hanbalite, respectant une même foi avec de légères nuances d’interprétation pratique.',
        figures: ['Imam Malik ibn Anas', 'Imam Abou Hanifa', 'Imam Ach-Chafi’i', 'Imam Ahmad ibn Hanbal'],
        teachingsFocus: 'Méthodologie juridique (Fiqh), consensus (Ijma) et raisonnement analogique (Qiyas).',
        resourceCount: 2,
      },
    ],
    furtherReadingSummary: {
      title: 'Approfondir la découverte de l’Islam sur Sunubiblio',
      description:
        'Accédez à une sélection de textes authentiques, de manuscrits des maîtres sénégalais, d’enregistrements audio et de traités de jurisprudence pour aller plus loin dans votre quête de savoir.',
      recommendedThemes: [
        'Le Coran et son interprétation',
        'La vie et les vertus du Prophète (Sirah)',
        'Les écrits des érudits sénégalais (Khassaides, Poésie)',
        'La théologie fondamentale (Tawhid)',
      ],
    },
  },

  // ==========================================
  // 2. CHRISTIANISME
  // ==========================================
  christianisme: {
    slug: 'christianisme',
    traditionId: 'christianisme',
    hero: {
      title: 'Découvrir le Christianisme',
      subtitle: 'Origines, Évangile, foi en Jésus-Christ et histoire universelle',
      tagline:
        'Une foi monothéiste centrée sur la personne et le message de Jésus de Nazareth, l’amour inconditionnel de Dieu et du prochain, et l’espérance du salut.',
      badge: 'Tradition Monothéiste',
      keyStat: '2,4 milliards de fidèles dans le monde',
      periodOrigin: 'Ier siècle de notre ère (vers l’an 30)',
      geographicOrigin: 'Judée et Galilée (Proche-Orient antique)',
      accentColor: '#2563eb',
      bgLight: 'rgba(37, 99, 235, 0.08)',
      borderColor: 'rgba(37, 99, 235, 0.25)',
      iconName: 'cross',
    },
    introduction: {
      definition:
        'Le Christianisme est une religion monothéiste née dans le prolongement de la tradition biblique juive, fondée sur la vie, les enseignements, la mort sur la croix et la résurrection de Jésus de Nazareth, reconnu comme le Christ (Messie) et Fils de Dieu.',
      etymology:
        'Du grec ancien « Khristos » (Χριστός), qui traduit l’hébreu « Mashia’h » signifiant « celui qui est oint » par l’Esprit de Dieu.',
      historicalOrigin:
        'Apparu au Ier siècle de notre ère dans la province romaine de Judée, le mouvement chrétien s’est rapidement diffusé à travers le bassin méditerranéen grâce aux apôtres Pierre et Paul.',
      historicalContext:
        'La région vivait sous domination impériale romaine, marquée par de vives attentes messianiques parmi le peuple juif face aux tensions religieuses, sociales et politiques.',
      objectiveAndPurpose:
        'Proclamer la Bonne Nouvelle (l’Évangile) de la réconciliation entre Dieu et l’humanité, l’amour du prochain étendu jusqu’aux ennemis, le pardon des péchés et la promesse de la vie éternelle.',
      keyPrinciplesSummary: [
        'Unicité de Dieu manifestée en trois Personnes (Père, Fils, Esprit Saint : la Trinité)',
        'Incarnation de la Parole divine en Jésus-Christ',
        'Résurrection du Christ comme victoire sur la mort',
        'Commandement suprême de l’amour de Dieu et du prochain',
        'Grâce divine, pardon et communion fraternelle',
      ],
    },
    coreBeliefs: [
      {
        title: 'Le Dieu Trinité',
        shortDesc: 'Un seul Dieu en trois personnes d’égale dignité.',
        explanation:
          'Le Père créateur, le Fils rédempteur incarné dans l’histoire, et l’Esprit Saint qui sanctifie et guide la communauté des croyants.',
        icon: 'triangle',
      },
      {
        title: 'L’Incarnation et la Rédemption',
        shortDesc: 'Dieu venu partager la condition humaine.',
        explanation:
          'Jésus a partagé la condition humaine pour libérer l’homme du péché et témoigner de la tendresse inconditionnelle du Créateur.',
        icon: 'heart',
      },
      {
        title: 'La Résurrection et l’Espérance',
        shortDesc: 'La vie plus forte que la mort.',
        explanation:
          'La résurrection du Christ fonde l’espérance chrétienne dans une vie renouvelée et éternelle auprès de Dieu.',
        icon: 'sun',
      },
    ],
    keyFigures: [
      {
        name: 'Jésus de Nazareth (Le Christ)',
        title: 'Le Sauveur et Maître spirituel',
        role: 'Prophète, Messie annoncé et Révélateur du Père',
        mission:
          'Inaugurer le Royaume de Dieu, guérir les cœurs brisés, enseigner l’amour universel et donner sa vie en sacrifice d’amour.',
        period: 'Vers 4 av. J.-C. – 30 ap. J.-C.',
        importance:
          'Cœur et fondement de la foi chrétienne. Ses paraboles et son exemple de don de soi inspirent la morale et l’art occidentaux et universels.',
        historicalSteps: [
          {
            period: 'Enfance',
            title: 'Naissance à Bethléem et vie discrète à Nazareth',
            description: 'Né de Marie, il grandit en Galilée en exerçant le métier de charpentier.',
          },
          {
            period: 'Vie publique',
            title: 'Baptême et ministère en Galilée',
            description:
              'Baptisé par Jean le Baptiste, il choisit douze apôtres, guérit les malades et dispense le Sermon sur la Montagne.',
          },
          {
            period: 'Passion et Résurrection',
            title: 'La Cène, la Croix et le Tombeau vide',
            description:
              'Arrêté à Jérusalem, crucifié sous Ponce Pilate, il ressuscite le troisième jour selon les Écritures.',
          },
        ],
        teachingsHighlight: [
          '« Aimez-vous les uns les autres comme je vous ai aimés. »',
          '« Heureux les artisans de paix, car ils seront appelés fils de Dieu. »',
        ],
      },
    ],
    sacredTexts: [
      {
        name: 'La Sainte Bible',
        subtitle: 'Ancien et Nouveau Testaments',
        statusAndPlace:
          'Recueil canonique inspiré contenant l’histoire de l’Alliance entre Dieu et son peuple.',
        importance: 'Nourriture de la prière quotidienne, de la catéchèse et de la liturgie.',
        structure: {
          unitsName: 'Livres bibliques',
          subUnitsName: 'Chapitres et Versets',
          totalUnits: 66,
          classification: 'Ancien Testament (Torah, Prophètes, Sagesse) et Nouveau Testament (Évangiles, Actes, Épîtres, Apocalypse).',
        },
        keyThemes: [
          {
            title: 'Les Béatitudes',
            description: 'La charte spirituelle du Royaume inversant les logiques de puissance mondaine.',
          },
          {
            title: 'L’Alliance et la Grâce',
            description: 'Le salut offert gratuitement par amour.',
          },
        ],
        howToExplore:
          'Retrouvez sur Sunubiblio des éditions commentées, les écrits patristiques (notamment Saint Augustin) et des études sur l’Église au Sénégal.',
      },
    ],
    practices: [
      {
        title: 'Le Baptême',
        category: 'pilier',
        description: 'Sacrement d’entrée dans la communauté chrétienne par l’eau et l’Esprit Saint.',
        spiritualMeaning: 'Renaissance spirituelle et purification.',
      },
      {
        title: 'L’Eucharistie / La Cène',
        category: 'pilier',
        frequency: 'Chaque dimanche et fêtes',
        description: 'Mémorial de la Pâque du Christ avec partage du pain et du vin consacrés.',
        spiritualMeaning: 'Communion intime avec le Christ et unité de la communauté.',
      },
      {
        title: 'La Prière du Notre Père',
        category: 'spiritualite',
        frequency: 'Quotidienne',
        description: 'La prière transmise par Jésus à ses disciples.',
        spiritualMeaning: 'Confiance filiale envers Dieu et demande de pain, de pardon et de paix.',
      },
    ],
    historyMilestones: [
      {
        period: 'Ier – IVe siècle',
        title: 'Les premières communautés et les persécutions',
        description: 'Diffusion clandestine dans l’Empire romain puis reconnaissance sous Constantin (Édit de Milan en 313).',
        geography: 'Bassin méditerranéen',
      },
      {
        period: '1054',
        title: 'Le Grand Schisme d’Orient',
        description: 'Séparation entre l’Église catholique romaine d’Occident et l’Église orthodoxe d’Orient.',
        geography: 'Rome et Constantinople',
      },
      {
        period: 'XVIe siècle',
        title: 'La Réforme Protestante',
        description: 'Mouvement de renouveau initié par Martin Luther et Jean Calvin insistant sur l’autorité exclusive des Écritures.',
        geography: 'Europe du Nord',
      },
      {
        period: 'XIXe – XXIe siècle',
        title: 'Enracinement au Sénégal',
        description:
          'Présence harmonieuse et fraternelle de la communauté catholique (archidiocèse de Dakar, sanctuaire marial de Popenguine) participant au dialogue islamo-chrétien exemplaire du pays.',
        geography: 'Sénégal (Popenguine, Dakar, Ziguinchor)',
      },
    ],
    currentsAndBranches: [
      {
        id: 'catholicisme',
        title: 'Le Catholicisme',
        traditionId: 'christianisme',
        subtitle: 'Universalité sous l’autorité pastorale de l’évêque de Rome (le Pape)',
        description: 'Grande tradition attachée aux 7 sacrements, à la Tradition vivante et à la dévotion mariale.',
        figures: ['Saint Augustin (Hippone)', 'Saint Thomas d’Aquin', 'Cardinal Hyacinthe Thiandoum (Sénégal)'],
        teachingsFocus: 'Doctrine sociale de l’Église, universalité et pèlerinage de Popenguine.',
        resourceCount: 3,
      },
      {
        id: 'protestantisme',
        title: 'Le Protestantisme et Évangélisme',
        traditionId: 'christianisme',
        subtitle: 'La foi seule (Sola Fide) et l’Écriture seule (Sola Scriptura)',
        description: 'Diversité de communautés luthériennes, calvinistes, baptistes et pentecôtistes.',
        figures: ['Martin Luther', 'Jean Calvin'],
        teachingsFocus: 'Lecture personnelle de la Bible et engagement citoyen.',
        resourceCount: 2,
      },
      {
        id: 'orthodoxie',
        title: 'L’Orthodoxie',
        traditionId: 'christianisme',
        subtitle: 'Fidélité aux sept conciles œcuméniques et liturgie contemplative',
        description: 'Tradition des Églises orientales (grecque, russe, copte) riche en théologie des icônes.',
        figures: ['Saint Jean Chrysostome', 'Saint Basile'],
        teachingsFocus: 'Mysticisme et communion trinitaire.',
        resourceCount: 1,
      },
    ],
    furtherReadingSummary: {
      title: 'Approfondir le Christianisme sur Sunubiblio',
      description:
        'Découvrez des commentaires bibliques, des textes historiques et des réflexions sur le dialogue interreligieux.',
      recommendedThemes: ['Les Évangiles', 'Histoire de l’Église au Sénégal', 'Saint Augustin et les pères africains'],
    },
  },

  // ==========================================
  // 3. JUDAÏSME
  // ==========================================
  judaisme: {
    slug: 'judaisme',
    traditionId: 'judaisme',
    hero: {
      title: 'Découvrir le Judaïsme',
      subtitle: 'Origines, Alliance, Torah et pensée philosophique et rabbinique',
      tagline:
        'Le berceau du monothéisme abrahamique, fondé sur l’Alliance sacrée, l’étude permanente des textes et la sanctification de la vie quotidienne.',
      badge: 'Tradition Monothéiste',
      keyStat: '15 millions de fidèles dans le monde',
      periodOrigin: 'IIe millénaire avant notre ère',
      geographicOrigin: 'Canaan / Proche-Orient antique',
      accentColor: '#4f46e5',
      bgLight: 'rgba(79, 70, 229, 0.08)',
      borderColor: 'rgba(79, 70, 229, 0.25)',
      iconName: 'star-david',
    },
    introduction: {
      definition:
        'Le Judaïsme est la tradition religieuse, spirituelle et culturelle du peuple d’Israël, fondée sur la croyance en un Dieu unique Créateur ayant contracté une Alliance éternelle avec les patriarches et transmis sa Loi (Torah) à Moïse.',
      etymology:
        'Du nom de Juda (Yehouda), l’une des douze tribus d’Israël, signifiant étymologiquement « louange et reconnaissance envers Dieu ».',
      historicalOrigin:
        'Prend sa source dans les récits bibliques d’Abraham quittant la Mésopotamie vers Canaan, puis dans la sortie d’Égypte sous la conduite de Moïse.',
      historicalContext:
        'Un univers proche-oriental polythéiste où l’affirmation d’un Dieu unique, invisible, éthique et personnel constituait une rupture spirituelle révolutionnaire.',
      objectiveAndPurpose:
        'Réparer le monde (Tikkoun Olam) par la justice, la sainteté de la vie quotidienne, la pratique des commandements (Mitzvot) et l’étude perpétuelle.',
      keyPrinciplesSummary: [
        'Monothéisme éthique strict (Le Shema Israël)',
        'L’Alliance (Brit) et la sainteté du temps (Le Shabbat)',
        'Valeur inestimable de l’étude et du débat intellectuel',
        'Justice, charité (Tsedaka) et dignité humaine',
      ],
    },
    coreBeliefs: [
      {
        title: 'Le Shema Israël',
        shortDesc: '« Écoute Israël, l’Éternel est notre Dieu, l’Éternel est Un. »',
        explanation: 'La proclamation quotidienne de l’Unicité divine absolue.',
        icon: 'star',
      },
      {
        title: 'L’Alliance et la Torah',
        shortDesc: 'La loi comme chemin de liberté et de sanctification.',
        explanation: 'La Torah n’est pas un carcan juridique mais un guide bienveillant pour élever chaque acte de la vie.',
        icon: 'book',
      },
    ],
    keyFigures: [
      {
        name: 'Moïse (Moché Rabbénou)',
        title: 'Le Législateur et plus grand des Prophètes',
        role: 'Guide de l’Exode et transmetteur de la Torah',
        mission: 'Libérer le peuple de l’esclavage d’Égypte et recevoir les Dix Commandements au mont Sinaï.',
        period: 'Vers le XIIIe siècle av. J.-C.',
        importance: 'Figure fondatrice de l’identité et de la législation juive.',
        historicalSteps: [
          { period: 'Égypte', title: 'L’Exode', description: 'La sortie de la servitude et la traversée de la mer.' },
          { period: 'Sinaï', title: 'Le don de la Torah', description: 'Révélation des Tables de la Loi et de l’Alliance.' },
        ],
        teachingsHighlight: ['« Tu aimeras ton prochain comme toi-même. » (Lévitique 19:18)'],
      },
    ],
    sacredTexts: [
      {
        name: 'La Torah et le Tanakh',
        subtitle: 'La Bible hébraïque',
        statusAndPlace: 'Texte fondateur de la Révélation écrite.',
        importance: 'Lecture rituelle hebdomadaire à la synagogue.',
        structure: {
          unitsName: 'Parties majeures',
          subUnitsName: 'Livres',
          totalUnits: 3,
          classification: 'Torah (Pentateuque), Nevi’im (Prophètes), Ketouvim (Écrits).',
        },
        keyThemes: [
          { title: 'La Création et l’Alliance', description: 'La bonté originelle du monde et la responsabilité de l’homme.' },
        ],
        howToExplore: 'Retrouvez les grands traités de pensée philosophique (Maïmonide) sur la plateforme.',
      },
    ],
    practices: [
      {
        title: 'Le Shabbat',
        category: 'pilier',
        frequency: 'Hebdomadaire (du vendredi soir au samedi soir)',
        description: 'Jour sacré de repos, de recueillement en famille et de cessation de toute activité créatrice profane.',
        spiritualMeaning: 'Reconnaissance de Dieu comme Créateur et libérateur du travail aliénant.',
      },
    ],
    historyMilestones: [
      { period: 'Xe siècle av. J.-C.', title: 'Royaume de David et Salomon', description: 'Construction du Premier Temple de Jérusalem.', geography: 'Jérusalem' },
      { period: 'Ier siècle ap. J.-C.', title: 'Destruction du Second Temple et Diaspora', description: 'Début du judaïsme rabbinique centré sur la synagogue et l’étude.', geography: 'Bassin méditerranéen' },
    ],
    currentsAndBranches: [
      {
        id: 'judaisme-rabbinique',
        title: 'Traditions et Pensée Rabbinique',
        traditionId: 'judaisme',
        subtitle: 'Courants orthodoxes, conservateurs et libéraux',
        description: 'Interprétation vivante de la Loi orale (Talmud) à travers les siècles.',
        figures: ['Moïse Maïmonide (Rambam)', 'Rachi de Troyes'],
        teachingsFocus: 'Exégèse, éthique prophétique et conciliation de la foi et de la raison.',
        resourceCount: 2,
      },
    ],
    furtherReadingSummary: {
      title: 'Approfondir le Judaïsme sur Sunubiblio',
      description: 'Accédez aux chefs-d’œuvre de la philosophie médiévale juive et à l’histoire des religions du Proche-Orient.',
      recommendedThemes: ['Le Guide des Égarés de Maïmonide', 'Histoire du monothéisme biblique'],
    },
  },

  // ==========================================
  // 4. HINDOUISME
  // ==========================================
  hindouisme: {
    slug: 'hindouisme',
    traditionId: 'hindouisme',
    hero: {
      title: 'Découvrir l’Hindouisme',
      subtitle: 'Origines, Dharma, Védas et sagesses millénaires de l’Inde',
      tagline:
        'Une des plus anciennes traditions vivantes de l’humanité (Sanatana Dharma), offrant une diversité infinie de voies spirituelles unies dans la quête de l’Absolu.',
      badge: 'Sagesse & Métaphysique',
      keyStat: '1,2 milliard de fidèles',
      periodOrigin: 'Vers 1500 – 1200 av. J.-C. (Période védique)',
      geographicOrigin: 'Sous-continent indien (Vallée de l’Indus et bassin du Gange)',
      accentColor: '#d97706',
      bgLight: 'rgba(217, 119, 6, 0.08)',
      borderColor: 'rgba(217, 119, 6, 0.25)',
      iconName: 'wheel',
    },
    introduction: {
      definition:
        'L’Hindouisme (appelé en sanskrit Sanatana Dharma, « l’Ordre cosmique éternel ») est une famille complexe de croyances, de philosophies, de rituels et de pratiques spirituelles originaires de l’Inde, sans fondateur unique ni dogme unifié.',
      etymology:
        'Dérive du fleuve Sindhu (l’Indus), terme utilisé par les Perses puis les Grecs pour désigner les populations vivant au-delà de ce cours d’eau.',
      historicalOrigin:
        'Né de la fusion entre la civilisation protohistorique de la vallée de l’Indus et la culture des peuples aryens composant les hymnes védiques.',
      historicalContext:
        'Une civilisation agraire et fluviale très avancée, méditant sur les cycles de la nature, les saisons et l’ordre universel.',
      objectiveAndPurpose:
        'Réaliser la libération spirituelle (Moksha) du cycle incessant des réincarnations (Samsara) en reconnaissant l’identité profonde entre l’âme individuelle (Atman) et la Réalité ultime (Brahman).',
      keyPrinciplesSummary: [
        'Le Dharma : devoir moral, ordre cosmique et harmonie éthique',
        'Le Karma : loi universelle de cause à effet des actions',
        'Le Samsara : cycle des renaissances successives',
        'Le Moksha : libération finale et union avec l’Infini',
      ],
    },
    coreBeliefs: [
      {
        title: 'Brahman et Atman',
        shortDesc: 'L’Absolu universel et l’étincelle divine intérieure.',
        explanation: 'Brahman est la conscience suprême omniprésente, et Atman est la véritable nature éternelle de chaque être vivant.',
        icon: 'sun',
      },
      {
        title: 'La loi du Karma',
        shortDesc: 'Toute action produit des fruits.',
        explanation: 'Les pensées, paroles et actes façonnent le destin présent et futur de l’individu.',
        icon: 'refresh-cw',
      },
    ],
    keyFigures: [
      {
        name: 'Krishna',
        title: 'Avatar divin et Maître spirituel de la Bhagavad Gita',
        role: 'Guide d’Arjuna sur le champ de bataille de Kurukshetra',
        mission: 'Restaurer le Dharma et enseigner les trois voies du salut (action désintéressée, dévotion, connaissance).',
        period: 'Époque épique antique',
        importance: 'Figure vénérée symbolisant l’amour divin et la sérénité au cœur de l’action.',
        historicalSteps: [
          { period: 'Kurukshetra', title: 'Le dialogue de la Bhagavad Gita', description: 'Enseignement à Arjuna pris de doute avant le combat.' },
        ],
        teachingsHighlight: ['« Tu as le droit à l’action, mais jamais aux fruits de l’action. »'],
      },
    ],
    sacredTexts: [
      {
        name: 'Les Védas et Upanishads',
        subtitle: 'Textes révélés (Shruti) et philosophie du Vedanta',
        statusAndPlace: 'Les écritures les plus vénérées de la tradition indienne.',
        importance: 'Fondement de la liturgie, de la musique et de la haute spéculation métaphysique.',
        structure: {
          unitsName: 'Grands Védas',
          subUnitsName: 'Hymnes et traités',
          totalUnits: 4,
          classification: 'Rig-Véda, Sama-Véda, Yajur-Véda, Atharva-Véda.',
        },
        keyThemes: [
          { title: 'L’Unité sous-jacente du multiple', description: '« La Vérité est Une, les sages la nomment de manières diverses. »' },
        ],
        howToExplore: 'Consultez la Bhagavad Gita et les traductions des Upanishads dans notre catalogue.',
      },
    ],
    practices: [
      {
        title: 'Les Voies du Yoga (Marga)',
        category: 'spiritualite',
        description: 'Karma Yoga (action désintéressée), Bhakti Yoga (dévotion sincère), Jnana Yoga (connaissance transcendante).',
        spiritualMeaning: 'Canaux d’élévation de la conscience adaptés aux tempéraments de chacun.',
      },
    ],
    historyMilestones: [
      { period: '1500 – 500 av. J.-C.', title: 'Période védique', description: 'Composition des hymnes védiques et émergence des Upanishads.', geography: 'Nord de l’Inde' },
      { period: 'VIIIe siècle ap. J.-C.', title: 'Shankara et l’Advaita Vedanta', description: 'Systématisation de la philosophie de la non-dualité.', geography: 'Inde' },
    ],
    currentsAndBranches: [
      {
        id: 'hindouisme-vedique',
        title: 'Grands Courants du Dharma',
        traditionId: 'hindouisme',
        subtitle: 'Vishnouisme, Shivaïsme et Shaktisme',
        description: 'Différentes formes de dévotion envers les manifestations de l’Unique.',
        figures: ['Adi Shankara', 'Ramanuja', 'Swami Vivekananda'],
        teachingsFocus: 'Méditation, ahimsa (non-violence) et respect de toute créature.',
        resourceCount: 2,
      },
    ],
    furtherReadingSummary: {
      title: 'Approfondir l’Hindouisme sur Sunubiblio',
      description: 'Découvrez la philosophie orientale classique, le texte intégral de la Bhagavad Gita et les principes de la non-violence.',
      recommendedThemes: ['La Bhagavad Gita commentée', 'Philosophie du Yoga et méditation'],
    },
  },

  // ==========================================
  // 5. BOUDDHISME
  // ==========================================
  bouddhisme: {
    slug: 'bouddhisme',
    traditionId: 'bouddhisme',
    hero: {
      title: 'Découvrir le Bouddhisme',
      subtitle: 'L’Éveil, les Quatre Nobles Vérités et la Voie du Milieu',
      tagline:
        'Une voie spirituelle et philosophique non-théiste axée sur la lucidité mentale, la compassion universelle et l’affranchissement de la souffrance.',
      badge: 'Éveil & Compassion',
      keyStat: '500 millions de pratiquants',
      periodOrigin: 'VIe – Ve siècle avant notre ère',
      geographicOrigin: 'Plaine gangétique (Nord de l’Inde et Népal actuel)',
      accentColor: '#eab308',
      bgLight: 'rgba(234, 179, 8, 0.08)',
      borderColor: 'rgba(234, 179, 8, 0.25)',
      iconName: 'lotus',
    },
    introduction: {
      definition:
        'Le Bouddhisme est un enseignement spirituel et une discipline méditative fondés sur les réalisations de Siddhartha Gautama, qui a atteint l’Éveil complet (Bodhi) et enseigné le chemin menant à l’extinction de la souffrance (Nirvana).',
      etymology: 'Du sanskrit « Budh » qui signifie « s’éveiller », « comprendre pleinement », « être lucide ».',
      historicalOrigin: 'Apparu au VIe siècle av. J.-C. à Bodhgaya, dans le nord de l’Inde contemporaine.',
      historicalContext:
        'Une période de profonde effervescence intellectuelle et d’urbanisation en Inde, où de nombreux renonçants (shramanas) cherchaient une réponse au mal-être existentiel au-delà des rituels sacerdotaux védiques.',
      objectiveAndPurpose:
        'Développer la sagesse (Prajna) et la compassion (Karuna) pour dissiper l’illusion de l’égo séparé (Anatta), vaincre l’attachement et vivre dans la sérénité.',
      keyPrinciplesSummary: [
        'Les Quatre Nobles Vérités sur la souffrance et sa cessation',
        'Le Noble Sentier Octuple (éthique, méditation, sagesse)',
        'L’impermanence de toute chose conditionnée (Anicca)',
        'La non-violence absolue envers tous les êtres sensibles',
      ],
    },
    coreBeliefs: [
      {
        title: 'Les Quatre Nobles Vérités',
        shortDesc: 'Le diagnostic et le remède au mal existentiel.',
        explanation:
          '1. La réalité de la souffrance (Dukkha). 2. L’origine de la souffrance dans le désir avide. 3. La possibilité de la cessation (Nirodha). 4. Le sentier menant à cette libération.',
        icon: 'help-circle',
      },
      {
        title: 'L’Impermanence et la Non-dualité',
        shortDesc: 'Rien dans le monde n’est figé ou immuable.',
        explanation: 'Tout est interdépendant et en constant mouvement. La paix naît de l’acceptation lucide de ce flux.',
        icon: 'wind',
      },
    ],
    keyFigures: [
      {
        name: 'Siddhartha Gautama (Le Bouddha)',
        title: 'L’Éveillé historique',
        role: 'Maître spirituel et fondateur',
        mission: 'Partager avec compassion la méthode permettant à chacun de s’éveiller à sa véritable nature.',
        period: 'Vers 563 – 483 av. J.-C.',
        importance: 'Guide ayant montré que la paix intérieure dépend de la transformation de son propre esprit.',
        historicalSteps: [
          { period: 'Lumbini', title: 'Naissance princière', description: 'Né prince du clan des Shakya, comblé de richesses.' },
          { period: 'Les 4 rencontres', title: 'Prise de conscience existentielle', description: 'La vue d’un vieillard, d’un malade, d’un mort et d’un moine serein l’incite à renoncer au palais.' },
          { period: 'Bodhgaya', title: 'L’Éveil sous l’arbre de la Bodhi', description: 'Après des années d’ascèse infructueuse, il adopte la voie du juste milieu et atteint la libération.' },
        ],
        teachingsHighlight: ['« La paix vient de l’intérieur. Ne la cherchez pas à l’extérieur. »'],
      },
    ],
    sacredTexts: [
      {
        name: 'Le Canon Pali (Tipitaka)',
        subtitle: 'Les Trois Corbeilles',
        statusAndPlace: 'Recueil des paroles et enseignements du Bouddha.',
        importance: 'Référence fondamentale pour toutes les traditions bouddhiques.',
        structure: {
          unitsName: 'Corbeilles (Pitakas)',
          subUnitsName: 'Soutras (Discours)',
          totalUnits: 3,
          classification: 'Vinaya (discipline), Sutta (discours), Abhidhamma (analyse philosophique).',
        },
        keyThemes: [
          { title: 'Le Dhammapada', description: 'Recueil de sentences poétiques sur la vigilance mentale et la douceur.' },
        ],
        howToExplore: 'Explorez les traités classiques sur la pleine conscience et la philosophie bouddhiste sur Sunubiblio.',
      },
    ],
    practices: [
      {
        title: 'La Méditation (Bhavana / Vipassana)',
        category: 'spiritualite',
        frequency: 'Quotidienne',
        description: 'Entraînement de l’esprit à la présence attentive, au calme intérieur et à l’observation lucide des pensées.',
        spiritualMeaning: 'Libération des automatismes de colère, de jalousie et d’avidité.',
      },
    ],
    historyMilestones: [
      { period: 'IIIe siècle av. J.-C.', title: 'Règne de l’empereur Ashoka', description: 'Adoption du Dharma et diffusion pacifique vers le Sri Lanka et l’Asie centrale.', geography: 'Inde et Asie' },
    ],
    currentsAndBranches: [
      {
        id: 'bouddhisme-general',
        title: 'Les Grandes Écoles Bouddhiques',
        traditionId: 'bouddhisme',
        subtitle: 'Theravada, Mahayana et Vajrayana',
        description: 'Voie des anciens (Theravada), voie du grand véhicule (Mahayana / Zen), et voie tantrique (Vajrayana / Tibet).',
        figures: ['Nagarjuna', 'Bodhidharma', 'Dalaï-Lama'],
        teachingsFocus: 'L’idéal du Bodhisattva qui retarde sa délivrance pour sauver tous les êtres.',
        resourceCount: 2,
      },
    ],
    furtherReadingSummary: {
      title: 'Approfondir le Bouddhisme sur Sunubiblio',
      description: 'Ouvrages d’introduction à la méditation laïque, philosophie de l’esprit et traductions du Dhammapada.',
      recommendedThemes: ['Le Dhammapada', 'Introduction à la pleine conscience', 'Philosophie de la compassion'],
    },
  },

  // ==========================================
  // 6. SIKHISME
  // ==========================================
  sikhisme: {
    slug: 'sikhisme',
    traditionId: 'sikhisme',
    hero: {
      title: 'Découvrir le Sikhisme',
      subtitle: 'Origines, Guru Nanak, égalité universelle et service désintéressé',
      tagline:
        'Une tradition monothéiste dynamique prônant l’égalité absolue de tous les êtres humains, le souvenir de Dieu et l’action bienfaisante au service de la communauté.',
      badge: 'Égalité & Dévotion',
      keyStat: '30 millions de fidèles',
      periodOrigin: 'XVe siècle (vers 1469)',
      geographicOrigin: 'Région du Pendjab (Sous-continent indien)',
      accentColor: '#f97316',
      bgLight: 'rgba(249, 115, 22, 0.08)',
      borderColor: 'rgba(249, 115, 22, 0.25)',
      iconName: 'khanda',
    },
    introduction: {
      definition:
        'Le Sikhisme (Sikhi, « disciple » ou « apprenant ») est une religion monothéiste révélée fondée par Guru Nanak au Pendjab, insistant sur la dévotion à un Dieu unique sans forme, l’abolition complète des castes et l’honnêteté du travail.',
      etymology: 'Du sanskrit « Shishya » signifiant « disciple », « celui qui apprend sans cesse auprès du Maître divin ».',
      historicalOrigin: 'Né au tournant du XVe siècle au Pendjab, au confluent des civilisations islamique et hindoue.',
      historicalContext:
        'Société indienne divisée par le système oppressif des castes et des rivalités sectaires. Guru Nanak proclama : « Il n’y a ni hindou ni musulman », affirmant la fraternité humaine universelle.',
      objectiveAndPurpose:
        'Vivre une vie droite et pure au sein de la société (sans se retirer du monde), méditer sur le Nom divin et nourrir les affamés.',
      keyPrinciplesSummary: [
        'Un seul Dieu suprême (Ik Onkar)',
        'Égalité stricte entre hommes et femmes et refus des castes',
        'Les 3 piliers : Naam Japna, Kirat Karo, Vand Chhako',
        'Le service désintéressé (Seva) et les cuisines communautaires gratuites (Langar)',
      ],
    },
    coreBeliefs: [
      {
        title: 'Ik Onkar (Un Seul Créateur)',
        shortDesc: 'La réalité divine unique présente en toute chose.',
        explanation: 'Dieu est sans peur, sans haine, intemporel, au-delà des représentations matérielles.',
        icon: 'sun',
      },
      {
        title: 'Les Trois Devoirs Quotidiens',
        shortDesc: 'Méditation, travail honnête et partage.',
        explanation:
          '1. Naam Japna (garder Dieu en mémoire). 2. Kirat Karo (gagner sa vie par un labeur intègre). 3. Vand Chhako (partager ses gains avec ceux qui sont dans le besoin).',
        icon: 'check-circle',
      },
    ],
    keyFigures: [
      {
        name: 'Guru Nanak Dev Ji',
        title: 'Premier Guru et Fondateur du Sikhisme',
        role: 'Maître spirituel, poète mystique et réformateur social',
        mission: 'Réconcilier les êtres humains au-delà des clivages religieux et prêcher la droiture du cœur.',
        period: '1469 – 1539',
        importance: 'Inspirateur d’un idéal de justice sociale et de communion mystique par le chant poétique.',
        historicalSteps: [
          { period: 'Pendjab', title: 'L’illumination à Sultanpur', description: 'Disparaît trois jours dans la rivière Kali Bein avant de revenir éclairé du message divin.' },
          { period: 'Voyages (Udasis)', title: 'Pèlerinages à travers le monde', description: 'Voyage vers La Mecque, Bagdad, le Tibet et l’Inde pour dialoguer avec les sages.' },
        ],
        teachingsHighlight: ['« La vérité est la plus haute vertu, mais une vie vécue dans la vérité est encore plus haute. »'],
      },
    ],
    sacredTexts: [
      {
        name: 'Le Guru Granth Sahib',
        subtitle: 'L’Écriture sainte érigée en Guru éternel',
        statusAndPlace: 'Considéré comme le Guru vivant et perpétuel de la communauté sikhe.',
        importance: 'Recueil poétique en versets musicaux (Ragas), vénéré dans chaque temple (Gurdwara).',
        structure: {
          unitsName: 'Pages (Angs)',
          subUnitsName: 'Hymnes (Shabads)',
          totalUnits: 1430,
          classification: 'Contient les hymnes des Gurus sikhs ainsi que de mystiques musulmans (Baba Farid) et hindous (Kabir).',
        },
        keyThemes: [
          { title: 'L’Amour divin et l’humilité', description: 'Chants d’extase célébrant la beauté et la bonté divine.' },
        ],
        howToExplore: 'Ressources et études comparatives des religions disponibles sur Sunubiblio.',
      },
    ],
    practices: [
      {
        title: 'Le Langar (Cuisine communautaire)',
        category: 'pilier',
        frequency: 'Permanente',
        description: 'Repas végétarien gratuit servi à tous sans distinction de religion, de caste, de genre ou de richesse, tous assis au même niveau sur le sol.',
        spiritualMeaning: 'Incarnation vivante de l’égalité fraternelle et de la solidarité.',
      },
    ],
    historyMilestones: [
      { period: '1699', title: 'Création du Khalsa', description: 'Institution de la confrérie des dévoués par Guru Gobind Singh.', geography: 'Anandpur Sahib' },
    ],
    currentsAndBranches: [
      {
        id: 'sikhisme-gurmat',
        title: 'La Voie du Gurmat',
        traditionId: 'sikhisme',
        subtitle: 'L’enseignement universel des Dix Gurus',
        description: 'La succession historique des 10 Gurus culminant avec le Guru Granth Sahib.',
        figures: ['Guru Nanak', 'Guru Arjan', 'Guru Gobind Singh'],
        teachingsFocus: 'Défense des opprimés, intégrité et foi paisible.',
        resourceCount: 1,
      },
    ],
    furtherReadingSummary: {
      title: 'Approfondir le Sikhisme sur Sunubiblio',
      description: 'Découvrez des textes sur l’histoire du Pendjab, les hymnes de Guru Nanak et les modèles de coexistence interreligieuse.',
      recommendedThemes: ['Hymnes de Guru Nanak', 'Éthique du service et du partage'],
    },
  },

  // ==========================================
  // 7. TAOÏSME
  // ==========================================
  taoisme: {
    slug: 'taoisme',
    traditionId: 'taoisme',
    hero: {
      title: 'Découvrir le Taoïsme',
      subtitle: 'Le Tao, le Yin et le Yang, le Non-agir (Wu Wei) et l’harmonie avec la nature',
      tagline:
        'Une sagesse philosophique et spirituelle millénaire de la Chine ancienne, invitant à vivre en harmonie spontanée avec le souffle naturel de l’univers.',
      badge: 'Harmonie & Sagesse',
      keyStat: 'Patrimoine philosophique mondial',
      periodOrigin: 'VIe – IVe siècle avant notre ère',
      geographicOrigin: 'Chine antique (Bassin du Fleuve Jaune)',
      accentColor: '#0f766e',
      bgLight: 'rgba(15, 118, 110, 0.08)',
      borderColor: 'rgba(15, 118, 110, 0.25)',
      iconName: 'yin-yang',
    },
    introduction: {
      definition:
        'Le Taoïsme (Daojiao / Daojia) est à la fois une philosophie de vie et une tradition spirituelle chinoise fondée sur le principe du Tao (la Voie), source ineffable, dynamique et spontanée d’où jaillit et s’ordonne toute la création.',
      etymology: 'Du sinogramme « Dao » (道) signifiant la Voie, le Chemin, le Principe cosmique primordial.',
      historicalOrigin:
        'Trouve son expression classique dans les textes attribués au sage Lao Tseu (Laozi) et à Zhuangzi durant la période des Royaumes Combattants.',
      historicalContext:
        'Époque troublée de conflits militaires et d’artifices politiques, à laquelle les maîtres taoïstes répondirent par un retour à la simplicité naturelle et à la sobriété.',
      objectiveAndPurpose:
        'Épouser le cours naturel des choses sans résistance inutile, cultiver sa vitalité intérieure et vivre en harmonie sereine avec le cosmos.',
      keyPrinciplesSummary: [
        'Le Tao : principe indéfinissable et matrice de l’univers',
        'Le Yin et le Yang : complémentarité des polarités opposées',
        'Le Wu Wei : action naturelle sans contrainte artificielle (« Non-agir »)',
        'Le retour à la simplicité originelle (Ziran) et respect du vivant',
      ],
    },
    coreBeliefs: [
      {
        title: 'Le Tao Ineffable',
        shortDesc: '« Le Tao que l’on peut nommer n’est pas le Tao éternel. »',
        explanation: 'Le Principe dépasse nos concepts mentaux et se perçoit par le silence intérieur et l’observation de la nature.',
        icon: 'compass',
      },
      {
        title: 'Le Wu Wei (Le Non-Agir efficace)',
        shortDesc: 'Agir sans forcer, comme l’eau qui épouse le relief.',
        explanation: 'L’eau est le modèle suprême de vertu taoïste : fluide, humble, épousant les formes sans lutter, elle use pourtant la roche la plus dure.',
        icon: 'droplet',
      },
    ],
    keyFigures: [
      {
        name: 'Lao Tseu (Laozi)',
        title: 'Le Sage vénérable',
        role: 'Philosophe mythique et auteur du Daodejing',
        mission: 'Consigner en 81 courts chapitres les maximes de sagesse du Tao et de sa Vertu.',
        period: 'VIe siècle av. J.-C.',
        importance: 'Père de la pensée taoïste, symbole d’humilité et de sagesse intemporelle.',
        historicalSteps: [
          { period: 'Passe de l’Ouest', title: 'La rédaction du Daodejing', description: 'Quittant le royaume décadent sur un buffle, il laisse au gardien de la frontière son chef-d’œuvre.' },
        ],
        teachingsHighlight: ['« Un voyage de mille lieues commence toujours par un premier pas. »'],
      },
    ],
    sacredTexts: [
      {
        name: 'Le Daodejing (Livre de la Voie et de la Vertu)',
        subtitle: 'Chef-d’œuvre de la poésie philosophique',
        statusAndPlace: 'Texte central de la sagesse chinoise.',
        importance: 'Ouvrage parmi les plus traduits et médités au monde.',
        structure: {
          unitsName: 'Chapitres / Poèmes',
          subUnitsName: 'Strophes',
          totalUnits: 81,
          classification: 'Livre de la Voie (Dao) et Livre de la Vertu (De).',
        },
        keyThemes: [
          { title: 'L’Éloge de la flexibilité et de la douceur', description: 'Ce qui est raide et rigide se brise ; ce qui est souple triomphe.' },
        ],
        howToExplore: 'Retrouvez le Daodejing et des commentaires sur notre bibliothèque.',
      },
    ],
    practices: [
      {
        title: 'La Culture de l’Énergie Vitale (Qi Gong / Méditation)',
        category: 'spiritualite',
        frequency: 'Quotidienne',
        description: 'Respiration consciente, mouvements fluides et écoute de son corps pour préserver la santé et la paix intérieure.',
        spiritualMeaning: 'Alignement du microcosme humain avec le macrocosme universel.',
      },
    ],
    historyMilestones: [
      { period: 'IVe siècle av. J.-C.', title: 'Époque des philosophes classiques', description: 'Rédaction du Zhuangzi et diffusion des thèses sur la liberté intérieure.', geography: 'Chine antique' },
    ],
    currentsAndBranches: [
      {
        id: 'taoisme-philosophique',
        title: 'Taoïsme Philosophique et Spirituel',
        traditionId: 'taoisme',
        subtitle: 'Laozi, Zhuangzi et alchimie intérieure',
        description: 'Les deux facettes indissociables : sagesse contemplative et rituels de longévité.',
        figures: ['Lao Tseu', 'Zhuangzi', 'Liezi'],
        teachingsFocus: 'Spontanéité, liberté d’esprit et écologie profonde.',
        resourceCount: 1,
      },
    ],
    furtherReadingSummary: {
      title: 'Approfondir le Taoïsme sur Sunubiblio',
      description: 'Accédez aux maximes du Daodejing et aux paraboles pleines d’humour de Zhuangzi.',
      recommendedThemes: ['Le Daodejing de Lao Tseu', 'Philosophie de la nature et Wu Wei'],
    },
  },

  // ==========================================
  // 8. SPIRITUALITÉS TRADITIONNELLES AFRICAINES
  // ==========================================
  'spiritualites-africaines': {
    slug: 'spiritualites-africaines',
    traditionId: 'religions-traditionnelles-africaines',
    hero: {
      title: 'Spiritualités Traditionnelles Africaines',
      subtitle: 'Cosmogonies, force vitale, ancêtres et harmonie avec le cosmos',
      tagline:
        'Un patrimoine spirituel plurimillénaire fondé sur la force vitale universelle, la vénération des ancêtres bienveillants et l’équilibre sacré entre l’homme et la nature.',
      badge: 'Racines & Sagesse Ancestrale',
      keyStat: 'Patrimoine vivant du continent',
      periodOrigin: 'Origines immémoriales de l’humanité',
      geographicOrigin: 'Berceau africain (Afrique de l’Ouest, Centrale, Australe et Nil)',
      accentColor: '#047857',
      bgLight: 'rgba(4, 120, 87, 0.08)',
      borderColor: 'rgba(4, 120, 87, 0.25)',
      iconName: 'tree',
    },
    introduction: {
      definition:
        'Les spiritualités traditionnelles africaines constituent un ensemble riche et pluriel de visions du monde (cosmovisions), de cosmogonies, de rites initiatiques et de pratiques communautaires partagés par les peuples d’Afrique subsaharienne, reconnaissant un Être Suprême Créateur et un univers habité de forces vivantes interconnectées.',
      etymology:
        'Exprimées à travers une diversité de langues africaines : « Nyame » (Ashanti), « Olodumare » (Yoruba), « Amma » (Dogon), « Roog » (Sérère), désignant l’Être transcendant inaccessible.',
      historicalOrigin:
        'Transmises de génération en génération par la parole vivante, le conte, les rituels initiatiques et l’art sacré depuis l’aube des civilisations africaines.',
      historicalContext:
        'Des sociétés communautaires où le sacré n’est pas séparé du profane : agriculture, forge, chasse, médecine et justice sont imprégnées d’une dimension spirituelle constante.',
      objectiveAndPurpose:
        'Maintenir l’équilibre vital et l’harmonie cosmique entre le monde visible des vivants, le monde invisible des ancêtres et des esprits, et l’environnement naturel.',
      keyPrinciplesSummary: [
        'Croyance en un Dieu Créateur Unique et Transcendant',
        'La Force Vitale (Nyama) irriguant tous les êtres',
        'La communion permanente avec les Ancêtres (les « Morts qui ne sont pas morts »)',
        'L’éthique communautaire et solidaire (l’Ubuntu : « Je suis parce que nous sommes »)',
        'Le respect sacré de la nature (forêts sacrées, fleuves, arbres totémiques)',
      ],
    },
    coreBeliefs: [
      {
        title: 'L’Être Suprême et les Médiateurs',
        shortDesc: 'Un Dieu transcendant honoré à travers ses intercesseurs.',
        explanation:
          'Dieu est unique, parfait et lointain. Les êtres humains s’adressent à Lui à travers les ancêtres méritants et les génies de la nature protecteurs.',
        icon: 'sun',
      },
      {
        title: 'La Force Vitale et l’Ubuntu',
        shortDesc: '« Une personne n’est une personne qu’à travers les autres personnes. »',
        explanation: 'La vie est un tissu d’interdépendances sacrées où la générosité et l’harmonie avec la communauté sont primordiales.',
        icon: 'users',
      },
      {
        title: 'Les Ancêtres Gardiens',
        shortDesc: 'Les aînés invisibles veillant sur la lignée.',
        explanation: 'Ceux qui ont vécu avec sagesse et dignité continuent de guider, conseiller et protéger leurs descendants.',
        icon: 'shield',
      },
    ],
    keyFigures: [
      {
        name: 'Les Sages, Griots et Maîtres de la Parole',
        title: 'Gardiens de la mémoire et de la tradition orale',
        role: 'Transmetteurs de savoirs, médiateurs de paix et philosophes',
        mission: 'Transmettre sans altération les récits de la création, les généalogies et les préceptes moraux de génération en génération.',
        period: 'Tradition vivante intemporelle',
        importance:
          'Comme le rappelait Amadou Hampâté Bâ : « En Afrique, un vieillard qui meurt est une bibliothèque qui brûle ». Les aînés sont les sanctuaires vivants du savoir.',
        historicalSteps: [
          { period: 'Initiation', title: 'Le passage à l’âge adulte', description: 'Enseignement des valeurs de courage, de discrétion, de respect des aînés et de maîtrise de soi dans le bois sacré.' },
        ],
        teachingsHighlight: ['« L’homme est le remède de l’homme. » (Proverbe ouolof)'],
      },
    ],
    sacredTexts: [
      {
        name: 'La Tradition Orale et les Récits Cosmoganiques',
        subtitle: 'Cosmogonies Dogon, Sérère, Bambara et récits initiatiques',
        statusAndPlace: 'Bibliothèque vivante gravée dans les cœurs et les chants rituels.',
        importance: 'Mémoire historique, poétique et philosophique des peuples africains.',
        structure: {
          unitsName: 'Cycles oraux',
          subUnitsName: 'Contes initiatiques et mythes',
          totalUnits: 10,
          classification: 'Mythe d’Amma (Dogon), Genèse selon Roog (Sérère), Charte de Kouroukan Fouga (Mali).',
        },
        keyThemes: [
          { title: 'L’Arbre à palabres', description: 'La recherche du consensus pacifique par la parole partagée.' },
        ],
        howToExplore: 'Découvrez les chefs-d’œuvre d’Amadou Hampâté Bâ et de Cheikh Anta Diop sur la plateforme.',
      },
    ],
    practices: [
      {
        title: 'Les Libations et Rites aux Ancêtres',
        category: 'rituel',
        frequency: 'Lors des événements majeurs de la vie',
        description: 'Offrandes d’eau ou de lait à la terre pour saluer la mémoire des ancêtres et solliciter leur bénédiction.',
        spiritualMeaning: 'Reconnaissance de notre dette envers ceux qui nous ont précédés.',
      },
      {
        title: 'Les Bois et Forêts Sacrés',
        category: 'ethique',
        description: 'Espaces naturels protégés où toute coupe d’arbre ou chasse est formellement prohibée.',
        spiritualMeaning: 'Écologie sacrée préservant la biodiversité et le recueillement.',
      },
    ],
    historyMilestones: [
      { period: 'Immémorial', title: 'L’Émergence des civilisations du Nil et du Sahel', description: 'Développement des premières sagesses éthiques (Maât en Égypte antique, cosmogonies sahéliennes).', geography: 'Afrique' },
      { period: '1236', title: 'La Charte du Manden (Kouroukan Fouga)', description: 'Une des plus anciennes déclarations des droits humains et de respect de la vie.', geography: 'Mali' },
    ],
    currentsAndBranches: [
      {
        id: 'afrique-cosmogonies',
        title: 'Cosmogonies du Sénégal et de l’Afrique de l’Ouest',
        traditionId: 'religions-traditionnelles-africaines',
        subtitle: 'Sagesse sérère (Roog Sène), croyances diolas (Kassila) et cosmologie bambara',
        description: 'Piliers de tolérance et de cousinage à plaisanterie (Kalir) cimentant la paix sociale au Sénégal.',
        figures: ['Amadou Hampâté Bâ', 'Cheikh Anta Diop'],
        teachingsFocus: 'Harmonie avec le cosmos, parenté à plaisanterie et solidarité sans faille.',
        resourceCount: 1,
      },
    ],
    furtherReadingSummary: {
      title: 'Approfondir les Sagesses Africaines sur Sunubiblio',
      description: 'Explorez les textes d’ethnologie, de philosophie africaine et de recueils de contes initiatiques.',
      recommendedThemes: ['Amadou Hampâté Bâ : Kaïdara', 'Cheikh Anta Diop : Civilisation ou Barbarie', 'Les cosmogonies de l’Afrique de l’Ouest'],
    },
  },
};
