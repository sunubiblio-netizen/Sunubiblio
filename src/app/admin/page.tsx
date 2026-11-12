'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  AnalyzedStagingItem,
  AdminDestinationCategory,
  DetectedDocumentKind,
  analyzeUploadedFile,
  generateEditorialCoverDataUrl,
  generateSampleFolderBatch,
} from '@/lib/smartDocumentAnalyzer';
import {
  getPublishedAdminItems,
  publishAdminBatch,
  deletePublishedAdminItem,
  clearAllPublishedAdminItems,
  updatePublishedAdminItem,
  getAdminSubscriptions,
  addAdminSubscription,
  deleteAdminSubscription,
  clearAllAdminSubscriptions,
  resetAdminSubscriptionsToDefault,
  AdminSubscriptionPayment,
  ADMIN_SUBSCRIPTIONS_UPDATED_EVENT,
} from '@/lib/adminCatalogStore';
import { MOCK_RESOURCES } from '@/data/mockLibrary';
import { INITIAL_EDUCATION_RESOURCES } from '@/data/educationData';
import { INITIAL_DOCUMENTS } from '@/data/mockDocuments';
import { MOCK_CONTESTS } from '@/data/mockContests';
import { EducationCycleId } from '@/types/education';
import { AccessLevel } from '@/types/library';

const ADMIN_PREFS_STORAGE_KEY = 'sunubiblio_admin_prefs_v1';

type AccentThemeId = 'amber' | 'emerald' | 'royal' | 'violet' | 'rose' | 'obsidian';

const ACCENT_THEMES: Record<
  AccentThemeId,
  {
    id: AccentThemeId;
    label: string;
    primary: string;
    secondary: string;
    dark: string;
    softBg: string;
    softBorder: string;
    stripeA: string;
    stripeB: string;
    shadow: string;
  }
> = {
  amber: {
    id: 'amber',
    label: 'Or & Ambre Sunubiblio',
    primary: '#d97706',
    secondary: '#f59e0b',
    dark: '#92400e',
    softBg: '#fffbeb',
    softBorder: '#fde68a',
    stripeA: 'rgba(217, 119, 6, 0.24)',
    stripeB: 'rgba(254, 243, 199, 0.78)',
    shadow: 'rgba(217, 119, 6, 0.32)',
  },
  emerald: {
    id: 'emerald',
    label: 'Vert Émeraude Pro',
    primary: '#059669',
    secondary: '#10b981',
    dark: '#065f46',
    softBg: '#ecfdf5',
    softBorder: '#a7f3d0',
    stripeA: 'rgba(5, 150, 105, 0.24)',
    stripeB: 'rgba(209, 250, 229, 0.78)',
    shadow: 'rgba(5, 150, 105, 0.32)',
  },
  royal: {
    id: 'royal',
    label: 'Bleu Royal Académique',
    primary: '#2563eb',
    secondary: '#3b82f6',
    dark: '#1e40af',
    softBg: '#eff6ff',
    softBorder: '#bfdbfe',
    stripeA: 'rgba(37, 99, 235, 0.24)',
    stripeB: 'rgba(219, 234, 254, 0.78)',
    shadow: 'rgba(37, 99, 235, 0.32)',
  },
  violet: {
    id: 'violet',
    label: 'Violet Prestige',
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    dark: '#5b21b6',
    softBg: '#f5f3ff',
    softBorder: '#ddd6fe',
    stripeA: 'rgba(124, 58, 237, 0.24)',
    stripeB: 'rgba(237, 233, 254, 0.78)',
    shadow: 'rgba(124, 58, 237, 0.32)',
  },
  rose: {
    id: 'rose',
    label: 'Rouge Rubis',
    primary: '#e11d48',
    secondary: '#f43f5e',
    dark: '#9f1239',
    softBg: '#fff1f2',
    softBorder: '#fecdd3',
    stripeA: 'rgba(225, 29, 72, 0.24)',
    stripeB: 'rgba(255, 228, 230, 0.78)',
    shadow: 'rgba(225, 29, 72, 0.32)',
  },
  obsidian: {
    id: 'obsidian',
    label: 'Noir Carbone Intense',
    primary: '#0f172a',
    secondary: '#334155',
    dark: '#020617',
    softBg: '#f1f5f9',
    softBorder: '#cbd5e1',
    stripeA: 'rgba(15, 23, 42, 0.25)',
    stripeB: 'rgba(226, 232, 240, 0.85)',
    shadow: 'rgba(15, 23, 42, 0.35)',
  },
};

const DATE_RANGE_OPTIONS = [
  { id: 'oct-nov', label: '01 Oct, 2026 - 10 Nov, 2026', multiplier: 1 },
  { id: '7days', label: '7 derniers jours (Nov 2026)', multiplier: 0.28 },
  { id: '30days', label: '30 derniers jours (Oct - Nov)', multiplier: 0.85 },
  { id: 'q4', label: 'Trimestre T4 2026', multiplier: 1.45 },
  { id: 'year2026', label: 'Année complète 2026', multiplier: 3.6 },
];

const ALL_GRADES_BY_CYCLE: Record<EducationCycleId, string[]> = {
  prescolaire: ['Petite Section', 'Moyenne Section', 'Grande Section'],
  primaire: ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2 / CFEE'],
  college: ['6e', '5e', '4e', '3e / BFEM'],
  lycee: ['Seconde', 'Première', 'Première S', 'Terminale S1', 'Terminale S2', 'Terminale L2', 'Terminale (Bac)'],
  universite: ['Licence 1', 'Licence 2', 'Licence 3', 'Master', 'Master 2', 'Doctorat'],
  formation_pro: ['CAP', 'BEP', 'BTS / Formation Pro', 'Licence Pro'],
};

const ALL_SUBJECTS = [
  'Mathématiques',
  'Physique-Chimie',
  'SVT',
  'Français',
  'Philosophie',
  'Histoire-Géographie',
  'Anglais',
  'Informatique',
  'Droit & Administration',
  'Économie & Gestion',
  'Culture Générale',
  'Spiritualité',
];

type AdminTab = 'dashboard' | 'subscriptions' | 'ingest' | 'classes' | 'catalog' | 'settings';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [chartPeriod, setChartPeriod] = useState<'monthly' | 'annually'>('annually');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'catalog'>('revenue');
  const [bottomTableMode, setBottomTableMode] = useState<'payments' | 'books'>('payments');

  // Préférences de thème (Noir / Blanc + Couleur d'accent + Options IA)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [accentTheme, setAccentTheme] = useState<AccentThemeId>('amber');
  const [adminName, setAdminName] = useState<string>('Mamadou');
  const [autoPublishOnScan, setAutoPublishOnScan] = useState<boolean>(false);
  const [extractHdCover, setExtractHdCover] = useState<boolean>(true);
  const [deletedMockIds, setDeletedMockIds] = useState<string[]>([]);

  // Menus interactifs du header (Recherche globale, Notifications, Période, Profil)
  const [selectedDateRangeId, setSelectedDateRangeId] = useState<string>('oct-nov');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState<boolean>(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isNotifPopoverOpen, setIsNotifPopoverOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const [stagingItems, setStagingItems] = useState<AnalyzedStagingItem[]>([]);
  const [publishedItems, setPublishedItems] = useState<AnalyzedStagingItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<AdminSubscriptionPayment[]>([]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<{ current: number; total: number; currentFile: string }>({
    current: 0,
    total: 0,
    currentFile: '',
  });
  const [stagingFilter, setStagingFilter] = useState<'all' | DetectedDocumentKind | AdminDestinationCategory>('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogDestFilter, setCatalogDestFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [preselectedGradeForUpload, setPreselectedGradeForUpload] = useState<{
    cycle: EducationCycleId;
    grade: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const customCoverInputRef = useRef<HTMLInputElement>(null);
  const [activeCoverEditId, setActiveCoverEditId] = useState<string | null>(null);

  useEffect(() => {
    setPublishedItems(getPublishedAdminItems());
    setSubscriptions(getAdminSubscriptions());

    // Chargement des préférences Paramètres (Noir/Blanc, Couleur, Nom, etc.)
    try {
      const savedPrefs = window.localStorage.getItem(ADMIN_PREFS_STORAGE_KEY);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.themeMode === 'dark' || parsed.themeMode === 'light') setThemeMode(parsed.themeMode);
        if (parsed.accentTheme && ACCENT_THEMES[parsed.accentTheme as AccentThemeId]) {
          setAccentTheme(parsed.accentTheme as AccentThemeId);
        }
        if (typeof parsed.adminName === 'string' && parsed.adminName.trim()) {
          setAdminName(parsed.adminName);
        }
        if (typeof parsed.autoPublishOnScan === 'boolean') {
          setAutoPublishOnScan(parsed.autoPublishOnScan);
        }
        if (typeof parsed.extractHdCover === 'boolean') {
          setExtractHdCover(parsed.extractHdCover);
        }
        if (Array.isArray(parsed.deletedMockIds)) {
          setDeletedMockIds(parsed.deletedMockIds);
        }
      }
    } catch {
      // ignore
    }

    const handleSubUpdate = () => setSubscriptions(getAdminSubscriptions());
    window.addEventListener(ADMIN_SUBSCRIPTIONS_UPDATED_EVENT, handleSubUpdate);
    return () => window.removeEventListener(ADMIN_SUBSCRIPTIONS_UPDATED_EVENT, handleSubUpdate);
  }, []);

  // Sauvegarde automatique des préférences dès qu'un réglage change
  const saveAdminPrefs = (patch: Partial<{
    themeMode: 'light' | 'dark';
    accentTheme: AccentThemeId;
    adminName: string;
    autoPublishOnScan: boolean;
    extractHdCover: boolean;
    deletedMockIds: string[];
  }>) => {
    try {
      const next = {
        themeMode: patch.themeMode ?? themeMode,
        accentTheme: patch.accentTheme ?? accentTheme,
        adminName: patch.adminName ?? adminName,
        autoPublishOnScan: patch.autoPublishOnScan ?? autoPublishOnScan,
        extractHdCover: patch.extractHdCover ?? extractHdCover,
        deletedMockIds: patch.deletedMockIds ?? deletedMockIds,
      };
      window.localStorage.setItem(ADMIN_PREFS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleToggleThemeMode = (nextMode: 'light' | 'dark') => {
    setThemeMode(nextMode);
    saveAdminPrefs({ themeMode: nextMode });
    showToast(
      nextMode === 'dark'
        ? '🌙 Mode Noir (Sombre Pro) activé sur le tableau de bord !'
        : '☀️ Mode Blanc (Clair Pro) activé sur le tableau de bord !'
    );
  };

  const handleSelectAccentTheme = (nextAccent: AccentThemeId) => {
    setAccentTheme(nextAccent);
    saveAdminPrefs({ accentTheme: nextAccent });
    showToast(`🎨 Couleur du tableau de bord changée : ${ACCENT_THEMES[nextAccent].label}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Simuler / Enregistrer un nouvel abonnement en direct
  const handleSimulateNewSubscription = () => {
    const sampleSubscribers = [
      { name: 'Ibrahima Sarr', email: 'ibrahima.sarr@ucad.sn', planId: 'gold' as const, planLabel: 'Formule Gold Illimitée', amount: 9000, method: 'Wave' as const },
      { name: 'Khadija Guèye', email: 'khadija.gueye@fastef.sn', planId: 'recommande' as const, planLabel: 'Formule Recommandée', amount: 5000, method: 'Orange Money' as const },
      { name: 'Babacar Ndoye', email: 'babacar.ndoye@ena.sn', planId: 'gold' as const, planLabel: 'Formule Gold Illimitée', amount: 9000, method: 'Carte Visa' as const },
      { name: 'Sokhna Beye', email: 'sokhna.beye@ugb.sn', planId: 'simple' as const, planLabel: 'Formule Simple', amount: 3000, method: 'Wave' as const },
    ];
    const pick = sampleSubscribers[Math.floor(Math.random() * sampleSubscribers.length)];
    const now = new Date();
    const newEntry: AdminSubscriptionPayment = {
      id: `sub-${Date.now()}`,
      subscriberName: pick.name,
      subscriberEmail: pick.email,
      avatarUrl: '/images/user-profile-logo.png',
      planId: pick.planId,
      planLabel: pick.planLabel,
      amountFcfa: pick.amount,
      paymentMethod: pick.method,
      dateFormatted: 'Aujourd’hui',
      timeFormatted: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'Payé',
      growthHint: `${pick.method} • Activation immédiate`,
      isNew: true,
    };

    const next = addAdminSubscription(newEntry);
    setSubscriptions(next);
    showToast(
      `🔔 Nouvel abonnement encaissé : ${pick.name} (${pick.planLabel} — +${pick.amount.toLocaleString('fr-FR')} FCFA via ${pick.method}) !`
    );
  };

  // Traitement d'une liste de fichiers (unitaires ou issus d'un dossier entier)
  const processFilesBatch = async (fileList: FileList | File[]) => {
    const rawFiles = Array.from(fileList).filter((f) => {
      const ext = f.name.toLowerCase();
      return (
        ext.endsWith('.pdf') ||
        ext.endsWith('.doc') ||
        ext.endsWith('.docx') ||
        ext.endsWith('.epub') ||
        ext.endsWith('.txt') ||
        f.type.includes('pdf')
      );
    });

    if (rawFiles.length === 0) {
      showToast('Aucun fichier PDF, Word ou EPUB détecté dans la sélection.');
      return;
    }

    setActiveTab('ingest');
    setIsAnalyzing(true);
    setAnalysisProgress({ current: 0, total: rawFiles.length, currentFile: rawFiles[0].name });

    const analyzedResults: AnalyzedStagingItem[] = [];
    for (let i = 0; i < rawFiles.length; i++) {
      const file = rawFiles[i];
      setAnalysisProgress({
        current: i + 1,
        total: rawFiles.length,
        currentFile: file.name,
      });

      const analyzed = await analyzeUploadedFile(file);

      if (preselectedGradeForUpload) {
        analyzed.destination = 'education';
        analyzed.cycle = preselectedGradeForUpload.cycle;
        analyzed.grade = preselectedGradeForUpload.grade;
      }

      analyzedResults.push(analyzed);
    }

    setIsAnalyzing(false);
    setPreselectedGradeForUpload(null);

    if (autoPublishOnScan) {
      const updatedCatalog = publishAdminBatch(analyzedResults);
      setPublishedItems(updatedCatalog);
      showToast(
        `🚀 ${analyzedResults.length} fichier(s) analysé(s) et publiés automatiquement dans leurs catégories !`
      );
    } else {
      setStagingItems((prev) => [...analyzedResults, ...prev]);
      showToast(
        `✅ ${analyzedResults.length} fichier(s) analysé(s) : 1ère page de couverture extraite, classe et catégorie détectées !`
      );
    }
  };

  const handleLoadDemoFolder = () => {
    const batch = generateSampleFolderBatch();
    if (autoPublishOnScan) {
      const updated = publishAdminBatch(batch);
      setPublishedItems(updated);
      setActiveTab('catalog');
      showToast('🚀 8 livres, fascicules et documents démo analysés et publiés directement au catalogue !');
    } else {
      setStagingItems((prev) => [...batch, ...prev]);
      setActiveTab('ingest');
      showToast(
        '📁 Dossier complet de 8 livres, fascicules, annales et docs analysé avec extraction des couvertures !'
      );
    }
  };

  const handleUpdateStagingItem = (id: string, patch: Partial<AnalyzedStagingItem>) => {
    setStagingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const handleRegenerateEditorialCover = (item: AnalyzedStagingItem) => {
    const kindLabelMap: Record<DetectedDocumentKind, string> = {
      livre: 'Livre & Manuel',
      fascicule: 'Fascicule Éducation',
      cours: 'Cours & Synthèse',
      annale: 'Annale & Corrigé',
      document: 'Document Officiel',
      ouvrage_religieux: 'Ouvrage Spirituel',
    };
    const newCover = generateEditorialCoverDataUrl({
      title: item.title,
      author: item.author,
      kindLabel: kindLabelMap[item.documentKind],
      gradeOrSub: item.competition || item.grade,
      subject: item.subject,
    });
    handleUpdateStagingItem(item.id, {
      coverImage: newCover,
      coverSource: 'auto_editorial',
    });
    showToast(`🎨 Couverture HD régénérée pour « ${item.title.slice(0, 35)}... »`);
  };

  const handleTriggerCustomCoverUpload = (itemId: string) => {
    setActiveCoverEditId(itemId);
    if (customCoverInputRef.current) {
      customCoverInputRef.current.value = '';
      customCoverInputRef.current.click();
    }
  };

  const handleCustomCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeCoverEditId) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const inStaging = stagingItems.some((it) => it.id === activeCoverEditId);
      if (inStaging) {
        handleUpdateStagingItem(activeCoverEditId, {
          coverImage: dataUrl,
          coverSource: 'custom_upload',
        });
      } else {
        const target = publishedItems.find((it) => it.id === activeCoverEditId);
        if (target) {
          const updated = updatePublishedAdminItem({
            ...target,
            coverImage: dataUrl,
            coverSource: 'custom_upload',
          });
          setPublishedItems(updated);
        }
      }
      showToast('📷 Nouvelle page de couverture appliquée avec succès !');
      setActiveCoverEditId(null);
    };
    reader.readAsDataURL(file);
  };

  const handlePublishSingle = (item: AnalyzedStagingItem) => {
    const updatedCatalog = publishAdminBatch([item]);
    setPublishedItems(updatedCatalog);
    setStagingItems((prev) => prev.filter((it) => it.id !== item.id));
    showToast(`🚀 « ${item.title.slice(0, 40)} » publié dans ${getDestinationLabel(item.destination)} (${item.grade}) !`);
  };

  const handlePublishAllStaging = () => {
    if (stagingItems.length === 0) return;
    const count = stagingItems.length;
    const updatedCatalog = publishAdminBatch(stagingItems);
    setPublishedItems(updatedCatalog);
    setStagingItems([]);
    showToast(
      `🎉 ${count} ressource(s) publiée(s) et classée(s) automatiquement sur Sunubiblio avec leurs couvertures !`
    );
  };

  const handleRemoveStagingItem = (id: string) => {
    setStagingItems((prev) => prev.filter((it) => it.id !== id));
    showToast('🗑️ Élément supprimé de la file d’attente.');
  };

  const handleDeletePublishedItem = (id: string) => {
    const next = deletePublishedAdminItem(id);
    setPublishedItems(next);
    showToast('🗑️ Livre / Fascicule supprimé du catalogue publié.');
  };

  const handleDeleteMockBook = (id: string) => {
    const next = [...deletedMockIds, id];
    setDeletedMockIds(next);
    saveAdminPrefs({ deletedMockIds: next });
    showToast('🗑️ Ressource supprimée de la liste.');
  };

  const handleDeleteSubscription = (id: string) => {
    const next = deleteAdminSubscription(id);
    setSubscriptions(next);
    showToast('🗑️ Paiement / Abonnement supprimé avec succès.');
  };

  const handleClearAllSubscriptions = () => {
    const next = clearAllAdminSubscriptions();
    setSubscriptions(next);
    showToast('🗑️ Tous les paiements et abonnements ont été supprimés.');
  };

  const handleRestoreDefaultSubscriptions = () => {
    const next = resetAdminSubscriptionsToDefault();
    setSubscriptions(next);
    showToast('♻️ Historique des paiements de démonstration restauré.');
  };

  const handleClearAllPublishedBooks = () => {
    const next = clearAllPublishedAdminItems();
    setPublishedItems(next);
    showToast('🗑️ Tous les livres et fascicules importés ont été supprimés.');
  };

  const handleResetAllSettings = () => {
    setThemeMode('light');
    setAccentTheme('amber');
    setAdminName('Mamadou');
    setAutoPublishOnScan(false);
    setExtractHdCover(true);
    setDeletedMockIds([]);
    try {
      window.localStorage.removeItem(ADMIN_PREFS_STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast('♻️ Tous les paramètres du tableau de bord ont été réinitialisés par défaut !');
  };

  const currentRangeObj = useMemo(
    () => DATE_RANGE_OPTIONS.find((d) => d.id === selectedDateRangeId) || DATE_RANGE_OPTIONS[0],
    [selectedDateRangeId]
  );

  const activeAccentObj = ACCENT_THEMES[accentTheme] || ACCENT_THEMES.amber;

  // Calculs financiers & catalogue
  const metrics = useMemo(() => {
    const safeLib = (MOCK_RESOURCES || []).filter((r) => !deletedMockIds.includes(r.id));
    const safeEdu = INITIAL_EDUCATION_RESOURCES || [];
    const safeDocs = INITIAL_DOCUMENTS || [];
    const safeContests = MOCK_CONTESTS || [];

    const adminBooks = publishedItems.filter((i) => i.documentKind === 'livre').length;
    const adminFascicules = publishedItems.filter((i) => i.documentKind === 'fascicule' || i.documentKind === 'cours').length;
    const adminDocs = publishedItems.filter((i) => i.documentKind === 'document').length;
    const adminAnnales = publishedItems.filter((i) => i.documentKind === 'annale').length;

    const liveSubsRevenue = subscriptions.reduce((acc, s) => acc + s.amountFcfa, 0);
    const mult = currentRangeObj.multiplier;
    const baseRev = subscriptions.length === 0 ? 0 : Math.round(2445000 * mult);
    const baseWeek = subscriptions.length === 0 ? 0 : Math.round(315000 * mult);
    const totalRevenueFcfa = baseRev + liveSubsRevenue;
    const weeklyRevenueFcfa = baseWeek + liveSubsRevenue;
    const totalSubscribersCount = (subscriptions.length === 0 ? 0 : 406) + subscriptions.length;
    const goldSubscribersCount = (subscriptions.length === 0 ? 0 : 240) + subscriptions.filter((s) => s.planId === 'gold').length;

    return {
      totalRevenueFcfa,
      weeklyRevenueFcfa,
      totalSubscribersCount,
      goldSubscribersCount,
      newSubsToday: subscriptions.filter((s) => s.isNew).length,
      totalPlatformResources: safeLib.length + safeEdu.length + safeDocs.length + publishedItems.length,
      totalBooks: safeLib.filter((r) => r.category === 'Livres').length + adminBooks,
      totalFascicules: safeEdu.length + adminFascicules,
      totalDocs: safeDocs.length + adminDocs,
      totalContests: safeContests.length + adminAnnales,
      adminPublishedCount: publishedItems.length,
      stagingCount: stagingItems.length,
      safeLib,
    };
  }, [publishedItems, stagingItems, subscriptions, deletedMockIds, currentRangeObj]);

  // Données du graphique central à barres arrondies hachurées (style Quixotic adapté Sunubiblio)
  const chartBars = useMemo(() => {
    if (chartMetric === 'revenue') {
      return chartPeriod === 'annually'
        ? [
            { label: 'JAN', value: 44, badge: '820k', active: false },
            { label: 'FÉV', value: 72, badge: '1.4M', active: false },
            { label: 'MAR', value: 56, badge: '1.1M', active: false },
            { label: 'AVR', value: 94, badge: '+24.8%', active: true },
            { label: 'MAI', value: 68, badge: '1.3M', active: false },
            { label: 'JUIN', value: 82, badge: '1.7M', active: false },
          ]
        : [
            { label: 'SEM 1', value: 52, badge: '210k', active: false },
            { label: 'SEM 2', value: 68, badge: '280k', active: false },
            { label: 'SEM 3', value: 60, badge: '245k', active: false },
            { label: 'SEM 4', value: 92, badge: '+18.4%', active: true },
            { label: 'SEM 5', value: 75, badge: '310k', active: false },
            { label: 'SEM 6', value: 84, badge: '355k', active: false },
          ];
    } else {
      return [
        { label: 'LIVRES', value: 78, badge: `${metrics.totalBooks}`, active: false },
        { label: 'FASCIC.', value: 95, badge: '+32.4%', active: true },
        { label: 'CONCOURS', value: 64, badge: `${metrics.totalContests}`, active: false },
        { label: 'DOCS', value: 54, badge: `${metrics.totalDocs}`, active: false },
        { label: 'RELIGION', value: 48, badge: '42', active: false },
        { label: 'AUTRES', value: 70, badge: '68', active: false },
      ];
    }
  }, [chartMetric, chartPeriod, metrics]);

  const filteredStaging = useMemo(() => {
    if (stagingFilter === 'all') return stagingItems;
    return stagingItems.filter(
      (item) => item.documentKind === stagingFilter || item.destination === stagingFilter
    );
  }, [stagingItems, stagingFilter]);

  const filteredPublished = useMemo(() => {
    return publishedItems.filter((item) => {
      if (catalogDestFilter !== 'all' && item.destination !== catalogDestFilter && item.documentKind !== catalogDestFilter) {
        return false;
      }
      if (catalogSearch.trim()) {
        const q = catalogSearch.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q) ||
          item.grade.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [publishedItems, catalogDestFilter, catalogSearch]);

  return (
    <div
      className={`quix-admin-shell ${themeMode === 'dark' ? 'theme-dark' : 'theme-light'}`}
      style={
        {
          '--q-accent': activeAccentObj.primary,
          '--q-accent-sec': activeAccentObj.secondary,
          '--q-accent-dark': activeAccentObj.dark,
          '--q-accent-soft': activeAccentObj.softBg,
          '--q-accent-border': activeAccentObj.softBorder,
          '--q-stripe-a': activeAccentObj.stripeA,
          '--q-stripe-b': activeAccentObj.stripeB,
          '--q-accent-shadow': activeAccentObj.shadow,
        } as React.CSSProperties
      }
    >
      {/* Inputs cachés pour import de fichiers, dossier complet et couverture personnalisée */}
      <input
        ref={customCoverInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleCustomCoverFileChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.epub"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && processFilesBatch(e.target.files)}
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        // @ts-expect-error webkitdirectory permet de sélectionner un dossier entier avec sous-dossiers
        webkitdirectory=""
        directory=""
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && processFilesBatch(e.target.files)}
      />

      {/* Notification Toast Flottante */}
      {toastMessage && (
        <div className="quix-toast" role="status">
          <span className="toast-dot" />
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

            {/* ===================================================================
          BARRE LATÉRALE MOBILE (DRAWER) POUR NAVIGATION PARFAITE
         =================================================================== */}
      {isMobileDrawerOpen && (
        <div className="quix-mobile-drawer-overlay" onClick={() => setIsMobileDrawerOpen(false)}>
          <div className="quix-mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <div className="drawer-brand">
                <img src="/logo.svg" alt="Sunubiblio" width={30} height={30} />
                <span className="quix-brand-text">Sunubiblio</span>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="drawer-user-card">
              <img src="/images/user-profile-logo.png" alt={adminName} className="drawer-avatar" />
              <div>
                <strong>{adminName}</strong>
                <span>Super Administrateur</span>
              </div>
            </div>

            <nav className="drawer-nav-list">
              <button
                type="button"
                className={`drawer-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => { setActiveTab('dashboard'); setIsMobileDrawerOpen(false); }}
              >
                <span className="drawer-icon">📊</span>
                <span>Dashboard Général</span>
              </button>

              <button
                type="button"
                className={`drawer-nav-item ${activeTab === 'subscriptions' ? 'active' : ''}`}
                onClick={() => { setActiveTab('subscriptions'); setIsMobileDrawerOpen(false); }}
              >
                <span className="drawer-icon">💳</span>
                <span>Abonnements & Paiements</span>
                <span className="drawer-badge">+{metrics.newSubsToday}</span>
              </button>

              <button
                type="button"
                className={`drawer-nav-item ${activeTab === 'ingest' ? 'active' : ''}`}
                onClick={() => { setActiveTab('ingest'); setIsMobileDrawerOpen(false); }}
              >
                <span className="drawer-icon">📥</span>
                <span>Import IA & Dossiers</span>
                {stagingItems.length > 0 && <span className="drawer-badge warn">{stagingItems.length}</span>}
              </button>

              <button
                type="button"
                className={`drawer-nav-item ${activeTab === 'classes' ? 'active' : ''}`}
                onClick={() => { setActiveTab('classes'); setIsMobileDrawerOpen(false); }}
              >
                <span className="drawer-icon">🎓</span>
                <span>Éducation & Classes</span>
              </button>

              <button
                type="button"
                className={`drawer-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
                onClick={() => { setActiveTab('catalog'); setIsMobileDrawerOpen(false); }}
              >
                <span className="drawer-icon">📚</span>
                <span>Catalogue ({metrics.totalPlatformResources})</span>
              </button>

              <button
                type="button"
                className={`drawer-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => { setActiveTab('settings'); setIsMobileDrawerOpen(false); }}
              >
                <span className="drawer-icon">⚙️</span>
                <span>Paramètres & Suppressions</span>
              </button>
            </nav>

            <div className="drawer-footer">
              <Link href="/" className="drawer-exit-btn" onClick={() => setIsMobileDrawerOpen(false)}>
                <span>🏠</span>
                <span>Retourner au site principal</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="quix-outer-frame">
        {/* ===================================================================
            1. TOP FLOATING PILL NAVBAR (Même Logo officiel Sunubiblio que le site)
           =================================================================== */}
        <header className="quix-top-pill-nav">
          {/* Brand Logo officiel Sunubiblio (/logo.svg + typographie identique au site) */}
          <div className="quix-brand-block">
            {/* Bouton Hamburger Mobile pour ouvrir la barre latérale / Drawer */}
            <button
              type="button"
              className="quix-mobile-drawer-trigger"
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="Ouvrir le menu de navigation"
              title="Menu Administrateur"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <Link href="/" className="quix-brand" title="Sunubiblio — Retour à l'accueil">
              <div className="quix-official-logo-wrap">
                <img
                  src="/logo.svg"
                  alt="Sunubiblio"
                  width={32}
                  height={32}
                  className="quix-official-logo-img"
                />
              </div>
              <span className="quix-brand-text">Sunubiblio</span>
            </Link>
          </div>

          {/* Center Segmented Pill Menu */}
          <nav className="quix-center-tabs" aria-label="Navigation Back-Office">
            <button
              type="button"
              className={`quix-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={`quix-nav-tab ${activeTab === 'subscriptions' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscriptions')}
            >
              Abonnements & Paiements
              {metrics.newSubsToday > 0 && <span className="nav-mini-pill">+{metrics.newSubsToday}</span>}
            </button>
            <button
              type="button"
              className={`quix-nav-tab ${activeTab === 'ingest' ? 'active' : ''}`}
              onClick={() => setActiveTab('ingest')}
            >
              Import IA & Dossiers
              {stagingItems.length > 0 && <span className="nav-mini-pill warn">{stagingItems.length}</span>}
            </button>
            <button
              type="button"
              className={`quix-nav-tab ${activeTab === 'classes' ? 'active' : ''}`}
              onClick={() => setActiveTab('classes')}
            >
              Éducation & Classes
            </button>
            <button
              type="button"
              className={`quix-nav-tab ${activeTab === 'catalog' ? 'active' : ''}`}
              onClick={() => setActiveTab('catalog')}
            >
              Catalogue ({metrics.totalPlatformResources})
            </button>
          </nav>

          {/* Right Profile & Quick Icons (Tous 100% fonctionnels) */}
          <div className="quix-nav-right">
            {/* Bouton Bascule Rapide Mode Noir / Mode Blanc */}
            <button
              type="button"
              className="quix-circle-icon-btn"
              onClick={() => handleToggleThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              title={themeMode === 'dark' ? 'Passer en Mode Blanc (Clair)' : 'Passer en Mode Noir (Sombre)'}
            >
              {themeMode === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Bouton Loupe : ouvre la barre de recherche globale en direct */}
            <button
              type="button"
              className={`quix-circle-icon-btn ${isGlobalSearchOpen ? 'active-circle' : ''}`}
              onClick={() => {
                setIsGlobalSearchOpen((prev) => !prev);
                setIsNotifPopoverOpen(false);
                setIsProfileMenuOpen(false);
              }}
              title="Recherche globale (Livres, Classes, Abonnés)"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Bouton Cloche Notifications avec Popover interactif */}
            <div className="quix-popover-anchor">
              <button
                type="button"
                className={`quix-circle-icon-btn notif-btn ${isNotifPopoverOpen ? 'active-circle' : ''}`}
                onClick={() => {
                  setIsNotifPopoverOpen((prev) => !prev);
                  setIsProfileMenuOpen(false);
                }}
                title="Notifications des abonnements et livres"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {subscriptions.length > 0 && <span className="notif-badge">{subscriptions.length}</span>}
              </button>

              {isNotifPopoverOpen && (
                <div className="quix-dropdown-panel notif-panel">
                  <div className="dropdown-panel-head">
                    <strong>Notifications en direct ({subscriptions.length})</strong>
                    <button
                      type="button"
                      className="dropdown-text-btn"
                      onClick={handleSimulateNewSubscription}
                    >
                      + Tester alerte
                    </button>
                  </div>
                  <div className="dropdown-notif-list">
                    {subscriptions.length === 0 ? (
                      <p className="dropdown-empty-msg">Aucune notification récente.</p>
                    ) : (
                      subscriptions.slice(0, 5).map((sub) => (
                        <div key={sub.id} className="dropdown-notif-item">
                          <div className="notif-item-left">
                            <strong>{sub.subscriberName}</strong>
                            <span>
                              {sub.planLabel} • +{sub.amountFcfa.toLocaleString('fr-FR')} FCFA ({sub.paymentMethod})
                            </span>
                          </div>
                          <button
                            type="button"
                            className="notif-del-mini"
                            onClick={() => handleDeleteSubscription(sub.id)}
                            title="Supprimer cette entrée"
                          >
                            🗑️
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="dropdown-panel-foot">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNotifPopoverOpen(false);
                        setActiveTab('subscriptions');
                      }}
                    >
                      Voir tous les paiements →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Profil Administrateur */}
            <div className="quix-popover-anchor">
              <button
                type="button"
                className="quix-admin-profile-pill"
                onClick={() => {
                  setIsProfileMenuOpen((prev) => !prev);
                  setIsNotifPopoverOpen(false);
                }}
                title="Menu Administrateur & Paramètres"
              >
                <img
                  src="/images/user-profile-logo.png"
                  alt={adminName}
                  className="quix-admin-avatar"
                />
                <span className="quix-admin-caret">▾</span>
              </button>

              {isProfileMenuOpen && (
                <div className="quix-dropdown-panel profile-panel">
                  <div className="dropdown-panel-head">
                    <div>
                      <strong>{adminName}</strong>
                      <span style={{ display: 'block', fontSize: '11px', opacity: 0.7 }}>
                        Super Administrateur Sunubiblio
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => {
                      setActiveTab('settings');
                      setIsProfileMenuOpen(false);
                    }}
                  >
                    ⚙️ Paramètres (Couleurs, Noir/Blanc, Suppressions)
                  </button>
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => {
                      handleToggleThemeMode(themeMode === 'dark' ? 'light' : 'dark');
                      setIsProfileMenuOpen(false);
                    }}
                  >
                    {themeMode === 'dark' ? '☀️ Activer le Mode Blanc (Clair)' : '🌙 Activer le Mode Noir (Sombre)'}
                  </button>
                  <Link href="/" className="profile-menu-item modern-return-site-btn">
                    <span className="return-icon-pill">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </span>
                    <span className="return-text-group">
                      <strong>Retourner à l’accueil</strong>
                      <small>Quitter l’espace Admin</small>
                    </span>
                    <span className="return-arrow-chevron">→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Barre de Recherche Globale Dépliable */}
        {isGlobalSearchOpen && (
          <div className="quix-global-search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher partout : titre d'un livre, fascicule, classe (CM2, 3e, Terminale S2), auteur ou nom d'un abonné..."
              value={globalSearchQuery}
              onChange={(e) => {
                setGlobalSearchQuery(e.target.value);
                setCatalogSearch(e.target.value);
              }}
              autoFocus
            />
            {globalSearchQuery && (
              <button
                type="button"
                className="search-go-btn"
                onClick={() => setActiveTab('catalog')}
              >
                Filtrer le catalogue ({filteredPublished.length}) →
              </button>
            )}
            <button
              type="button"
              className="search-close-btn"
              onClick={() => {
                setIsGlobalSearchOpen(false);
                setGlobalSearchQuery('');
                setCatalogSearch('');
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ===================================================================
            2. WELCOME SUB-HEADER ROW ("Bon retour, Mamadou" + Actions Pilules)
           =================================================================== */}
        <section className="quix-welcome-row">
          <h1 className="quix-welcome-heading">
            Bon retour, <span className="welcome-muted-name">{adminName}</span>
          </h1>

          <div className="quix-welcome-actions">
            {/* Sélecteur de Période Interactif */}
            <div className="quix-popover-anchor">
              <button
                type="button"
                className="quix-date-pill"
                onClick={() => setIsDateDropdownOpen((prev) => !prev)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--q-accent)" strokeWidth="2.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{currentRangeObj.label}</span>
                <span className="pill-chevron">⌄</span>
              </button>

              {isDateDropdownOpen && (
                <div className="quix-dropdown-panel date-panel">
                  {DATE_RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`date-option-btn ${selectedDateRangeId === opt.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedDateRangeId(opt.id);
                        setIsDateDropdownOpen(false);
                        showToast(`📅 Période appliquée : ${opt.label}`);
                      }}
                    >
                      <span>{opt.label}</span>
                      {selectedDateRangeId === opt.id && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="quix-action-pill-btn secondary"
              onClick={handleSimulateNewSubscription}
            >
              <span>+ Simuler un Abonnement</span>
            </button>

            <button
              type="button"
              className="quix-action-pill-btn primary"
              onClick={() => folderInputRef.current?.click()}
            >
              <span>+ Importer un Dossier / Livres</span>
            </button>
          </div>
        </section>

        {/* ===================================================================
            3. CORPS PRINCIPAL : RAIL D'ICÔNES GAUCHE + CONTENU CENTRAL
           =================================================================== */}
        <div className="quix-body-layout">
          {/* RAIL VERTICAL FLOTTANT GAUCHE (3 Pilules d'icônes comme sur Quixotic) */}
          <aside className="quix-left-dock" aria-label="Raccourcis rapides">
            <div className="dock-pill-group">
              <button
                type="button"
                className={`dock-icon-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
                title="Vue d'ensemble Dashboard"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </button>

              <button
                type="button"
                className={`dock-icon-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
                onClick={() => setActiveTab('subscriptions')}
                title="Paiements encaissés & Abonnements"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </button>

              <button
                type="button"
                className={`dock-icon-btn ${activeTab === 'ingest' ? 'active' : ''}`}
                onClick={() => setActiveTab('ingest')}
                title="Import Dossier & Analyse IA des Livres"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>
              </button>

              <button
                type="button"
                className={`dock-icon-btn ${activeTab === 'classes' ? 'active' : ''}`}
                onClick={() => setActiveTab('classes')}
                title="Classes Éducation : Livres vs Fascicules"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </button>
            </div>

            <div className="dock-pill-group">
              <button
                type="button"
                className={`dock-icon-btn ${activeTab === 'catalog' ? 'active' : ''}`}
                onClick={() => setActiveTab('catalog')}
                title="Catalogue & Pages de couverture"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </button>

              <button
                type="button"
                className="dock-icon-btn"
                onClick={handleLoadDemoFolder}
                title="Charger un dossier démo de 8 livres & fascicules"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </button>

              <button
                type="button"
                className="dock-icon-btn"
                onClick={handleSimulateNewSubscription}
                title="Ajouter / Simuler un paiement d'abonnement"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </button>
            </div>

            <div className="dock-pill-group">
              {/* BOUTON PARAMÈTRES (⚙️) EN BAS AVANT ACCUEIL */}
              <button
                type="button"
                className={`dock-icon-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
                title="Paramètres : Changer la couleur, Mode Noir/Blanc, Boutons de suppression"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>

              <Link href="/" className="dock-icon-btn" title="Retourner à l'accueil du site">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </Link>
            </div>
          </aside>

          {/* ZONE DE CONTENU PRINCIPALE */}
          <div className="quix-content-stage">
            {/* ===============================================================
                VUE 1 : DASHBOARD BENTO 3 COLONNES (Modèle exact Quixotic)
               =============================================================== */}
            {activeTab === 'dashboard' && (
              <div className="quix-bento-grid">
                {/* COLONNE GAUCHE */}
                <div className="bento-col-left">
                  {/* Carte 1 : Paiements Encaissés & Carte Gold Sunubiblio */}
                  <div className="quix-card">
                    <div className="quix-card-head">
                      <div>
                        <h3 className="quix-card-title">Paiements Encaissés</h3>
                        <p className="quix-card-sub">Total des abonnements perçus</p>
                      </div>
                      <button
                        type="button"
                        className="quix-arrow-circle"
                        onClick={() => setActiveTab('subscriptions')}
                        title="Voir tous les paiements"
                      >
                        ↗
                      </button>
                    </div>

                    {/* La Carte de Trésorerie Sunubiblio en dégradé Ambre/Or */}
                    <div className="sunu-gold-wallet-card">
                      <div className="wallet-top-row">
                        <span className="wallet-brand-label">WAVE • OM • VISA</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2">
                          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                          <line x1="12" y1="20" x2="12.01" y2="20" />
                        </svg>
                      </div>

                      <span className="wallet-sub-caption">Trésorerie Abonnements Sunubiblio</span>
                      <div className="wallet-main-amount">
                        {metrics.totalRevenueFcfa.toLocaleString('fr-FR')} <small>FCFA</small>
                      </div>

                      <div className="wallet-bottom-row">
                        <span>•••• 909026 ({metrics.totalSubscribersCount} abonnés)</span>
                        <span>ACTIF 11/26</span>
                      </div>
                    </div>
                  </div>

                  {/* Carte 2 : Revenu Hebdomadaire */}
                  <div className="quix-card compact-metric-card">
                    <div>
                      <span className="quix-card-sub">Revenus de la semaine</span>
                      <div className="compact-big-num">
                        +{metrics.weeklyRevenueFcfa.toLocaleString('fr-FR')} FCFA
                      </div>
                    </div>
                    <span className="quix-growth-pill">+18.4%</span>
                  </div>
                </div>

                {/* COLONNE CENTRALE */}
                <div className="bento-col-center">
                  {/* Carte 3 : Graphique à barres arrondies hachurées (Engagement / Abonnements & Catalogue) */}
                  <div className="quix-card chart-bento-card">
                    <div className="quix-card-head">
                      <div className="card-head-with-icon">
                        <span className="soft-icon-box">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                          </svg>
                        </span>
                        <div>
                          <h3 className="quix-card-title">
                            {chartMetric === 'revenue' ? 'Croissance des Abonnements' : 'Répartition du Catalogue'}
                          </h3>
                        </div>
                      </div>

                      <div className="chart-controls-right">
                        <div className="quix-segmented-switch">
                          <button
                            type="button"
                            className={`seg-btn ${chartMetric === 'revenue' ? 'active' : ''}`}
                            onClick={() => setChartMetric('revenue')}
                          >
                            Abonnements
                          </button>
                          <button
                            type="button"
                            className={`seg-btn ${chartMetric === 'catalog' ? 'active' : ''}`}
                            onClick={() => setChartMetric('catalog')}
                          >
                            Livres & Docs
                          </button>
                        </div>

                        <div className="quix-segmented-switch">
                          <button
                            type="button"
                            className={`seg-btn ${chartPeriod === 'monthly' ? 'active' : ''}`}
                            onClick={() => setChartPeriod('monthly')}
                          >
                            Mensuel
                          </button>
                          <button
                            type="button"
                            className={`seg-btn ${chartPeriod === 'annually' ? 'active' : ''}`}
                            onClick={() => setChartPeriod('annually')}
                          >
                            Annuel
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Barres verticales arrondies hachurées fidèles à l'image */}
                    <div className="quix-bars-stage">
                      <div className="y-axis-labels">
                        <span>5k</span>
                        <span>4k</span>
                        <span>3k</span>
                        <span>2k</span>
                        <span>1k</span>
                        <span>0</span>
                      </div>

                      <div className="bars-columns-wrap">
                        {chartBars.map((bar) => (
                          <div key={bar.label} className="bar-col-item">
                            <div className="bar-track-area">
                              {bar.active && (
                                <div className="bar-floating-pill">
                                  <span>{bar.badge}</span>
                                  <div className="bar-top-dot" />
                                </div>
                              )}
                              <div
                                className={`quix-pill-bar ${bar.active ? 'is-peak' : ''}`}
                                style={{ height: `${bar.value}%` }}
                                title={`${bar.label} : ${bar.badge}`}
                              />
                            </div>
                            <span className="bar-x-label">{bar.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Carte 4 : Historique des Paiements & Abonnés OU Derniers Livres Importés */}
                  <div className="quix-card history-bento-card">
                    <div className="quix-card-head">
                      <div>
                        <h3 className="quix-card-title">
                          Historique & Activité de la Plateforme
                        </h3>
                        <p className="quix-card-sub">
                          {bottomTableMode === 'payments'
                            ? 'Encaissements récents via Wave, Orange Money et Carte Visa'
                            : 'Ouvrages récents avec couverture extraite et classe détectée'}
                        </p>
                      </div>

                      <div className="history-head-actions">
                        <div className="quix-segmented-switch">
                          <button
                            type="button"
                            className={`seg-btn ${bottomTableMode === 'payments' ? 'active' : ''}`}
                            onClick={() => setBottomTableMode('payments')}
                          >
                            💳 Paiements ({subscriptions.length})
                          </button>
                          <button
                            type="button"
                            className={`seg-btn ${bottomTableMode === 'books' ? 'active' : ''}`}
                            onClick={() => setBottomTableMode('books')}
                          >
                            📘 Livres ({publishedItems.length + MOCK_RESOURCES.slice(0, 4).length})
                          </button>
                        </div>

                        <button
                          type="button"
                          className="quix-arrow-circle"
                          onClick={() =>
                            setActiveTab(bottomTableMode === 'payments' ? 'subscriptions' : 'catalog')
                          }
                        >
                          ↗
                        </button>
                      </div>
                    </div>

                    <div className="quix-clean-table unified-bento-table">
                      <div className="q-thead unified-thead">
                        <span>{bottomTableMode === 'payments' ? 'Abonné & Formule' : 'Livre / Fascicule & Couverture'}</span>
                        <span>{bottomTableMode === 'payments' ? 'Moyen / Date' : 'Catégorie'}</span>
                        <span>{bottomTableMode === 'payments' ? 'Heure' : 'Classe'}</span>
                        <span>Statut</span>
                        <span style={{ textAlign: 'right' }}>{bottomTableMode === 'payments' ? 'Montant & Action' : 'Volume & Action'}</span>
                      </div>

                      <div className="q-tbody">
                        {bottomTableMode === 'payments' ? (
                          subscriptions.length === 0 ? (
                            <div style={{ padding: '24px 8px', fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>
                              Aucun paiement enregistré pour l’instant.
                            </div>
                          ) : (
                            subscriptions.slice(0, 4).map((sub) => (
                              <div key={sub.id} className="q-trow unified-trow">
                                <div className="q-cell-main">
                                  <div className={`method-circle method-${sub.paymentMethod.toLowerCase().replace(/\s+/g, '-')}`}>
                                    {sub.paymentMethod === 'Wave' ? 'W' : sub.paymentMethod === 'Orange Money' ? 'OM' : 'V'}
                                  </div>
                                  <div className="q-cell-info">
                                    <div className="q-row-title">{sub.subscriberName}</div>
                                    <div className="q-row-sub">{sub.planLabel}</div>
                                  </div>
                                </div>
                                <div className="q-cell-text">{sub.paymentMethod} • {sub.dateFormatted}</div>
                                <div className="q-cell-text">{sub.timeFormatted}</div>
                                <div>
                                  <span className="q-status-pill">
                                    <span className="status-dot" />
                                    {sub.status}
                                  </span>
                                </div>
                                <div className="q-cell-amount-with-del">
                                  <span className="amount-num">{sub.amountFcfa.toLocaleString('fr-FR')} FCFA</span>
                                  <button
                                    type="button"
                                    className="modern-trash-btn"
                                    onClick={() => handleDeleteSubscription(sub.id)}
                                    title="Supprimer ce paiement"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6" />
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))
                          )
                        ) : (
                          publishedItems.length > 0 ? (
                            publishedItems.slice(0, 4).map((item) => (
                              <div key={item.id} className="q-trow unified-trow">
                                <div className="q-cell-main">
                                  <img
                                    src={item.coverImage}
                                    alt={item.title}
                                    className="mini-book-cover-thumb"
                                  />
                                  <div className="q-cell-info">
                                    <div className="q-row-title">{item.title.slice(0, 36)}</div>
                                    <div className="q-row-sub">{item.author}</div>
                                  </div>
                                </div>
                                <div className="q-cell-text">{getDestinationLabel(item.destination)}</div>
                                <div className="q-cell-text">{item.grade}</div>
                                <div>
                                  <span className="q-status-pill">
                                    <span className="status-dot" />
                                    Publié
                                  </span>
                                </div>
                                <div className="q-cell-amount-with-del">
                                  <span className="amount-num">{item.pagesCount} pages</span>
                                  <button
                                    type="button"
                                    className="modern-trash-btn"
                                    onClick={() => handleDeletePublishedItem(item.id)}
                                    title="Supprimer ce livre/fascicule"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6" />
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            metrics.safeLib.slice(0, 3).map((res) => (
                              <div key={res.id} className="q-trow unified-trow">
                                <div className="q-cell-main">
                                  <div
                                    className="mini-book-cover-thumb"
                                    style={{ background: res.coverGradient }}
                                  />
                                  <div className="q-cell-info">
                                    <div className="q-row-title">{res.title.slice(0, 36)}</div>
                                    <div className="q-row-sub">{res.author}</div>
                                  </div>
                                </div>
                                <div className="q-cell-text">{res.category}</div>
                                <div className="q-cell-text">{res.level.grade}</div>
                                <div>
                                  <span className="q-status-pill">
                                    <span className="status-dot" />
                                    En ligne
                                  </span>
                                </div>
                                <div className="q-cell-amount-with-del">
                                  <span className="amount-num">{res.pagesCount} pages</span>
                                  <button
                                    type="button"
                                    className="modern-trash-btn"
                                    onClick={() => handleDeleteMockBook(res.id)}
                                    title="Supprimer cette ressource"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6" />
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLONNE DROITE */}
                <div className="bento-col-right">
                  {/* Carte 5 : Import Rapide Dossier / Fichiers & Courbe d'Activité */}
                  <div className="quix-card">
                    <div className="quix-card-head">
                      <div>
                        <h3 className="quix-card-title">Catalogue & Import IA</h3>
                        <p className="quix-card-sub">Livres, fascicules & couvertures</p>
                      </div>
                      <button
                        type="button"
                        className="quix-arrow-circle"
                        onClick={() => setActiveTab('ingest')}
                      >
                        ↗
                      </button>
                    </div>

                    <div className="balance-center-block">
                      <span className="balance-small-label">Ressources actives sur la plateforme</span>
                      <div className="balance-huge-num">
                        {metrics.totalPlatformResources.toLocaleString('fr-FR')}
                        <span className="balance-decimal">.{metrics.totalBooks}</span>
                      </div>
                    </div>

                    {/* Courbe SVG fluide dynamique selon la couleur choisie dans Paramètres */}
                    <div className="mini-area-chart-wrap">
                      <svg viewBox="0 0 300 95" className="mini-area-svg" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="sunuAmberArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={activeAccentObj.secondary} stopOpacity="0.34" />
                            <stop offset="100%" stopColor={activeAccentObj.secondary} stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,65 Q25,75 45,55 T90,25 T135,50 T180,35 T225,65 T265,30 L300,20 L300,95 L0,95 Z"
                          fill="url(#sunuAmberArea)"
                        />
                        <path
                          d="M0,65 Q25,75 45,55 T90,25 T135,50 T180,35 T225,65 T265,30 L300,20"
                          fill="none"
                          stroke={activeAccentObj.primary}
                          strokeWidth="2.4"
                        />
                      </svg>
                    </div>

                    {/* Les 2 Boutons Pilules (Send ↑ / Receive ↓ -> Dossier ↑ / Fichiers ↓) */}
                    <div className="dual-pill-actions">
                      <button
                        type="button"
                        className="dual-btn primary-amber"
                        onClick={() => folderInputRef.current?.click()}
                      >
                        <span>Dossier</span>
                        <span>↑</span>
                      </button>
                      <button
                        type="button"
                        className="dual-btn light-pill"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <span>Fichiers PDF</span>
                        <span>↓</span>
                      </button>
                    </div>
                  </div>

                  {/* Carte 6 : Abonnements Actifs & Derniers Membres Gold */}
                  <div className="quix-card">
                    <div className="card-head-with-icon" style={{ marginBottom: '12px' }}>
                      <span className="soft-icon-box">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--q-accent)" strokeWidth="2.2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </span>
                      <div>
                        <h3 className="quix-card-title">Abonnements Actifs</h3>
                        <p className="quix-card-sub">Membres Gold, Recommandé & Simple</p>
                      </div>
                    </div>

                    <div className="credit-amount-row">
                      <div className="credit-big-figure">
                        {metrics.totalSubscribersCount}
                        <span className="credit-muted-part">.{metrics.goldSubscribersCount} Gold</span>
                      </div>
                      <span className="quix-growth-pill">+12.8%</span>
                    </div>

                    {/* Sous-carte grise interne avec la rangée d'avatars + badge "+N" */}
                    <div className="mandatory-inner-box">
                      <div className="quix-card-head" style={{ marginBottom: '10px' }}>
                        <div>
                          <h4 className="inner-box-title">Derniers Abonnés & Livres</h4>
                          <p className="quix-card-sub">Activations et couvertures récentes</p>
                        </div>
                        <button
                          type="button"
                          className="quix-arrow-circle small"
                          onClick={handleLoadDemoFolder}
                          title="Simuler l'import d'un dossier de 8 livres"
                        >
                          ↗
                        </button>
                      </div>

                      <div className="avatar-stack-row">
                        {subscriptions.slice(0, 4).map((sub, i) => (
                          <div
                            key={sub.id}
                            className="stacked-avatar-item"
                            title={`${sub.subscriberName} — ${sub.planLabel} (${sub.amountFcfa} FCFA)`}
                            style={{
                              background:
                                i % 2 === 0
                                  ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
                                  : 'linear-gradient(135deg, #ffedd5, #fed7aa)',
                            }}
                          >
                            <span>{sub.subscriberName.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="stacked-plus-badge"
                          onClick={() => setActiveTab('subscriptions')}
                        >
                          +{subscriptions.length}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                VUE 2 : ABONNEMENTS & PAIEMENTS ENCAISSÉS (DÉTAIL COMPLET)
               =============================================================== */}
            {activeTab === 'subscriptions' && (
              <div className="quix-subpage-container">
                <div className="subpage-top-kpis">
                  <div className="quix-card sub-kpi">
                    <span className="quix-card-sub">Total Paiements Encaissés</span>
                    <strong className="sub-kpi-val amber">
                      {metrics.totalRevenueFcfa.toLocaleString('fr-FR')} FCFA
                    </strong>
                    <span className="sub-kpi-foot">Wave, Orange Money & Carte Visa</span>
                  </div>

                  <div className="quix-card sub-kpi">
                    <span className="quix-card-sub">Total Abonnés Actifs</span>
                    <strong className="sub-kpi-val">{metrics.totalSubscribersCount} abonnés</strong>
                    <span className="sub-kpi-foot">Dont {metrics.goldSubscribersCount} en formule Gold (9 000 FCFA)</span>
                  </div>

                  <div className="quix-card sub-kpi">
                    <span className="quix-card-sub">Encaissements de la semaine</span>
                    <strong className="sub-kpi-val">
                      +{metrics.weeklyRevenueFcfa.toLocaleString('fr-FR')} FCFA
                    </strong>
                    <span className="sub-kpi-foot">Taux de renouvellement : 94.2%</span>
                  </div>
                </div>

                <div className="quix-card">
                  <div className="quix-card-head" style={{ marginBottom: '18px', flexWrap: 'wrap' }}>
                    <div>
                      <h2 className="quix-card-title" style={{ fontSize: '18px' }}>
                        Journal en direct des Abonnements & Paiements ({subscriptions.length})
                      </h2>
                      <p className="quix-card-sub">
                        Chaque fois qu’un étudiant ou enseignant s’abonne, la transaction apparaît instantanément ici.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {subscriptions.length > 0 ? (
                        <button
                          type="button"
                          className="btn-danger-outline"
                          onClick={handleClearAllSubscriptions}
                        >
                          🗑️ Tout supprimer
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="quix-action-pill-btn secondary"
                          onClick={handleRestoreDefaultSubscriptions}
                        >
                          ♻️ Restaurer les paiements démo
                        </button>
                      )}
                      <button
                        type="button"
                        className="quix-action-pill-btn primary"
                        onClick={handleSimulateNewSubscription}
                      >
                        + Simuler un nouvel abonné maintenant
                      </button>
                    </div>
                  </div>

                  <div className="quix-clean-table subscriptions-detail-table">
                    <div className="q-thead sub-detail-thead">
                      <span>Abonné & Email</span>
                      <span>Formule choisie</span>
                      <span>Moyen de paiement</span>
                      <span>Date & Heure</span>
                      <span>Statut</span>
                      <span style={{ textAlign: 'right' }}>Montant & Action</span>
                    </div>
                    <div className="q-tbody">
                      {subscriptions.map((sub) => (
                        <div key={sub.id} className="q-trow sub-detail-trow">
                          <div className="q-cell-main">
                            <div className={`method-circle method-${sub.paymentMethod.toLowerCase().replace(/\s+/g, '-')}`}>
                              {sub.subscriberName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="q-row-title">{sub.subscriberName}</div>
                              <div className="q-row-sub">{sub.subscriberEmail}</div>
                            </div>
                          </div>
                          <div className="q-cell-text">
                            <strong>{sub.planLabel}</strong>
                          </div>
                          <div className="q-cell-text">{sub.paymentMethod}</div>
                          <div className="q-cell-text">
                            {sub.dateFormatted} à {sub.timeFormatted}
                          </div>
                          <div>
                            <span className="q-status-pill">
                              <span className="status-dot" />
                              {sub.status}
                            </span>
                          </div>
                          <div className="q-cell-amount-with-del">
                            <span>+{sub.amountFcfa.toLocaleString('fr-FR')} FCFA</span>
                            <button
                              type="button"
                              className="row-del-icon-btn"
                              onClick={() => handleDeleteSubscription(sub.id)}
                              title="Supprimer cet abonnement"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                VUE 3 : IMPORT IA EN MASSE (DOSSIERS & LIVRES + COUVERTURE)
               =============================================================== */}
            {activeTab === 'ingest' && (
              <div className="quix-subpage-container">
                {preselectedGradeForUpload && (
                  <div className="preselected-class-banner">
                    <span>
                      🎯 <strong>Ciblage Classe actif :</strong> Les prochains livres ou fascicules importés seront
                      affectés à la classe <strong>{preselectedGradeForUpload.grade}</strong>.
                    </span>
                    <button type="button" onClick={() => setPreselectedGradeForUpload(null)}>
                      Désactiver ✕
                    </button>
                  </div>
                )}

                <div
                  className="quix-card bulk-dropzone-panel"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      processFilesBatch(e.dataTransfer.files);
                    }
                  }}
                >
                  <div className="dropzone-left-info">
                    <div className="ai-engine-pill">
                      <span className="pulse-dot" />
                      <span>Moteur IA d’Extraction de Couverture & Classification par Classe</span>
                    </div>
                    <h2 className="dropzone-title">
                      Importez un dossier complet ou des centaines de livres et fascicules
                    </h2>
                    <p className="dropzone-desc">
                      Le système analyse automatiquement chaque fichier pour :
                    </p>
                    <ul className="dropzone-capabilities-list">
                      <li>
                        <strong>Extraire la 1ère page de couverture</strong> pour l’afficher au devant du livre sur Sunubiblio.
                      </li>
                      <li>
                        <strong>Identifier la nature exacte</strong> : Livre scolaire, Fascicule d’exercices, Annale de Concours ou Document administratif.
                      </li>
                      <li>
                        <strong>Détecter la classe (Éducation)</strong> : du CI/CM2 à la 3e (BFEM), Seconde, Première, Terminale S1/S2/L2 et Licence/Master, ainsi que l’Auteur.
                      </li>
                    </ul>
                  </div>

                  <div className="dropzone-actions-col">
                    <button
                      type="button"
                      className="import-action-card folder-card"
                      onClick={() => folderInputRef.current?.click()}
                      disabled={isAnalyzing}
                    >
                      <div className="action-card-icon">📁</div>
                      <div className="action-card-text">
                        <strong>Importer un Dossier Complet</strong>
                        <span>Sélectionnez un dossier contenant plusieurs livres, fascicules et docs</span>
                      </div>
                      <span className="action-card-arrow">→</span>
                    </button>

                    <button
                      type="button"
                      className="import-action-card files-card"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isAnalyzing}
                    >
                      <div className="action-card-icon">📄</div>
                      <div className="action-card-text">
                        <strong>Sélectionner des Fichiers (PDF, DOCX)</strong>
                        <span>Extraction automatique de la page de couverture et de l’auteur</span>
                      </div>
                      <span className="action-card-arrow">→</span>
                    </button>

                    <button
                      type="button"
                      className="demo-batch-btn"
                      onClick={handleLoadDemoFolder}
                      disabled={isAnalyzing}
                    >
                      ✨ Simuler l’analyse d’un dossier de 8 livres, fascicules & docs
                    </button>
                  </div>
                </div>

                {isAnalyzing && (
                  <div className="analysis-progress-box">
                    <div className="progress-head">
                      <strong>
                        🔍 Extraction de la couverture & détection de la classe ({analysisProgress.current} /{' '}
                        {analysisProgress.total})
                      </strong>
                      <span>{Math.round((analysisProgress.current / Math.max(1, analysisProgress.total)) * 100)}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(analysisProgress.current / Math.max(1, analysisProgress.total)) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="progress-sub">Fichier en cours : {analysisProgress.currentFile}</p>
                  </div>
                )}

                {stagingItems.length > 0 && (
                  <div className="quix-card staging-section">
                    <div className="staging-header-bar">
                      <div className="staging-header-left">
                        <h2>
                          File d’attente analysée ({stagingItems.length} élément{stagingItems.length > 1 ? 's' : ''})
                        </h2>
                        <p>
                          Vérifiez la couverture extraite, la classe et la catégorie avant de tout publier en 1 clic.
                        </p>
                      </div>

                      <div className="staging-header-actions">
                        <button
                          type="button"
                          className="btn-clear-staging"
                          onClick={() => setStagingItems([])}
                        >
                          Vider la file
                        </button>
                        <button
                          type="button"
                          className="btn-publish-all"
                          onClick={handlePublishAllStaging}
                        >
                          🚀 Tout Publier dans chaque catégorie ({stagingItems.length})
                        </button>
                      </div>
                    </div>

                    <div className="staging-filter-pills">
                      <button
                        type="button"
                        className={`s-pill ${stagingFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStagingFilter('all')}
                      >
                        Tous ({stagingItems.length})
                      </button>
                      <button
                        type="button"
                        className={`s-pill ${stagingFilter === 'livre' ? 'active' : ''}`}
                        onClick={() => setStagingFilter('livre')}
                      >
                        📘 Livres ({stagingItems.filter((i) => i.documentKind === 'livre').length})
                      </button>
                      <button
                        type="button"
                        className={`s-pill ${stagingFilter === 'fascicule' ? 'active' : ''}`}
                        onClick={() => setStagingFilter('fascicule')}
                      >
                        📙 Fascicules Éducation ({stagingItems.filter((i) => i.documentKind === 'fascicule').length})
                      </button>
                      <button
                        type="button"
                        className={`s-pill ${stagingFilter === 'concours' ? 'active' : ''}`}
                        onClick={() => setStagingFilter('concours')}
                      >
                        🏆 Concours ({stagingItems.filter((i) => i.destination === 'concours').length})
                      </button>
                      <button
                        type="button"
                        className={`s-pill ${stagingFilter === 'document' ? 'active' : ''}`}
                        onClick={() => setStagingFilter('document')}
                      >
                        📄 Documents ({stagingItems.filter((i) => i.documentKind === 'document').length})
                      </button>
                    </div>

                    <div className="staging-cards-list">
                      {filteredStaging.map((item) => {
                        const gradesForCycle = ALL_GRADES_BY_CYCLE[item.cycle] || ALL_GRADES_BY_CYCLE.lycee;
                        return (
                          <article key={item.id} className="staging-item-card">
                            <div className="staging-cover-col">
                              <div className="cover-preview-frame">
                                <img
                                  src={item.coverImage}
                                  alt={`Couverture de ${item.title}`}
                                  className="cover-preview-img"
                                />
                                <div className="cover-spine-effect" />
                                <span className="cover-source-tag">
                                  {item.coverSource === 'pdf_page_1'
                                    ? '✓ 1ère Page PDF'
                                    : item.coverSource === 'custom_upload'
                                    ? '✓ Image Perso'
                                    : '✦ Couverture HD'}
                                </span>
                              </div>

                              <div className="cover-actions-stack">
                                <button
                                  type="button"
                                  className="cover-mini-btn"
                                  onClick={() => handleTriggerCustomCoverUpload(item.id)}
                                >
                                  📷 Changer couverture
                                </button>
                                <button
                                  type="button"
                                  className="cover-mini-btn secondary"
                                  onClick={() => handleRegenerateEditorialCover(item)}
                                >
                                  🎨 Régénérer HD
                                </button>
                              </div>
                            </div>

                            <div className="staging-form-col">
                              <div className="detection-banner-row">
                                <div className="detection-badges">
                                  <span className={`kind-badge kind-${item.documentKind}`}>
                                    {getKindLabel(item.documentKind)}
                                  </span>
                                  <span className="dest-badge">→ {getDestinationLabel(item.destination)}</span>
                                  <span className="class-detected-badge">
                                    🎓 {item.grade} • {item.subject}
                                  </span>
                                  <span className="ai-confidence-badge">IA {item.confidence}%</span>
                                </div>
                                <div className="file-origin-meta">
                                  <span>📁 {item.folderPath}</span>
                                  <span>•</span>
                                  <span>{item.fileName}</span>
                                </div>
                              </div>

                              <div className="staging-fields-grid">
                                <div className="field-group span-2">
                                  <label>Titre de l’ouvrage / fascicule / document</label>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => handleUpdateStagingItem(item.id, { title: e.target.value })}
                                  />
                                </div>

                                <div className="field-group">
                                  <label>Auteur détecté</label>
                                  <input
                                    type="text"
                                    value={item.author}
                                    onChange={(e) => handleUpdateStagingItem(item.id, { author: e.target.value })}
                                  />
                                </div>

                                <div className="field-group">
                                  <label>Institution / Éditeur</label>
                                  <input
                                    type="text"
                                    value={item.institution}
                                    onChange={(e) => handleUpdateStagingItem(item.id, { institution: e.target.value })}
                                  />
                                </div>

                                <div className="field-group">
                                  <label>Type de ressource</label>
                                  <select
                                    value={item.documentKind}
                                    onChange={(e) => {
                                      const nextKind = e.target.value as DetectedDocumentKind;
                                      let nextDest = item.destination;
                                      if (nextKind === 'document') nextDest = 'documents';
                                      if (nextKind === 'fascicule') nextDest = 'education';
                                      handleUpdateStagingItem(item.id, {
                                        documentKind: nextKind,
                                        destination: nextDest,
                                      });
                                    }}
                                  >
                                    <option value="livre">📘 Livre / Manuel scolaire</option>
                                    <option value="fascicule">📙 Fascicule d’exercices (Éducation)</option>
                                    <option value="cours">📗 Cours & Fiche de révision</option>
                                    <option value="annale">🏆 Annale Examen / Concours</option>
                                    <option value="document">📄 Document Administratif</option>
                                    <option value="ouvrage_religieux">🕌 Ouvrage Religieux</option>
                                  </select>
                                </div>

                                <div className="field-group">
                                  <label>Catégorie de destination</label>
                                  <select
                                    value={item.destination}
                                    onChange={(e) =>
                                      handleUpdateStagingItem(item.id, {
                                        destination: e.target.value as AdminDestinationCategory,
                                      })
                                    }
                                  >
                                    <option value="education">🎓 Éducation (Par Classe)</option>
                                    <option value="bibliotheque">📚 Bibliothèque Générale</option>
                                    <option value="concours">🏆 Concours Nationaux</option>
                                    <option value="documents">📄 Documents Officiels</option>
                                    <option value="religion">🕌 Religion & Spiritualités</option>
                                  </select>
                                </div>

                                <div className="field-group">
                                  <label>Cycle Éducatif</label>
                                  <select
                                    value={item.cycle}
                                    onChange={(e) => {
                                      const nextCycle = e.target.value as EducationCycleId;
                                      const defaultGrade = ALL_GRADES_BY_CYCLE[nextCycle]?.[0] || 'Terminale S2';
                                      handleUpdateStagingItem(item.id, {
                                        cycle: nextCycle,
                                        grade: defaultGrade,
                                      });
                                    }}
                                  >
                                    <option value="prescolaire">Préscolaire</option>
                                    <option value="primaire">Primaire (CI au CM2)</option>
                                    <option value="college">Collège (6e à 3e / BFEM)</option>
                                    <option value="lycee">Lycée (2nde, 1ère, Terminale)</option>
                                    <option value="universite">Université (Licence, Master, Doctorat)</option>
                                    <option value="formation_pro">Formation Pro (CAP, BEP, BTS)</option>
                                  </select>
                                </div>

                                <div className="field-group">
                                  <label>Classe exacte</label>
                                  <select
                                    value={item.grade}
                                    onChange={(e) => handleUpdateStagingItem(item.id, { grade: e.target.value })}
                                  >
                                    {gradesForCycle.map((g) => (
                                      <option key={g} value={g}>
                                        {g}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="field-group">
                                  <label>Matière</label>
                                  <select
                                    value={item.subject}
                                    onChange={(e) => handleUpdateStagingItem(item.id, { subject: e.target.value })}
                                  >
                                    {ALL_SUBJECTS.map((subj) => (
                                      <option key={subj} value={subj}>
                                        {subj}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="field-group">
                                  <label>Accès</label>
                                  <select
                                    value={item.accessLevel}
                                    onChange={(e) =>
                                      handleUpdateStagingItem(item.id, {
                                        accessLevel: e.target.value as AccessLevel,
                                      })
                                    }
                                  >
                                    <option value="free">Gratuit</option>
                                    <option value="subscription">Abonnement</option>
                                    <option value="premium">Gold</option>
                                  </select>
                                </div>
                              </div>

                              <div className="staging-card-footer">
                                <button
                                  type="button"
                                  className="btn-remove-item"
                                  onClick={() => handleRemoveStagingItem(item.id)}
                                >
                                  Retirer
                                </button>
                                <button
                                  type="button"
                                  className="btn-publish-single"
                                  onClick={() => handlePublishSingle(item)}
                                >
                                  ✓ Publier dans {getDestinationLabel(item.destination)}
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===============================================================
                VUE 4 : MATRICE ÉDUCATION PAR CLASSE (LIVRES VS FASCICULES)
               =============================================================== */}
            {activeTab === 'classes' && (
              <div className="quix-subpage-container">
                <div className="quix-card" style={{ marginBottom: '20px' }}>
                  <h2 className="quix-card-title" style={{ fontSize: '18px', marginBottom: '6px' }}>
                    Matrice Éducation par Classe : Livres de cours vs Fascicules d’exercices
                  </h2>
                  <p className="quix-card-sub">
                    Sélectionnez n’importe quelle classe pour importer directement un livre ou un fascicule dédié à ce niveau.
                  </p>
                </div>

                {(['primaire', 'college', 'lycee', 'universite', 'formation_pro'] as EducationCycleId[]).map(
                  (cycleId) => {
                    const cycleTitles: Record<EducationCycleId, string> = {
                      prescolaire: 'Préscolaire',
                      primaire: 'Primaire (CI, CP, CE1, CE2, CM1, CM2 / CFEE)',
                      college: 'Collège (6e, 5e, 4e, 3e / BFEM)',
                      lycee: 'Lycée (Seconde, Première, Terminale S1, S2, L2)',
                      universite: 'Université (Licence 1, 2, 3, Master, Doctorat)',
                      formation_pro: 'Formation Professionnelle (CAP, BEP, BTS)',
                    };
                    const grades = ALL_GRADES_BY_CYCLE[cycleId];

                    return (
                      <div key={cycleId} className="cycle-matrix-block">
                        <h3 className="cycle-matrix-title">{cycleTitles[cycleId]}</h3>
                        <div className="grades-matrix-grid">
                          {grades.map((gradeName) => {
                            const adminForGrade = publishedItems.filter(
                              (i) => i.grade.toLowerCase() === gradeName.toLowerCase()
                            );
                            const mockLibForGrade = (MOCK_RESOURCES || []).filter((r) =>
                              r.level.grade.toLowerCase().includes(gradeName.split(' ')[0].toLowerCase())
                            );
                            const mockEduForGrade = (INITIAL_EDUCATION_RESOURCES || []).filter(
                              (r) =>
                                r.level === cycleId &&
                                (!r.grade || r.grade.toLowerCase().includes(gradeName.split(' ')[0].toLowerCase()))
                            );

                            const booksCount =
                              adminForGrade.filter((i) => i.documentKind === 'livre').length +
                              mockLibForGrade.filter((r) => r.resourceType === 'livre' || r.category === 'Livres').length;

                            const fasciculesCount =
                              adminForGrade.filter(
                                (i) => i.documentKind === 'fascicule' || i.documentKind === 'cours'
                              ).length + mockEduForGrade.length;

                            return (
                              <div key={gradeName} className="quix-card grade-matrix-card">
                                <div className="grade-card-top">
                                  <span className="grade-name-badge">{gradeName}</span>
                                  <span className="grade-total-pill">
                                    {booksCount + fasciculesCount} ressources
                                  </span>
                                </div>
                                <div className="grade-breakdown-list">
                                  <div className="breakdown-row">
                                    <span>📘 Livres & Manuels</span>
                                    <strong>{booksCount}</strong>
                                  </div>
                                  <div className="breakdown-row">
                                    <span>📙 Fascicules Éducation</span>
                                    <strong>{fasciculesCount}</strong>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="btn-upload-for-grade"
                                  onClick={() => {
                                    setPreselectedGradeForUpload({ cycle: cycleId, grade: gradeName });
                                    setActiveTab('ingest');
                                    showToast(`🎯 Classe « ${gradeName} » activée pour le prochain import !`);
                                  }}
                                >
                                  + Importer pour {gradeName}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            {/* ===============================================================
                VUE 5 : CATALOGUE & COUVERTURES PUBLIÉES
               =============================================================== */}
            {activeTab === 'catalog' && (
              <div className="quix-subpage-container">
                <div className="quix-card" style={{ marginBottom: '20px' }}>
                  <div className="catalog-toolbar">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Rechercher un livre, un fascicule, une classe (Terminale S2, CM2...), un auteur..."
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        className="catalog-search-input"
                        style={{ flex: 1 }}
                      />
                      {publishedItems.length > 0 && (
                        <button
                          type="button"
                          className="btn-danger-outline"
                          onClick={handleClearAllPublishedBooks}
                        >
                          🗑️ Supprimer tous les livres importés ({publishedItems.length})
                        </button>
                      )}
                    </div>
                    <div className="catalog-filter-chips">
                      {[
                        { id: 'all', label: 'Tous les éléments importés' },
                        { id: 'livre', label: '📘 Livres' },
                        { id: 'fascicule', label: '📙 Fascicules Éducation' },
                        { id: 'concours', label: '🏆 Concours' },
                        { id: 'documents', label: '📄 Documents' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          className={`c-chip ${catalogDestFilter === tab.id ? 'active' : ''}`}
                          onClick={() => setCatalogDestFilter(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {filteredPublished.length === 0 ? (
                  <div className="quix-card empty-catalog-box">
                    <h3>Aucun nouveau livre ou dossier importé dans ce filtre</h3>
                    <p style={{ color: '#64748b', margin: '8px 0 16px' }}>
                      Cliquez ci-dessous pour simuler l’import d’un dossier de 8 livres et fascicules avec leurs couvertures.
                    </p>
                    <button type="button" className="quix-action-pill-btn primary" onClick={handleLoadDemoFolder}>
                      ✨ Importer un Dossier Démo (8 Livres & Fascicules)
                    </button>
                  </div>
                ) : (
                  <div className="published-catalog-grid">
                    {filteredPublished.map((item) => (
                      <article key={item.id} className="quix-card published-book-card">
                        <div className="pub-cover-stage">
                          <div className="pub-book-3d">
                            <img src={item.coverImage} alt={item.title} className="pub-cover-img" />
                          </div>
                          <span className={`pub-kind-tag kind-${item.documentKind}`}>
                            {getKindLabel(item.documentKind)}
                          </span>
                          <button
                            type="button"
                            className="pub-change-cover-btn"
                            onClick={() => handleTriggerCustomCoverUpload(item.id)}
                          >
                            📷 Couverture
                          </button>
                        </div>

                        <div className="pub-card-body">
                          <div className="pub-meta-top">
                            <span className="pub-dest">{getDestinationLabel(item.destination)}</span>
                            <span className="pub-grade">{item.grade}</span>
                          </div>
                          <h4 className="pub-title">{item.title}</h4>
                          <p className="pub-author">
                            {item.author} • <span>{item.subject}</span>
                          </p>
                          <div className="pub-footer">
                            <span>{item.pagesCount} pages</span>
                            <button
                              type="button"
                              className="pub-delete-btn"
                              onClick={() => handleDeletePublishedItem(item.id)}
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===============================================================
                VUE 6 : PARAMÈTRES PRO (COULEURS, MODE NOIR/BLANC, SUPPRESSIONS)
               =============================================================== */}
            {activeTab === 'settings' && (
              <div className="quix-subpage-container">
                {/* En-tête Paramètres */}
                <div className="quix-card settings-hero-banner">
                  <div>
                    <span className="ai-engine-pill">⚙️ Configuration Générale & Personnalisation</span>
                    <h2 className="dropzone-title" style={{ marginBottom: '4px' }}>
                      Paramètres du Tableau de Bord Sunubiblio
                    </h2>
                    <p className="quix-card-sub">
                      Changez le mode Noir ou Blanc, personnalisez la couleur d’accentuation, configurez l’IA ou supprimez des données.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="quix-action-pill-btn secondary"
                    onClick={handleResetAllSettings}
                  >
                    ♻️ Réinitialiser tous les paramètres
                  </button>
                </div>

                <div className="settings-two-col-grid">
                  {/* CARTE 1 : MODE NOIR OU BLANC (THÈME SOMBRE / CLAIR) */}
                  <div className="quix-card">
                    <div className="quix-card-head">
                      <div>
                        <h3 className="quix-card-title" style={{ fontSize: '16px' }}>
                          1. Apparence : Mode Blanc ou Mode Noir
                        </h3>
                        <p className="quix-card-sub">
                          Basculez instantanément tout le tableau de bord entre le thème clair (Blanc) et le thème sombre (Noir).
                        </p>
                      </div>
                    </div>

                    <div className="theme-mode-cards-row">
                      <button
                        type="button"
                        className={`theme-preview-card light-preview ${themeMode === 'light' ? 'selected' : ''}`}
                        onClick={() => handleToggleThemeMode('light')}
                      >
                        <div className="preview-mockup light-mock">
                          <div className="mock-bar" />
                          <div className="mock-grid">
                            <div className="mock-box accent" />
                            <div className="mock-box" />
                          </div>
                        </div>
                        <div className="preview-label-row">
                          <strong>☀️ Mode Blanc (Clair)</strong>
                          {themeMode === 'light' && <span className="active-check">✓ Actif</span>}
                        </div>
                        <span className="preview-sub">Fond gris-perle lumineux et cartes blanches</span>
                      </button>

                      <button
                        type="button"
                        className={`theme-preview-card dark-preview ${themeMode === 'dark' ? 'selected' : ''}`}
                        onClick={() => handleToggleThemeMode('dark')}
                      >
                        <div className="preview-mockup dark-mock">
                          <div className="mock-bar" />
                          <div className="mock-grid">
                            <div className="mock-box accent" />
                            <div className="mock-box" />
                          </div>
                        </div>
                        <div className="preview-label-row">
                          <strong>🌙 Mode Noir (Sombre)</strong>
                          {themeMode === 'dark' && <span className="active-check">✓ Actif</span>}
                        </div>
                        <span className="preview-sub">Fond noir carbone profond et cartes anthracite</span>
                      </button>
                    </div>
                  </div>

                  {/* CARTE 2 : CHANGER LA COULEUR DU TABLEAU DE BORD */}
                  <div className="quix-card">
                    <div className="quix-card-head">
                      <div>
                        <h3 className="quix-card-title" style={{ fontSize: '16px' }}>
                          2. Couleur Principale du Tableau de Bord
                        </h3>
                        <p className="quix-card-sub">
                          Adaptez la couleur de la carte bancaire, des graphiques, des badges et des boutons.
                        </p>
                      </div>
                    </div>

                    <div className="color-swatches-grid">
                      {(Object.keys(ACCENT_THEMES) as AccentThemeId[]).map((key) => {
                        const swatch = ACCENT_THEMES[key];
                        const isSelected = accentTheme === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            className={`color-swatch-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelectAccentTheme(key)}
                          >
                            <span
                              className="swatch-circle"
                              style={{
                                background: `linear-gradient(135deg, ${swatch.secondary} 0%, ${swatch.primary} 100%)`,
                              }}
                            />
                            <div className="swatch-info">
                              <strong>{swatch.label}</strong>
                              <span>{isSelected ? '✓ Couleur active' : 'Cliquer pour appliquer'}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* CARTE 3 : BOUTONS DE SUPPRESSION & ZONE DE NETTOYAGE */}
                <div className="quix-card danger-zone-card">
                  <div className="quix-card-head">
                    <div>
                      <h3 className="quix-card-title" style={{ fontSize: '16px', color: '#dc2626' }}>
                        3. Boutons de Suppression & Gestion des Données
                      </h3>
                      <p className="quix-card-sub">
                        Supprimez des livres, videz la file d’attente d’analyse IA ou réinitialisez les paiements et abonnements.
                      </p>
                    </div>
                  </div>

                  <div className="danger-actions-grid">
                    <div className="danger-action-item">
                      <div>
                        <strong>Vider la file d’attente d’import IA</strong>
                        <p>Supprime les {stagingItems.length} fichier(s) actuellement en attente de validation.</p>
                      </div>
                      <button
                        type="button"
                        className="btn-danger-solid"
                        onClick={() => {
                          setStagingItems([]);
                          showToast('🗑️ File d’attente d’import IA vidée.');
                        }}
                      >
                        🗑️ Vider la file ({stagingItems.length})
                      </button>
                    </div>

                    <div className="danger-action-item">
                      <div>
                        <strong>Supprimer tous les livres & fascicules importés</strong>
                        <p>Retire les {publishedItems.length} ouvrage(s) ajoutés depuis l’espace Admin.</p>
                      </div>
                      <button
                        type="button"
                        className="btn-danger-solid"
                        onClick={handleClearAllPublishedBooks}
                      >
                        🗑️ Supprimer les livres ({publishedItems.length})
                      </button>
                    </div>

                    <div className="danger-action-item">
                      <div>
                        <strong>Supprimer tous les paiements & abonnements</strong>
                        <p>Remet à zéro la liste des {subscriptions.length} paiements encaissés.</p>
                      </div>
                      <button
                        type="button"
                        className="btn-danger-solid"
                        onClick={handleClearAllSubscriptions}
                      >
                        🗑️ Supprimer les paiements ({subscriptions.length})
                      </button>
                    </div>

                    <div className="danger-action-item">
                      <div>
                        <strong>Restaurer les données de démonstration</strong>
                        <p>Recharge les paiements exemples et restaure les livres initiaux masqués.</p>
                      </div>
                      <button
                        type="button"
                        className="quix-action-pill-btn primary"
                        onClick={() => {
                          handleRestoreDefaultSubscriptions();
                          setDeletedMockIds([]);
                          saveAdminPrefs({ deletedMockIds: [] });
                        }}
                      >
                        ♻️ Restaurer les données démo
                      </button>
                    </div>
                  </div>
                </div>

                {/* CARTE 4 : PRÉFÉRENCES PROFIL & AUTOMATISATION IA */}
                <div className="quix-card">
                  <div className="quix-card-head">
                    <div>
                      <h3 className="quix-card-title" style={{ fontSize: '16px' }}>
                        4. Profil Administrateur & Automatisation IA
                      </h3>
                      <p className="quix-card-sub">
                        Personnalisez le message d’accueil et le comportement lors de l’insertion d’un dossier de livres.
                      </p>
                    </div>
                  </div>

                  <div className="settings-prefs-grid">
                    <div className="field-group">
                      <label>Prénom / Nom de l’Administrateur affiché en haut</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="text"
                          value={adminName}
                          onChange={(e) => {
                            setAdminName(e.target.value);
                            saveAdminPrefs({ adminName: e.target.value });
                          }}
                          placeholder="Ex: Mamadou"
                        />
                        <button
                          type="button"
                          className="quix-action-pill-btn primary"
                          onClick={() => showToast(`✅ Nom d'administrateur enregistré : ${adminName}`)}
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>

                    <div className="toggle-pref-row">
                      <div>
                        <strong>Publication automatique après analyse d’un dossier</strong>
                        <p>
                          Si activé, les livres et fascicules importés sont immédiatement publiés dans leur classe sans passer par la file d’attente.
                        </p>
                      </div>
                      <button
                        type="button"
                        className={`switch-pill-btn ${autoPublishOnScan ? 'on' : 'off'}`}
                        onClick={() => {
                          const next = !autoPublishOnScan;
                          setAutoPublishOnScan(next);
                          saveAdminPrefs({ autoPublishOnScan: next });
                          showToast(
                            next
                              ? '⚡ Publication automatique activée lors de l’import de dossiers !'
                              : '⏸️ Vérification manuelle activée avant publication.'
                          );
                        }}
                      >
                        {autoPublishOnScan ? 'ACTIVÉ ✓' : 'DÉSACTIVÉ'}
                      </button>
                    </div>

                    <div className="toggle-pref-row">
                      <div>
                        <strong>Extraction Haute Définition de la 1re page de couverture</strong>
                        <p>
                          Extrait automatiquement la première page de chaque PDF en qualité studio pour l’afficher au devant du livre.
                        </p>
                      </div>
                      <button
                        type="button"
                        className={`switch-pill-btn ${extractHdCover ? 'on' : 'off'}`}
                        onClick={() => {
                          const next = !extractHdCover;
                          setExtractHdCover(next);
                          saveAdminPrefs({ extractHdCover: next });
                          showToast(
                            next
                              ? '📷 Extraction de couverture HD activée !'
                              : 'Couverture éditoriale standard activée.'
                          );
                        }}
                      >
                        {extractHdCover ? 'ACTIVÉ ✓' : 'DÉSACTIVÉ'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ===================================================================
           QUIXOTIC-INSPIRED SAAS DASHBOARD — ADAPTÉ AUX COULEURS SUNUBIBLIO
           Palette : Fond Gris Perle (#e9edf2 / #f4f6f9), Cartes Blanches (#ffffff),
           Accents Or/Ambre Sunubiblio (#d97706, #f59e0b, #b45309, #fef3c7)
           =================================================================== */
        .quix-admin-shell {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          background: #e9edf2;
          padding: 22px 24px 60px;
          color: #0f172a;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }

        .quix-outer-frame {
          max-width: 1440px;
          margin: 0 auto;
          background: #f4f6f9;
          border-radius: 34px;
          padding: 20px 26px 34px;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        /* TOAST */
        .quix-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 3000;
          background: #0f172a;
          color: #ffffff;
          padding: 14px 20px;
          border-radius: 999px;
          box-shadow: 0 18px 38px rgba(15, 23, 42, 0.25);
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13.5px;
          font-weight: 600;
        }

        .toast-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #f59e0b;
          flex-shrink: 0;
        }

        .quix-toast button {
          color: #94a3b8;
          font-size: 14px;
          margin-left: 6px;
        }

        /* 1. TOP FLOATING PILL NAVBAR */
        .quix-top-pill-nav {
          background: #ffffff;
          border-radius: 999px;
          padding: 8px 16px 8px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
          margin-bottom: 26px;
          min-height: 58px;
        }

        .quix-brand {
          display: inline-flex;
          align-items: center;
          flex-direction: row;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .quix-official-logo-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
        }

        .quix-official-logo-img {
          width: 32px;
          height: 32px;
          object-fit: contain;
          display: block;
        }

        .quix-brand-text {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1;
          display: inline-block;
        }

        .quix-center-tabs {
          display: flex;
          align-items: center;
          background: #f4f6f9;
          padding: 4px;
          border-radius: 999px;
          gap: 4px;
          flex-shrink: 0;
        }

        .quix-nav-tab {
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .quix-nav-tab:hover {
          color: #0f172a;
        }

        .quix-nav-tab.active {
          background: #ffffff;
          color: #0f172a;
          font-weight: 700;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
        }

        .nav-mini-pill {
          background: #fef3c7;
          color: #b45309;
          font-size: 10.5px;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: 999px;
        }

        .nav-mini-pill.warn {
          background: #f59e0b;
          color: #ffffff;
        }

        .quix-nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .quix-circle-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #f4f6f9;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.18s ease;
          cursor: pointer;
          border: none;
        }

        .quix-circle-icon-btn:hover {
          background: #fef3c7;
          color: #b45309;
        }

        .notif-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #d97706;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
        }

        .quix-admin-profile-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 2px 8px 2px 2px;
          border-radius: 999px;
          background: #f4f6f9;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          height: 38px;
        }

        .quix-admin-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }

        .quix-admin-caret {
          font-size: 10px;
          color: #64748b;
        }

        /* 2. WELCOME ROW */
        .quix-welcome-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 0 8px 24px;
          flex-wrap: wrap;
        }

        .quix-welcome-heading {
          font-size: clamp(26px, 3vw, 36px);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin: 0;
        }

        .welcome-muted-name {
          font-weight: 400;
          color: #94a3b8;
        }

        .quix-welcome-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .quix-date-pill {
          background: #ffffff;
          border-radius: 999px;
          padding: 10px 18px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
        }

        .pill-chevron {
          color: #94a3b8;
          font-size: 12px;
        }

        .quix-action-pill-btn {
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .quix-action-pill-btn.secondary {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
        }

        .quix-action-pill-btn.secondary:hover {
          background: var(--q-accent-soft);
          color: var(--q-accent-dark);
        }

        .quix-action-pill-btn.primary {
          background: linear-gradient(135deg, var(--q-accent-sec) 0%, var(--q-accent) 100%);
          color: #ffffff;
          box-shadow: 0 8px 20px var(--q-accent-shadow);
        }

        .quix-action-pill-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px var(--q-accent-shadow);
        }

        /* 3. BODY LAYOUT : LEFT ICON DOCK + CONTENT STAGE */
        .quix-body-layout {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 22px;
          align-items: start;
        }

        .quix-left-dock {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: sticky;
          top: 24px;
        }

        .dock-pill-group {
          background: #ffffff;
          border-radius: 999px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
        }

        .dock-icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          background: transparent;
          transition: all 0.2s ease;
        }

        .dock-icon-btn:hover {
          background: var(--q-accent-soft);
          color: var(--q-accent);
        }

        .dock-icon-btn.active {
          background: linear-gradient(135deg, var(--q-accent-sec) 0%, var(--q-accent) 100%);
          color: #ffffff;
          box-shadow: 0 6px 16px var(--q-accent-shadow);
        }

        /* BENTO 3-COLUMN GRID */
        .quix-bento-grid {
          display: grid;
          grid-template-columns: 310px 1fr 320px;
          gap: 20px;
          align-items: start;
        }

        .bento-col-left,
        .bento-col-center,
        .bento-col-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .quix-card {
          background: #ffffff;
          border-radius: 26px;
          padding: 22px;
          box-shadow: 0 4px 22px rgba(15, 23, 42, 0.03);
        }

        .quix-card-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .quix-card-title {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2px;
        }

        .quix-card-sub {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
          font-weight: 500;
        }

        .quix-arrow-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #f4f6f9;
          color: #475569;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.18s ease;
        }

        .quix-arrow-circle.small {
          width: 28px;
          height: 28px;
          font-size: 12px;
          background: #ffffff;
        }

        .quix-arrow-circle:hover {
          background: var(--q-accent-soft);
          color: var(--q-accent-dark);
        }

        /* SUNUBIBLIO WALLET CARD (Couleur dynamique pilotée par Paramètres) */
        .sunu-gold-wallet-card {
          background: linear-gradient(135deg, var(--q-accent) 0%, var(--q-accent-dark) 100%);
          border-radius: 20px;
          padding: 20px;
          color: #ffffff;
          box-shadow: 0 14px 28px -6px var(--q-accent-shadow);
          position: relative;
          overflow: hidden;
        }

        .sunu-gold-wallet-card::after {
          content: '';
          position: absolute;
          right: -30px;
          bottom: -40px;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, transparent 70%);
          pointer-events: none;
        }

        .wallet-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .wallet-brand-label {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .wallet-sub-caption {
          display: block;
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.78);
          margin-bottom: 6px;
        }

        .wallet-main-amount {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
        }

        .wallet-main-amount small {
          font-size: 14px;
          font-weight: 700;
          opacity: 0.9;
        }

        .wallet-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.84);
          font-weight: 600;
        }

        /* COMPACT WEEKLY REVENUE CARD */
        .compact-metric-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 22px;
        }

        .compact-big-num {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 4px;
          letter-spacing: -0.02em;
        }

        .quix-growth-pill {
          background: linear-gradient(135deg, var(--q-accent-sec) 0%, var(--q-accent) 100%);
          color: #ffffff;
          font-size: 11.5px;
          font-weight: 800;
          padding: 5px 11px;
          border-radius: 999px;
        }

        /* CENTER BAR CHART CARD */
        .card-head-with-icon {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .soft-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--q-accent-soft);
          border: 1px solid var(--q-accent-border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chart-controls-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: nowrap;
        }

        .quix-segmented-switch {
          background: #f4f6f9;
          padding: 3px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
        }

        .seg-btn {
          padding: 5px 13px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 700;
          color: #64748b;
          transition: all 0.18s ease;
        }

        .seg-btn.active {
          background: linear-gradient(135deg, var(--q-accent-sec) 0%, var(--q-accent) 100%);
          color: #ffffff;
          box-shadow: 0 2px 8px var(--q-accent-shadow);
        }

        .quix-bars-stage {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 12px;
          height: 230px;
          padding-top: 24px;
        }

        .y-axis-labels {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 11px;
          color: #94a3b8;
          font-weight: 600;
          padding-bottom: 24px;
        }

        .bars-columns-wrap {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 14px;
          align-items: end;
          height: 100%;
        }

        .bar-col-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
        }

        .bar-track-area {
          flex: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          position: relative;
        }

        .bar-floating-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 4px;
        }

        .bar-floating-pill span {
          background: var(--q-accent);
          color: #ffffff;
          font-size: 10.5px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 999px;
          margin-bottom: 4px;
          white-space: nowrap;
        }

        .bar-top-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--q-accent);
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 2px var(--q-accent-border);
        }

        /* Barres arrondies hachurées en diagonale dynamiques selon la couleur choisie */
        .quix-pill-bar {
          width: 100%;
          max-width: 54px;
          border-radius: 999px;
          background-color: var(--q-accent-border);
          background-image: repeating-linear-gradient(
            -45deg,
            var(--q-stripe-a),
            var(--q-stripe-a) 5px,
            var(--q-stripe-b) 5px,
            var(--q-stripe-b) 10px
          );
          transition: height 0.35s ease;
        }

        .quix-pill-bar.is-peak {
          background-color: var(--q-accent);
          background-image: repeating-linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.14),
            rgba(255, 255, 255, 0.14) 5px,
            transparent 5px,
            transparent 10px
          );
          box-shadow: 0 10px 22px var(--q-accent-shadow);
        }

        .bar-x-label {
          margin-top: 8px;
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
        }

        /* PAYMENT & BOOK HISTORY TABLE */
        .history-head-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .quix-clean-table {
          width: 100%;
          overflow-x: auto;
        }

        .q-thead {
          display: grid;
          grid-template-columns: 2fr 1fr 0.9fr 1fr 1.3fr;
          gap: 12px;
          font-size: 11.5px;
          font-weight: 600;
          color: #94a3b8;
          padding: 0 8px 10px;
          border-bottom: 1px solid #f1f5f9;
        }

        .q-tbody {
          display: flex;
          flex-direction: column;
        }

        .q-trow {
          display: grid;
          grid-template-columns: 2fr 1fr 0.9fr 1fr 1.3fr;
          gap: 12px;
          align-items: center;
          padding: 12px 8px;
          border-bottom: 1px solid #f8fafc;
        }

        /* Vue dédiée Abonnements & Paiements avec 6 colonnes parfaites */
        .subscriptions-detail-table .sub-detail-thead,
        .subscriptions-detail-table .sub-detail-trow {
          display: grid;
          grid-template-columns: 2.2fr 1.6fr 1.2fr 1.4fr 1fr 1.4fr;
          gap: 14px;
          align-items: center;
        }

        .q-cell-main {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .method-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          flex-shrink: 0;
          background: #fef3c7;
          color: #b45309;
        }

        .method-wave {
          background: #e0f2fe;
          color: #0369a1;
        }

        .method-orange-money {
          background: #ffedd5;
          color: #c2410c;
        }

        .mini-book-cover-thumb {
          width: 28px;
          height: 34px;
          border-radius: 4px;
          object-fit: cover;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);
        }

        .q-row-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .q-row-sub {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }

        .q-cell-text {
          font-size: 12.5px;
          color: #475569;
          font-weight: 600;
        }

        .q-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #b45309;
          font-size: 11.5px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f59e0b;
        }

        .q-cell-amount {
          text-align: right;
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
        }

        /* RIGHT COLUMN CARDS */
        .balance-center-block {
          text-align: center;
          margin: 6px 0 10px;
        }

        .balance-small-label {
          font-size: 11.5px;
          color: #94a3b8;
          font-weight: 600;
        }

        .balance-huge-num {
          font-size: 30px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin-top: 2px;
        }

        .balance-decimal {
          color: #94a3b8;
          font-weight: 600;
          font-size: 22px;
        }

        .mini-area-chart-wrap {
          height: 86px;
          margin: 0 -10px 12px;
        }

        .mini-area-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .dual-pill-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .dual-btn {
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.18s ease;
        }

        .dual-btn.primary-amber {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          box-shadow: 0 6px 16px rgba(217, 119, 6, 0.28);
        }

        .dual-btn.light-pill {
          background: #f4f6f9;
          color: #334155;
        }

        .dual-btn.light-pill:hover {
          background: #fef3c7;
          color: #b45309;
        }

        .credit-amount-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .credit-big-figure {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
        }

        .credit-muted-part {
          font-size: 16px;
          color: #94a3b8;
          font-weight: 600;
          margin-left: 4px;
        }

        .mandatory-inner-box {
          background: #f4f6f9;
          border-radius: 20px;
          padding: 14px 16px;
        }

        .inner-box-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2px;
        }

        .avatar-stack-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stacked-avatar-item {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: #92400e;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
        }

        .stacked-plus-badge {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
        }

        /* SUBPAGES (ABONNEMENTS, IMPORT IA, CLASSES, CATALOGUE) */
        .quix-subpage-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .subpage-top-kpis {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .sub-kpi {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sub-kpi-val {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
        }

        .sub-kpi-val.amber {
          color: #d97706;
        }

        .sub-kpi-foot {
          font-size: 12px;
          color: #64748b;
        }

        .preselected-class-banner {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          color: #92400e;
          padding: 12px 18px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13.5px;
        }

        .preselected-class-banner button {
          background: #92400e;
          color: #ffffff;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }

        .bulk-dropzone-panel {
          border: 2px dashed #fcd34d;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 28px;
          align-items: center;
        }

        .ai-engine-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #b45309;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 999px;
          margin-bottom: 12px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f59e0b;
        }

        .dropzone-title {
          font-size: 22px;
          font-weight: 800;
          margin: 0 0 8px;
        }

        .dropzone-desc {
          font-size: 13.5px;
          color: #64748b;
          margin: 0 0 10px;
        }

        .dropzone-capabilities-list {
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 13px;
          color: #334155;
        }

        .dropzone-actions-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .import-action-card {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          text-align: left;
          padding: 15px 18px;
          border-radius: 18px;
          transition: all 0.2s ease;
        }

        .folder-card {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          color: #ffffff;
          box-shadow: 0 10px 24px rgba(180, 83, 9, 0.25);
        }

        .files-card {
          background: #fffbeb;
          color: #0f172a;
          border: 1.5px solid #fde68a;
        }

        .action-card-icon {
          font-size: 26px;
        }

        .action-card-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .action-card-text strong {
          font-size: 14.5px;
          font-weight: 800;
        }

        .action-card-text span {
          font-size: 11.5px;
          opacity: 0.85;
        }

        .demo-batch-btn {
          background: #f4f6f9;
          color: #334155;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 12.5px;
          font-weight: 700;
        }

        .analysis-progress-box {
          background: #0f172a;
          color: #ffffff;
          border-radius: 20px;
          padding: 18px 22px;
        }

        .progress-head {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
          margin-bottom: 8px;
        }

        .progress-track {
          height: 8px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
        }

        .progress-sub {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
        }

        .staging-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 16px;
        }

        .staging-header-left h2 {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 4px;
        }

        .staging-header-left p {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        .staging-header-actions {
          display: flex;
          gap: 10px;
        }

        .btn-clear-staging {
          background: #f4f6f9;
          color: #475569;
          padding: 9px 16px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
        }

        .btn-publish-all {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(217, 119, 6, 0.28);
        }

        .staging-filter-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .s-pill {
          padding: 6px 14px;
          border-radius: 999px;
          background: #f4f6f9;
          color: #475569;
          font-size: 12px;
          font-weight: 700;
        }

        .s-pill.active {
          background: #d97706;
          color: #ffffff;
        }

        .staging-cards-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .staging-item-card {
          display: grid;
          grid-template-columns: 170px 1fr;
          gap: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 18px;
        }

        .staging-cover-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .cover-preview-frame {
          width: 140px;
          height: 196px;
          border-radius: 4px 10px 10px 4px;
          overflow: hidden;
          position: relative;
          box-shadow: -3px 0 6px rgba(0, 0, 0, 0.16), 8px 14px 24px rgba(15, 23, 42, 0.2);
          background: #0f172a;
        }

        .cover-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cover-source-tag {
          position: absolute;
          bottom: 6px;
          left: 6px;
          right: 6px;
          text-align: center;
          background: rgba(15, 23, 42, 0.85);
          color: #fbbf24;
          font-size: 9.5px;
          font-weight: 800;
          padding: 3px 5px;
          border-radius: 6px;
        }

        .cover-actions-stack {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 140px;
        }

        .cover-mini-btn {
          width: 100%;
          padding: 6px 8px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
        }

        .staging-form-col {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 12px;
        }

        .detection-banner-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        .detection-badges {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .kind-badge,
        .dest-badge,
        .class-detected-badge,
        .ai-confidence-badge {
          font-size: 11px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 999px;
        }

        .kind-badge {
          background: #fef3c7;
          color: #b45309;
        }

        .dest-badge {
          background: #e2e8f0;
          color: #0f172a;
        }

        .class-detected-badge {
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #92400e;
        }

        .ai-confidence-badge {
          background: #ecfdf5;
          color: #059669;
        }

        .file-origin-meta {
          font-size: 11px;
          color: #64748b;
          display: flex;
          gap: 6px;
        }

        .staging-fields-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .field-group.span-2 {
          grid-column: span 2;
        }

        .field-group label {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
        }

        .field-group input,
        .field-group select {
          height: 36px;
          padding: 0 10px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          font-size: 12.5px;
          font-weight: 600;
          color: #0f172a;
        }

        .staging-card-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-remove-item {
          border: 1px solid #fca5a5;
          color: #dc2626;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }

        .btn-publish-single {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          padding: 7px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }

        /* MATRICE CLASSES */
        .cycle-matrix-block {
          margin-bottom: 24px;
        }

        .cycle-matrix-title {
          font-size: 15px;
          font-weight: 800;
          margin: 0 0 12px;
          padding-left: 10px;
          border-left: 4px solid #f59e0b;
        }

        .grades-matrix-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 14px;
        }

        .grade-matrix-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px;
        }

        .grade-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .grade-name-badge {
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #b45309;
          font-size: 12.5px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .grade-total-pill {
          font-size: 11.5px;
          color: #64748b;
          font-weight: 700;
        }

        .grade-breakdown-list {
          background: #f8fafc;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #334155;
        }

        .btn-upload-for-grade {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }

        /* CATALOGUE PUBLIÉ */
        .catalog-toolbar {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .catalog-search-input {
          width: 100%;
          height: 44px;
          padding: 0 18px;
          border-radius: 999px;
          background: #f4f6f9;
          font-size: 13.5px;
          color: #0f172a;
        }

        .catalog-filter-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .c-chip {
          padding: 6px 14px;
          border-radius: 999px;
          background: #f4f6f9;
          color: #475569;
          font-size: 12px;
          font-weight: 700;
        }

        .c-chip.active {
          background: #d97706;
          color: #ffffff;
        }

        .empty-catalog-box {
          text-align: center;
          padding: 48px 24px;
        }

        .published-catalog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 18px;
        }

        .published-book-card {
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .pub-cover-stage {
          height: 196px;
          background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 14px;
        }

        .pub-book-3d {
          width: 110px;
          height: 156px;
          border-radius: 3px 8px 8px 3px;
          overflow: hidden;
          box-shadow: -3px 0 6px rgba(0, 0, 0, 0.2), 6px 12px 22px rgba(15, 23, 42, 0.22);
        }

        .pub-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pub-kind-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(255, 255, 255, 0.92);
          color: #92400e;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 999px;
        }

        .pub-change-cover-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(15, 23, 42, 0.82);
          color: #ffffff;
          font-size: 10.5px;
          font-weight: 700;
          padding: 4px 9px;
          border-radius: 999px;
        }

        .pub-card-body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .pub-meta-top {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 4px;
        }

        .pub-grade {
          color: #d97706;
        }

        .pub-title {
          font-size: 13.5px;
          font-weight: 800;
          margin: 0 0 4px;
          line-height: 1.35;
        }

        .pub-author {
          font-size: 11.5px;
          color: #64748b;
          margin: 0 0 10px;
        }

        .pub-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 8px;
          border-top: 1px solid #f1f5f9;
          font-size: 11.5px;
          color: #64748b;
        }

        .pub-delete-btn {
          color: #dc2626;
          font-size: 11px;
          font-weight: 700;
        }

        /* ===================================================================
           POPOVERS, RECHERCHE GLOBALE & BOUTONS DE SUPPRESSION PAR LIGNE
           =================================================================== */
        .quix-popover-anchor {
          position: relative;
        }

        .quix-circle-icon-btn.active-circle {
          background: var(--q-accent);
          color: #ffffff;
        }

        .quix-dropdown-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          z-index: 2500;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 14px;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.16);
          min-width: 280px;
        }

        .notif-panel {
          width: 340px;
        }

        .profile-panel {
          width: 290px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .date-panel {
          width: 260px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dropdown-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 10px;
          margin-bottom: 8px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 13px;
        }

        .dropdown-text-btn {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--q-accent);
          background: var(--q-accent-soft);
          padding: 4px 10px;
          border-radius: 999px;
        }

        .dropdown-notif-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 240px;
          overflow-y: auto;
        }

        .dropdown-notif-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 12px;
          background: #f8fafc;
        }

        .notif-item-left {
          display: flex;
          flex-direction: column;
          font-size: 12px;
        }

        .notif-item-left span {
          font-size: 11px;
          color: #64748b;
        }

        .notif-del-mini {
          font-size: 13px;
          padding: 4px 6px;
          border-radius: 8px;
        }

        .notif-del-mini:hover {
          background: #fee2e2;
        }

        .dropdown-panel-foot {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid #f1f5f9;
          text-align: center;
        }

        .dropdown-panel-foot button {
          font-size: 12px;
          font-weight: 700;
          color: var(--q-accent);
        }

        .profile-menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          text-align: left;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 12.5px;
          font-weight: 700;
          color: #334155;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .profile-menu-item:hover {
          background: #f1f5f9;
        }

        .profile-menu-item.danger-link {
          color: #dc2626;
        }

        .date-option-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
          text-align: left;
        }

        .date-option-btn.active,
        .date-option-btn:hover {
          background: var(--q-accent-soft);
          color: var(--q-accent-dark);
          font-weight: 700;
        }

        .quix-global-search-bar {
          background: #ffffff;
          border: 2px solid var(--q-accent);
          border-radius: 999px;
          padding: 8px 16px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
        }

        .quix-global-search-bar input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 13.5px;
          font-weight: 600;
          color: #0f172a;
        }

        .search-go-btn {
          background: var(--q-accent);
          color: #ffffff;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }

        .search-close-btn {
          color: #64748b;
          font-size: 14px;
          padding: 4px 8px;
        }

        .q-cell-amount-with-del {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
        }

        .row-del-icon-btn {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 4px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .row-del-icon-btn:hover {
          background: #dc2626;
          color: #ffffff;
        }

        .btn-danger-outline {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          color: #dc2626;
          padding: 9px 16px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-danger-outline:hover {
          background: #dc2626;
          color: #ffffff;
        }

        .btn-danger-solid {
          background: #dc2626;
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 800;
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.25);
          white-space: nowrap;
        }

        .btn-danger-solid:hover {
          background: #b91c1c;
        }

        /* ===================================================================
           STYLES DE LA VUE 6 : PARAMÈTRES PRO (NOIR/BLANC, COULEURS, SUPPRESSION)
           =================================================================== */
        .settings-hero-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .settings-two-col-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .theme-mode-cards-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .theme-preview-card {
          border: 2px solid #e2e8f0;
          border-radius: 20px;
          padding: 14px;
          text-align: left;
          background: #f8fafc;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .theme-preview-card.selected {
          border-color: var(--q-accent);
          box-shadow: 0 0 0 3px var(--q-accent-soft);
        }

        .preview-mockup {
          height: 84px;
          border-radius: 12px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .light-mock {
          background: #e9edf2;
          border: 1px solid #cbd5e1;
        }

        .light-mock .mock-bar {
          height: 12px;
          border-radius: 999px;
          background: #ffffff;
        }

        .light-mock .mock-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          flex: 1;
        }

        .light-mock .mock-box {
          background: #ffffff;
          border-radius: 8px;
        }

        .light-mock .mock-box.accent,
        .dark-mock .mock-box.accent {
          background: var(--q-accent);
        }

        .dark-mock {
          background: #090d16;
          border: 1px solid #334155;
        }

        .dark-mock .mock-bar {
          height: 12px;
          border-radius: 999px;
          background: #1e293b;
        }

        .dark-mock .mock-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          flex: 1;
        }

        .dark-mock .mock-box {
          background: #1e293b;
          border-radius: 8px;
        }

        .preview-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13.5px;
          color: #0f172a;
        }

        .active-check {
          background: var(--q-accent);
          color: #ffffff;
          font-size: 10.5px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .preview-sub {
          font-size: 11.5px;
          color: #64748b;
        }

        .color-swatches-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .color-swatch-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 14px;
          border: 2px solid #e2e8f0;
          background: #f8fafc;
          text-align: left;
          transition: all 0.18s ease;
        }

        .color-swatch-btn.selected {
          border-color: var(--q-accent);
          background: var(--q-accent-soft);
        }

        .swatch-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .swatch-info {
          display: flex;
          flex-direction: column;
        }

        .swatch-info strong {
          font-size: 12.5px;
          color: #0f172a;
        }

        .swatch-info span {
          font-size: 10.5px;
          color: #64748b;
        }

        .danger-zone-card {
          border: 1.5px solid #fecaca;
        }

        .danger-actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .danger-action-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 16px;
          background: #fef2f2;
          border: 1px solid #fee2e2;
        }

        .danger-action-item strong {
          display: block;
          font-size: 13.5px;
          color: #0f172a;
          margin-bottom: 2px;
        }

        .danger-action-item p {
          margin: 0;
          font-size: 11.5px;
          color: #64748b;
        }

        .settings-prefs-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .toggle-pref-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 16px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .toggle-pref-row strong {
          display: block;
          font-size: 13.5px;
          margin-bottom: 2px;
        }

        .toggle-pref-row p {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }

        .switch-pill-btn {
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .switch-pill-btn.on {
          background: var(--q-accent);
          color: #ffffff;
        }

        .switch-pill-btn.off {
          background: #e2e8f0;
          color: #475569;
        }

        /* ===================================================================
           MODE NOIR (THÈME SOMBRE PRO — .theme-dark)
           =================================================================== */
        .quix-admin-shell.theme-dark {
          background: #070b14;
          color: #f8fafc;
        }

        .quix-admin-shell.theme-dark .quix-outer-frame {
          background: #0f172a;
          border-color: #1e293b;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.55);
        }

        .quix-admin-shell.theme-dark .quix-top-pill-nav,
        .quix-admin-shell.theme-dark .dock-pill-group,
        .quix-admin-shell.theme-dark .quix-card,
        .quix-admin-shell.theme-dark .quix-date-pill,
        .quix-admin-shell.theme-dark .quix-action-pill-btn.secondary,
        .quix-admin-shell.theme-dark .quix-dropdown-panel,
        .quix-admin-shell.theme-dark .quix-global-search-bar {
          background: #1e293b;
          color: #f8fafc;
          border-color: #334155;
        }

        .quix-admin-shell.theme-dark .quix-brand-text,
        .quix-admin-shell.theme-dark .quix-welcome-heading,
        .quix-admin-shell.theme-dark .quix-card-title,
        .quix-admin-shell.theme-dark .compact-big-num,
        .quix-admin-shell.theme-dark .balance-huge-num,
        .quix-admin-shell.theme-dark .credit-big-figure,
        .quix-admin-shell.theme-dark .inner-box-title,
        .quix-admin-shell.theme-dark .q-row-title,
        .quix-admin-shell.theme-dark .q-cell-amount,
        .quix-admin-shell.theme-dark .q-cell-amount-with-del,
        .quix-admin-shell.theme-dark .sub-kpi-val,
        .quix-admin-shell.theme-dark .preview-label-row,
        .quix-admin-shell.theme-dark .swatch-info strong,
        .quix-admin-shell.theme-dark .danger-action-item strong,
        .quix-admin-shell.theme-dark .quix-global-search-bar input {
          color: #f8fafc;
        }

        .quix-admin-shell.theme-dark .quix-center-tabs,
        .quix-admin-shell.theme-dark .quix-circle-icon-btn,
        .quix-admin-shell.theme-dark .quix-admin-profile-pill,
        .quix-admin-shell.theme-dark .quix-arrow-circle,
        .quix-admin-shell.theme-dark .quix-segmented-switch,
        .quix-admin-shell.theme-dark .dual-btn.light-pill,
        .quix-admin-shell.theme-dark .mandatory-inner-box,
        .quix-admin-shell.theme-dark .catalog-search-input,
        .quix-admin-shell.theme-dark .c-chip,
        .quix-admin-shell.theme-dark .s-pill,
        .quix-admin-shell.theme-dark .grade-breakdown-list,
        .quix-admin-shell.theme-dark .staging-item-card,
        .quix-admin-shell.theme-dark .theme-preview-card,
        .quix-admin-shell.theme-dark .color-swatch-btn,
        .quix-admin-shell.theme-dark .toggle-pref-row,
        .quix-admin-shell.theme-dark .dropdown-notif-item {
          background: #0f172a;
          color: #cbd5e1;
          border-color: #334155;
        }

        .quix-admin-shell.theme-dark .quix-nav-tab {
          color: #94a3b8;
        }

        .quix-admin-shell.theme-dark .quix-nav-tab.active {
          background: var(--q-accent);
          color: #ffffff;
        }

        .quix-admin-shell.theme-dark .q-thead,
        .quix-admin-shell.theme-dark .q-trow,
        .quix-admin-shell.theme-dark .pub-footer,
        .quix-admin-shell.theme-dark .staging-header-bar {
          border-color: #334155;
        }

        .quix-admin-shell.theme-dark .q-cell-text,
        .quix-admin-shell.theme-dark .breakdown-row,
        .quix-admin-shell.theme-dark .dropzone-capabilities-list,
        .quix-admin-shell.theme-dark .profile-menu-item,
        .quix-admin-shell.theme-dark .date-option-btn {
          color: #cbd5e1;
        }

        .quix-admin-shell.theme-dark .danger-action-item {
          background: rgba(220, 38, 38, 0.12);
          border-color: rgba(220, 38, 38, 0.35);
        }

        .quix-admin-shell.theme-dark .field-group input,
        .quix-admin-shell.theme-dark .field-group select {
          background: #0f172a;
          border-color: #334155;
          color: #f8fafc;
        }

        @media (max-width: 1200px) {
          .quix-bento-grid,
          .settings-two-col-grid,
          .danger-actions-grid {
            grid-template-columns: 1fr;
          }
          .bulk-dropzone-panel {
            grid-template-columns: 1fr;
          }
          .chart-controls-right {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 992px) {
          .quix-mobile-drawer-trigger {
            display: inline-flex;
          }
          .quix-center-tabs {
            display: none !important;
          }
          .quix-top-pill-nav {
            border-radius: 20px;
            flex-wrap: nowrap;
            justify-content: space-between;
            padding: 10px 14px;
            gap: 10px;
            min-height: 52px;
          }
        }

        @media (max-width: 860px) {
          .quix-admin-shell {
            padding: 12px 10px 84px;
          }
          .quix-outer-frame {
            padding: 14px 12px 24px;
            border-radius: 24px;
          }
          .quix-body-layout {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          /* Rail vertical transformé en Bottom Nav Bar mobile ergonomique */
          .quix-left-dock {
            position: fixed;
            bottom: 12px;
            left: 12px;
            right: 12px;
            top: auto;
            z-index: 2999;
            flex-direction: row;
            justify-content: center;
            background: #ffffff;
            border-radius: 999px;
            padding: 6px 12px;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.22);
            border: 1px solid rgba(255, 255, 255, 0.8);
            gap: 6px;
          }
          .quix-admin-shell.theme-dark .quix-left-dock {
            background: #1e293b;
            border-color: #334155;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
          }
          .dock-pill-group {
            flex-direction: row;
            padding: 0;
            background: transparent;
            box-shadow: none;
            gap: 4px;
          }
          .dock-icon-btn {
            width: 40px;
            height: 40px;
          }
          .quix-welcome-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding: 0 4px 16px;
          }
          .quix-welcome-heading {
            font-size: 24px;
          }
          .quix-welcome-actions {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .quix-date-pill,
          .quix-action-pill-btn {
            width: 100%;
            justify-content: center;
            text-align: center;
          }
          .staging-item-card {
            grid-template-columns: 1fr;
          }
          .staging-fields-grid {
            grid-template-columns: 1fr;
          }
          .field-group.span-2 {
            grid-column: span 1;
          }
          .subpage-top-kpis,
          .theme-mode-cards-row,
          .color-swatches-grid {
            grid-template-columns: 1fr;
          }
          .sub-detail-thead {
            display: none;
          }
          .subscriptions-detail-table .sub-detail-trow {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            padding: 14px;
            background: #f8fafc;
            border-radius: 14px;
            margin-bottom: 8px;
          }
          .quix-admin-shell.theme-dark .subscriptions-detail-table .sub-detail-trow {
            background: #0f172a;
          }
          .subscriptions-detail-table .q-cell-amount-with-del {
            width: 100%;
            justify-content: space-between;
            padding-top: 6px;
            border-top: 1px dashed #e2e8f0;
          }
          .quix-clean-table .q-thead {
            font-size: 10.5px;
            grid-template-columns: 1.6fr 1fr 1fr;
          }
          .quix-clean-table .q-trow {
            grid-template-columns: 1.6fr 1fr 1fr;
          }
          .quix-clean-table .q-cell-text:nth-child(2),
          .quix-clean-table .q-thead span:nth-child(2) {
            display: none;
          }
        }

        /* ===================================================================
           FINITIONS ALIGNEMENT PARFAIT, COMMUTATEUR ET CORBEILLE MODERNE
           =================================================================== */
        .quix-brand-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .quix-mobile-drawer-trigger {
          display: none;
          width: 38px;
          height: 38px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #0f172a;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quix-admin-shell.theme-dark .quix-mobile-drawer-trigger {
          background: #1e293b;
          border-color: #334155;
          color: #f8fafc;
        }

        .modern-return-site-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          text-decoration: none;
          transition: all 0.2s ease;
          margin-top: 4px;
        }

        .modern-return-site-btn:hover {
          background: #fffbeb;
          border-color: #fde68a;
          transform: translateY(-1px);
        }

        .quix-admin-shell.theme-dark .modern-return-site-btn {
          background: #0f172a;
          border-color: #334155;
          color: #f8fafc;
        }

        .return-icon-pill {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--q-accent-sec) 0%, var(--q-accent) 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .return-text-group {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .return-text-group strong {
          font-size: 12.5px;
          font-weight: 700;
        }

        .return-text-group small {
          font-size: 10.5px;
          color: #64748b;
        }

        .return-arrow-chevron {
          font-size: 14px;
          color: #94a3b8;
        }

        /* Corbeille moderne ultra-pro */
        .modern-trash-btn {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .modern-trash-btn:hover {
          background: #dc2626;
          color: #ffffff;
          border-color: #dc2626;
          transform: scale(1.06);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
        }

        .quix-admin-shell.theme-dark .modern-trash-btn {
          background: rgba(220, 38, 38, 0.15);
          border-color: rgba(220, 38, 38, 0.35);
          color: #f87171;
        }

        .quix-admin-shell.theme-dark .modern-trash-btn:hover {
          background: #dc2626;
          color: #ffffff;
        }

        /* Stabilité absolue du tableau central (Images 2 et 3) */
        .unified-bento-table {
          width: 100%;
        }

        .unified-thead,
        .unified-trow {
          display: grid;
          grid-template-columns: 2.2fr 1.3fr 1fr 1fr 1.3fr;
          gap: 12px;
          align-items: center;
        }

        .unified-trow {
          min-height: 52px;
        }

        .history-head-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .history-head-actions .quix-segmented-switch {
          min-width: 260px;
          height: 38px;
        }

        .history-head-actions .seg-btn {
          flex: 1;
          padding: 6px 14px;
          text-align: center;
          justify-content: center;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          font-weight: 700;
        }

        /* Tiroir Latéral Mobile (Drawer) */
        .quix-mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          animation: fadeIn 0.2s ease;
        }

        .quix-mobile-drawer-content {
          width: 310px;
          max-width: 85vw;
          height: 100%;
          background: #ffffff;
          box-shadow: 10px 0 35px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          padding: 20px;
          animation: slideRight 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .quix-admin-shell.theme-dark .quix-mobile-drawer-content {
          background: #0f172a;
          color: #f8fafc;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        .drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .quix-admin-shell.theme-dark .drawer-head {
          border-color: #1e293b;
        }

        .drawer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .drawer-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          cursor: pointer;
        }

        .quix-admin-shell.theme-dark .drawer-close-btn {
          background: #1e293b;
          border-color: #334155;
          color: #cbd5e1;
        }

        .drawer-user-card {
          margin: 16px 0;
          padding: 12px 14px;
          border-radius: 16px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .quix-admin-shell.theme-dark .drawer-user-card {
          background: #1e293b;
        }

        .drawer-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .drawer-user-card div {
          display: flex;
          flex-direction: column;
        }

        .drawer-user-card strong {
          font-size: 13.5px;
        }

        .drawer-user-card span {
          font-size: 11px;
          color: #64748b;
        }

        .drawer-nav-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          overflow-y: auto;
        }

        .drawer-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          background: transparent;
          border: none;
          color: #334155;
          font-size: 13.5px;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
          transition: all 0.18s ease;
          width: 100%;
        }

        .quix-admin-shell.theme-dark .drawer-nav-item {
          color: #cbd5e1;
        }

        .drawer-nav-item:hover {
          background: #f1f5f9;
        }

        .quix-admin-shell.theme-dark .drawer-nav-item:hover {
          background: #1e293b;
        }

        .drawer-nav-item.active {
          background: linear-gradient(135deg, var(--q-accent-sec) 0%, var(--q-accent) 100%);
          color: #ffffff;
          box-shadow: 0 6px 16px var(--q-accent-shadow);
        }

        .drawer-icon {
          font-size: 17px;
        }

        .drawer-badge {
          margin-left: auto;
          background: #fef3c7;
          color: #b45309;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .drawer-badge.warn {
          background: #f59e0b;
          color: #ffffff;
        }

        .drawer-footer {
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
        }

        .quix-admin-shell.theme-dark .drawer-footer {
          border-color: #1e293b;
        }

        .drawer-exit-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 12px;
          background: #f8fafc;
          color: #0f172a;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          justify-content: center;
        }

        .quix-admin-shell.theme-dark .drawer-exit-btn {
          background: #1e293b;
          color: #f8fafc;
        }

      `}</style>
    </div>
  );
}

function getKindLabel(kind: DetectedDocumentKind): string {
  switch (kind) {
    case 'livre':
      return '📘 Livre & Manuel';
    case 'fascicule':
      return '📙 Fascicule Éducation';
    case 'cours':
      return '📗 Cours & Synthèse';
    case 'annale':
      return '🏆 Annale & Corrigé';
    case 'document':
      return '📄 Document Officiel';
    case 'ouvrage_religieux':
      return '🕌 Ouvrage Spirituel';
    default:
      return 'Ressource';
  }
}

function getDestinationLabel(dest: AdminDestinationCategory): string {
  switch (dest) {
    case 'education':
      return 'Éducation';
    case 'bibliotheque':
      return 'Bibliothèque';
    case 'concours':
      return 'Concours';
    case 'documents':
      return 'Documents';
    case 'religion':
      return 'Religion';
    default:
      return 'Catalogue';
  }
}
