'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AntiplagiatUploadZone } from '@/components/ia/antiplagiat/AntiplagiatUploadZone';
import { AntiplagiatProgressState } from '@/components/ia/antiplagiat/AntiplagiatProgressState';
import { AntiplagiatReportView } from '@/components/ia/antiplagiat/AntiplagiatReportView';
import { AntiplagiatHistory } from '@/components/ia/antiplagiat/AntiplagiatHistory';
import { PlagiarismService } from '@/services/plagiarismService';
import { 
  PlagiarismAnalysisStep, 
  PlagiarismReport, 
  PlagiarismHistoryItem, 
  PlagiarismQuota 
} from '@/types/plagiarism';

export default function AntiplagiatPage() {
  const [quota, setQuota] = useState<PlagiarismQuota>(PlagiarismService.getQuota());
  const [history, setHistory] = useState<PlagiarismHistoryItem[]>([]);
  const [currentStep, setCurrentStep] = useState<PlagiarismAnalysisStep>('idle');
  const [activeReport, setActiveReport] = useState<PlagiarismReport | null>(null);
  const [analyzingDocName, setAnalyzingDocName] = useState<string>('');

  useEffect(() => {
    setHistory(PlagiarismService.getHistory());
  }, []);

  const handleStartAnalysis = async (doc: { name: string; size: string; rawText?: string }) => {
    setAnalyzingDocName(doc.name);
    setCurrentStep('reading');

    try {
      const report = await PlagiarismService.analyzeDocument({
        documentName: doc.name,
        fileSize: doc.size,
        rawText: doc.rawText,
        onProgress: (step) => setCurrentStep(step)
      });

      setActiveReport(report);
      setCurrentStep('completed');
      setHistory(PlagiarismService.getHistory());
      setQuota(prev => ({ ...prev, used: Math.min(prev.used + 1, prev.limit) }));
    } catch {
      setCurrentStep('error');
    }
  };

  const handleNewAnalysis = () => {
    setActiveReport(null);
    setCurrentStep('idle');
    setAnalyzingDocName('');
  };

  const handleSelectHistoryItem = async (item: PlagiarismHistoryItem) => {
    // Recharger ou simuler la consultation du rapport correspondant
    const report = await PlagiarismService.analyzeDocument({
      documentName: item.documentName,
      fileSize: item.fileSize
    });
    report.similarityScore = item.similarityScore;
    report.similarityLevel = item.similarityLevel;
    setActiveReport(report);
    setCurrentStep('completed');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = PlagiarismService.deleteHistoryItem(id);
    setHistory(updated);
  };

  const isAnalyzing = currentStep !== 'idle' && currentStep !== 'completed' && currentStep !== 'error';

  return (
    <div className="antiplagiat-page-wrapper">
      <Navbar />

      <main className="antiplagiat-main-content">
        {/* Header avec Titre STRICTEMENT CENTRÉ sur tous les écrans */}
        <header className="antiplagiat-header-root">
          <div className="container">
            {/* Lien retour indépendant pour ne jamais décentrer le titre */}
            <div className="top-nav-bar">
              <Link href="/ia" className="back-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Retour à l’espace IA</span>
              </Link>
            </div>

            {/* Bloc Titre STRICTEMENT CENTRÉ */}
            <div className="title-center-box">
              <div className="antiplagiat-badge">
                <span className="badge-dot"></span>
                <span>Intégrité Académique & Documentaire</span>
              </div>

              <h1 className="main-title">
                Vérification <span className="gradient-text">antiplagiat</span>
              </h1>

              <p className="main-subtitle">
                Analysez votre document et identifiez les passages présentant des similitudes.
              </p>

              <p className="main-description">
                Conçu pour les étudiants, chercheurs, enseignants et candidats préparant des mémoires, thèses, devoirs ou rapports.
              </p>
            </div>
          </div>
        </header>

        {/* Corps principal de la page */}
        <section className="antiplagiat-body-section">
          <div className="container">
            <div className="content-max-width">
              {/* État 1 : En cours d'analyse */}
              {isAnalyzing && (
                <AntiplagiatProgressState
                  currentStep={currentStep}
                  documentName={analyzingDocName}
                />
              )}

              {/* État 2 : Rapport final généré */}
              {!isAnalyzing && activeReport && (
                <AntiplagiatReportView
                  report={activeReport}
                  onNewAnalysis={handleNewAnalysis}
                />
              )}

              {/* État 3 : Accueil / Dépôt du document */}
              {!isAnalyzing && !activeReport && (
                <div className="upload-and-history-flow">
                  <AntiplagiatUploadZone
                    quota={quota}
                    isAnalyzing={isAnalyzing}
                    onStartAnalysis={handleStartAnalysis}
                  />

                  {/* Section pédagogique : Comment ça marche ? */}
                  <div className="how-it-works-box">
                    <h3 className="section-small-title">Deux niveaux d'analyse documentaire</h3>
                    <div className="two-levels-grid">
                      <div className="level-card">
                        <div className="level-badge-tag">Niveau 1 : Interne Sunubiblio</div>
                        <h4>Fonds pédagogique & autorisations légales</h4>
                        <p>
                          Comparaison rigoureuse avec les cours, manuels, annales d'examens nationaux et documents de référence pour lesquels Sunubiblio détient les autorisations légales d'analyse.
                        </p>
                      </div>

                      <div className="level-card">
                        <div className="level-badge-tag">Niveau 2 : Extension Académique</div>
                        <h4>Passerelle vers fournisseurs spécialisés</h4>
                        <p>
                          Architecture modulaire conçue pour raccorder à terme des fournisseurs spécialisés d'intégrité académique et des référentiels universitaires internationaux.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Historique des analyses antérieures */}
                  <AntiplagiatHistory
                    history={history}
                    onSelectHistoryItem={handleSelectHistoryItem}
                    onDeleteHistoryItem={handleDeleteHistoryItem}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .antiplagiat-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .antiplagiat-main-content {
          flex: 1;
        }

        .antiplagiat-header-root {
          padding: 32px 0 20px 0;
          background: linear-gradient(180deg, #f8faff 0%, #ffffff 100%);
          border-bottom: 1px solid rgba(226, 232, 240, 0.7);
        }

        .top-nav-bar {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 12px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 13.5px;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .back-link:hover {
          color: #4f46e5;
        }

        .title-center-box {
          max-width: 780px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .antiplagiat-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 9999px;
          color: #4f46e5;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin-bottom: 16px;
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4f46e5;
          box-shadow: 0 0 8px #4f46e5;
        }

        .main-title {
          font-size: clamp(32px, 4.5vw, 44px);
          font-weight: 900;
          color: #0f172a;
          line-height: 1.15;
          margin: 0 0 10px 0;
          letter-spacing: -0.025em;
          text-align: center;
          width: 100%;
        }

        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .main-subtitle {
          font-size: clamp(17px, 2.5vw, 20px);
          font-weight: 600;
          color: #475569;
          margin: 0 0 10px 0;
          line-height: 1.4;
          text-align: center;
          width: 100%;
        }

        .main-description {
          font-size: 14.5px;
          color: #64748b;
          line-height: 1.6;
          margin: 0 auto;
          max-width: 620px;
          text-align: center;
        }

        .antiplagiat-body-section {
          padding: 40px 0 70px 0;
          background: #f8fafc;
          min-height: 60vh;
        }

        .content-max-width {
          max-width: 900px;
          margin: 0 auto;
        }

        .upload-and-history-flow {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .how-it-works-box {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 24px;
          padding: 24px 28px;
        }

        .section-small-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 16px 0;
        }

        .two-levels-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .level-card {
          background: #f8faff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 16px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .level-badge-tag {
          font-size: 10.5px;
          font-weight: 800;
          text-transform: uppercase;
          color: #4f46e5;
          letter-spacing: 0.03em;
        }

        .level-card h4 {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .level-card p {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }

        @media (max-width: 640px) {
          .antiplagiat-header-root {
            padding: 20px 0 16px 0;
          }
          .main-title {
            font-size: 28px;
          }
          .main-subtitle {
            font-size: 16px;
          }
          .two-levels-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
