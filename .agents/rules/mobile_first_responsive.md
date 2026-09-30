# RÈGLE PERMANENTE : PRIORITÉ ABSOLUE AU RESPONSIVE (MOBILE & TABLETTE FIRST)

## 1. CONTEXTE ET CONSTAT
La majorité des utilisateurs de Sunubiblio consultent la plateforme depuis des **smartphones** (iPhone, Android) et des **tablettes**. L'expérience mobile doit être irréprochable, fluide et sans compromis.

## 2. DIRECTIVES STRICTES POUR TOUTE MODIFICATION UI
Pour TOUTE nouvelle fonctionnalité, modification de composant, mise en page ou retouche graphique :

1. **Conception & Test Mobile-First** :
   - Tester et valider systématiquement le rendu sur des résolutions mobiles réelles (ex: 360px, 390px, 393px, 414px) et tablettes (768px, 820px).
   - Ne jamais se contenter d'une simple réduction d'échelle de la version desktop.

2. **Zéro Débordement & Zéro Vide Fantôme** :
   - Aucun débordement horizontal non intentionnel (`overflow-x`).
   - Aucun espace vide ou blanc inutile en bas d'écran : les sections et le footer doivent s'ancrer de manière nette et statique (`margin-top: auto`, `min-height: 100vh`).
   - Le fond du footer doit toujours rejoindre le bas de l'écran, avec un dégagement intérieur adapté (`padding-bottom`) pour ne jamais entrer en conflit avec la barre de navigation mobile flottante.

3. **Mise en page compacte & ergonomie tactile** :
   - Sur mobile, privilégier des composants épurés, compacts, alignés proprement (ex: disposition en ligne équilibrée gauche/droite plutôt que des empilements verticaux interminables).
   - Zones tactiles confortables (minimum 40x40px pour les boutons et icônes interactives).
   - Typographie lisible sans zoom (tailles entre 10px et 16px sur mobile).

4. **Vérification systématique avant validation** :
   - L'agent ne doit JAMAIS clore une tâche visuelle sans avoir vérifié le rendu responsive sur écran mobile et tablette.
