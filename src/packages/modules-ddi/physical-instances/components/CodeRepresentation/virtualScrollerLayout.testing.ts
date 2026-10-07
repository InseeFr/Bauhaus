import { vi } from "vitest";

/**
 * Le tableau des codes est virtualisé : sous happy-dom, qui ne calcule aucune mise en page, le
 * virtual scroller ne rend aucune ligne. On donne au viewport la taille d'un écran pour qu'il sache
 * combien de lignes afficher.
 */
export const withScreenLayout = (): Disposable => {
  const height = vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(600);
  const width = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(800);
  const rect = vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockReturnValue(DOMRect.fromRect({ width: 800, height: 600 }));
  // Le scroller retranche paddings et bordures lus via getComputedStyle : sans feuille de style,
  // happy-dom les rend vides (NaN une fois parsés) et aucune ligne n'est calculée.
  const style = document.createElement("style");
  style.textContent = "* { padding: 0px; border-width: 0px; }";
  document.head.appendChild(style);
  return {
    [Symbol.dispose]: () => {
      style.remove();
      rect.mockRestore();
      width.mockRestore();
      height.mockRestore();
    },
  };
};
