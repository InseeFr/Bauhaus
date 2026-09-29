import type { AppName } from "./app-context";

export type SectionName =
  | "concepts"
  | "operations"
  | "dataDescription"
  | "classifications"
  | "administration";

/** Tuile de la page d'accueil : un module seul, ou plusieurs modules sous un même menu. */
export interface Section {
  identifier: SectionName;
  /** Par ordre de préférence : la tuile mène au premier module visible. */
  modules: AppName[];
  logo?: string;
}

/* Une ligne par tableau. Quand une tuile manque, sa ligne se réduit au lieu d'être
   complétée par les tuiles suivantes. */
export const SECTION_ROWS: Section[][] = [
  [
    { identifier: "concepts", modules: ["concepts"], logo: "concepts-01.svg" },
    { identifier: "operations", modules: ["operations"], logo: "operations-01.svg" },
    {
      identifier: "dataDescription",
      modules: ["datasets", "ddi"],
      logo: "structures-01.svg",
    },
  ],
  [
    { identifier: "classifications", modules: ["classifications"], logo: "classifications-01.svg" },
    { identifier: "administration", modules: ["codelists", "structures"] },
  ],
];

/** Premier module de la section parmi ceux donnés, ou `undefined` si aucun n'en fait partie. */
export const landingModule = (section: Section, modules: AppName[]) =>
  section.modules.find((m) => modules.includes(m));
