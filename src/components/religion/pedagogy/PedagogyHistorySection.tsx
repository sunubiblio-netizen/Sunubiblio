'use client';

import React from 'react';
import { ReligionHistoryEvent } from '@/types/religion';

interface PedagogyHistorySectionProps {
  milestones: ReligionHistoryEvent[];
  accentColor: string;
  hideHeader?: boolean;
}

export const PedagogyHistorySection: React.FC<PedagogyHistorySectionProps> = ({
  milestones,
  accentColor,
  hideHeader = false,
}) => {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="pedagogy-section-inner">
      {!hideHeader && (
        <div className="section-head">
          <div className="section-num-badge" style={{ backgroundColor: accentColor }}>5</div>
          <div>
            <h2 className="section-title">Histoire & Rayonnement</h2>
            <p className="section-subtitle">
              Grandes époques historiques, essor des civilisations et diffusion géographique.
            </p>
          </div>
        </div>
      )}

      <div className="milestones-grid">
        {milestones.map((m, idx) => (
          <div key={idx} className="milestone-card">
            <div className="milestone-header">
              <span className="milestone-period" style={{ color: accentColor }}>{m.period}</span>
              <span className="milestone-geo">{m.geography}</span>
            </div>
            <h3 className="milestone-title">{m.title}</h3>
            <p className="milestone-desc">{m.description}</p>
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

        .milestones-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .milestone-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 16px;
          padding: 22px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .milestone-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .milestone-period {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .milestone-geo {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .milestone-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .milestone-desc {
          font-size: 13.5px;
          line-height: 1.55;
          color: #475569;
        }

        @media (max-width: 768px) {
          .milestones-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
