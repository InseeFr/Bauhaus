import { singletonEntries, makeEntry } from "../../../utils/multilingual";
import { buildDataRelationshipLabel, buildLogicalRecordLabel } from "../../constants";
import type { Variable, LogicalRecord, DataRelationship, Reference } from "../../types/api";
import { itemsOfType, replaceItemsOfType } from "../../types/ddi4Items";

interface DuplicatePhysicalInstanceParams {
  agencyId: string;
  data: any;
  /** Libellé final de la PI dupliquée (le suffixe « (copy) » éventuel est posé par l'appelant). */
  label: string;
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
  label: string;
  variableIdMap: Map<string, string>;
  defaultLocale: string;
}

const refTo = (
  agency: string,
  id: string,
  version: string,
  type: Reference["$type"],
): Reference => ({
  $type: type,
  URN: `urn:ddi:${agency}:${id}:${version}`,
  Agency: agency,
  ID: id,
  Version: version,
});

const nowVersionDate = () => ({ DateTime: new Date().toISOString() });

/**
 * Builds a duplicated LogicalRecord with new IDs and metadata.
 * Preserves the original language if available, otherwise uses the provided defaultLocale.
 */
export function buildDuplicatedLogicalRecord({
  originalLogicalRecord,
  newLogicalRecordId,
  newAgencyId,
  label,
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
    Label: singletonEntries(
      originalLogicalRecord?.Label?.[0]?.["@language"] ?? defaultLocale,
      buildLogicalRecordLabel(label),
    ),
    VariablesInRecord: {
      VariableUsedReference: Array.from(variableIdMap.values()).map((newVarId) =>
        refTo(newAgencyId, newVarId, "1", "Variable"),
      ),
    },
  };
}

interface BuildDuplicatedDataRelationshipParams {
  originalDataRelationship: DataRelationship;
  newDataRelationshipId: string;
  newAgencyId: string;
  label: string;
  newLogicalRecordId: string;
  variableIdMap: Map<string, string>;
  defaultLocale: string;
}

/**
 * Builds a duplicated DataRelationship with new IDs and a BasedOnObject.
 * Also creates a new nested LogicalRecord via buildDuplicatedLogicalRecord.
 */
export function buildDuplicatedDataRelationship({
  originalDataRelationship,
  newDataRelationshipId,
  newAgencyId,
  label,
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
    VersionDate: nowVersionDate(),
    BasedOnObject: {
      $type: "BasedOnObjectType" as const,
      BasedOnReference: [
        refTo(
          originalDataRelationship.Agency,
          originalDataRelationship.ID,
          originalDataRelationship.Version || "1",
          "DataRelationship",
        ),
      ],
    },
    Label: singletonEntries(
      originalDataRelationship?.Label?.[0]?.["@language"] ?? defaultLocale,
      buildDataRelationshipLabel(label),
    ),
    LogicalRecord: originalDataRelationship.LogicalRecord?.[0]
      ? [
          buildDuplicatedLogicalRecord({
            originalLogicalRecord: originalDataRelationship.LogicalRecord[0],
            newLogicalRecordId,
            newAgencyId,
            label,
            variableIdMap,
            defaultLocale,
          }),
        ]
      : undefined,
  };
}

/**
 * Duplicates a complete PhysicalInstance with all its relationships and metadata.
 * Generates new IDs for PhysicalInstance, DataRelationship, LogicalRecord and Variables.
 * Preserves CodeList and Category without modification.
 */
export function buildDuplicatedPhysicalInstance({
  agencyId,
  data,
  label,
  defaultLocale,
}: DuplicatePhysicalInstanceParams): DuplicatePhysicalInstanceResult {
  const newAgencyId = agencyId;
  const newPhysicalInstanceId = crypto.randomUUID();
  const newDataRelationshipId = crypto.randomUUID();
  const newLogicalRecordId = crypto.randomUUID();

  const variableIdMap = new Map<string, string>();
  itemsOfType(data, "Variable").forEach((v: Variable) => {
    variableIdMap.set(v.ID, crypto.randomUUID());
  });

  const duplicatedVariables = itemsOfType(data, "Variable").map((variable: Variable) => {
    const newVariableId = variableIdMap.get(variable.ID)!;
    return {
      ...variable,
      ID: newVariableId,
      URN: `urn:ddi:${newAgencyId}:${newVariableId}:1`,
      Agency: newAgencyId,
      VersionDate: nowVersionDate(),
      BasedOnObject: {
        $type: "BasedOnObjectType" as const,
        BasedOnReference: [
          refTo(variable.Agency, variable.ID, variable.Version || "1", "Variable"),
        ],
      },
    };
  });

  const duplicatedDataRelationships = itemsOfType(data, "DataRelationship").map((dr) =>
    buildDuplicatedDataRelationship({
      originalDataRelationship: dr,
      newDataRelationshipId,
      newAgencyId,
      label,
      newLogicalRecordId,
      variableIdMap,
      defaultLocale,
    }),
  );

  const duplicatedPhysicalInstances = itemsOfType(data, "PhysicalInstance").map((pi) => ({
    ...pi,
    ID: newPhysicalInstanceId,
    URN: `urn:ddi:${newAgencyId}:${newPhysicalInstanceId}:1`,
    Agency: newAgencyId,
    VersionDate: nowVersionDate(),
    BasedOnObject: {
      $type: "BasedOnObjectType" as const,
      BasedOnReference: [refTo(pi.Agency, pi.ID, pi.Version || "1", "PhysicalInstance")],
    },
    Citation: {
      ...pi.Citation,
      Title: [makeEntry(pi.Citation?.Title?.[0]?.["@language"] ?? defaultLocale, label)],
    },
    DataRelationshipReference: [refTo(newAgencyId, newDataRelationshipId, "1", "DataRelationship")],
  }));

  // Réassemblage de l'enveloppe : les CodeList/Category d'origine sont conservées telles quelles.
  let duplicatedData = replaceItemsOfType(data ?? {}, "Variable", duplicatedVariables);
  duplicatedData = replaceItemsOfType(
    duplicatedData,
    "DataRelationship",
    duplicatedDataRelationships,
  );
  duplicatedData = replaceItemsOfType(
    duplicatedData,
    "PhysicalInstance",
    duplicatedPhysicalInstances,
  );

  return {
    duplicatedData,
    newPhysicalInstanceId,
    newAgencyId,
  };
}
