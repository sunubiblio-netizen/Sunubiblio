'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ContextualTab {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface ContextConfig {
  rootPath: string;
  badge: string;
  title: string;
  tabs: ContextualTab[];
}

const CONTEXT_CONFIGS: ContextConfig[] = [
  // 1. Concours
  {
    rootPath: '/concours',
    badge: 'Module Officiel',
    title: 'Concours & Examens',
    tabs: [
      { id: 'all', label: 'Vue d’ensemble', href: '/concours' },
      { id: 'annales', label: 'Annales & Sujets', href: '/concours#annales' },
      { id: 'exercices', label: 'Exercices associés', href: '/exercices?category=concours' },
      { id: 'calendrier', label: 'Dates & Calendrier', href: '/concours#calendrier' },
    ],
  },
  // 2. Documents & Outils
  {
    rootPath: '/documents',
    badge: 'Boîte à Outils',
    title: 'Documents & Traitement',
    tabs: [
      { id: 'catalogue', label: 'Tous les Documents', href: '/documents' },
      { id: 'outils', label: 'Outils PDF & Word', href: '/documents#outils' },
      { id: 'mes-docs', label: 'Mes Documents traités', href: '/documents#mes-documents' },
      { id: 'verification', label: 'Vérificateur d’authenticité', href: '/documents#verification' },
    ],
  },
  // 3. IA Sunubiblio
  {
    rootPath: '/ia',
    badge: 'Intelligence Artificielle',
    title: 'Espace IA Sunubiblio',
    tabs: [
      { id: 'assistant', label: 'Assistant Conversationnel', href: '/ia' },
      { id: 'resumer', label: 'Résumer', href: '/ia/resumer' },
      { id: 'expliquer', label: 'Expliquer', href: '/ia/expliquer' },
      { id: 'qcm', label: 'Générateur QCM', href: '/ia/qcm' },
      { id: 'exercices-ia', label: 'Exercices IA', href: '/ia/exercices' },
      { id: 'antiplagiat', label: 'Détecteur de Plagiat', href: '/ia/antiplagiat' },
    ],
  },
  // 4. Religion & Savoirs
  {
    rootPath: '/religion',
    badge: 'Patrimoine Spirituel',
    title: 'Religion & Savoirs',
    tabs: [
      { id: 'confreries', label: 'Confréries & Traditions', href: '/religion' },
      { id: 'mouridisme', label: 'Mouridisme', href: '/religion/mouridisme' },
      { id: 'tidjaniya', label: 'Tidjaniya', href: '/religion/tidjaniya' },
      { id: 'eglise', label: 'Église Catholique', href: '/religion/eglise-catholique' },
      { id: 'textes', label: 'Textes sacrés', href: '/religion#textes' },
    ],
  },
  // 5. Marketplace
  {
    rootPath: '/marketplace',
    badge: 'Place de Marché',
    title: 'Marketplace Éducative',
    tabs: [
      { id: 'explorer', label: 'Explorer', href: '/marketplace' },
      { id: 'acheter', label: 'Ressources certifiées', href: '/marketplace#acheter' },
      { id: 'vendre', label: 'Vendre une ressource', href: '/marketplace#vendre' },
      { id: 'mes-ventes', label: 'Mes Ventes & Revenus', href: '/marketplace#mes-ventes' },
    ],
  },
  // 6. Visio
  {
    rootPath: '/visio',
    badge: 'Tutorat Direct',
    title: 'Visio Sunubiblio',
    tabs: [
      { id: 'accueil-visio', label: 'Mes Visios', href: '/visio' },
      { id: 'demarrer', label: 'Démarrer maintenant', href: '/visio#demarrer' },
      { id: 'programmer', label: 'Programmer une séance', href: '/visio#programmer' },
      { id: 'invitations', label: 'Invitations & Historique', href: '/visio#historique' },
    ],
  },
  // 8. Exercices
  {
    rootPath: '/exercices',
    badge: 'Moteur d’Examen',
    title: 'Centre d’Entraînement',
    tabs: [
      { id: 'tous', label: 'Tous les tests', href: '/exercices' },
      { id: 'concours-exos', label: 'Prépa Concours', href: '/exercices?category=concours' },
      { id: 'livres-exos', label: 'Manuels & Séries', href: '/exercices#manuels' },
      { id: 'simulations', label: 'Simulations d’examens', href: '/exercices#simulations' },
    ],
  },
];

export const ContextualNavigation: React.FC = () => {
  const pathname = usePathname() || '/';

  // Ne pas afficher la navigation contextuelle pendant le player d'exercice (/exercices/[id])
  if (pathname.startsWith('/exercices/') && pathname !== '/exercices') {
    return null;
  }

  // Trouver la configuration correspondant à la route courante
  const currentConfig = CONTEXT_CONFIGS.find((cfg) => {
    return pathname === cfg.rootPath || pathname.startsWith(`${cfg.rootPath}/`);
  });

  // Si la page ne fait pas partie des modules avec sous-navigation contextuelle (ex: accueil, tarifs, profil, contact)
  if (!currentConfig) {
    return null;
  }

  return (
    <nav className="contextual-nav-bar" aria-label={`Navigation contextuelle pour ${currentConfig.title}`}>
      <div className="container contextual-nav-container">
        {/* Badge contextuel compact */}
        <div className="contextual-header-tag">
          <span className="context-indicator-dot" />
          <span className="context-badge-text">{currentConfig.badge}</span>
        </div>

        {/* Liste des onglets horizontaux avec scroll tactile sur mobile */}
        <div className="contextual-tabs-scroll">
          {currentConfig.tabs.map((tab) => {
            const isTabActive = pathname === tab.href || (tab.href !== currentConfig.rootPath && pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`contextual-tab-link ${isTabActive ? 'is-active-tab' : ''}`}
                aria-current={isTabActive ? 'page' : undefined}
              >
                <span>{tab.label}</span>
                {isTabActive && <span className="tab-active-pill-bar" />}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
