import { arrayMove } from "@dnd-kit/sortable";

import { Document } from "../../../../../model/operations/document";

/**
 * Reorder a document/link within the combined documents array of a SIMS rubric.
 *
 * Documents and links share a single array but are displayed in two separate
 * blocs. Reordering happens within one subset (selected by `belongsToSubset`):
 * the moved item takes the over-item's slot inside the subset, while items of
 * the other subset keep their absolute position in the combined array.
 */
export function reorderDocuments(
  combined: Document[],
  belongsToSubset: (doc: Document) => boolean,
  activeUri: string,
  overUri: string,
): Document[] {
  const subset = combined.filter(belongsToSubset);

  const oldIndex = subset.findIndex((doc) => doc.uri === activeUri);

  const newIndex = subset.findIndex((doc) => doc.uri === overUri);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return combined;
  }

  const reordered = arrayMove(subset, oldIndex, newIndex);

  let cursor = 0;
  return combined.map((doc) => (belongsToSubset(doc) ? reordered[cursor++] : doc));
}
