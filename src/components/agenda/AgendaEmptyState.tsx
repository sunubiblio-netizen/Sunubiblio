'use client';

import React from 'react';
import Link from 'next/link';

export const AgendaEmptyState: React.FC = () => {
  return (
    <div className="agenda-empty-state-root">
      <div className="empty-icon-wrap">
        <span className="empty-icon">📅</span>
      </div>

      <h3 className="empty-title">Votre agenda est vide</h3>
      <p className="empty-desc">
        Vos prochains cours et rendez-vous apparaîtront ici.
      </p>

      <Link href="/professeurs" className="empty-cta-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        Trouver un professeur
      </Link>

      <style jsx>{`
        .agenda-empty-state-root {
          padding: 64px 20px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(226, 232, 240, 0.85);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          box-shadow: 0 4px 24px rgba(15, 23, 42, 0.03);
          margin: 16px 0;
        }

        .empty-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: rgba(79, 70, 229, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .empty-icon {
          font-size: 32px;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .empty-desc {
          font-size: 14.5px;
          color: #64748b;
          margin: 0;
          max-width: 340px;
          line-height: 1.5;
        }

        .empty-cta-btn {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(79, 70, 229, 0.35);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .empty-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(79, 70, 229, 0.45);
        }
      `}</style>
    </div>
  );
};
