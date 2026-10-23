// Mêmes classes que la commande de contrôle du chantier B, lues sur le DOM rendu.
const BOOTSTRAP_CLASS =
  /^(row|col-(xs|sm|md|lg)-((offset|push|pull)-)?\d+|pull-(left|right)|btn(-[a-z]+)?|form-group|form-control|glyphicon(-[a-z-]+)?|panel(-[a-z]+)?|list-group(-[a-z]+)?)$/;

export const bootstrapClassesIn = (root: ParentNode) =>
  [...root.querySelectorAll("[class]")].flatMap((el) =>
    [...el.classList].filter((token) => BOOTSTRAP_CLASS.test(token)),
  );

export const expectNoBootstrapClass = () => expect(bootstrapClassesIn(document.body)).toEqual([]);
