import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

// Mêmes classes que la commande de contrôle du chantier B, cette fois dans les feuilles de style.
const BOOTSTRAP_SELECTOR =
  /\.(row|col-(xs|sm|md|lg)-((offset|push|pull)-)?\d+|pull-(left|right)|btn(-[a-z]+)?|form-group|form-control|glyphicon(-[a-z-]+)?|panel(-[a-z]+)?|list-group(-[a-z]+)?)(?![\w-])/;

const PACKAGES = join(__dirname, "..");

const filesUnder = (dir: string, extensions: string[]): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return filesUnder(path, extensions);
    return extensions.some((extension) => entry.name.endsWith(extension)) ? [path] : [];
  });

describe("sortie de Bootstrap", () => {
  it("ne garde aucune feuille Bootstrap dans les styles", () => {
    expect(readdirSync(__dirname)).not.toContain("bootstrap.css");
  });

  it("ne référence aucune classe Bootstrap dans les feuilles de style", () => {
    const offenders = filesUnder(PACKAGES, [".css"])
      .filter((file) => BOOTSTRAP_SELECTOR.test(readFileSync(file, "utf8")))
      .map((file) => relative(PACKAGES, file));

    expect(offenders).toEqual([]);
  });

  it("n'importe plus bootstrap.css", () => {
    const importers = filesUnder(PACKAGES, [".ts", ".tsx"])
      .filter((file) => /bootstrap\.css/.test(readFileSync(file, "utf8")))
      .filter((file) => !file.endsWith(".spec.ts"))
      .map((file) => relative(PACKAGES, file));

    expect(importers).toEqual([]);
  });
});
