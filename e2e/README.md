# Tests de bout en bout (Playwright)

Ces tests pilotent l'IHM réelle contre un Back-Office réel et un GraphDB réel.
Ils couvrent les parcours métier, pas les composants : tout ce qui se teste avec
Testing Library reste dans `src/**/*.spec.tsx`.

## Parcours couverts

| Fichier                                   | Parcours                                                            |
| ----------------------------------------- | ------------------------------------------------------------------- |
| `smoke/modules.spec.ts`                   | Les 7 modules et les 9 formulaires de création s'ouvrent sans erreur |
| `operations/series.spec.ts`               | Créer une série → la retrouver → la publier (+ validation client)    |
| `operations/operations.spec.ts`           | Créer une opération → la publier → initialiser son rapport SIMS      |
| `operations/families.spec.ts`             | Créer une famille → affichage bilingue → la retrouver                |
| `concepts/concepts.spec.ts`               | Créer un concept (onglets, éditeur riche) → le publier               |
| `codelists/codelists.spec.ts`             | Consulter et filtrer une liste de codes ; créer une liste + un code  |
| `datasets/datasets.spec.ts`               | Lister sans doublon ; créer un jeu de données (multi-sections)       |
| `structures/components.spec.ts`           | Créer une composante mutualisée                                      |
| `classifications/classifications.spec.ts` | Naviguer nomenclature → postes → poste, et afficher l'arbre          |
| `a11y/a11y.spec.ts`                       | Aucune nouvelle violation axe sur les écrans d'accueil des modules   |

Non couvert : le module **DDI / Variables**, qui interroge Colectica. Sans
identifiants (`COLECTICA_USERNAME` / `COLECTICA_PASSWORD`), l'API répond 401 ;
seul le montage du module est vérifié.

## Lancer la suite en local

Trois briques doivent tourner : GraphDB, le Back-Office, et l'IHM (démarrée
automatiquement par Playwright).

```bash
# 1. GraphDB + le reste de la stack (dans le dépôt Bauhaus-Back-Office)
docker compose -f module-bauhaus-bo/compose.yaml up -d graphdb minio

# 2. Jeux de données (⚠️ recrée les dépôts `bauhaus` et `publication`)
cd Bauhaus/e2e && ./playwright/db/init.sh

# 3. Back-Office (JDK 25)
cd Bauhaus-Back-Office && ./mvnw -pl module-bauhaus-bo spring-boot:run

# 4. Les tests — Playwright démarre `pnpm start` tout seul
cd Bauhaus/e2e && npx playwright test
```

Options utiles : `npx playwright test --ui`, `--headed`, `--debug`,
`npx playwright show-report`.

## Conventions

- **Aucune donnée figée.** Tout ce que les tests créent porte un suffixe unique
  (`helpers/data.ts`) : la base n'est pas remise à zéro entre deux exécutions,
  et une assertion du type « 57 résultats » se périme au premier run suivant.
- **Sélecteurs par rôle et libellé.** Les listes déroulantes PrimeReact font
  exception : elles n'ont pas de `htmlFor`, on passe par `helpers/prime.ts`.
- **Langue figée** à `en-US` dans la configuration : l'IHM choisit sa langue
  via `navigator.language`, les libellés attendus doivent être déterministes.
- **Un seul worker.** Les tests écrivent dans le même dépôt RDF.
- **Les formulaires sont enregistrés tels qu'ils sont proposés.** Contourner un
  champ mal pré-rempli pour faire passer un test masque précisément le défaut
  que le test devrait attraper. Si un parcours est bloqué par une anomalie, le
  marquer `test.fixme` avec la cause en commentaire : c'est une dette visible,
  pas un test supprimé.

## Limites connues

- **Le back accepte encore mal un timbre en contributeur.** L'IHM ne pré-remplit
  plus « Contributeurs » qu'avec une IRI d'organisation, mais un client qui
  posterait un timbre déclencherait toujours
  `IllegalArgumentException: Not a valid (absolute) IRI` (500 avec pile Java) sur
  les listes de codes, les composantes et les structures. Le module Datasets, lui,
  résout le timbre côté back (`DatasetServiceImpl.resolveOrganisationIri`).
- **Jeux de données stockés sous deux IRI.** La mise à jour d'un jeu hérité
  (IRI `catalogues/jeuDeDonnees/…`) est écrite sous l'IRI dérivée de la
  configuration (`datasets/…`) : elle crée un second nœud au lieu de mettre à
  jour le premier. La liste ne les affiche plus qu'une fois (`SELECT DISTINCT`),
  mais les nœuds en double restent à traiter côté données.
- **Dette d'accessibilité.** `a11y/a11y.spec.ts` tolère trois règles axe déjà
  violées partout (`color-contrast`, `label`, `select-name`). Toute nouvelle
  règle violée fait échouer le test.
- **Le workflow CI dépend d'un `compose.yaml` du Back-Office actuellement
  cassé** (`build: ../Dockerfile.bauhaus` ne pointe pas sur un contexte de
  build valide). Tant qu'il n'est pas corrigé côté Back-Office, l'étape
  « Start GraphDB and the Back-Office » échouera.
