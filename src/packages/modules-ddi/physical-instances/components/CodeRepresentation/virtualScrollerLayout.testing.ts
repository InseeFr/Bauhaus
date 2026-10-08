import { vi } from "vitest";

/**
 * Le tableau des codes est virtualisé : sous happy-dom, qui ne calcule aucune mise en page, le
 * virtual scroller ne rend aucune ligne. On donne au viewport la taille d'un écran pour qu'il sache
 * combien de lignes afficher.
 */
export const withScreenLayout = (): Disposable => withLayout(() => 600);

/**
 * Variante où le viewport du scroller mesure la hauteur demandée par le tableau (son `style.height`),
 * comme dans un navigateur : une liste courte n'a alors de place que pour ses propres lignes.
 */
export const withRowsSizedLayout = (): Disposable =>
  withLayout(function (this: HTMLElement) {
    return this.classList.contains("p-virtualscroller")
      ? parseFloat(this.style.height) || 600
      : 600;
  });

const withLayout = (heightOf: (this: HTMLElement) => number): Disposable => {
  const height = vi
    .spyOn(HTMLElement.prototype, "offsetHeight", "get")
    .mockImplementation(function (this: HTMLElement) {
      return heightOf.call(this);
    });
  const width = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(800);
  const rect = vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: HTMLElement) {
      return DOMRect.fromRect({ width: 800, height: heightOf.call(this) });
    });
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
