import type { Ddi4Item, PhysicalInstanceResponse } from "./api";

/**
 * Accès typé au tableau `items` d'une enveloppe DDI 4.
 *
 * Le contrat de fil est celui du `ddi-schema.json` : un unique tableau à plat dont chaque objet
 * porte son `$type`. Ces helpers évitent d'éparpiller les `filter((i) => i.$type === "...")` et,
 * grâce aux unions discriminées, rendent le type concret sans cast.
 *
 * Générique sur le type d'item : la même fonction sert l'enveloppe d'une PhysicalInstance et
 * celle d'un groupe (`Group` / `StudyUnit`).
 */

type Ddi4Envelope = { items?: { $type: string }[] };

/** Type des items portés par l'enveloppe `D`. */
type ItemIn<D extends Ddi4Envelope> = NonNullable<D["items"]>[number];

/** Tous les items du type demandé, dans l'ordre de l'enveloppe. */
export const itemsOfType = <D extends Ddi4Envelope, K extends ItemIn<D>["$type"]>(
  data: D | undefined,
  type: K,
): Extract<ItemIn<D>, { $type: K }>[] =>
  ((data?.items ?? []) as ItemIn<D>[]).filter(
    (item): item is Extract<ItemIn<D>, { $type: K }> => item.$type === type,
  );

/** Le premier item du type demandé — pour les types dont l'enveloppe ne porte qu'un exemplaire. */
export const singleItemOfType = <D extends Ddi4Envelope, K extends ItemIn<D>["$type"]>(
  data: D | undefined,
  type: K,
): Extract<ItemIn<D>, { $type: K }> | undefined => itemsOfType(data, type)[0];

/**
 * Nouvelle enveloppe où tous les items du type donné sont remplacés par `replacement`, les autres
 * types restant en place. L'enveloppe d'origine n'est pas modifiée.
 */
export const replaceItemsOfType = <K extends Ddi4Item["$type"]>(
  data: PhysicalInstanceResponse,
  type: K,
  replacement: Extract<Ddi4Item, { $type: K }>[],
): PhysicalInstanceResponse => ({
  ...data,
  items: [...(data?.items ?? []).filter((item) => item.$type !== type), ...replacement],
});
