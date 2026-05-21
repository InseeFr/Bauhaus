import type {
  CodeRepresentation as CodeRepresentationType,
  CodeList,
  Code,
  Category,
  LangString,
} from "../../types/api";
import { pickLang, singletonEntries } from "../../../utils/multilingual";

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
  Label: singletonEntries(locale, label),
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
  Label: singletonEntries(locale, label),
});

export const createLabel = (text: string, locale: string): LangString[] =>
  singletonEntries(locale, text);

export const parseSelectedCodeListId = (selectedId: string | null): [string, string] => {
  if (!selectedId) return ["", ""];
  const [agency, ...idParts] = selectedId.split("-");
  return [agency ?? "", idParts.join("-")];
};

export const getLocalizedText = (
  content: LangString[] | undefined,
  lang = "fr-FR",
): string | undefined => pickLang(content, lang);
