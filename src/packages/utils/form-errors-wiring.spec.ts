/**
 * Chaque écran d'édition affiche un 400 de validation du back sous la saisie concernée :
 * son enregistrement passe le rejet à `toFormErrors` (voir `api-errors.ts`).
 *
 * Le contrôle lit les sources : un écran est branché quand l'un de ses fichiers appelle
 * `toFormErrors(`. La règle est gelée : `FROZEN` liste les écrans pas encore branchés. Elle
 * ne doit que décroître, écran après écran ; une fois vide, elle disparaît avec lui.
 */

// Littéraux exigés par Vite : tout fichier ajouté à `SCREENS` doit être couvert par l'un
// de ces motifs, ce que vérifie le dernier test.
const SOURCES = import.meta.glob<string>(
  [
    "../modules-*/pages/*/edit/**/*.{ts,tsx}",
    "../modules-operations/pages/sims/create/**/*.{ts,tsx}",
    "../modules-codelists/components/CodesPanel.tsx",
    "../modules-structures/components/ComponentDetailEdit.tsx",
    "../modules-operations/components/SimsGeographyField.tsx",
    "!**/*.spec.*",
    "!**/*.testing.*",
    "!**/*.test-utils.*",
  ],
  { query: "?raw", import: "default", eager: true },
);

// Un écran = les fichiers qui portent sa saisie et son enregistrement. Un chemin terminé
// par « / » désigne tout le dossier.
const SCREENS = {
  familles: "modules-operations/pages/families/edit/",
  indicateurs: "modules-operations/pages/indicators/edit/",
  "documents et liens": "modules-operations/pages/documents/edit/",
  "listes de codes": "modules-codelists/pages/codelists/edit/",
  "codes d'une liste": "modules-codelists/components/CodesPanel.tsx",
  opérations: "modules-operations/pages/operations/edit/",
  séries: "modules-operations/pages/series/edit/",
  concepts: "modules-concepts/pages/concepts/edit/",
  "composants de structure": "modules-structures/components/ComponentDetailEdit.tsx",
  structures: "modules-structures/pages/structures/edit/",
  "listes partielles": "modules-codelists/pages/partial-codelists/edit/",
  classifications: "modules-classifications/pages/classifications/edit/",
  "items de classification": "modules-classifications/pages/item/edit/",
  datasets: "modules-datasets/pages/datasets/edit/",
  distributions: "modules-datasets/pages/distributions/edit/",
  territoires: "modules-operations/components/SimsGeographyField.tsx",
  "rapports SIMS": "modules-operations/pages/sims/create/",
  collections: "modules-concepts/pages/collections/edit/",
} as const;

type Screen = keyof typeof SCREENS;

const FROZEN: ReadonlySet<Screen> = new Set<Screen>([
  "opérations",
  "séries",
  "concepts",
  "composants de structure",
  "structures",
  "listes partielles",
  "classifications",
  "items de classification",
  "datasets",
  "distributions",
  "territoires",
  "rapports SIMS",
  "collections",
]);

const TO_FORM_ERRORS_CALL = /\btoFormErrors\(/;

const screens = Object.keys(SCREENS) as Screen[];

const filesOf = (screen: Screen) =>
  Object.entries(SOURCES)
    .map(([path, source]) => ({ path: path.replace(/^\.\.\//, ""), source }))
    .filter(({ path }) =>
      SCREENS[screen].endsWith("/") ? path.startsWith(SCREENS[screen]) : path === SCREENS[screen],
    );

const isWired = (screen: Screen) =>
  filesOf(screen).some(({ source }) => TO_FORM_ERRORS_CALL.test(source));

describe("branchement des écrans d'édition sur toFormErrors", () => {
  it("les écrans hors FROZEN appellent toFormErrors", () => {
    const unwired = screens.filter((screen) => !FROZEN.has(screen) && !isWired(screen));

    expect(
      unwired,
      "Ces écrans n'appellent pas toFormErrors dans le rejet de leur enregistrement : les erreurs de validation du back n'arrivent plus sous les saisies.",
    ).toEqual([]);
  });

  it("les écrans de FROZEN n'appellent pas encore toFormErrors", () => {
    const wired = [...FROZEN].filter(isWired);

    expect(wired, "Ces écrans appellent toFormErrors : les retirer de FROZEN.").toEqual([]);
  });

  it("chaque écran retrouve ses fichiers", () => {
    const missing = screens.filter((screen) => filesOf(screen).length === 0);

    expect(
      missing,
      "Aucun fichier source pour ces écrans : chemin déplacé, ou absent des motifs de SOURCES. Sans quoi la règle ne protège plus rien.",
    ).toEqual([]);
  });
});
