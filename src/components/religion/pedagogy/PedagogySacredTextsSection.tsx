'use client';

import React from 'react';
import { ReligionSacredText } from '@/types/religion';

interface PedagogySacredTextsSectionProps {
  texts: ReligionSacredText[];
  accentColor: string;
  onExploreTextResources: (textName: string) => void;
  hideHeader?: boolean;
}

export const PedagogySacredTextsSection: React.FC<PedagogySacredTextsSectionProps> = ({
  texts,
  accentColor,
  onExploreTextResources,
  hideHeader = false,
}) => {
  if (!texts || texts.length === 0) return null;

  return (
    <div className="pedagogy-section-inner">
      {!hideHeader && (
        <div className="section-head">
          <div className="section-num-badge" style={{ backgroundColor: accentColor }}>3</div>
          <div>
            <h2 className="section-title">Les Textes Fondamentaux</h2>
            <p className="section-subtitle">
              Écritures sacrées, corpus normatifs et transmission scripturaire.
            </p>
          </div>
        </div>
      )}

      <div className="texts-list">
        {texts.map((text, idx) => (
          <div key={idx} className="sacred-text-card">
            <div className="text-header">
              <div className="text-header-left">
                <span className="text-type-badge">Texte Suprême</span>
                <h3 className="text-title">{text.name}</h3>
                {text.arabicOrOriginalName && (
                  <span className="text-original-script">{text.arabicOrOriginalName}</span>
                )}
                <p className="text-subtitle">{text.subtitle}</p>
              </div>

              <button
                type="button"
                className="explore-text-btn"
                style={{ borderColor: accentColor, color: accentColor }}
                onClick={() => onExploreTextResources(text.name)}
              >
                <span>Explorer les œuvres liées</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Structure Metrics */}
            <div className="text-structure-banner">
              <div className="structure-metric">
                <span className="metric-label">{text.structure.unitsName}</span>
                <span className="metric-value">{text.structure.totalUnits}</span>
              </div>
              {text.structure.totalSubUnits && (
                <div className="structure-metric">
                  <span className="metric-label">{text.structure.subUnitsName}</span>
                  <span className="metric-value">{text.structure.totalSubUnits}</span>
                </div>
              )}
              {text.structure.classification && (
                <div className="structure-classification">
                  <span className="class-label">Classification :</span>
                  <span className="class-text">{text.structure.classification}</span>
                </div>
              )}
            </div>

            {/* Status and Importance */}
            <div className="text-desc-grid">
              <div className="text-desc-block">
                <h4 className="desc-heading">Statut & Nature</h4>
                <p className="desc-body">{text.statusAndPlace}</p>
              </div>
              <div className="text-desc-block">
                <h4 className="desc-heading">Importance pour les fidèles</h4>
                <p className="desc-body">{text.importance}</p>
              </div>
            </div>

            {/* Key Themes Cards */}
            {text.keyThemes && text.keyThemes.length > 0 && (
              <div className="themes-section">
                <h4 className="themes-title">Principaux thèmes abordés :</h4>
                <div className="themes-grid">
                  {text.keyThemes.map((theme, tIdx) => (
                    <div key={tIdx} className="theme-card">
                      <span className="theme-dot" style={{ backgroundColor: accentColor }} />
                      <div>
                        <h5 className="theme-name">{theme.title}</h5>
                        <p className="theme-desc">{theme.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exploration Hint */}
            <div className="text-explore-hint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>{text.howToExplore}</span>
            </div>
          </div>
        ))}
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

        .texts-list {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .sacred-text-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .text-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .text-type-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #4f46e5;
          background: #eef2ff;
          padding: 4px 10px;
          border-radius: 9999px;
          margin-bottom: 6px;
        }

        .text-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .text-original-script {
          font-size: 20px;
          font-weight: 700;
          color: #059669;
          display: block;
          margin-bottom: 6px;
        }

        .text-subtitle {
          font-size: 14.5px;
          color: #475569;
          font-weight: 500;
        }

        .explore-text-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          border: 1.5px solid;
          border-radius: 9999px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .explore-text-btn:hover {
          background: #f8fafc;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }

        /* Structure Banner */
        .text-structure-banner {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 24px;
        }

        .structure-metric {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .metric-label {
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
        }

        .metric-value {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
        }

        .structure-classification {
          margin-left: auto;
          font-size: 13px;
          color: #475569;
          max-width: 500px;
        }

        .class-label {
          font-weight: 700;
          color: #0f172a;
          margin-right: 6px;
        }

        /* Desc Grid */
        .text-desc-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .text-desc-block {
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 18px;
        }

        .desc-heading {
          font-size: 13.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #1e293b;
          margin-bottom: 6px;
        }

        .desc-body {
          font-size: 14px;
          line-height: 1.6;
          color: #475569;
        }

        /* Themes */
        .themes-section {
          padding-top: 4px;
        }

        .themes-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .themes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .theme-card {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 10px;
          padding: 12px 14px;
        }

        .theme-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .theme-name {
          font-size: 13.5px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 2px;
        }

        .theme-desc {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.45;
        }

        .text-explore-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: #1e40af;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .text-desc-grid,
          .themes-grid {
            grid-template-columns: 1fr;
          }

          .structure-classification {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};
