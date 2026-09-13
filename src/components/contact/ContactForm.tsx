'use client';

import React, { useState, useEffect } from 'react';
import { CONTACT_CATEGORIES, CONTACT_INFO } from '@/data/contactData';
import { ContactCategory, ContactFormData, ContactApiResponse } from '@/types/contact';
import { ContactSuccess, ContactErrorBanner } from './ContactFeedback';
import { CategorySelect } from './CategorySelect';

interface ContactFormProps {
  preselectedCategory?: ContactCategory;
}

export const ContactForm: React.FC<ContactFormProps> = ({ preselectedCategory }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    category: preselectedCategory || 'Question générale',
    message: '',
    honeypot: '',
  });

  // Keep category in sync if prop changes
  useEffect(() => {
    if (preselectedCategory) {
      setFormData((prev) => ({ ...prev, category: preselectedCategory }));
    }
  }, [preselectedCategory]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const validateClient = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Veuillez renseigner votre nom.';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Veuillez entrer une adresse email valide.';
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      errs.subject = 'Veuillez renseigner un sujet.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Votre message est trop court (minimum 10 caractères).';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!validateClient()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ContactApiResponse = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
      } else {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setGlobalError(data.message || 'Impossible d’envoyer votre message. Veuillez réessayer.');
      }
    } catch {
      setGlobalError('Erreur de connexion. Veuillez vérifier votre réseau et réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: 'Question générale',
      message: '',
      honeypot: '',
    });
    setFieldErrors({});
    setGlobalError(null);
  };

  return (
    <section className="contact-form-section" id="formulaire">
      <div className="container">
        <div className="form-section-header">
          <div className="badge-pill form-badge">
            <span className="badge-dot" />
            <span>Formulaire de Contact</span>
          </div>

          <h2 className="form-section-title">
            Envoyez-nous un <span className="gradient-hero-text">message</span>
          </h2>

          <p className="form-section-subtitle">
            Remplissez le formulaire ci-dessous. Notre équipe traitera votre demande avec soin.
          </p>
        </div>

        {isSuccess ? (
          <ContactSuccess onReset={handleReset} />
        ) : (
          <div className="form-layout-grid">
            {/* Left: Interactive Form */}
            <div className="form-card-wrapper">
              {globalError && (
                <ContactErrorBanner
                  message={globalError}
                  onRetry={() => setGlobalError(null)}
                />
              )}

              <form onSubmit={handleSubmit} noValidate className="main-contact-form">
                {/* Honeypot field (hidden from humans, catches automated spam bots) */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input
                    type="text"
                    name="phone_hp"
                    tabIndex={-1}
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  {/* Name field */}
                  <div className="form-group">
                    <label htmlFor="contact-name" className="field-label">
                      Nom complet <span className="req-star">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      className={`form-input ${fieldErrors.name ? 'input-error' : ''}`}
                      placeholder="Ex : Aminata Diallo"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                      }}
                      required
                    />
                    {fieldErrors.name && (
                      <span className="error-hint" role="alert">{fieldErrors.name}</span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="form-group">
                    <label htmlFor="contact-email" className="field-label">
                      Adresse email <span className="req-star">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
                      placeholder="Ex : aminata@exemple.sn"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                      }}
                      required
                    />
                    {fieldErrors.email && (
                      <span className="error-hint" role="alert">{fieldErrors.email}</span>
                    )}
                  </div>
                </div>

                <div className="form-row-2">
                  {/* Category custom select */}
                  <div className="form-group category-form-group">
                    <label htmlFor="contact-category" className="field-label">
                      Catégorie de la demande <span className="req-star">*</span>
                    </label>
                    <CategorySelect
                      id="contact-category"
                      value={formData.category}
                      onChange={(cat) => setFormData({ ...formData, category: cat })}
                    />
                  </div>

                  {/* Subject field */}
                  <div className="form-group">
                    <label htmlFor="contact-subject" className="field-label">
                      Sujet <span className="req-star">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      className={`form-input ${fieldErrors.subject ? 'input-error' : ''}`}
                      placeholder="Ex : Question sur l’accès aux annales FASTEF"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (fieldErrors.subject) setFieldErrors({ ...fieldErrors, subject: '' });
                      }}
                      required
                    />
                    {fieldErrors.subject && (
                      <span className="error-hint" role="alert">{fieldErrors.subject}</span>
                    )}
                  </div>
                </div>

                {/* Message textarea */}
                <div className="form-group">
                  <div className="textarea-header">
                    <label htmlFor="contact-message" className="field-label">
                      Votre message <span className="req-star">*</span>
                    </label>
                    <span className="char-count">{formData.message.length} / 3000</span>
                  </div>
                  <textarea
                    id="contact-message"
                    rows={6}
                    className={`form-textarea ${fieldErrors.message ? 'input-error' : ''}`}
                    placeholder="Décrivez votre question, suggestion ou problème de manière détaillée..."
                    value={formData.message}
                    maxLength={3000}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' });
                    }}
                    required
                  />
                  {fieldErrors.message && (
                    <span className="error-hint" role="alert">{fieldErrors.message}</span>
                  )}
                </div>

                {/* Submit button */}
                <div className="form-action-row">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary form-submit-btn"
                  >
                    {isSubmitting ? (
                      <span>Envoi en cours...</span>
                    ) : (
                      <>
                        <span>Envoyer le message</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </>
                    )}
                  </button>
                  <span className="privacy-reassurance">
                    Vos coordonnées restent strictement confidentielles.
                  </span>
                </div>
              </form>
            </div>

            {/* Right: Helpful Info / Reassurance Sidebar */}
            <div className="form-info-sidebar">
              <div className="sidebar-card">
                <h3 className="sb-title">Conseils pour une réponse rapide</h3>
                <ul className="sb-tips-list">
                  <li className="sb-tip">
                    <span className="tip-bullet">✓</span>
                    <span><strong>Précisez le contexte</strong> : mentionnez le concours ou la classe concernée.</span>
                  </li>
                  <li className="sb-tip">
                    <span className="tip-bullet">✓</span>
                    <span><strong>Paiement</strong> : indiquez votre numéro Wave ou Orange Money en cas de doute.</span>
                  </li>
                  <li className="sb-tip">
                    <span className="tip-bullet">✓</span>
                    <span><strong>Ressource</strong> : mentionnez le titre exact du livre ou de l’annale.</span>
                  </li>
                </ul>

                <div className="sb-divider" />

                <div className="sb-direct-channel">
                  <span className="direct-tag">Besoin d’échanger immédiatement ?</span>
                  <p className="direct-phone">{CONTACT_INFO.phone}</p>
                  <p className="direct-email">{CONTACT_INFO.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .contact-form-section {
          padding: 30px 0 60px 0;
          position: relative;
        }

        .form-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 40px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .form-badge {
          margin-bottom: 14px;
        }

        .form-section-title {
          font-size: clamp(26px, 3.2vw, 36px);
          font-weight: 800;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 12px;
        }

        .form-section-subtitle {
          font-size: clamp(14px, 1.8vw, 16px);
          color: var(--text-body);
          line-height: 1.6;
        }

        .form-layout-grid {
          display: grid;
          grid-template-columns: 1.35fr 0.65fr;
          gap: 32px;
          align-items: flex-start;
        }

        .form-card-wrapper {
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-2xl);
          padding: 40px 36px;
          box-shadow: var(--shadow-card);
        }

        .main-contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-heading);
        }

        .req-star {
          color: #ef4444;
          font-weight: 800;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid var(--border-subtle);
          border-radius: var(--radius-md);
          font-size: 14px;
          color: var(--text-heading);
          background: #ffffff;
          transition: all 0.2s ease;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
          outline: none;
        }

        .input-error {
          border-color: #ef4444 !important;
          background: #fef2f2;
        }

        .error-hint {
          font-size: 12px;
          font-weight: 600;
          color: #dc2626;
          margin-top: 2px;
        }

        .category-form-group {
          position: relative;
          z-index: 20;
        }

        .textarea-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .char-count {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.5;
        }

        .form-action-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 8px;
        }

        .form-submit-btn {
          padding: 13px 26px;
          font-size: 15px;
          box-shadow: 0 4px 18px rgba(99, 102, 241, 0.35);
        }

        .privacy-reassurance {
          font-size: 12px;
          color: var(--text-muted);
        }

        /* Sidebar */
        .form-info-sidebar {
          position: sticky;
          top: 100px;
        }

        .sidebar-card {
          background: linear-gradient(180deg, #f8fafc 0%, #faf8ff 100%);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-2xl);
          padding: 32px 26px;
          box-shadow: var(--shadow-xs);
        }

        .sb-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 18px;
          letter-spacing: -0.01em;
        }

        .sb-tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sb-tip {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: var(--text-body);
          line-height: 1.55;
        }

        .tip-bullet {
          color: #10b981;
          font-weight: 800;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .sb-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 24px 0 20px 0;
        }

        .direct-tag {
          display: block;
          font-size: 11.5px;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }

        .direct-phone {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 2px;
        }

        .direct-email {
          font-size: 13.5px;
          color: var(--text-muted);
          word-break: break-all;
        }

        @media (max-width: 960px) {
          .form-layout-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .form-card-wrapper {
            padding: 28px 20px;
          }

          .form-row-2 {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .form-action-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .form-submit-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};
