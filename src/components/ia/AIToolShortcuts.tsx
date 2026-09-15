'use client';

import React from 'react';
import Link from 'next/link';

interface ToolShortcutItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  badge: string;
  icon: React.ReactNode;
}

const TOOLS: ToolShortcutItem[] = [
  {
    id: 'resumer',
    title: 'Résumer',
    desc: 'Synthèse automatique de cours ou documents longs',
    href: '/ia/resumer',
    badge: 'Synthèse',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="21" y1="10" x2="3" y2="10"></line>
        <line x1="21" y1="6" x2="3" y2="6"></line>
        <line x1="21" y1="14" x2="3" y2="14"></line>
        <line x1="21" y1="18" x2="13" y2="18"></line>
      </svg>
    )
  },
  {
    id: 'expliquer',
    title: 'Expliquer',
    desc: 'Compréhension pas à pas avec vulgarisation adaptée',
    href: '/ia/expliquer',
    badge: 'Pédagogie',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    )
  },
  {
    id: 'qcm',
    title: 'Générer des QCM',
    desc: 'Création de questionnaires à choix multiples corrigés',
    href: '/ia/qcm',
    badge: 'Évaluation',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"></polyline>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
      </svg>
    )
  },
  {
    id: 'exercices',
    title: 'Générer des exercices',
    desc: 'Énoncés d’entraînement ciblés par niveau et discipline',
    href: '/ia/exercices',
    badge: 'Pratique',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    )
  },
  {
    id: 'corriger',
    title: 'Corriger',
    desc: 'Analyse méthodique de réponses et devoirs',
    href: '/ia/corriger',
    badge: 'Analyse',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
    )
  },
  {
    id: 'antiplagiat',
    title: 'Vérification Antiplagiat',
    desc: 'Détection de similarités documentaires et rapport d’intégrité',
    href: '/ia/antiplagiat',
    badge: 'Similarité',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    )
  },
  {
    id: 'assistant',
    title: 'Assistant Général',
    desc: 'Échange libre avec le tuteur pédagogique Sunubiblio',
    href: '/ia/assistant',
    badge: 'Discussion',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    )
  }
];

export const AIToolShortcuts: React.FC = () => {
  return (
    <section className="ia-tools-shortcuts-section" aria-label="Espaces d'outils spécialisés">
      <div className="container">
        <div className="section-header-centered">
          <span className="section-mini-badge">Outils Spécialisés</span>
          <h2 className="section-title">Espaces de travail configurables</h2>
          <p className="section-subtitle">
            Besoin d’options avancées (longueur, style, barème) ? Accédez directement à l’espace dédié par outil.
          </p>
        </div>

        <div className="shortcuts-grid">
          {TOOLS.map((tool) => (
            <Link key={tool.id} href={tool.href} className="shortcut-card-link">
              <div className="shortcut-card">
                <div className="card-top-row">
                  <div className="tool-icon-box">
                    {tool.icon}
                  </div>
                  <span className="tool-badge">{tool.badge}</span>
                </div>

                <h3 className="tool-title">{tool.title}</h3>
                <p className="tool-desc">{tool.desc}</p>

                <div className="card-footer-link">
                  <span>Ouvrir l’espace</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .ia-tools-shortcuts-section {
          padding: 64px 0;
          background: #ffffff;
        }

        .section-header-centered {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 40px auto;
        }

        .section-mini-badge {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6366f1;
          background: rgba(99, 102, 241, 0.08);
          padding: 4px 12px;
          border-radius: 9999px;
          margin-bottom: 12px;
        }

        .section-title {
          font-size: clamp(22px, 3.2vw, 28px);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px 0;
          letter-spacing: -0.02em;
        }

        .section-subtitle {
          font-size: 15px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        .shortcuts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .shortcut-card-link {
          text-decoration: none;
          display: block;
        }

        .shortcut-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 20px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.02);
        }

        .shortcut-card:hover {
          border-color: #6366f1;
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -6px rgba(99, 102, 241, 0.12);
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .tool-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #f8faff;
          border: 1px solid rgba(99, 102, 241, 0.18);
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .shortcut-card:hover .tool-icon-box {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          border-color: transparent;
        }

        .tool-badge {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          padding: 3px 8px;
          border-radius: 9999px;
        }

        .tool-title {
          font-size: 16.5px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px 0;
        }

        .tool-desc {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.5;
          margin: 0 0 16px 0;
          flex-grow: 1;
        }

        .card-footer-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6366f1;
          font-size: 13px;
          font-weight: 700;
          transition: transform 0.2s ease;
        }

        .shortcut-card:hover .card-footer-link {
          transform: translateX(3px);
        }

        @media (max-width: 960px) {
          .shortcuts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .shortcuts-grid {
            grid-template-columns: 1fr;
          }
          .ia-tools-shortcuts-section {
            padding: 44px 0;
          }
        }
      `}</style>
    </section>
  );
};
