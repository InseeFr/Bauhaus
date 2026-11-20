import { useQuery } from "@tanstack/react-query";

import { ClassificationsApi } from "@sdk/classification";

import { range } from "@utils/array-utils";

import { emptyNotes } from "../utils/emptyNotes";
import { fetchingPreviousLevels } from "./useClassificationItemClient";

/**
 * Chaque type de note a son propre numéro de version : on garde, note par note,
 * la version la plus récente qui porte un contenu (avec son IRI et, pour la note
 * de changement, sa date).
 */
const latestNotes = (notesByVersion: Record<string, unknown> | undefined) => {
  if (!notesByVersion) return {};
  const versions = Object.values(notesByVersion) as Record<string, unknown>[];
  versions.sort((a, b) => Number(a.version) - Number(b.version));

  return versions.reduce<Record<string, unknown>>((latest, notes) => {
    const next: Record<string, unknown> = { ...latest, version: notes.version };
    for (const [field, value] of Object.entries(notes)) {
      if (field.endsWith("Uri") || field === "version" || field === "changeNoteDate") continue;
      if (!value) continue;
      next[field] = value;
      next[`${field}Uri`] = notes[`${field}Uri`];
      if (field === "changeNoteLg1") next.changeNoteDate = notes.changeNoteDate;
    }
    return next;
  }, {});
};

export const useClassificationItem = (
  classificationId: string,
  itemId: string,
  current?: boolean,
) => {
  const {
    isLoading,
    data: item,
    status,
    error,
  } = useQuery({
    queryKey: ["classifications-item", classificationId, itemId],
    queryFn: async () => {
      const [general, narrowers] = await Promise.all([
        ClassificationsApi.getClassificationItemGeneral(classificationId, itemId),
        ClassificationsApi.getClassificationItemNarrowers(classificationId, itemId),
      ]);

      let notes: Record<string, unknown>[] = [];
      if (general.conceptVersion) {
        notes = await Promise.all(
          range(1, Number(general.conceptVersion) + 1).map((version) => {
            return ClassificationsApi.getClassificationItemNotes(
              classificationId,
              itemId,
              version,
            ).then((note: Record<string, unknown>) => {
              return {
                version,
                ...emptyNotes,
                ...note,
              };
            });
          }),
        );
      }

      const formattedNotes = notes.reduce(
        (acc, note) => ({ ...acc, [note.version as string]: note }),
        {} as Record<string, unknown>,
      );

      return { general, notes: formattedNotes, narrowers };
    },
  });

  if (current) {
    return {
      isLoading,
      status,
      error,
      item: {
        general: item?.general,
        narrowers: item?.narrowers,
        notes: latestNotes(item?.notes),
      },
    };
  }

  return { isLoading, item, status, error };
};

export const useClassificationParentLevels = (
  classificationId: string,
  itemId: string,
  item: { general?: { broaderURI?: string; [key: string]: unknown } } | undefined,
) => {
  return useQuery({
    queryKey: ["classification-parent-levels", classificationId, itemId],
    queryFn: () => {
      if (!item?.general) return Promise.resolve([]);
      return fetchingPreviousLevels(classificationId, item.general);
    },
    enabled: !!item?.general,
  });
};
