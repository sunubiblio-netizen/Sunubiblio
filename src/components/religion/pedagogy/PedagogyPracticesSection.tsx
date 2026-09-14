'use client';

import React from 'react';
import { ReligionPractice } from '@/types/religion';

interface PedagogyPracticesSectionProps {
  practices: ReligionPractice[];
  accentColor: string;
}

export const PedagogyPracticesSection: React.FC<PedagogyPracticesSectionProps> = ({
  practices,
  accentColor,
}) => {
  if (!practices || practices.length === 0) return null;

  return (
    <section className="pedagogy-section" id="pratiques">
      <div className="section-head">
        <div className="section-num-badge" style={{ backgroundColor: accentColor }}>4</div>
        <div>
          <h2 className="section-title">Pratiques & Spiritualité</h2>
          <p className="section-subtitle">
            Piliers d&apos;action, rituels quotidiens et dimension intérieure de purification.
          </p>
        </div>
      </div>

      <div className="practices-grid">
        {practices.map((item, idx) => (
          <div key={idx} className="practice-card">
            <div className="practice-top">
              <span className={`practice-cat-pill ${item.category}`}>
                {item.category === 'pilier'
                  ? 'Pilier Fondamental'
                  : item.category === 'spiritualite'
                  ? 'Dimension Spirituelle'
                  : item.category === 'rituel'
                  ? 'Rituel'
                  : 'Éthique'}
              </span>
              {item.frequency && (
                <span className="practice-freq">{item.frequency}</span>
              )}
            </div>

            <h3 className="practice-title">{item.title}</h3>
            <p className="practice-desc">{item.description}</p>

            <div className="practice-spiritual-meaning">
              <span className="meaning-label">Portée spirituelle :</span>
              <p className="meaning-text">{item.spiritualMeaning}</p>
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

        .practices-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .practice-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .practice-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
        }

        .practice-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .practice-cat-pill {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .practice-cat-pill.pilier {
          background: #ecfdf5;
          color: #059669;
        }

        .practice-cat-pill.spiritualite {
          background: #fdf4ff;
          color: #a855f7;
        }

        .practice-cat-pill.rituel {
          background: #eff6ff;
          color: #2563eb;
        }

        .practice-cat-pill.ethique {
          background: #fffbeb;
          color: #d97706;
        }

        .practice-freq {
          font-size: 11.5px;
          font-weight: 600;
          color: #64748b;
        }

        .practice-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .practice-desc {
          font-size: 13.5px;
          line-height: 1.55;
          color: #475569;
        }

        .practice-spiritual-meaning {
          margin-top: auto;
          background: #f8fafc;
          border-radius: 10px;
          padding: 10px 12px;
        }

        .meaning-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #6366f1;
          margin-bottom: 2px;
        }

        .meaning-text {
          font-size: 12.5px;
          color: #334155;
          line-height: 1.45;
          font-style: italic;
        }

        @media (max-width: 990px) {
          .practices-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .practices-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};
