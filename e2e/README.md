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
| `concepts/concepts.spec.ts`               | Créer un concept (sommaire, éditeur riche) → le publier              |
| `codelists/codelists.spec.ts`             | Consulter et filtrer une liste de codes ; créer une liste + un code  |
| `datasets/datasets.spec.ts`               | Lister sans doublon ; créer un jeu de données (multi-sections)       |
| `structures/components.spec.ts`           | Créer une composante mutualisée                                      |
| `classifications/classifications.spec.ts` | Naviguer nomenclature → postes → poste, et afficher l'arbre          |
| `a11y/a11y.spec.ts`                       | Aucune nouvelle violation axe sur les accueils, chargement compris   |

Non couvert : le module **DDI / Variables**, qui interroge Colectica. Sans
identifiants (`COLECTICA_USERNAME` / `COLECTICA_PASSWORD`), l'API répond 401 ;
seul le montage du module est vérifié.

## Lancer la suite en local

Depuis la racine de `Bauhaus/`, deux commandes :

```bash
pnpm e2e:stack   # GraphDB + minio + Back-Office, puis chargement des fixtures
pnpm e2e         # les tests — Playwright démarre `pnpm start` tout seul
```

`pnpm e2e:stack` (`scripts/e2e-stack.sh`) enchaîne `docker compose up -d` sur le
compose du Back-Office, l'attente de GraphDB, `playwright/db/init.sh`, puis
l'attente d'un `/api/healthcheck` en 200 — dans cet ordre, parce que le
healthcheck sort en 500 tant que `init.sh` n'a pas créé les dépôts.

Le tout prend **16 s** à froid (conteneurs supprimés) et **3 s** à chaud, dont
3 à 4 s de chargement des fixtures. Le premier lancement construit en plus
l'image du Back-Office : environ **2 min 20**.

⚠️ `init.sh` est destructif : il recrée les dépôts `bauhaus` et `publication`.

### Dépendance au dépôt voisin

La suite dépend deux fois du dépôt **Bauhaus-Back-Office** cloné à côté de
`Bauhaus` : l'image du back en est **construite**, et l'essentiel des fixtures
RDF en est **lu** (`module-bauhaus-bo/src/test/resources/testcontainers/`, huit
`.trig` chargés par `init.sh`). Si le clone n'est pas un répertoire frère :

```bash
BACK_OFFICE_HOME=/chemin/vers/Bauhaus-Back-Office pnpm e2e:stack
```

Deux conséquences : un `.trig` renommé côté Back-Office casse la suite — mais
`init.sh` le détecte **avant** toute suppression de dépôt — et le contenu des
fixtures est figé par un décompte de triplets (`EXPECTED_TRIPLES`), à régénérer
après toute modification volontaire.

La suite possède en propre `playwright/db/classifications.trig`
(`LOCAL_FIXTURES` dans `init.sh`), chargé après les autres. Aucune fixture du
Back-Office ne convenait : `classifications-crud-it` termine les IRI de ses
postes par un slash, alors que `getClassificationItem.ftlh` filtre par
`STRENDS(STR(?item), "/<notation>")` — la fiche d'un poste y remonte vide.

Options utiles : `pnpm --dir e2e test --ui`, `--headed`, `--debug`,
`pnpm --dir e2e report`.

La procédure détaillée (prérequis, variables d'environnement, chronométrage, CI)
est dans la documentation : *How to run end-to-end tests*.

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
- **Libellés en double dans les fixtures.** `sims-codes.trig` et
  `jeuxDeDonnees-pour-tests.trig` décrivent tous deux
  `<http://bauhaus/codes/frequences>`, avec des libellés différents
  (« Fréquence » / « Fréquences »). `CL_FREQ` a donc deux `skos:prefLabel` par
  langue une fois les deux chargés, la liste des listes de codes en affiche le
  produit — quatre lignes identiques — et React signale quatre enfants de même
  clé. C'est la donnée qui est en cause, pas l'IHM : d'où l'absence de test de
  non-régression « sans doublon » sur cet écran, contrairement aux jeux de
  données.
- **Le workflow CI épingle le Back-Office sur la branche `4.21.0`.** Le compose
  du Back-Office n'est plus cassé *sur cette branche* : `context: ../..` +
  `dockerfile: Dockerfile.bauhaus` y sont en place, et le back composé joint bien
  les deux dépôts, minio et un répertoire de stockage inscriptible. Mais sur la
  branche par défaut (`main`), `compose/bauhaus-back.yaml` déclare toujours
  `build: ../Dockerfile.bauhaus` : la forme courte de `build` attend un contexte
  de build, pas un Dockerfile, et l'étape « Start GraphDB and the Back-Office »
  échoue sur « unable to prepare context ». Le `ref: 4.21.0` de
  `.github/workflows/playwright.yml` reste donc nécessaire, à retirer une fois ce
  correctif fusionné dans `main`.
