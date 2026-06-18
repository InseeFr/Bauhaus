import { buildApi } from "./build-api";

const api = {
  getGroups: () => ["group"],
  getGroup: (agencyId: string, id: string) => ["group/" + agencyId + "/" + id],
  getPhysicalInstances: () => ["physical-instance"],
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
  getPhysicalCodesLists: (agencyId: string, physicalInstanceId: string) => [
    `physical-instance/${agencyId}/${physicalInstanceId}/codeslists`,
  ],
  getGroupCodesLists: (agencyId: string, groupId: string) => [
    `groups/${agencyId}/${groupId}/codes-list`,
  ],
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
