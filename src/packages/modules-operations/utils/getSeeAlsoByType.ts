import { OperationsLink } from "@model/operations/operations-link";

/**
 *
 * @param {Array<OperationsLink>} seeAlso an array of OperationsLink object
 * @returns an object corresponding to the array grouped by type of seeAlso
 */
export function getSeeAlsoByType(seeAlso: OperationsLink[] = []) {
  return seeAlso.reduce((acc: Record<string, OperationsLink[]>, link: OperationsLink) => {
    return {
      ...acc,
      [link.type]: [...(acc[link.type] || []), link],
    };
  }, {});
}
