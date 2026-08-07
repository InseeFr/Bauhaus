import { buildApi } from "./build-api";

const api = {
  getGroups: () => ["group"],
  getGroup: (agencyId: string, id: string) => ["group/" + agencyId + "/" + id],
  getPhysicalInstances: () => ["physical-instance"],
  getPhysicalInstancesForAdvancedSearch: () => ["physical-instance/search"],
  getPhysicalInstance: (agencyId: string, id: string) => [
    "physical-instance/" + agencyId + "/" + id,
  ],
  getPhysicalInstanceParents: (agencyId: string, id: string) => [
    "physical-instance/" + agencyId + "/" + id + "/parents",
  ],
  postPhysicalInstance: (data: {
    physicalInstanceLabel: string;
    dataRelationshipLabel: string;
    logicalRecordLabel: string;
    groupId: string;
    groupAgency: string;
    studyUnitId: string;
    studyUnitAgency: string;
  }) => [
    "physical-instance",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  ],
  patchPhysicalInstance: (
    agencyId: string,
    id: string,
    data: {
      physicalInstanceLabel: string;
      dataRelationshipLabel: string;
      logicalRecordLabel: string;
      groupId: string;
      groupAgency: string;
      studyUnitId: string;
      studyUnitAgency: string;
    },
  ) => [
    "physical-instance/" + agencyId + "/" + id,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  ],
  putPhysicalInstance: (agencyId: string, id: string, data: unknown) => {
    const stringified = JSON.stringify(data);
    return [
      "physical-instance/" + agencyId + "/" + id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: stringified,
      },
    ];
  },
  convertToDDI3: (data: unknown) => [
    "convert/ddi4-to-ddi3",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    (res: Response) => res.text(),
  ],
  // Validation du DDI4 contre ddi-schema.json (côté back). Répond 400 + le corps
  // `{valid, errors}` quand la PI n'est pas conforme : `buildCall` rejette alors
  // avec ce corps, c'est là que se trouvent les erreurs de schéma.
  postValidateDdi4: (data: unknown) => [
    "validate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  ],
  getPhysicalCodesLists: (agencyId: string, physicalInstanceId: string) => [
    `physical-instance/${agencyId}/${physicalInstanceId}/codeslists`,
  ],
  getGroupCodesLists: (agencyId: string, groupId: string) => [
    `groups/${agencyId}/${groupId}/codes-list`,
  ],
  // Valeurs sentinelles (#1566)
  getGroupMissingCodesLists: (agencyId: string, groupId: string) => [
    `groups/${agencyId}/${groupId}/missing-codes-list`,
  ],
  getGroupMissingValuesRepresentations: (agencyId: string, groupId: string) => [
    `groups/${agencyId}/${groupId}/missing-values-representations`,
  ],
  getMissingValuesRepresentationUsers: (agencyId: string, id: string) => [
    `missing-values-representations/${agencyId}/${id}/users`,
  ],
  deleteMissingValuesRepresentation: (agencyId: string, id: string) => [
    `missing-values-representations/${agencyId}/${id}`,
    { method: "DELETE" },
    // 204 sans corps : ne pas tenter de parser du JSON.
    (res: Response) => res.text(),
  ],
  getCodeListUsers: (agencyId: string, id: string) => [`codes-list/${agencyId}/${id}/users`],
  getCategoryUsers: (agencyId: string, id: string) => [`category/${agencyId}/${id}/users`],
  getMutualizedCodesLists: () => ["mutualized-codes-list"],
  getMutualizedCodesList: (agencyId: string, id: string) => [
    `mutualized-codes-list/${agencyId}/${id}`,
    {},
    // Le back renvoie 200 + corps VIDE quand la liste de codes n'existe pas
    // (ResponseEntity.ok().body(null)). On évite que res.json() échoue sur un corps
    // vide ("Unexpected end of JSON input") en renvoyant null dans ce cas.
    async (res: Response) => {
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    },
  ],
};

export const DDIApi = buildApi("ddi", api) as any;
