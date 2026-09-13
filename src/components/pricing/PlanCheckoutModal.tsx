'use client';

import React, { useState } from 'react';
import { PricingPlan } from '@/types/pricing';

interface PlanCheckoutModalProps {
  plan: PricingPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PlanCheckoutModal: React.FC<PlanCheckoutModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'om' | 'card'>('wave');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !plan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulated secure server transaction handshake
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
    }, 1200);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Fermer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {isSuccess ? (
          <div className="modal-success-state">
            <div className="success-icon-badge">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="success-title">Souscription initiée !</h3>
            <p className="success-desc">
              {plan.price === 0
                ? 'Bienvenue sur la formule Gratuit. Vous avez désormais accès aux ressources d’initiation.'
                : `Votre demande pour la formule ${plan.name} (${plan.formattedPrice}) a bien été enregistrée. Une confirmation vous sera transmise sur votre numéro.`}
            </p>
            <button
              type="button"
              className="btn-primary success-btn"
              onClick={handleReset}
            >
              Accéder à mes ressources
            </button>
          </div>
        ) : (
          <div className="modal-form-state">
            {/* Header */}
            <div className="modal-header">
              <div className="plan-badge-mini">
                Formule sélectionnée : <strong>{plan.name}</strong>
              </div>
              <h3 className="modal-title">Finaliser votre abonnement</h3>
              <p className="modal-subtitle">
                {plan.price === 0
                  ? 'Activez immédiatement votre accès gratuit à la bibliothèque.'
                  : 'Réglez en toute sécurité via Wave, Orange Money ou Carte.'}
              </p>
            </div>

            {/* Plan Recap Card */}
            <div className="plan-recap-box">
              <div className="recap-left">
                <span className="recap-name">{plan.name}</span>
                <span className="recap-period">Abonnement sans engagement</span>
              </div>
              <div className="recap-right">
                <span className="recap-price">{plan.formattedPrice}</span>
                <span className="recap-sub">{plan.price === 0 ? 'Offert' : '/ mois'}</span>
              </div>
            </div>

            {plan.price > 0 ? (
              <form onSubmit={handleSubmit} className="checkout-form">
                {/* Method selector */}
                <div className="form-group">
                  <label className="group-label">Choisir votre moyen de règlement :</label>
                  <div className="payment-options-grid">
                    <button
                      type="button"
                      className={`payment-opt-btn ${selectedMethod === 'wave' ? 'opt-active' : ''}`}
                      onClick={() => setSelectedMethod('wave')}
                    >
                      <div className="opt-logo-wrap">
                        <img src="/images/payments/wave-logo.png" alt="Wave" className="opt-brand-img" />
                      </div>
                      <span className="opt-name">Wave</span>
                      <span className="opt-sub">QR ou Numéro</span>
                    </button>

                    <button
                      type="button"
                      className={`payment-opt-btn ${selectedMethod === 'om' ? 'opt-active' : ''}`}
                      onClick={() => setSelectedMethod('om')}
                    >
                      <div className="opt-logo-wrap">
                        <img src="/images/payments/orange-money-logo.png" alt="Orange Money" className="opt-brand-img" />
                      </div>
                      <span className="opt-name">Orange Money</span>
                      <span className="opt-sub">Code secret</span>
                    </button>

                    <button
                      type="button"
                      className={`payment-opt-btn ${selectedMethod === 'card' ? 'opt-active' : ''}`}
                      onClick={() => setSelectedMethod('card')}
                    >
                      <div className="opt-logo-wrap opt-logo-card">
                        <img src="/images/payments/card-logo.png" alt="Carte bancaire Mastercard" className="opt-brand-img opt-brand-card" />
                      </div>
                      <span className="opt-name">Carte bancaire</span>
                      <span className="opt-sub">Visa / Mastercard</span>
                    </button>
                  </div>
                </div>

                {/* Phone or Card input */}
                {selectedMethod !== 'card' ? (
                  <div className="form-group">
                    <label className="group-label" htmlFor="phone-number">
                      Numéro de téléphone {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'} :
                    </label>
                    <div className="input-group">
                      <span className="input-prefix">+221</span>
                      <input
                        id="phone-number"
                        type="tel"
                        placeholder="77 000 00 00"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="phone-input"
                      />
                    </div>
                    <span className="input-hint">
                      Un prompt de confirmation s’ouvrira directement sur votre application {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'}.
                    </span>
                  </div>
                ) : (
                  <div className="card-mock-notice">
                    <img src="/images/payments/card-logo.png" alt="Mastercard" className="notice-card-logo" />
                    <span>Règlement par carte bancaire sécurisé (Mastercard, Visa) via protocole 3D Secure conforme PCI-DSS.</span>
                  </div>
                )}

                {/* Trust notice */}
                <div className="form-guarantee">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Paiement chiffré de bout en bout • Annulation en 1 clic</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary submit-pay-btn"
                >
                  {isProcessing ? (
                    <span>Connexion sécurisée en cours...</span>
                  ) : (
                    <>
                      <span>Confirmer le paiement de {plan.formattedPrice}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="free-activation-box">
                <p className="free-info">
                  Profitez d’un accès gratuit immédiat pour explorer les cours et tester vos connaissances avec nos QCM d’initiation.
                </p>
                <button
                  type="button"
                  className="btn-primary submit-pay-btn"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  <span>Activer mon accès gratuit</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        .modal-sheet {
          position: relative;
          background: #ffffff;
          border-radius: var(--radius-2xl);
          width: 100%;
          max-width: 520px;
          padding: 36px 32px;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
          border: 1px solid var(--border-card);
          animation: slideUp 0.25s var(--ease-spring);
        }

        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          background: var(--surface-subtle);
          transition: all 0.15s ease;
        }

        .modal-close-btn:hover {
          color: var(--text-heading);
          background: #f1f5f9;
        }

        .modal-header {
          margin-bottom: 24px;
        }

        .plan-badge-mini {
          display: inline-block;
          font-size: 12px;
          color: #4f46e5;
          background: #eef2ff;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          margin-bottom: 12px;
          font-weight: 600;
        }

        .modal-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }

        .modal-subtitle {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .plan-recap-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          margin-bottom: 24px;
        }

        .recap-left {
          display: flex;
          flex-direction: column;
        }

        .recap-name {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-heading);
        }

        .recap-period {
          font-size: 12px;
          color: var(--text-muted);
        }

        .recap-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .recap-price {
          font-size: 20px;
          font-weight: 800;
          color: #4f46e5;
        }

        .recap-sub {
          font-size: 11px;
          color: var(--text-faint);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .group-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-heading);
          margin-bottom: 8px;
        }

        .payment-options-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .payment-opt-btn {
          border: 1.5px solid var(--border-subtle);
          border-radius: var(--radius-md);
          background: #ffffff;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .payment-opt-btn.opt-active {
          border-color: #6366f1;
          background: #fdfcff;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }

        .opt-logo-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
        }

        .opt-logo-card {
          background: #ecfdf5;
          border-color: #a7f3d0;
        }

        .opt-brand-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .opt-brand-card {
          object-fit: contain;
          padding: 3px;
        }

        .notice-card-logo {
          width: 32px;
          height: 20px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .opt-name {
          font-size: 13px;
          font-weight: 800;
          color: var(--text-heading);
          margin-top: 2px;
        }

        .opt-sub {
          font-size: 10px;
          color: var(--text-muted);
        }

        .input-group {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #ffffff;
        }

        .input-group:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .input-prefix {
          padding: 10px 14px;
          background: #f8fafc;
          border-right: 1px solid var(--border-subtle);
          font-size: 14px;
          font-weight: 700;
          color: var(--text-muted);
        }

        .phone-input {
          flex: 1;
          padding: 10px 14px;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-heading);
        }

        .input-hint {
          display: block;
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 6px;
        }

        .card-mock-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ecfdf5;
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          font-size: 12.5px;
          color: #065f46;
          margin-bottom: 20px;
        }

        .form-guarantee {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 22px;
          justify-content: center;
        }

        .submit-pay-btn {
          width: 100%;
          padding: 13px 20px;
          font-size: 15px;
        }

        .free-info {
          font-size: 14px;
          color: var(--text-body);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        /* Success state */
        .modal-success-state {
          text-align: center;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .success-icon-badge {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #ecfdf5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .success-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 10px;
        }

        .success-desc {
          font-size: 14px;
          color: var(--text-body);
          line-height: 1.6;
          max-width: 400px;
          margin-bottom: 24px;
        }

        .success-btn {
          width: 100%;
          padding: 12px 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 520px) {
          .modal-sheet {
            padding: 28px 20px;
          }

          .payment-options-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
