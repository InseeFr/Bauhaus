/**
 * Retourne, dans l'ordre du rendu, les éléments produits par `List.Item` sous
 * `container` — en ignorant les autres `<li>` de la page, typiquement ceux d'une
 * pagination.
 *
 * Les tests des modules passent par cette fonction plutôt que par un sélecteur
 * CSS écrit à la main : la classe portée par `List.Item` reste ainsi connue du
 * seul paquet `list-group`, et changer d'habillage ne casse pas les specs des
 * pages qui affichent des listes.
 */
export const getListItems = (container: HTMLElement): HTMLLIElement[] =>
  Array.from(container.querySelectorAll<HTMLLIElement>("li.list-group-item"));
