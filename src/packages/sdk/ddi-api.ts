import { buildApi } from "./build-api";

const api = {
  getGroups: () => ["group"],
  getGroup: (agencyId: string, id: string) => ["group/" + agencyId + "/" + id],
  getPhysicalInstances: () => ["physical-instance"],
  getPhysicalInstance: (agencyId: string, id: string) => [
    "physical-instance/" + agencyId + "/" + id,
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
  getCodesLists: () => ["codes-list"],
  getPhysicalCodesLists: (agencyId: string, physicalInstanceId: string) => [
    `physical-instance/${agencyId}/${physicalInstanceId}/codeslists`,
  ],
  getMutualizedCodesLists: () => ["mutualized-codes-list"],
};

export const DDIApi = buildApi("ddi", api) as any;
