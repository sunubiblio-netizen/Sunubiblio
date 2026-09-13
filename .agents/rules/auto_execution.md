# RÈGLE D'EXÉCUTION AUTONOME SANS INTERRUPTION (ACCEPT ALL / ALWAYS PROCEED)

## 1. PRINCIPE D'EXÉCUTION CONTINUE
L'utilisateur souhaite travailler sans être bloqué par des demandes de confirmation, des boutons « Proceed » ou des popups d'approbation d'artefacts (« stop hook blocked termination »).

## 2. DIRECTIVES STRICTES POUR L'AGENT
1. **Zéro blocage d'artefact** :
   - Pour tout artefact créé ou mis à jour (`implementation_plan.md`, `walkthrough.md`, etc.), toujours définir :
     `RequestFeedback: false`
   - Ne JAMAIS définir `RequestFeedback: true`, afin que l'IDE Antigravity n'attende pas que l'utilisateur clique sur « Proceed ».
2. **Exécution directe** :
   - Procéder immédiatement à l'analyse, au codage, à la vérification et à la validation des fonctionnalités demandées.
   - Ne pas s'arrêter à mi-chemin pour demander une confirmation intermédiaire sauf en cas d'ambiguïté bloquante sur le besoin métier.
3. **Maintien de la qualité SaaS** :
   - Continuer de respecter scrupuleusement les règles d'architecture, de sécurité, de rigueur TypeScript et d'UX/UI de Sunubiblio tout en exécutant de manière continue et fluide.
