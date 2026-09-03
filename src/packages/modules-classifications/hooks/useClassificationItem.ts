import { useQuery } from "@tanstack/react-query";

import { ClassificationsApi } from "@sdk/classification";
import { range } from "@utils/array-utils";

import { emptyNotes } from "../utils/emptyNotes";
import { fetchingPreviousLevels } from "./useClassificationItemClient";

export const useClassificationItem = (
  classificationId: string,
  itemId: string,
  current?: boolean,
) => {
  const {
    isLoading,
    data: item,
    status,
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
      item: {
        general: item?.general,
        narrowers: item?.narrowers,
        notes: item?.notes?.[item?.general?.conceptVersion] ?? {},
      },
    };
  }

  return { isLoading, item, status };
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
