import { buildApi } from "./build-api";

const api = {
  getFamiliesList: () => ["families"],
  getSeriesList: () => ["series"],
  getList: () => [""],
  getCorrespondencesList: () => ["correspondences"],
  getFamilyGeneral: (id: string) => [`family/${id}`],
  getFamilyMembers: (id: string) => [`family/${id}/members`],
  getSeriesGeneral: (id: string) => [`series/${id}`],
  getSeriesMembers: (id: string) => [`series/${id}/members`],
  getClassificationGeneral: (id: string) => [`classification/${id}`],
  getClassificationItems: (id: string) => [`classification/${id}/items`],
  getClassificationLevels: (id: string) => [`classification/${id}/levels`],
  getClassificationLevelGeneral: (classificationId: string, levelId: string) => [
    `classification/${classificationId}/level/${levelId}`,
  ],
  getClassificationLevelMembers: (classificationId: string, levelId: string) => [
    `classification/${classificationId}/level/${levelId}/members`,
  ],
  getClassificationItemGeneral: (classificationId: string, itemId: string) => [
    `classification/${classificationId}/item/${itemId}`,
  ],
  putClassificationItemGeneral: (classificationId: string, itemId: string, item: any) => [
    `classification/${classificationId}/item/${itemId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    },
    () => Promise.resolve(item.id),
  ],
  getClassificationItemNotes: (
    classificationId: string,
    itemId: string,
    conceptVersion: string,
  ) => [`classification/${classificationId}/item/${itemId}/notes/${conceptVersion}`],
  getClassificationItemNarrowers: (classificationId: string, itemId: string) => [
    `classification/${classificationId}/item/${itemId}/narrowers`,
  ],
  getCorrespondenceGeneral: (correspondenceId: string) => [`correspondence/${correspondenceId}`],
  getCorrespondenceAssociations: (correspondenceId: string) => [
    `correspondence/${correspondenceId}/associations`,
  ],
  getCorrespondenceAssociation: (correspondenceId: string, associationId: string) => [
    `correspondence/${correspondenceId}/association/${associationId}`,
  ],
  publishClassification: (id: string) => [
    `classification/${id}/validate`,
    { method: "PUT" },
    (res: Response) => res.text(),
  ],
  putClassification: (classification: any) => [
    `classification/${classification.id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classification),
    },
    () => Promise.resolve(classification.id),
  ],
};

export const ClassificationsApi = buildApi("classifications", api) as any;
