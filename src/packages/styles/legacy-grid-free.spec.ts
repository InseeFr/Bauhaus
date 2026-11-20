import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

// Classes de l'ancienne grille maison (`components/layout/grid.css`, copie de Bootstrap 3) et de
// `.bauhaus-row`, remplacées par la grille PrimeFlex : `grid`, `col`, `col-12 lg:col-N`,
// `lg:col-offset-N`.
const LEGACY_GRID = /bauhaus-grid-|bauhaus-row(?![\w-])/;

const PACKAGES = join(__dirname, "..");

const filesUnder = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return filesUnder(path);
    if (/(legacy-grid-free\.spec|grid-classes\.testing)\.ts$/.test(entry.name)) return [];
    return /\.(tsx?|css)$/.test(entry.name) ? [path] : [];
  });

const offendersIn = (dir: string) =>
  filesUnder(join(PACKAGES, dir))
    .filter((file) => LEGACY_GRID.test(readFileSync(file, "utf8")))
    .map((file) => relative(PACKAGES, file));

describe("sortie de la grille maison", () => {
  it("ne garde plus la feuille de l'ancienne grille", () => {
    expect(existsSync(join(PACKAGES, "components/layout/grid.css"))).toBe(false);
  });

  it("aucun fichier de src/ n'utilise plus l'ancienne grille", () => {
    expect(offendersIn(".")).toEqual([]);
  });

  it.each([
    "modules-ddi",
    "modules-classifications",
    "modules-concepts",
    "modules-codelists",
    "modules-structures",
    "modules-datasets",
    "modules-operations",
  ])("%s n'utilise plus aucune classe bauhaus-grid-*", (module) => {
    expect(offendersIn(module)).toEqual([]);
  });
});
