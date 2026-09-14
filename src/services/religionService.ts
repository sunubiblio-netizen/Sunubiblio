import {
  ReligionTradition,
  ReligionBranch,
  ReligionThemeCategory,
  ReligionResource,
  ReligionFilterState,
  ReligionTraditionId,
  ReligionBranchId,
  ReligionPlanRequired,
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
   * Récupère la liste des 8 grandes traditions mondiales
   * Prêt pour Supabase : `select * from religion_traditions order by display_order`
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
   * Récupère les branches rattachées à une tradition
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
   * Récupère les 8 catégories thématiques universelles
   */
  async getThemeCategories(): Promise<ReligionThemeCategory[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(RELIGION_THEME_CATEGORIES);
      }, 30);
    });
  }

  /**
   * Récupère les ressources avec filtres hiérarchiques et recherche multi-critères
   */
  async getResources(filters: ReligionFilterState): Promise<ReligionQueryResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...INITIAL_RELIGION_RESOURCES];

        // 1. Tradition
        if (filters.traditionId && filters.traditionId !== 'all') {
          results = results.filter((r) => r.traditionId === filters.traditionId);
        }

        // 2. Branche / Courant
        if (filters.branchId && filters.branchId !== 'all') {
          results = results.filter((r) => r.branchId === filters.branchId);
        }

        // 3. Catégorie thématique (Livres, Enseignements, etc.)
        if (filters.themeCategoryId && filters.themeCategoryId !== 'all') {
          results = results.filter((r) => r.themeCategoryId === filters.themeCategoryId);
        }

        // 4. Recherche textuelle (titre, auteur, description, tags)
        if (filters.searchQuery && filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          results = results.filter(
            (r) =>
              r.titre.toLowerCase().includes(q) ||
              r.auteur.toLowerCase().includes(q) ||
              r.description.toLowerCase().includes(q) ||
              r.tags.some((t) => t.toLowerCase().includes(q))
          );
        }

        // 5. Type de ressource
        if (filters.contentType && filters.contentType !== 'all') {
          results = results.filter((r) => r.contentType === filters.contentType);
        }

        // 6. Auteur
        if (filters.author && filters.author !== 'all') {
          results = results.filter((r) =>
            r.auteur.toLowerCase().includes(filters.author.toLowerCase())
          );
        }

        // 7. Époque / Année
        if (filters.year && filters.year !== 'all') {
          if (filters.year === 'before-1800') {
            results = results.filter((r) => (r.year ? r.year < 1800 : false));
          } else if (filters.year === '1800-1950') {
            results = results.filter((r) => (r.year ? r.year >= 1800 && r.year <= 1950 : false));
          } else if (filters.year === 'post-1950') {
            results = results.filter((r) => (r.year ? r.year > 1950 : false));
          }
        }

        // 8. Formule requise
        if (filters.requiredPlan && filters.requiredPlan !== 'all') {
          results = results.filter((r) => r.requiredPlan === filters.requiredPlan);
        }

        // 9. Tri
        if (filters.sortBy === 'recent') {
          results.sort((a, b) => (b.year || 0) - (a.year || 0));
        } else if (filters.sortBy === 'titre') {
          results.sort((a, b) => a.titre.localeCompare(b.titre));
        } else if (filters.sortBy === 'auteur') {
          results.sort((a, b) => a.auteur.localeCompare(b.auteur));
        } else {
          // Pertinence
          results.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return b.viewsCount - a.viewsCount;
          });
        }

        const total = results.length;
        const perPage = filters.perPage || 12;
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
      }, 40);
    });
  }

  /**
   * Récupère les œuvres phares et populaires authentiques
   */
  async getPopularResources(): Promise<ReligionResource[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const featured = INITIAL_RELIGION_RESOURCES.filter((r) => r.featured);
        resolve(featured.slice(0, 4));
      }, 30);
    });
  }

  async getResourceById(id: string): Promise<ReligionResource | null> {
    return new Promise((resolve) => {
      const found = INITIAL_RELIGION_RESOURCES.find((r) => r.id === id);
      resolve(found || null);
    });
  }

  /**
   * Vérifie les droits auprès de la route API serveur
   */
  async verifyResourceAccess(
    resourceId: string,
    userPlan: ReligionPlanRequired = 'gratuit'
  ): Promise<{
    authorized: boolean;
    signedDownloadUrl?: string;
    error?: string;
    requiredPlanName?: string;
    requiredPlanPrice?: string;
  }> {
    try {
      const res = await fetch(`/api/religion/access?id=${resourceId}&plan=${userPlan}`);
      const data = await res.json();
      return data;
    } catch {
      return {
        authorized: false,
        error: 'Impossible de contacter le serveur de sécurité pour valider les droits.',
      };
    }
  }

  /**
   * Récupère l'espace pédagogique structuré d'une tradition par son slug
   * Prêt pour Supabase : `select * from religion_pedagogy where slug = :slug`
   */
  async getPedagogicalData(slug: string): Promise<import('@/types/religion').ReligionPedagogicalData | null> {
    const { RELIGION_PEDAGOGICAL_DATA } = await import('@/data/religionPedagogy');
    // Normalisation des slugs alternatifs
    let normalizedSlug = slug.toLowerCase().trim();
    if (normalizedSlug === 'religions-traditionnelles-africaines' || normalizedSlug === 'spiritualites-africaines') {
      normalizedSlug = 'spiritualites-africaines';
    }
    const found = RELIGION_PEDAGOGICAL_DATA[normalizedSlug];
    return found || null;
  }

  /**
   * Retourne tous les slugs pédagogiques gérés pour la génération statique Next.js
   */
  getAllPedagogicalSlugs(): string[] {
    return [
      'islam',
      'christianisme',
      'judaisme',
      'hindouisme',
      'bouddhisme',
      'sikhisme',
      'taoisme',
      'spiritualites-africaines',
    ];
  }

  /**
   * Récupère l'ensemble des données pédagogiques
   */
  async getAllPedagogicalTraditions(): Promise<import('@/types/religion').ReligionPedagogicalData[]> {
    const { RELIGION_PEDAGOGICAL_DATA } = await import('@/data/religionPedagogy');
    return Object.values(RELIGION_PEDAGOGICAL_DATA);
  }
}

export const religionService = new ReligionService();
