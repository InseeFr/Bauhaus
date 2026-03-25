import { takeKeys } from "../../../../utils/take-keys";

const generalFieldsToKeepCreate = ["id", "creator", "contributor"];

const generalFieldsToKeepUpdate = ["id", "created", "creator", "contributor"];

function processGeneral(general: any, keys: string[]) {
  const extract = takeKeys(keys);
  const base = extract(general);
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

function processMembers(members: { id: string }[]) {
  return members.map(({ id }) => id);
}

export default function buildPayload(collection: any, action: string) {
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
