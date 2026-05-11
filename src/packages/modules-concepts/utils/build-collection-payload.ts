import { CollectionGeneral, CollectionPayload } from "@model/concepts/collection";

import { takeKeys } from "../../utils/take-keys";

export interface CollectionMemberInput {
  id: string;
}

export interface CollectionPayloadInput {
  general: CollectionGeneral;
  members: CollectionMemberInput[];
}

const generalFieldsToKeepCreate: (keyof CollectionGeneral)[] = ["id", "creator", "contributor"];

const generalFieldsToKeepUpdate: (keyof CollectionGeneral)[] = [
  "id",
  "created",
  "creator",
  "contributor",
];

function processGeneral(
  general: CollectionGeneral,
  keys: (keyof CollectionGeneral)[],
): Omit<CollectionPayload, "conceptsIdentifiers"> {
  const extract = takeKeys(keys as string[]);
  const base = extract(general as unknown as Record<string, unknown>) as Partial<CollectionGeneral>;
  return {
    id: base.id ?? "",
    creator: base.creator ?? "",
    contributor: base.contributor ?? undefined,
    labels: [
      { lang: "fr", value: general.prefLabelLg1 ?? "" },
      { lang: "en", value: general.prefLabelLg2 ?? "" },
    ],
    descriptions: [
      { lang: "fr", value: general.descriptionLg1 ?? "" },
      { lang: "en", value: general.descriptionLg2 ?? "" },
    ],
  };
}

function processMembers(members: CollectionMemberInput[]): string[] {
  return members.map(({ id }) => id);
}

export default function buildPayload(
  collection: CollectionPayloadInput,
  action: "CREATE" | "UPDATE",
): CollectionPayload {
  const general =
    action === "CREATE"
      ? processGeneral(collection.general, generalFieldsToKeepCreate)
      : processGeneral(collection.general, generalFieldsToKeepUpdate);
  return {
    ...general,
    conceptsIdentifiers: processMembers(collection.members),
  };
}
