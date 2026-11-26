// Classes de l'ancienne grille maison (`components/layout/grid.css`), lues sur le DOM rendu.
const LEGACY_GRID_CLASS = /^bauhaus-grid-/;

export const legacyGridClassesIn = (root: ParentNode) =>
  [...root.querySelectorAll("[class]")].flatMap((el) =>
    [...el.classList].filter((token) => LEGACY_GRID_CLASS.test(token)),
  );

export const expectNoLegacyGridClass = () => expect(legacyGridClassesIn(document.body)).toEqual([]);
