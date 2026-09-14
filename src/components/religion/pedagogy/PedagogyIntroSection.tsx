'use client';

import React from 'react';
import { ReligionPedagogicalIntro, ReligionCoreBelief } from '@/types/religion';

interface PedagogyIntroSectionProps {
  traditionTitle: string;
  intro: ReligionPedagogicalIntro;
  coreBeliefs: ReligionCoreBelief[];
  accentColor: string;
}

export const PedagogyIntroSection: React.FC<PedagogyIntroSectionProps> = ({
  traditionTitle,
  intro,
  coreBeliefs,
  accentColor,
}) => {
  return (
    <section className="pedagogy-section" id="comprendre">
      <div className="section-head">
        <div className="section-num-badge" style={{ backgroundColor: accentColor }}>1</div>
        <div>
          <h2 className="section-title">Comprendre {traditionTitle}</h2>
          <p className="section-subtitle">
            Définition, genèse historique, raison d&apos;être et fondements spirituels indispensables.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Context Grid */}
      <div className="intro-grid">
        <div className="intro-card main-definition">
          <div className="card-top">
            <span className="card-tag">Définition & Essence</span>
          </div>
          <h3 className="card-headline">Qu&apos;est-ce que {traditionTitle} ?</h3>
          <p className="card-text">{intro.definition}</p>
          <div className="etymology-box">
            <span className="etymology-label">Étymologie :</span>
            <span className="etymology-text">{intro.etymology}</span>
          </div>
        </div>

        <div className="intro-card">
          <div className="card-top">
            <span className="card-tag">Origine & Genèse</span>
          </div>
          <h3 className="card-headline">Apparition historique</h3>
          <p className="card-text">{intro.historicalOrigin}</p>
          <div className="context-subtext">
            <strong>Contexte de l&apos;époque :</strong> {intro.historicalContext}
          </div>
        </div>

        <div className="intro-card full-width-card">
          <div className="card-top">
            <span className="card-tag">Finalité & Mission</span>
          </div>
          <h3 className="card-headline">Objectif spirituel et éthique</h3>
          <p className="card-text">{intro.objectiveAndPurpose}</p>
          <div className="principles-tags-wrap">
            {intro.keyPrinciplesSummary.map((p, idx) => (
              <span key={idx} className="principle-pill">
                <span className="pill-check">✓</span>
                <span>{p}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Core Beliefs Subsection */}
      <div className="beliefs-block">
        <h3 className="subheading-title">Les Croyances Fondamentales</h3>
        <p className="subheading-desc">
          Les piliers de foi et convictions théologiques partagés par les croyants de cette tradition.
        </p>

        <div className="beliefs-grid">
          {coreBeliefs.map((belief, idx) => (
            <div key={idx} className="belief-card">
              <div className="belief-header">
                <span className="belief-index">{idx + 1}</span>
                <h4 className="belief-title">{belief.title}</h4>
              </div>
              <p className="belief-short-desc">{belief.shortDesc}</p>
              <p className="belief-explanation">{belief.explanation}</p>
              {belief.referenceQuote && (
                <blockquote className="belief-quote">
                  <p className="quote-body">« {belief.referenceQuote.text} »</p>
                  <footer className="quote-source">— {belief.referenceQuote.source}</footer>
                </blockquote>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .pedagogy-section {
          padding: 44px 0;
          border-bottom: 1px solid rgba(226, 232, 240, 0.85);
        }

        .section-head {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
        }

        .section-num-badge {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
          flex-shrink: 0;
        }

        .section-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.015em;
          margin-bottom: 4px;
        }

        .section-subtitle {
          font-size: 14.5px;
          color: #64748b;
          font-weight: 500;
        }

        .intro-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .intro-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 3px 12px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .full-width-card {
          grid-column: 1 / -1;
        }

        .card-top {
          display: flex;
          align-items: center;
        }

        .card-tag {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #4f46e5;
          background: #eef2ff;
          padding: 4px 10px;
          border-radius: 9999px;
        }

        .card-headline {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .card-text {
          font-size: 14.5px;
          line-height: 1.65;
          color: #334155;
        }

        .etymology-box {
          margin-top: auto;
          background: #f8fafc;
          border-left: 3px solid #6366f1;
          padding: 10px 14px;
          border-radius: 0 10px 10px 0;
          font-size: 13px;
          color: #475569;
        }

        .etymology-label {
          font-weight: 700;
          color: #1e293b;
          margin-right: 6px;
        }

        .context-subtext {
          font-size: 13.5px;
          line-height: 1.6;
          color: #475569;
          background: #f8fafc;
          padding: 12px;
          border-radius: 10px;
        }

        .principles-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
        }

        .principle-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
        }

        .pill-check {
          color: #059669;
          font-weight: 800;
        }

        /* Beliefs */
        .beliefs-block {
          margin-top: 36px;
        }

        .subheading-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .subheading-desc {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 22px;
        }

        .beliefs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .belief-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: transform 0.2s ease;
        }

        .belief-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
        }

        .belief-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .belief-index {
          width: 24px;
          height: 24px;
          background: #f1f5f9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: #475569;
          flex-shrink: 0;
        }

        .belief-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .belief-short-desc {
          font-size: 13px;
          font-weight: 600;
          color: #4338ca;
        }

        .belief-explanation {
          font-size: 13.5px;
          line-height: 1.55;
          color: #475569;
        }

        .belief-quote {
          margin-top: auto;
          background: #f8fafc;
          border-left: 2px solid #059669;
          padding: 10px 12px;
          border-radius: 0 8px 8px 0;
          font-style: italic;
        }

        .quote-body {
          font-size: 12.5px;
          color: #334155;
          line-height: 1.45;
          margin-bottom: 4px;
        }

        .quote-source {
          font-size: 11px;
          font-weight: 700;
          color: #059669;
          text-align: right;
        }

        @media (max-width: 990px) {
          .beliefs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 680px) {
          .intro-grid,
          .beliefs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
