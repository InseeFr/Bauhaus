import type {
  CodeRepresentation as CodeRepresentationType,
  CodeList,
  Code,
  Category,
} from "../../types/api";

export const createDefaultRepresentation = (
  codeListId: string,
  agencyId: string,
): CodeRepresentationType => ({
  "@blankIsMissingValue": "false",
  CodeListReference: {
    Agency: agencyId,
    ID: codeListId,
    Version: "1",
    TypeOfObject: "CodeList",
  },
});

export const createDefaultCodeList = (
  id: string,
  label: string,
  agencyId: string,
  locale: string,
): CodeList => ({
  "@isUniversallyUnique": "true",
  "@versionDate": new Date().toISOString(),
  URN: `urn:ddi:${agencyId}:${id}:1`,
  Agency: agencyId,
  ID: id,
  Version: "1",
  Label: {
    Content: {
      "@xml:lang": locale,
      "#text": label,
    },
  },
  Code: [],
});

export const createCode = (
  id: string,
  categoryId: string,
  value: string,
  agencyId: string,
): Code => ({
  "@isUniversallyUnique": "true",
  URN: `urn:ddi:${agencyId}:${id}:1`,
  Agency: agencyId,
  ID: id,
  Version: "1",
  CategoryReference: {
    Agency: agencyId,
    ID: categoryId,
    Version: "1",
    TypeOfObject: "Category",
  },
  Value: value,
});

export const createCategory = (
  id: string,
  label: string,
  agencyId: string,
  locale: string,
): Category => ({
  "@isUniversallyUnique": "true",
  "@versionDate": new Date().toISOString(),
  URN: `urn:ddi:${agencyId}:${id}:1`,
  Agency: agencyId,
  ID: id,
  Version: "1",
  Label: {
    Content: {
      "@xml:lang": locale,
      "#text": label,
    },
  },
});

export const createLabel = (text: string, locale: string) => ({
  Content: {
    "@xml:lang": locale,
    "#text": text,
  },
});
