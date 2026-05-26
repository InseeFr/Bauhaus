import type { Variable, LogicalRecord, DataRelationship, Reference } from "../../types/api";
import { buildDataRelationshipLabel, buildLogicalRecordLabel } from "../../constants";
import { singletonEntries, makeEntry } from "../../../utils/multilingual";

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
    Label: singletonEntries(
      originalLogicalRecord?.Label?.[0]?.["@language"] ?? defaultLocale,
      buildLogicalRecordLabel(`${title} (copy)`),
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
  title: string;
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
    VersionDate: nowVersionDate(),
    BasedOnObject: {
      $type: "BasedOnObjectType",
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
      buildDataRelationshipLabel(`${title} (copy)`),
    ),
    LogicalRecord: originalDataRelationship.LogicalRecord
      ? buildDuplicatedLogicalRecord({
          originalLogicalRecord: originalDataRelationship.LogicalRecord,
          newLogicalRecordId,
          newAgencyId,
          title,
          variableIdMap,
          defaultLocale,
        })
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
  title,
  defaultLocale,
}: DuplicatePhysicalInstanceParams): DuplicatePhysicalInstanceResult {
  const newAgencyId = agencyId;
  const newPhysicalInstanceId = crypto.randomUUID();
  const newDataRelationshipId = crypto.randomUUID();
  const newLogicalRecordId = crypto.randomUUID();

  const variableIdMap = new Map<string, string>();
  if (data?.Variable) {
    data.Variable.forEach((v: Variable) => {
      variableIdMap.set(v.ID, crypto.randomUUID());
    });
  }

  const duplicatedData = {
    ...data,
    CodeList: data?.CodeList || [],
    Category: data?.Category || [],
    Variable: data?.Variable?.map((variable: Variable) => {
      const newVariableId = variableIdMap.get(variable.ID)!;
      return {
        ...variable,
        ID: newVariableId,
        URN: `urn:ddi:${newAgencyId}:${newVariableId}:1`,
        Agency: newAgencyId,
        VersionDate: nowVersionDate(),
        BasedOnObject: {
          $type: "BasedOnObjectType",
          BasedOnReference: [
            refTo(variable.Agency, variable.ID, variable.Version || "1", "Variable"),
          ],
        },
      };
    }),
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
    PhysicalInstance: data?.PhysicalInstance?.map((pi: any) => ({
      ...pi,
      ID: newPhysicalInstanceId,
      URN: `urn:ddi:${newAgencyId}:${newPhysicalInstanceId}:1`,
      Agency: newAgencyId,
      VersionDate: nowVersionDate(),
      BasedOnObject: {
        $type: "BasedOnObjectType",
        BasedOnReference: [refTo(pi.Agency, pi.ID, pi.Version || "1", "PhysicalInstance")],
      },
      Citation: {
        ...pi.Citation,
        Title: [
          makeEntry(pi.Citation?.Title?.[0]?.["@language"] ?? defaultLocale, `${title} (copy)`),
        ],
      },
      DataRelationshipReference: [
        refTo(newAgencyId, newDataRelationshipId, "1", "DataRelationship"),
      ],
    })),
  };

  return {
    duplicatedData,
    newPhysicalInstanceId,
    newAgencyId,
  };
}
