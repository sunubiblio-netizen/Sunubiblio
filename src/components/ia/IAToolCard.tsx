'use client';

import React from 'react';
import Link from 'next/link';

export interface IATool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface IAToolCardProps {
  tool: IATool;
}

export const IAToolCard: React.FC<IAToolCardProps> = ({ tool }) => {
  return (
    <Link href={`/ia/${tool.id}`} className="ia-tool-card-link">
      <div className="ia-tool-card">
        <div className="icon-wrapper">
          {tool.icon}
        </div>
        <h3 className="tool-title">{tool.title}</h3>
        <p className="tool-description">{tool.description}</p>
        
        <div className="tool-action">
          <span>Ouvrir l'outil</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>

      <style jsx>{`
        .ia-tool-card-link {
          text-decoration: none;
          display: block;
          height: 100%;
        }

        .ia-tool-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 20px;
          padding: 28px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        .ia-tool-card:hover {
          border-color: #6366f1;
          box-shadow: 0 12px 30px -8px rgba(99, 102, 241, 0.15);
          transform: translateY(-4px);
        }

        .ia-tool-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #4f46e5, #9333ea);
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .ia-tool-card:hover::after {
          opacity: 1;
        }

        .icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          transition: all 0.2s ease;
        }

        .ia-tool-card:hover .icon-wrapper {
          background: #4f46e5;
          color: #ffffff;
        }

        .tool-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px 0;
        }

        .tool-description {
          font-size: 14.5px;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 24px 0;
          flex-grow: 1;
        }

        .tool-action {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6366f1;
          font-size: 13.5px;
          font-weight: 700;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.2s ease;
        }

        .ia-tool-card:hover .tool-action {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
    </Link>
  );
};
