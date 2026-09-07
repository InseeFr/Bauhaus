import type { Ddi4Item, PhysicalInstanceResponse, Reference } from "./api";

/**
 * Assemble une enveloppe DDI 4 de test depuis des listes par type.
 *
 * Le contrat de fil est un unique tableau `items` ; déclarer les fixtures par type reste plus
 * lisible qu'un tableau à plat où l'on perd de vue ce que chaque objet représente. L'ordre des
 * clés fixe l'ordre des items.
 *
 * Les items sont typés `unknown` : une fixture ne renseigne en général qu'une poignée de champs,
 * et l'exiger complète n'apporterait rien ici — c'est le rôle des types de production.
 */
export const envelope = (
  byType: Partial<Record<Ddi4Item["$type"], readonly unknown[]>>,
  topLevelReferences?: readonly unknown[],
): PhysicalInstanceResponse => ({
  ...(topLevelReferences ? { topLevelReferences: topLevelReferences as Reference[] } : {}),
  // La clé porte déjà le type : on complète les items qui ne le répètent pas, pour que les
  // fixtures restent concises sans perdre le discriminant dont dépend `itemsOfType`.
  items: Object.entries(byType).flatMap(([$type, items]) =>
    [...(items ?? [])].map((item) => ({ $type, ...(item as object) }) as Ddi4Item),
  ),
});
