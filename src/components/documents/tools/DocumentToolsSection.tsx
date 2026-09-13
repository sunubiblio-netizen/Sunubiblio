'use client';

import React, { useState, useEffect } from 'react';
import { DocumentToolsTab, UserProcessedDocument } from '@/types/documentTools';
import { 
  getRecommendedPlan, 
  getRecommendedPriceLabel, 
  canAccessAdvancedDocumentTools,
  UserPlanSlug 
} from '@/services/subscriptionAccessService';
import { documentToolsService } from '@/services/documentToolsService';
import { PlanCheckoutModal } from '@/components/pricing/PlanCheckoutModal';
import { PricingPlan } from '@/types/pricing';
import { DocumentVerificationTool } from './DocumentVerificationTool';
import { WordToPdfTool } from './WordToPdfTool';
import { PdfModifierTool } from './PdfModifierTool';
import { MyProcessedDocuments } from './MyProcessedDocuments';

interface DocumentToolsSectionProps {
  userRole?: UserPlanSlug;
  initialTab?: DocumentToolsTab;
}

export const DocumentToolsSection: React.FC<DocumentToolsSectionProps> = ({
  userRole: initialUserRole = 'gratuit',
  initialTab = 'verify',
}) => {
  const [activeTab, setActiveTab] = useState<DocumentToolsTab>(initialTab);
  // Simulatation de rôle dynamique pour test immédiat par l'utilisateur
  const [currentRole, setCurrentRole] = useState<UserPlanSlug>(initialUserRole);
  const [processedDocs, setProcessedDocs] = useState<UserProcessedDocument[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlan | null>(null);

  const recommendedPriceLabel = getRecommendedPriceLabel();
  const hasAdvancedAccess = canAccessAdvancedDocumentTools(currentRole);

  const refreshDocuments = () => {
    const docs = documentToolsService.getUserProcessedDocuments();
    setProcessedDocs(docs);
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  const handleOpenCheckout = () => {
    const plan = getRecommendedPlan();
    setCheckoutPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setCurrentRole('recommande');
    setIsCheckoutOpen(false);
  };

  const handleDocumentSaved = () => {
    refreshDocuments();
  };

  return (
    <section className="doc-tools-section" id="outils-documents">
      <div className="doc-tools-container">
        {/* Header de la section */}
        <div className="doc-tools-header">
          <div className="doc-tools-title-group">
            <span className="doc-tools-badge">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Suite bureautique & académique Sunubiblio
            </span>
            <h2 className="doc-tools-title">Outils pour vos documents</h2>
            <p className="doc-tools-subtitle">
              Ne vous limitez pas à consulter : créez, vérifiez, convertissez et personnalisez vos thèses, mémoires, rapports et documents professionnels en toute confidentialité.
            </p>
          </div>
        </div>

        {/* 4 Cartes / Onglets d'outils */}
        <div className="doc-tools-nav-grid">
          <button
            type="button"
            className={`doc-tool-nav-card ${activeTab === 'verify' ? 'active' : ''}`}
            onClick={() => setActiveTab('verify')}
          >
            <div className="nav-card-icon verify">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div className="nav-card-body">
              <span className="nav-card-title">Vérifier mon document</span>
              <span className="nav-card-desc">Analyse d&apos;assistance IA éthique, cohérence, style et clarté</span>
            </div>
            <span className="nav-card-tag tag-free">Inclus</span>
          </button>

          <button
            type="button"
            className={`doc-tool-nav-card ${activeTab === 'convert' ? 'active' : ''}`}
            onClick={() => setActiveTab('convert')}
          >
            <div className="nav-card-icon convert">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <div className="nav-card-body">
              <span className="nav-card-title">Word → PDF</span>
              <span className="nav-card-desc">Convertir vos .docx et .doc en PDF fidèle et sécurisé</span>
            </div>
            <span className="nav-card-tag tag-free">Inclus</span>
          </button>

          <button
            type="button"
            className={`doc-tool-nav-card ${activeTab === 'pdf-edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('pdf-edit')}
          >
            <div className="nav-card-icon modify">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div className="nav-card-body">
              <span className="nav-card-title">Modifier un PDF</span>
              <span className="nav-card-desc">Annotations, texte, visa, rotation et suppression de pages</span>
            </div>
            <span className="nav-card-tag tag-free">Inclus</span>
          </button>

          <button
            type="button"
            className={`doc-tool-nav-card ${activeTab === 'my-documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-documents')}
          >
            <div className="nav-card-icon storage">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="nav-card-body">
              <span className="nav-card-title">Mes documents</span>
              <span className="nav-card-desc">Retrouvez vos fichiers traités, convertis et annotations</span>
            </div>
            <span className="nav-card-counter">{processedDocs.length}</span>
          </button>
        </div>

        {/* Vue active de l'outil sélectionné */}
        <div className="doc-tools-workbench">
          {activeTab === 'verify' && (
            <DocumentVerificationTool 
              onAnalysisSaved={handleDocumentSaved}
            />
          )}

          {activeTab === 'convert' && (
            <WordToPdfTool 
              onDocumentCreated={handleDocumentSaved}
            />
          )}

          {activeTab === 'pdf-edit' && (
            <PdfModifierTool
              userPlanSlug="recommande"
              onOpenUpgradeModal={handleOpenCheckout}
              onDocumentCreated={handleDocumentSaved}
            />
          )}

          {activeTab === 'my-documents' && (
            <MyProcessedDocuments
              refreshTrigger={processedDocs.length}
            />
          )}
        </div>
      </div>

      {/* Modal de paiement sécurisé pour passer au forfait recommandé */}
      {isCheckoutOpen && checkoutPlan && (
        <PlanCheckoutModal
          plan={checkoutPlan}
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </section>
  );
};
