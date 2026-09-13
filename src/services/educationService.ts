/**
 * Sunubiblio — Service Éducation Découplé (Architecture Database-Ready)
 * 
 * Cette couche centralise l'accès aux données hiérarchiques :
 * Cycle → Domaine → Filière → Matière → Ressources
 * 
 * Elle est conçue pour être branchée directement sur PostgreSQL / Supabase
 * sans avoir à modifier les composants de l'interface utilisateur.
 */

import {
  EducationCycleId,
  EducationDomain,
  EducationFiliere,
  EducationHierarchySubject,
  EducationResource,
  EducationResourceType,
  EducationAccessStatus,
} from '@/types/education';
import {
  EDUCATION_DOMAINS,
  EDUCATION_FILIERES,
  EDUCATION_HIERARCHY_SUBJECTS,
  INITIAL_EDUCATION_RESOURCES,
} from '@/data/educationData';

export interface HierarchyFilterQuery {
  cycleId?: EducationCycleId | 'all';
  domainId?: string | 'all';
  filiereId?: string | 'all';
  subjectId?: string | 'all';
  type?: EducationResourceType | 'all';
  accessStatus?: EducationAccessStatus | 'all';
  searchQuery?: string;
  grade?: string;
}

export const educationService = {
  /**
   * Récupère tous les domaines rattachés à un cycle donné (ex: universite, lycee...)
   */
  async getDomainsByCycle(cycleId: EducationCycleId): Promise<EducationDomain[]> {
    return EDUCATION_DOMAINS.filter((domain) => domain.cycleId === cycleId).sort(
      (a, b) => a.orderIndex - b.orderIndex
    );
  },

  /**
   * Récupère un domaine par son ID
   */
  async getDomainById(domainId: string): Promise<EducationDomain | null> {
    return EDUCATION_DOMAINS.find((d) => d.id === domainId) || null;
  },

  /**
   * Récupère toutes les filières/séries associées à un domaine
   */
  async getFilieresByDomain(domainId: string): Promise<EducationFiliere[]> {
    return EDUCATION_FILIERES.filter((filiere) => filiere.domainId === domainId).sort(
      (a, b) => a.orderIndex - b.orderIndex
    );
  },

  /**
   * Récupère une filière par son ID
   */
  async getFiliereById(filiereId: string): Promise<EducationFiliere | null> {
    return EDUCATION_FILIERES.find((f) => f.id === filiereId) || null;
  },

  /**
   * Récupère toutes les matières rattachées à une filière
   */
  async getSubjectsByFiliere(filiereId: string): Promise<EducationHierarchySubject[]> {
    return EDUCATION_HIERARCHY_SUBJECTS.filter((sub) => sub.filiereId === filiereId).sort(
      (a, b) => a.orderIndex - b.orderIndex
    );
  },

  /**
   * Récupère une matière par son ID
   */
  async getSubjectById(subjectId: string): Promise<EducationHierarchySubject | null> {
    return EDUCATION_HIERARCHY_SUBJECTS.find((s) => s.id === subjectId) || null;
  },

  /**
   * Recherche et filtre les ressources selon les nœuds de la hiérarchie
   */
  async getResources(query: HierarchyFilterQuery): Promise<EducationResource[]> {
    return INITIAL_EDUCATION_RESOURCES.filter((res) => {
      // 1. Cycle / Niveau
      if (query.cycleId && query.cycleId !== 'all' && res.level !== query.cycleId) {
        return false;
      }

      // 2. Domaine
      if (query.domainId && query.domainId !== 'all' && res.domainId !== query.domainId) {
        return false;
      }

      // 3. Filière
      if (query.filiereId && query.filiereId !== 'all' && res.filiereId !== query.filiereId) {
        return false;
      }

      // 4. Matière (soit par subjectId hiérarchique soit par subjectSlug)
      if (query.subjectId && query.subjectId !== 'all') {
        if (res.subjectId && res.subjectId !== query.subjectId) return false;
        if (!res.subjectId && res.subjectSlug !== query.subjectId) return false;
      }

      // 5. Type de ressource (cours, exercice, annale, livre, etc.)
      if (query.type && query.type !== 'all' && res.type !== query.type) {
        return false;
      }

      // 6. Statut d'accès
      if (query.accessStatus && query.accessStatus !== 'all' && res.accessStatus !== query.accessStatus) {
        return false;
      }

      // 7. Grade / Sous-niveau
      if (query.grade && query.grade !== 'all') {
        if (!res.grade || !res.grade.toLowerCase().includes(query.grade.toLowerCase())) {
          return false;
        }
      }

      // 8. Requête textuelle
      if (query.searchQuery && query.searchQuery.trim()) {
        const q = query.searchQuery.toLowerCase().trim();
        const mTitle = res.title.toLowerCase().includes(q);
        const mDesc = res.description.toLowerCase().includes(q);
        const mSub = res.subject.toLowerCase().includes(q);
        const mDom = res.domainTitle ? res.domainTitle.toLowerCase().includes(q) : false;
        const mFil = res.filiereTitle ? res.filiereTitle.toLowerCase().includes(q) : false;
        if (!mTitle && !mDesc && !mSub && !mDom && !mFil) return false;
      }

      return true;
    });
  },
};
