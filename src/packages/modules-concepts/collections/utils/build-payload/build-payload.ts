import { takeKeys } from "../../../../utils/take-keys";

const generalFieldsToKeepCreate = [
  "id",
  "prefLabelLg1",
  "prefLabelLg2",
  "creator",
  "contributor",
  "descriptionLg1",
  "descriptionLg2",
];

const generalFieldsToKeepUpdate = [
  "id",
  "prefLabelLg1",
  "prefLabelLg2",
  "created",
  "creator",
  "contributor",
  "descriptionLg1",
  "descriptionLg2",
];

function processGeneral(general: any, keys: string[]) {
  const extract = takeKeys(keys);
  return extract(general);
}

function processMembers(members: { id: string }[]) {
  return members.map(({ id }) => id);
}

export default function buildPayload(collection: any, action: string) {
  let general;
  if (action === "CREATE") general = processGeneral(collection.general, generalFieldsToKeepCreate);
  else general = processGeneral(collection.general, generalFieldsToKeepUpdate);
  const members = processMembers(collection.members);

  return {
    ...general,
    members,
  };
}
