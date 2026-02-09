# 100 Améliorations possibles pour Bauhaus

## TypeScript & Typage

1. Activer le mode `strict: true` dans `tsconfig.json` pour détecter davantage d'erreurs à la compilation
2. Activer `strictNullChecks` pour éviter les erreurs liées aux valeurs `null` et `undefined`
3. Éliminer tous les usages de `any` dans le code source et les remplacer par des types précis
4. Ajouter des type guards pour les unions discriminées dans les réponses API
5. Typer strictement les paramètres de routes avec des types génériques React Router
6. Utiliser `satisfies` au lieu de `as` pour les assertions de type quand c'est possible
7. Ajouter des types utilitaires partagés (Pick, Omit, Record) pour les modèles de données récurrents
8. Créer des types branded pour les identifiants (ConceptId, ClassificationId) afin d'éviter les confusions

## Tests

9. Augmenter la couverture de tests des modules `modules-operations` et `modules-ddi`
10. Mettre en place MSW (Mock Service Worker) pour mocker les appels API de manière cohérente
11. Ajouter des tests d'intégration pour les flux utilisateur critiques (création/publication de concepts)
12. Mettre en place des tests de régression visuelle (Chromatic, Percy ou Playwright screenshots)
13. Ajouter des tests de performance avec Lighthouse CI dans la pipeline
14. Tester les cas d'erreur et les états de chargement de chaque page
15. Ajouter des tests unitaires pour tous les reducers et hooks personnalisés
16. Tester les validations de formulaires avec différentes données invalides
17. Ajouter des tests d'accessibilité automatisés (axe-core) dans les tests unitaires via vitest-axe
18. Ajouter un seuil minimum de couverture de code dans la CI (ex: 80%)

## Accessibilité (a11y)

19. Ajouter des attributs ARIA sur tous les composants interactifs
20. Remplacer les `alt=""` par des descriptions pertinentes sur les images significatives
21. Vérifier et corriger les contrastes de couleur selon WCAG 2.1 AA
22. Ajouter la navigation au clavier sur tous les composants personnalisés
23. Implémenter des "skip links" pour la navigation principale
24. Ajouter des `aria-live` regions pour les notifications et messages d'erreur
25. Vérifier que tous les formulaires ont des labels associés correctement
26. Ajouter des `role` appropriés sur les composants de mise en page
27. Implémenter la gestion du focus lors des changements de page (React Router)
28. Ajouter un audit axe-core systématique dans chaque test e2e Playwright

## Performance

29. Mettre en place le code splitting par route avec `React.lazy` et `Suspense`
30. Analyser et optimiser la taille du bundle avec `vite-bundle-visualizer`
31. Mettre en place le prefetching des routes pour améliorer la navigation
32. Optimiser les re-renders avec `React.memo` sur les composants lourds (listes, tableaux)
33. Revoir la configuration `staleTime: Infinity` de React Query pour éviter les données périmées
34. Utiliser `useDeferredValue` ou `useTransition` pour les recherches et filtres
35. Mettre en place la virtualisation des longues listes (déjà react-virtualized, vérifier son usage)
36. Optimiser le chargement des images (lazy loading, formats modernes WebP/AVIF)
37. Mettre en place des Web Workers pour les traitements lourds côté client
38. Ajouter des métriques de performance (Core Web Vitals) dans le monitoring

## Dépendances

39. Remplacer Draft.js (archivé/non maintenu) par TipTap ou Slate.js
40. Supprimer react-draft-wysiwyg au profit d'un éditeur moderne unique
41. Supprimer draftjs-md-converter devenu inutile après la migration de l'éditeur
42. Évaluer le remplacement de react-modal par le composant Dialog natif de PrimeReact
43. Supprimer Redux et redux-thunk si leur usage est marginal au profit de React Query + Context
44. Mettre à jour les dépendances régulièrement avec Renovate ou Dependabot
45. Auditer les vulnérabilités avec `pnpm audit` et corriger les failles identifiées
46. Remplacer file-saver par l'API native File System Access quand disponible
47. Évaluer le remplacement de query-string par URLSearchParams natif
48. Mettre en place un outil de suivi de la taille des dépendances (bundlephobia, size-limit)

## Internationalisation (i18n)

49. Migrer le système de dictionnaire custom (`deprecated-locales/`) vers des fichiers JSON i18next standard
50. Supprimer le dossier `deprecated-locales` une fois la migration terminée
51. Ajouter la détection automatique de la langue du navigateur
52. Mettre en place des namespaces i18next par module pour le lazy loading des traductions
53. Ajouter une vérification CI des clés de traduction manquantes
54. Supporter le pluriel et le genre dans les traductions via les fonctionnalités i18next
55. Externaliser les messages d'erreur hardcodés dans les fichiers de traduction

## Architecture & Patterns

56. Créer un système de Design System documenté avec Storybook
57. Standardiser la structure des dossiers de composants (composant, styles, tests, types)
58. Implémenter un Error Boundary par module plutôt qu'un seul global
59. Ajouter une page 404 et des pages d'erreur spécialisées (403, 500)
60. Mettre en place un système de logging côté client (Sentry, LogRocket)
61. Centraliser la gestion des formulaires avec React Hook Form ou une solution commune
62. Créer un hook générique pour les opérations CRUD (useResource)
63. Standardiser les notifications utilisateur (toast, alertes) via un système centralisé
64. Implémenter un système de feature flags pour les déploiements progressifs
65. Séparer les types/interfaces dans des fichiers `.types.ts` par module

## Qualité de Code

66. Réactiver les règles oxlint désactivées (`no-unsafe-optional-chaining`, règles unicorn)
67. Ajouter une règle lint pour interdire les `console.log` en production
68. Mettre en place un pre-commit hook (en plus du pre-push) pour un feedback plus rapide
69. Standardiser les conventions de nommage des dossiers (kebab-case partout)
70. Ajouter des règles lint pour l'ordre des imports
71. Mettre en place Knip pour détecter le code mort et les exports inutilisés
72. Ajouter une vérification de la complexité cyclomatique dans le linting
73. Standardiser les messages de commit avec Conventional Commits
74. Ajouter un changelog automatique basé sur les commits conventionnels

## Formulaires & Validation

75. Utiliser Zod de manière systématique pour la validation de tous les formulaires
76. Créer des schémas Zod partagés entre le front et la validation côté serveur
77. Ajouter une validation en temps réel (on blur) sur tous les champs de formulaire
78. Implémenter des messages d'erreur contextuels et traduits pour chaque champ
79. Ajouter un système d'auto-sauvegarde (draft) pour les formulaires complexes

## UX & Interface

80. Ajouter un mode sombre (le contexte de thème existe mais n'est pas utilisé)
81. Implémenter un système de breadcrumb pour améliorer la navigation
82. Ajouter un indicateur de progression lors des opérations longues (publication, export)
83. Mettre en place un système de recherche globale (Cmd+K / Ctrl+K)
84. Ajouter des raccourcis clavier pour les actions fréquentes
85. Améliorer le feedback utilisateur lors des erreurs API (messages explicites)
86. Ajouter des animations de transition entre les pages
87. Implémenter un système de favoris/récemment consultés
88. Ajouter un mode offline avec Service Workers pour les données consultées

## CI/CD & DevOps

89. Ajouter des checks de taille de bundle dans la CI (budget de performance)
90. Mettre en place des environnements de preview par pull request
91. Ajouter un scan de sécurité automatique (Snyk, CodeQL) dans la pipeline
92. Optimiser le temps de build CI avec du caching pnpm amélioré
93. Ajouter des smoke tests automatiques après chaque déploiement
94. Mettre en place du canary deployment pour les releases majeures
95. Ajouter des health checks applicatifs

## Documentation & DX

96. Ajouter des commentaires JSDoc sur les hooks et fonctions utilitaires publics
97. Créer un guide de contribution (CONTRIBUTING.md) avec les conventions du projet
98. Documenter les variables d'environnement requises et leurs valeurs possibles
99. Ajouter des exemples d'utilisation dans le Storybook pour chaque composant partagé
100. Mettre en place un ADR (Architecture Decision Record) pour tracer les décisions techniques
