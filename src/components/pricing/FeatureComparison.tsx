'use client';

import React, { useState } from 'react';
import { COMPARISON_CATEGORIES, PRICING_PLANS } from '@/data/pricingPlans';
import { PricingPlan } from '@/types/pricing';

interface FeatureComparisonProps {
  onSelectPlan?: (plan: PricingPlan) => void;
}

export const FeatureComparison: React.FC<FeatureComparisonProps> = ({ onSelectPlan }) => {
  // Mobile accordion open states: default all open or first 2 open
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Bibliothèque & Documentation': true,
    'Concours & Examens Nationaux': true,
    'Exercices, QCM & Entraînement': true,
    'Téléchargements & Mobilité': true,
    'Intelligence Artificielle & Outils': true,
    'Compte, Favoris & Support': true,
  });

  const toggleCategory = (title: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const renderValue = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span className="icon-check" aria-label="Inclus">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.8">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      ) : (
        <span className="icon-dash" aria-label="Non inclus">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      );
    }
    return <span className="cell-text">{val}</span>;
  };

  return (
    <section className="comparison-section" id="comparatif">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill section-badge">
            <span className="badge-dot" />
            <span>Transparence & Détails</span>
          </div>
          <h2 className="section-title">
            Comparatif complet des <span className="gradient-hero-text">fonctionnalités</span>
          </h2>
          <p className="section-subtitle">
            Comparez en un coup d’œil toutes les options incluses dans nos 4 formules pour faire le meilleur choix d’apprentissage.
          </p>
        </div>

        {/* ================= DESKTOP TABLE VIEW ================= */}
        <div className="comparison-table-wrapper desktop-only-table">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="th-feature">Fonctionnalités & Privilèges</th>
                <th className="th-plan">
                  <div className="th-plan-box">
                    <span className="th-plan-name">Gratuit</span>
                    <span className="th-plan-price">0 FCFA</span>
                  </div>
                </th>
                <th className="th-plan">
                  <div className="th-plan-box">
                    <span className="th-plan-name">Simple</span>
                    <span className="th-plan-price">3 000 FCFA</span>
                  </div>
                </th>
                <th className="th-plan th-plan-recommande">
                  <div className="th-plan-box">
                    <span className="badge-rec-mini">RECOMMANDÉ</span>
                    <span className="th-plan-name text-primary">5 000 FCFA</span>
                    <span className="th-plan-price">5 000 FCFA</span>
                  </div>
                </th>
                <th className="th-plan">
                  <div className="th-plan-box">
                    <span className="th-plan-name">Gold</span>
                    <span className="th-plan-price">9 000 FCFA</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_CATEGORIES.map((category) => (
                <React.Fragment key={category.title}>
                  <tr className="category-header-row">
                    <td colSpan={5} className="category-header-cell">
                      <div className="category-title-inner">
                        <span className="category-marker" />
                        <span>{category.title}</span>
                      </div>
                    </td>
                  </tr>
                  {category.rows.map((row, idx) => (
                    <tr key={idx} className="feature-row">
                      <td className="td-feature-name">
                        <span className="feature-title">{row.name}</span>
                      </td>
                      <td className="td-val td-gratuit">{renderValue(row.gratuit)}</td>
                      <td className="td-val td-simple">{renderValue(row.simple)}</td>
                      <td className="td-val td-recommande">{renderValue(row.recommande)}</td>
                      <td className="td-val td-gold">{renderValue(row.gold)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE ACCORDION VIEW ================= */}
        <div className="mobile-accordion-wrapper mobile-only-accordion">
          {COMPARISON_CATEGORIES.map((category) => {
            const isOpen = !!openCategories[category.title];
            return (
              <div key={category.title} className="mobile-cat-card">
                <button
                  type="button"
                  className="mobile-cat-header"
                  onClick={() => toggleCategory(category.title)}
                  aria-expanded={isOpen}
                >
                  <div className="mobile-cat-title">
                    <span className="cat-dot" />
                    <span>{category.title}</span>
                  </div>
                  <div className={`chevron-icon ${isOpen ? 'open' : ''}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="mobile-cat-body">
                    {category.rows.map((row, idx) => (
                      <div key={idx} className="mobile-feature-item">
                        <div className="mobile-feature-header">
                          <span className="mobile-feature-name">{row.name}</span>
                        </div>
                        <div className="mobile-plans-grid">
                          <div className="mobile-plan-cell">
                            <span className="mp-label">Gratuit</span>
                            <div className="mp-val">{renderValue(row.gratuit)}</div>
                          </div>
                          <div className="mobile-plan-cell">
                            <span className="mp-label">Simple (3 000)</span>
                            <div className="mp-val">{renderValue(row.simple)}</div>
                          </div>
                          <div className="mobile-plan-cell mp-rec">
                            <span className="mp-label-rec">5 000 FCFA ★</span>
                            <div className="mp-val">{renderValue(row.recommande)}</div>
                          </div>
                          <div className="mobile-plan-cell">
                            <span className="mp-label">Gold (9 000)</span>
                            <div className="mp-val">{renderValue(row.gold)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .comparison-section {
          padding: 60px 0 70px 0;
          position: relative;
        }

        .section-header {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 40px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .section-badge {
          margin-bottom: 16px;
        }

        .section-title {
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 12px;
        }

        .section-subtitle {
          font-size: clamp(14px, 1.8vw, 16px);
          color: var(--text-body);
          line-height: 1.6;
        }

        /* Desktop Table */
        .desktop-only-table {
          display: block;
        }

        .mobile-only-accordion {
          display: none;
        }

        .comparison-table-wrapper {
          background: #ffffff;
          border-radius: var(--radius-2xl);
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .comparison-table th {
          padding: 20px 16px;
          background: #f8fafc;
          border-bottom: 2px solid var(--border-subtle);
          vertical-align: middle;
        }

        .th-feature {
          width: 36%;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding-left: 28px !important;
        }

        .th-plan {
          width: 16%;
          text-align: center;
        }

        .th-plan-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .th-plan-name {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-heading);
        }

        .th-plan-price {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .th-plan-recommande {
          background: rgba(99, 102, 241, 0.05);
          position: relative;
        }

        .badge-rec-mini {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #ffffff;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          padding: 3px 8px;
          border-radius: var(--radius-full);
          margin-bottom: 2px;
        }

        .category-header-row {
          background: #faf8ff;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }

        .category-header-cell {
          padding: 14px 28px;
        }

        .category-title-inner {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 800;
          color: #4338ca;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .category-marker {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6366f1;
        }

        .feature-row {
          border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          transition: background 0.15s ease;
        }

        .feature-row:hover {
          background: #fdfcff;
        }

        .td-feature-name {
          padding: 16px 20px 16px 28px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-heading);
        }

        .td-val {
          padding: 16px 12px;
          text-align: center;
          vertical-align: middle;
        }

        .td-recommande {
          background: rgba(99, 102, 241, 0.02);
        }

        .icon-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          background: #ecfdf5;
          border-radius: 50%;
        }

        .icon-dash {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .cell-text {
          display: inline-block;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-heading);
          background: var(--surface-subtle);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
        }

        .td-recommande .cell-text {
          background: #eef2ff;
          color: #4f46e5;
          font-weight: 700;
        }

        /* Mobile Accordion Styles */
        @media (max-width: 860px) {
          .desktop-only-table {
            display: none !important;
          }

          .mobile-only-accordion {
            display: flex !important;
            flex-direction: column;
            gap: 16px;
          }

          .mobile-cat-card {
            background: #ffffff;
            border-radius: var(--radius-xl);
            border: 1px solid var(--border-card);
            box-shadow: var(--shadow-sm);
            overflow: hidden;
          }

          .mobile-cat-header {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            background: #f8fafc;
            border-bottom: 1px solid var(--border-subtle);
            font-size: 14.5px;
            font-weight: 800;
            color: var(--text-heading);
            cursor: pointer;
            text-align: left;
          }

          .mobile-cat-title {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .cat-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #6366f1;
            flex-shrink: 0;
          }

          .chevron-icon {
            transition: transform 0.25s ease;
            color: var(--text-muted);
          }

          .chevron-icon.open {
            transform: rotate(180deg);
          }

          .mobile-cat-body {
            padding: 12px 16px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .mobile-feature-item {
            padding: 14px 12px;
            border-radius: var(--radius-md);
            background: #faf8ff;
            border: 1px solid rgba(226, 232, 240, 0.7);
          }

          .mobile-feature-header {
            margin-bottom: 10px;
          }

          .mobile-feature-name {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-heading);
          }

          .mobile-plans-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }

          .mobile-plan-cell {
            background: #ffffff;
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-sm);
            padding: 8px 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 4px;
          }

          .mobile-plan-cell.mp-rec {
            background: #fdfcff;
            border: 1.5px solid #6366f1;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
          }

          .mp-label {
            font-size: 11px;
            font-weight: 700;
            color: var(--text-muted);
          }

          .mp-label-rec {
            font-size: 11px;
            font-weight: 800;
            color: #4f46e5;
          }

          .mp-val {
            font-size: 12px;
            font-weight: 600;
          }
        }
      `}</style>
    </section>
  );
};
