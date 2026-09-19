'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';

import { AgendaViewMode, AgendaItem, AgendaItemType } from '@/types/agenda';
import { INITIAL_AGENDA_ITEMS, AGENDA_REFERENCE_DATE } from '@/data/mockAgenda';

import { AgendaHeader } from '@/components/agenda/AgendaHeader';
import { AgendaNavTabs } from '@/components/agenda/AgendaNavTabs';
import { AgendaAppointmentsView } from '@/components/agenda/AgendaAppointmentsView';
import { AgendaTimetableView } from '@/components/agenda/AgendaTimetableView';
import { AgendaCalendarView } from '@/components/agenda/AgendaCalendarView';
import { AgendaNewModal } from '@/components/agenda/AgendaNewModal';
import { AgendaDetailModal } from '@/components/agenda/AgendaDetailModal';

export default function AgendaPage() {
  const router = useRouter();

  // Navigation par onglet dans la même page
  const [activeTab, setActiveTab] = useState<AgendaViewMode>('rendez-vous');

  // Données de l'agenda (modifiables en mémoire pour les ajouts / annulations)
  const [items, setItems] = useState<AgendaItem[]>(INITIAL_AGENDA_ITEMS);

  // Modals
  const [selectedItem, setSelectedItem] = useState<AgendaItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Nombre de rendez-vous actifs (aujourd'hui + à venir)
  const activeAppointmentsCount = useMemo(() => {
    return items.filter(
      (it) =>
        (it.type === 'cours' || it.type === 'rdv' || it.type === 'formation') &&
        (it.status === 'today' || it.status === 'upcoming' || it.status === 'pending')
    ).length;
  }, [items]);

  // Auth handler
  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  // Rejoindre une séance Visio
  const handleJoinVisio = useCallback((item: AgendaItem) => {
    if (item.visioLink) {
      window.open(item.visioLink, '_blank', 'noopener,noreferrer');
    } else {
      router.push('/visio');
    }
  }, [router]);

  // Annulation d'un rendez-vous
  const handleCancelItem = useCallback((item: AgendaItem) => {
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, status: 'cancelled' } : it))
    );
  }, []);

  // Ajout d'un nouvel élément
  const handleCreateItem = useCallback((newItem: AgendaItem) => {
    setItems((prev) => [newItem, ...prev]);
    // Basculer sur l'onglet correspondant
    if (newItem.type === 'cours' || newItem.type === 'rdv') {
      setActiveTab('rendez-vous');
    }
  }, []);

  // État du modal Nouveau rendez-vous
  const [newModalInitialDate, setNewModalInitialDate] = useState<string | undefined>(undefined);
  const [newModalInitialType, setNewModalInitialType] = useState<AgendaItemType | 'visio' | undefined>(undefined);

  const handleOpenNewModal = (date?: string, type?: AgendaItemType | 'visio') => {
    setNewModalInitialDate(date);
    setNewModalInitialType(type);
    setIsNewModalOpen(true);
  };

  return (
    <div className="agenda-page-root">
      {/* Header global de Sunubiblio */}
      <Navbar onOpenAuth={handleOpenAuth} activePage="agenda" />

      <main className="agenda-main-wrapper">
        <div className="container agenda-main-container">
          {/* En-tête de la page Agenda */}
          <AgendaHeader onOpenNewModal={() => handleOpenNewModal()} />

          {/* Navigation principale par onglets */}
          <AgendaNavTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            appointmentsCount={activeAppointmentsCount}
          />

          {/* Contenu dynamique sans rechargement de page */}
          <div className="agenda-tab-content-area" role="tabpanel">
            {activeTab === 'rendez-vous' && (
              <AgendaAppointmentsView
                items={items}
                onSelectItem={setSelectedItem}
                onJoinVisio={handleJoinVisio}
                onCancelItem={handleCancelItem}
                onEmptyCTA={() => router.push('/professeurs')}
              />
            )}

            {activeTab === 'emploi-du-temps' && (
              <AgendaTimetableView
                items={items}
                onSelectItem={setSelectedItem}
                onJoinVisio={handleJoinVisio}
              />
            )}

            {activeTab === 'calendrier' && (
              <AgendaCalendarView
                items={items}
                onSelectItem={setSelectedItem}
                onJoinVisio={handleJoinVisio}
                onCreateItem={handleCreateItem}
                onOpenNewModal={handleOpenNewModal}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer global de Sunubiblio */}
      <Footer />

      {/* Modal Nouveau Rendez-vous (forme repliable, compacte, bordure lumineuse animée) */}
      <AgendaNewModal
        isOpen={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setNewModalInitialDate(undefined);
          setNewModalInitialType(undefined);
        }}
        onCreateItem={handleCreateItem}
        initialDate={newModalInitialDate}
        initialType={newModalInitialType}
      />

      {/* Modal Détail d'un événement */}
      <AgendaDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onJoinVisio={handleJoinVisio}
        onCancelItem={handleCancelItem}
      />

      {/* Modal d'authentification */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <style jsx>{`
        .agenda-page-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          overflow-x: hidden;
        }

        .agenda-main-wrapper {
          flex: 1;
        }

        .agenda-main-container {
          padding-top: 28px;
          /* Marge de sécurité indispensable pour éviter tout chevauchement avec la bottom navigation mobile */
          padding-bottom: 110px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          max-width: 1200px;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .agenda-tab-content-area {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        @media (max-width: 640px) {
          .agenda-main-container {
            padding-top: 14px;
            padding-bottom: 110px;
            padding-left: 12px;
            padding-right: 12px;
            gap: 14px;
          }
        }
      `}</style>
    </div>
  );
}
