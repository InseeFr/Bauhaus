import type { Variable, LogicalRecord, DataRelationship } from "../../types/api";
import { buildDataRelationshipLabel, buildLogicalRecordLabel } from "../../constants";

interface DuplicatePhysicalInstanceParams {
  agencyId: string;
  data: any;
  title: string;
  defaultLocale: string;
}

interface DuplicatePhysicalInstanceResult {
  duplicatedData: any;
  newPhysicalInstanceId: string;
  newAgencyId: string;
}

interface BuildDuplicatedLogicalRecordParams {
  originalLogicalRecord: LogicalRecord;
  newLogicalRecordId: string;
  newAgencyId: string;
  title: string;
  variableIdMap: Map<string, string>;
  defaultLocale: string;
}

/**
 * Builds a duplicated LogicalRecord with new IDs and metadata.
 * Preserves the original language if available, otherwise uses the provided defaultLocale.
 *
 * @param params - Duplication parameters
 * @param params.originalLogicalRecord - Source LogicalRecord to duplicate
 * @param params.newLogicalRecordId - New UUID identifier for the LogicalRecord
 * @param params.newAgencyId - New owner agency
 * @param params.title - Base title to build the label
 * @param params.variableIdMap - Mapping from old variable IDs to new ones
 * @param params.defaultLocale - Default locale to use if no language is specified
 * @returns A new LogicalRecord with regenerated IDs and updated references
 */
export function buildDuplicatedLogicalRecord({
  originalLogicalRecord,
  newLogicalRecordId,
  newAgencyId,
  title,
  variableIdMap,
  defaultLocale,
}: BuildDuplicatedLogicalRecordParams): LogicalRecord {
  if (!originalLogicalRecord) {
    throw new Error("originalLogicalRecord is required");
  }
  if (!newLogicalRecordId || !newAgencyId) {
    throw new Error("newLogicalRecordId and newAgencyId are required");
  }

  return {
    ...originalLogicalRecord,
    ID: newLogicalRecordId,
    URN: `urn:ddi:${newAgencyId}:${newLogicalRecordId}:1`,
    Agency: newAgencyId,
    "@versionDate": new Date().toISOString(),
    Label: {
      Content: {
        "@xml:lang": originalLogicalRecord?.Label?.Content?.["@xml:lang"] || defaultLocale,
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
  };
}

interface BuildDuplicatedDataRelationshipParams {
  originalDataRelationship: DataRelationship;
  newDataRelationshipId: string;
  newAgencyId: string;
  title: string;
  newLogicalRecordId: string;
  variableIdMap: Map<string, string>;
  defaultLocale: string;
}

/**
 * Builds a duplicated DataRelationship with new IDs and a BasedOnObject.
 * Also creates a new nested LogicalRecord via buildDuplicatedLogicalRecord.
 *
 * @param params - Duplication parameters
 * @param params.originalDataRelationship - Source DataRelationship to duplicate
 * @param params.newDataRelationshipId - New UUID identifier for the DataRelationship
 * @param params.newAgencyId - New owner agency
 * @param params.title - Base title to build the label
 * @param params.newLogicalRecordId - New UUID identifier for the nested LogicalRecord
 * @param params.variableIdMap - Mapping from old variable IDs to new ones
 * @param params.defaultLocale - Default locale to use if no language is specified
 * @returns A new DataRelationship with regenerated IDs, BasedOnObject and nested LogicalRecord
 */
export function buildDuplicatedDataRelationship({
  originalDataRelationship,
  newDataRelationshipId,
  newAgencyId,
  title,
  newLogicalRecordId,
  variableIdMap,
  defaultLocale,
}: BuildDuplicatedDataRelationshipParams): DataRelationship {
  if (!originalDataRelationship) {
    throw new Error("originalDataRelationship is required");
  }
  if (!newDataRelationshipId || !newAgencyId || !newLogicalRecordId) {
    throw new Error("newDataRelationshipId, newAgencyId, and newLogicalRecordId are required");
  }

  return {
    ...originalDataRelationship,
    ID: newDataRelationshipId,
    URN: `urn:ddi:${newAgencyId}:${newDataRelationshipId}:1`,
    Agency: newAgencyId,
    "@versionDate": new Date().toISOString(),
    BasedOnObject: {
      BasedOnReference: {
        Agency: originalDataRelationship.Agency,
        ID: originalDataRelationship.ID,
        Version: originalDataRelationship.Version || "1",
        TypeOfObject: "DataRelationship",
      },
    },
    Label: {
      Content: {
        "@xml:lang": originalDataRelationship?.Label?.Content?.["@xml:lang"] || defaultLocale,
        "#text": buildDataRelationshipLabel(`${title} (copy)`),
      },
    },
    LogicalRecord: buildDuplicatedLogicalRecord({
      originalLogicalRecord: originalDataRelationship.LogicalRecord,
      newLogicalRecordId,
      newAgencyId,
      title,
      variableIdMap,
      defaultLocale,
    }),
  };
}

/**
 * Duplicates a complete PhysicalInstance with all its relationships and metadata.
 * Generates new IDs for PhysicalInstance, DataRelationship, LogicalRecord and Variables.
 * Preserves CodeList and Category without modification.
 *
 * @param params - Duplication parameters
 * @param params.agencyId - Owner agency ID
 * @param params.data - Source PhysicalInstance data to duplicate
 * @param params.title - PhysicalInstance title (will be suffixed with " (copy)")
 * @param params.defaultLocale - Default locale to use if no language is specified in source data
 * @returns Object containing duplicated data and new identifiers
 */
export function buildDuplicatedPhysicalInstance({
  agencyId,
  data,
  title,
  defaultLocale,
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
    DataRelationship: data?.DataRelationship?.map((dr: any) =>
      buildDuplicatedDataRelationship({
        originalDataRelationship: dr,
        newDataRelationshipId,
        newAgencyId,
        title,
        newLogicalRecordId,
        variableIdMap,
        defaultLocale,
      }),
    ),
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
