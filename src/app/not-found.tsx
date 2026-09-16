import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
      background: '#faf8ff',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '40px 32px',
        maxWidth: '480px',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)',
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'rgba(79, 70, 229, 0.1)',
          color: '#4f46e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '24px',
          fontWeight: 800,
        }}>
          404
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
          Page introuvable
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 24px 0' }}>
          La page demandée n'existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#4f46e5',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
