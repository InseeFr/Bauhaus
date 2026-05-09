import { takeKeys } from "../../utils/take-keys";

interface CollectionGeneralInput {
  id?: string;
  prefLabelLg1?: string;
  prefLabelLg2?: string;
  descriptionLg1?: string;
  descriptionLg2?: string;
  creator?: string;
  contributor?: string;
  created?: string;
}

interface CollectionInput {
  general: CollectionGeneralInput;
  members: { id: string }[];
}

const generalFieldsToKeepCreate: (keyof CollectionGeneralInput)[] = [
  "id",
  "creator",
  "contributor",
];

const generalFieldsToKeepUpdate: (keyof CollectionGeneralInput)[] = [
  "id",
  "created",
  "creator",
  "contributor",
];

function processGeneral(general: CollectionGeneralInput, keys: (keyof CollectionGeneralInput)[]) {
  const extract = takeKeys(keys as string[]);
  const base = extract(
    general as unknown as Record<string, unknown>,
  ) as Partial<CollectionGeneralInput>;
  return {
    ...base,
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

function processMembers(members: { id: string }[]): string[] {
  return members.map(({ id }) => id);
}

export default function buildPayload(collection: CollectionInput, action: "CREATE" | "UPDATE") {
  const general =
    action === "CREATE"
      ? processGeneral(collection.general, generalFieldsToKeepCreate)
      : processGeneral(collection.general, generalFieldsToKeepUpdate);
  const conceptsIdentifiers = processMembers(collection.members);

  return {
    ...general,
    conceptsIdentifiers,
  };
}
