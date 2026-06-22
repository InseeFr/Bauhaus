import { PartialConcept, UnpublishedConcept } from "@model/concepts/concept";

import { buildApi } from "./build-api";

const api = {
  getConceptList: (): [string] => [""],
  getConceptValidateList: (): [string] => ["toValidate"],
  deleteConceptById: (id: string) => [id, { method: "DELETE" }, (res: Response) => res.text()],
  putConceptValidate: (ids: string[]) => [
    `${ids[0] ?? ""}/validate`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    },
    () => undefined,
  ],
};

export interface NewConceptApi {
  getConceptList(): Promise<PartialConcept[]>;
  getConceptValidateList(): Promise<UnpublishedConcept[]>;
  deleteConceptById(id: string): Promise<string>;
  putConceptValidate(ids: string[]): Promise<void>;
}

export const ConceptApi = buildApi("concepts", api) as unknown as NewConceptApi;
