import {
  ReligionTradition,
  ReligionBranch,
  ReligionThemeCategory,
  ReligionResource,
  ReligionFilterState,
  ReligionTraditionId,
  ReligionBranchId,
} from '@/types/religion';
import {
  RELIGION_TRADITIONS,
  RELIGION_BRANCHES,
  RELIGION_THEME_CATEGORIES,
  INITIAL_RELIGION_RESOURCES,
} from '@/data/mockReligion';

export interface ReligionQueryResult {
  resources: ReligionResource[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}

class ReligionService {
  /**
   * Récupère la liste des grandes traditions (Islam, Christianisme, Autres religions)
   * Prêt pour Supabase : table `religion_traditions`
   */
  async getTraditions(): Promise<ReligionTradition[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(RELIGION_TRADITIONS);
      }, 40);
    });
  }

  async getTraditionById(id: ReligionTraditionId): Promise<ReligionTradition | null> {
    const found = RELIGION_TRADITIONS.find((t) => t.id === id);
    return found || null;
  }

  /**
   * Récupère les branches / courants rattachés à une tradition donnée
   * Prêt pour Supabase : table `religion_branches` avec foreign key `tradition_id`
   */
  async getBranches(traditionId?: ReligionTraditionId): Promise<ReligionBranch[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!traditionId) {
          resolve(RELIGION_BRANCHES);
        } else {
          resolve(RELIGION_BRANCHES.filter((b) => b.traditionId === traditionId));
        }
      }, 40);
    });
  }

  async getBranchById(id: ReligionBranchId): Promise<ReligionBranch | null> {
    const found = RELIGION_BRANCHES.find((b) => b.id === id);
    return found || null;
  }

  /**
   * Récupère les 8 catégories thématiques universelles par courant
   * Prêt pour Supabase : table `religion_theme_categories`
   */
  async getThemeCategories(): Promise<ReligionThemeCategory[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(RELIGION_THEME_CATEGORIES);
      }, 30);
    });
  }

  /**
   * Récupère les ressources avec filtres hiérarchiques, recherche multi-critères et pagination
   * Prêt pour Supabase : query jointe sur `religion_resources`
   */
  async getResources(filters: ReligionFilterState): Promise<ReligionQueryResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...INITIAL_RELIGION_RESOURCES];

        // 1. Filtre par Tradition
        if (filters.traditionId && filters.traditionId !== 'all') {
          results = results.filter((r) => r.traditionId === filters.traditionId);
        }

        // 2. Filtre par Courant / Branche
        if (filters.branchId && filters.branchId !== 'all') {
          results = results.filter((r) => r.branchId === filters.branchId);
        }

        // 3. Filtre par Catégorie Thématique (Livres, Enseignements, etc.)
        if (filters.themeCategoryId && filters.themeCategoryId !== 'all') {
          results = results.filter((r) => r.themeCategoryId === filters.themeCategoryId);
        }

        // 4. Recherche textuelle globale (titre, auteur, description, tags)
        if (filters.searchQuery && filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          results = results.filter(
            (r) =>
              r.title.toLowerCase().includes(q) ||
              r.author.toLowerCase().includes(q) ||
              r.description.toLowerCase().includes(q) ||
              r.tags.some((t) => t.toLowerCase().includes(q))
          );
        }

        // 5. Filtre par Type de Ressource (livre, cours, article, etc.)
        if (filters.contentType && filters.contentType !== 'all') {
          results = results.filter((r) => r.contentType === filters.contentType);
        }

        // 6. Filtre par Auteur
        if (filters.author && filters.author !== 'all') {
          results = results.filter((r) =>
            r.author.toLowerCase().includes(filters.author.toLowerCase())
          );
        }

        // 7. Filtre par Année / Époque
        if (filters.year && filters.year !== 'all') {
          if (filters.year === 'before-1800') {
            results = results.filter((r) => (r.year ? r.year < 1800 : false));
          } else if (filters.year === '1800-1950') {
            results = results.filter((r) => (r.year ? r.year >= 1800 && r.year <= 1950 : false));
          } else if (filters.year === 'post-1950') {
            results = results.filter((r) => (r.year ? r.year > 1950 : false));
          }
        }

        // 8. Filtre par Accès (Gratuit / Premium)
        if (filters.accessLevel && filters.accessLevel !== 'all') {
          results = results.filter((r) => r.accessLevel === filters.accessLevel);
        }

        // 9. Tri
        if (filters.sortBy === 'recent') {
          results.sort((a, b) => (b.year || 0) - (a.year || 0));
        } else if (filters.sortBy === 'titre') {
          results.sort((a, b) => a.title.localeCompare(b.title));
        } else if (filters.sortBy === 'auteur') {
          results.sort((a, b) => a.author.localeCompare(b.author));
        } else {
          // Pertinence
          results.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return a.title.localeCompare(b.title);
          });
        }

        const total = results.length;
        const perPage = filters.perPage || 9;
        const totalPages = Math.ceil(total / perPage) || 1;
        const currentPage = Math.max(1, Math.min(filters.page || 1, totalPages));
        const startIndex = (currentPage - 1) * perPage;
        const paginatedResources = results.slice(startIndex, startIndex + perPage);

        resolve({
          resources: paginatedResources,
          total,
          totalPages,
          page: currentPage,
          perPage,
        });
      }, 50);
    });
  }

  async getResourceById(id: string): Promise<ReligionResource | null> {
    return new Promise((resolve) => {
      const found = INITIAL_RELIGION_RESOURCES.find((r) => r.id === id);
      resolve(found || null);
    });
  }
}

export const religionService = new ReligionService();
