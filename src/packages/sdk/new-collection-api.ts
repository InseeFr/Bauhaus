import {
  Collection,
  CollectionDashboardItem,
  CollectionMember,
  CollectionPayload,
  PartialCollection,
  UnpublishedCollection,
} from "@model/concepts/collection";

import { buildApi } from "./build-api";

const api = {
  getCollectionList: (): [string] => [""],
  getCollectionById: (id: string): [string] => [id],
  getCollectionMembersList: (id: string): [string] => [`${id}/members`],
  getCollectionDashboardList: (): [string] => ["dashboard"],
  getCollectionValidateList: (): [string] => ["toValidate"],
  postCollection: (collection: CollectionPayload) => [
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
  putCollection: (id: string, collection: CollectionPayload) => [
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

export interface NewCollectionApi {
  getCollectionList(): Promise<PartialCollection[]>;
  getCollectionById(id: string): Promise<Collection>;
  getCollectionMembersList(id: string): Promise<CollectionMember[]>;
  getCollectionDashboardList(): Promise<CollectionDashboardItem[]>;
  getCollectionValidateList(): Promise<UnpublishedCollection[]>;
  postCollection(collection: CollectionPayload): Promise<string>;
  putCollection(id: string, collection: CollectionPayload): Promise<string>;
}

export const CollectionApi = buildApi("concepts/collections", api) as unknown as NewCollectionApi;
