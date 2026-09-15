'use client';

import React from 'react';
import { ReligionKeyFigure } from '@/types/religion';

interface PedagogyKeyFigureSectionProps {
  figures: ReligionKeyFigure[];
  accentColor: string;
  hideHeader?: boolean;
}

export const PedagogyKeyFigureSection: React.FC<PedagogyKeyFigureSectionProps> = ({
  figures,
  accentColor,
  hideHeader = false,
}) => {
  if (!figures || figures.length === 0) return null;

  const mainFigure = figures[0];
  const secondaryFigures = figures.slice(1);

  return (
    <div className="pedagogy-section-inner">
      {!hideHeader && (
        <div className="section-head">
          <div className="section-num-badge" style={{ backgroundColor: accentColor }}>2</div>
          <div>
            <h2 className="section-title">Figure Majeure : {mainFigure.name}</h2>
            <p className="section-subtitle">{mainFigure.title} — Rôle, mission prophétique et jalons biographiques.</p>
          </div>
        </div>
      )}

      {/* Main Profile Hero Card */}
      <div className="figure-main-card">
        <div className="figure-header-banner">
          <div className="figure-role-pill">
            <span>{mainFigure.role}</span>
          </div>
          <span className="figure-period-badge">{mainFigure.period}</span>
        </div>

        <div className="figure-body">
          <div className="figure-body-top">
            <div className="figure-mission-box">
              <h3 className="sub-box-title">Mission et message central</h3>
              <p className="sub-box-text">{mainFigure.mission}</p>
            </div>
            <div className="figure-importance-box">
              <h3 className="sub-box-title">Importance dans la tradition</h3>
              <p className="sub-box-text">{mainFigure.importance}</p>
            </div>
          </div>

          {/* Timeline of Historical Life Steps */}
          {mainFigure.historicalSteps && mainFigure.historicalSteps.length > 0 && (
            <div className="timeline-container">
              <h3 className="timeline-heading">Grandes étapes historiques et biographiques</h3>
              <div className="timeline-steps">
                {mainFigure.historicalSteps.map((step, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-marker">
                      <span className="marker-dot" style={{ backgroundColor: accentColor }} />
                      <span className="marker-line" />
                    </div>
                    <div className="timeline-content">
                      <span className="step-period" style={{ color: accentColor }}>{step.period}</span>
                      <h4 className="step-title">{step.title}</h4>
                      <p className="step-desc">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teachings Highlight */}
          {mainFigure.teachingsHighlight && mainFigure.teachingsHighlight.length > 0 && (
            <div className="teachings-highlight-box">
              <h3 className="teachings-heading">Enseignements et Paroles Mémorables</h3>
              <div className="teachings-grid">
                {mainFigure.teachingsHighlight.map((teaching, idx) => (
                  <div key={idx} className="teaching-quote-card">
                    <span className="quote-mark">“</span>
                    <p className="teaching-text">{teaching}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Figures (e.g. Califes, Apôtres, etc.) */}
      {secondaryFigures.length > 0 && (
        <div className="secondary-figures-wrap">
          <h3 className="secondary-figures-title">Autres Figures et Successeurs Emblématiques</h3>
          <div className="secondary-figures-grid">
            {secondaryFigures.map((fig, idx) => (
              <div key={idx} className="secondary-fig-card">
                <div className="sec-top">
                  <h4 className="sec-fig-name">{fig.name}</h4>
                  <span className="sec-fig-period">{fig.period}</span>
                </div>
                <p className="sec-fig-role">{fig.title}</p>
                <p className="sec-fig-desc">{fig.importance}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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

        .figure-main-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        }

        .figure-header-banner {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .figure-role-pill {
          background: #eef2ff;
          color: #4338ca;
          font-size: 12.5px;
          font-weight: 700;
          padding: 5px 14px;
          border-radius: 9999px;
        }

        .figure-period-badge {
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
        }

        .figure-body {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .figure-body-top {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .figure-mission-box,
        .figure-importance-box {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 14px;
          padding: 20px;
        }

        .sub-box-title {
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .sub-box-text {
          font-size: 14px;
          line-height: 1.6;
          color: #475569;
        }

        /* Timeline */
        .timeline-container {
          padding-top: 10px;
        }

        .timeline-heading {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 20px;
        }

        .timeline-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }

        .timeline-item {
          display: flex;
          gap: 18px;
          position: relative;
          padding-bottom: 24px;
        }

        .timeline-item:last-child {
          padding-bottom: 0;
        }

        .timeline-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 16px;
          flex-shrink: 0;
        }

        .marker-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.25);
          margin-top: 4px;
          z-index: 1;
        }

        .marker-line {
          flex: 1;
          width: 2px;
          background: #e2e8f0;
          margin-top: 4px;
        }

        .timeline-item:last-child .marker-line {
          display: none;
        }

        .timeline-content {
          flex: 1;
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 12px 18px;
        }

        .step-period {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .step-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 4px 0 6px 0;
        }

        .step-desc {
          font-size: 13.5px;
          line-height: 1.55;
          color: #475569;
        }

        /* Teachings */
        .teachings-highlight-box {
          background: linear-gradient(135deg, #faf5ff 0%, #f0fdf4 100%);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 24px;
        }

        .teachings-heading {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .teachings-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .teaching-quote-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 12px;
          padding: 16px 18px;
          position: relative;
        }

        .quote-mark {
          font-size: 26px;
          font-family: serif;
          color: #6366f1;
          line-height: 1;
          display: block;
          margin-bottom: 4px;
        }

        .teaching-text {
          font-size: 13.5px;
          font-style: italic;
          color: #1e293b;
          line-height: 1.5;
        }

        /* Secondary figures */
        .secondary-figures-wrap {
          margin-top: 32px;
        }

        .secondary-figures-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .secondary-figures-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .secondary-fig-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px;
        }

        .sec-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }

        .sec-fig-name {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .sec-fig-period {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        .sec-fig-role {
          font-size: 13px;
          font-weight: 600;
          color: #4f46e5;
          margin-bottom: 6px;
        }

        .sec-fig-desc {
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .figure-body-top,
          .teachings-grid,
          .secondary-figures-grid {
            grid-template-columns: 1fr;
          }

          .figure-body {
            padding: 18px;
          }
        }
      `}</style>
    </div>
  );
};
