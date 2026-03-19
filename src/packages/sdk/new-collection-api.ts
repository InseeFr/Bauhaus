import { buildApi } from "./build-api";

const api = {
  getCollectionList: () => [""],
  getCollectionById: (id: string) => [id],
  getCollectionMembersList: (id: string) => [`${id}/members`],
  getCollectionDashboardList: () => ["dashboard"],
  getCollectionValidateList: () => ["toValidate"],
  postCollection: (collection: unknown) => [
    "",
    {
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collection),
    },
    (res: Response) => res.text(),
  ],
  putCollection: (id: string, collection: unknown) => [
    id,
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collection),
    },
    () => id,
  ],
};

export const CollectionApi = buildApi("concepts/collections", api) as any;
