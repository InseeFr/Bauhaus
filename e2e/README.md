# Tests de bout en bout (Playwright)

Ces tests pilotent l'IHM réelle contre un Back-Office réel et un GraphDB réel.
Ils couvrent les parcours métier, pas les composants : tout ce qui se teste avec
Testing Library reste dans `src/**/*.spec.tsx`.

## Parcours couverts

| Fichier                                   | Parcours                                                            |
| ----------------------------------------- | ------------------------------------------------------------------- |
| `smoke/modules.spec.ts`                   | Les 7 modules s'ouvrent depuis l'accueil et chargent leurs données   |
| `operations/series.spec.ts`               | Créer une série → la retrouver → la publier (+ validation client)    |
| `operations/operations.spec.ts`           | Créer une opération → la publier → initialiser son rapport SIMS      |
| `operations/families.spec.ts`             | Créer une famille → affichage bilingue → la retrouver                |
| `concepts/concepts.spec.ts`               | Créer un concept (onglets, éditeur riche) → le publier               |
| `codelists/codelists.spec.ts`             | Consulter et filtrer une liste de codes ; créer une liste + un code  |
| `datasets/datasets.spec.ts`               | Créer un jeu de données (formulaire multi-sections)                  |
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
- `test.fixme` documente un parcours réel bloqué par une anomalie applicative,
  avec la cause en commentaire. C'est une dette visible, pas un test supprimé.

## Limites connues

- **Contributeur pré-rempli refusé par le back.** Les formulaires de création de
  liste de codes et de composante pré-remplissent « Contributeurs » avec le
  timbre de l'utilisateur ; `POST` échoue alors sur
  `IllegalArgumentException: Not a valid (absolute) IRI: DG75-…`. Les tests
  contournent en remplaçant la valeur par une organisation du référentiel ; le
  parcours sans contournement est marqué `test.fixme` dans
  `structures/components.spec.ts`.
- **Dette d'accessibilité.** `a11y/a11y.spec.ts` tolère trois règles axe déjà
  violées partout (`color-contrast`, `label`, `select-name`). Toute nouvelle
  règle violée fait échouer le test.
- **Le workflow CI dépend d'un `compose.yaml` du Back-Office actuellement
  cassé** (`build: ../Dockerfile.bauhaus` ne pointe pas sur un contexte de
  build valide). Tant qu'il n'est pas corrigé côté Back-Office, l'étape
  « Start GraphDB and the Back-Office » échouera.
