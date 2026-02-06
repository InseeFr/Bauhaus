import type { Variable } from "../../types/api";
import { buildDataRelationshipLabel, buildLogicalRecordLabel } from "../../constants";

interface DuplicatePhysicalInstanceParams {
  agencyId: string;
  data: any;
  title: string;
}

interface DuplicatePhysicalInstanceResult {
  duplicatedData: any;
  newPhysicalInstanceId: string;
  newAgencyId: string;
}

export function buildDuplicatedPhysicalInstance({
  agencyId,
  data,
  title,
}: DuplicatePhysicalInstanceParams): DuplicatePhysicalInstanceResult {
  // Générer de nouveaux IDs pour tous les objets sauf CodeList et Category
  const newAgencyId = agencyId;
  const newPhysicalInstanceId = crypto.randomUUID();
  const newDataRelationshipId = crypto.randomUUID();
  const newLogicalRecordId = crypto.randomUUID();

  // Créer un mapping des anciens IDs de variables vers les nouveaux
  const variableIdMap = new Map<string, string>();
  if (data?.Variable) {
    data.Variable.forEach((v: Variable) => {
      variableIdMap.set(v.ID, crypto.randomUUID());
    });
  }

  // Dupliquer les données en régénérant les IDs
  const duplicatedData = {
    ...data,
    // Garder les mêmes CodeList et Category (pas de régénération d'ID)
    CodeList: data?.CodeList || [],
    Category: data?.Category || [],
    // Dupliquer les variables avec de nouveaux IDs et BasedOnObject
    Variable: data?.Variable?.map((variable: Variable) => {
      const newVariableId = variableIdMap.get(variable.ID)!;
      return {
        ...variable,
        ID: newVariableId,
        URN: `urn:ddi:${newAgencyId}:${newVariableId}:1`,
        Agency: newAgencyId,
        "@versionDate": new Date().toISOString(),
        BasedOnObject: {
          BasedOnReference: {
            Agency: variable.Agency,
            ID: variable.ID,
            Version: variable.Version || "1",
            TypeOfObject: "Variable",
          },
        },
      };
    }),
    // Mettre à jour DataRelationship avec nouveaux IDs, nom et BasedOnObject
    DataRelationship: data?.DataRelationship?.map((dr: any) => ({
      ...dr,
      ID: newDataRelationshipId,
      URN: `urn:ddi:${newAgencyId}:${newDataRelationshipId}:1`,
      Agency: newAgencyId,
      "@versionDate": new Date().toISOString(),
      BasedOnObject: {
        BasedOnReference: {
          Agency: dr.Agency,
          ID: dr.ID,
          Version: dr.Version || "1",
          TypeOfObject: "DataRelationship",
        },
      },
      DataRelationshipName: {
        ...dr.DataRelationshipName,
        String: {
          ...dr.DataRelationshipName?.String,
          "#text": buildDataRelationshipLabel(`${title} (copy)`),
        },
      },
      LogicalRecord: {
        ...dr.LogicalRecord,
        ID: newLogicalRecordId,
        URN: `urn:ddi:${newAgencyId}:${newLogicalRecordId}:1`,
        Agency: newAgencyId,
        "@versionDate": new Date().toISOString(),
        LogicalRecordName: {
          String: {
            ...dr.LogicalRecord?.LogicalRecordName?.String,
            "#text": buildLogicalRecordLabel(`${title} (copy)`),
          },
        },
        VariablesInRecord: {
          VariableUsedReference: Array.from(variableIdMap.values()).map((newVarId) => ({
            Agency: newAgencyId,
            ID: newVarId,
            Version: "1",
            TypeOfObject: "Variable",
          })),
        },
      },
    })),
    // Mettre à jour PhysicalInstance avec nouveaux IDs, label et BasedOnObject
    PhysicalInstance: data?.PhysicalInstance?.map((pi: any) => ({
      ...pi,
      ID: newPhysicalInstanceId,
      URN: `urn:ddi:${newAgencyId}:${newPhysicalInstanceId}:1`,
      Agency: newAgencyId,
      "@versionDate": new Date().toISOString(),
      BasedOnObject: {
        BasedOnReference: {
          Agency: pi.Agency,
          ID: pi.ID,
          Version: pi.Version || "1",
          TypeOfObject: "PhysicalInstance",
        },
      },
      Citation: {
        ...pi.Citation,
        Title: {
          ...pi.Citation?.Title,
          String: {
            ...pi.Citation?.Title?.String,
            "#text": `${title} (copy)`,
          },
        },
      },
      PhysicalInstanceLabel: {
        ...pi.PhysicalInstanceLabel,
        Content: {
          ...pi.PhysicalInstanceLabel?.Content,
          "#text": `${title} (copy)`,
        },
      },
      DataRelationshipReference: {
        Agency: newAgencyId,
        ID: newDataRelationshipId,
        Version: "1",
        TypeOfObject: "DataRelationship",
      },
    })),
  };

  return {
    duplicatedData,
    newPhysicalInstanceId,
    newAgencyId,
  };
}
