'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CommunityTab } from '@/types/community';
import { useDragScroll } from '@/hooks/useDragScroll';

interface CommunityNavTabsProps {
  activeTab: CommunityTab;
  onSelectTab: (tab: CommunityTab) => void;
}

const TABS: { id: CommunityTab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  {
    id: 'feed',
    label: 'Fil d’actualité',
    shortLabel: 'Fil',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M8 7h6" />
        <path d="M8 11h8" />
      </svg>
    ),
  },
  {
    id: 'groups',
    label: 'Groupes d’études',
    shortLabel: 'Groupes',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'discussions',
    label: 'Discussions & Débats',
    shortLabel: 'Discussions',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'peers',
    label: 'Trouver des pairs',
    shortLabel: 'Pairs',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
];

export const CommunityNavTabs: React.FC<CommunityNavTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const router = useRouter();
  const tabsContainerRef = useDragScroll<HTMLDivElement>();

  const handleTabClick = (tabId: CommunityTab) => {
    if (tabId === 'groups') {
      router.push('/groupes');
      return;
    }
    onSelectTab(tabId);
  };

  return (
    <nav className="communaute-tabs-nav-wrapper" aria-label="Navigation des espaces communautaires">
      <div className="communaute-tabs-nav" ref={tabsContainerRef} role="tablist">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className={`communaute-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              aria-selected={isActive}
            >
              <span className="communaute-tab-icon" aria-hidden="true">{tab.icon}</span>
              <span className="communaute-tab-label-full">{tab.label}</span>
              <span className="communaute-tab-label-short">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
