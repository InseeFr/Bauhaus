import type {
  CodeRepresentation as CodeRepresentationType,
  CodeList,
  Code,
  Category,
  CodeListUsage,
  LangString,
} from "../../types/api";
import { pickLang, singletonEntries } from "../../../utils/multilingual";

export const createDefaultRepresentation = (
  codeListId: string,
  agencyId: string,
): CodeRepresentationType => ({
  $type: "CodeRepresentationBaseType",
  BlankIsMissingValue: false,
  CodeListReference: {
    $type: "CodeList",
    URN: `urn:ddi:${agencyId}:${codeListId}:1`,
    Agency: agencyId,
    ID: codeListId,
    Version: "1",
  },
});

export const createDefaultCodeList = (
  id: string,
  label: string,
  agencyId: string,
  locale: string,
): CodeList => ({
  $type: "CodeList",
  VersionDate: { DateTime: new Date().toISOString() },
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
  $type: "CodeType",
  URN: `urn:ddi:${agencyId}:${id}:1`,
  Agency: agencyId,
  ID: id,
  Version: "1",
  CategoryReference: {
    $type: "Category",
    URN: `urn:ddi:${agencyId}:${categoryId}:1`,
    Agency: agencyId,
    ID: categoryId,
    Version: "1",
  },
  Value: { StringValue: value },
});

export const createCategory = (
  id: string,
  label: string,
  agencyId: string,
  locale: string,
): Category => ({
  $type: "Category",
  VersionDate: { DateTime: new Date().toISOString() },
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

/**
 * Nombre de variables, autres que celle en cours d'édition, qui réutilisent la même liste de codes.
 */
export const countOtherUsers = (
  usages: CodeListUsage[],
  currentVariableId: string | undefined,
): number => usages.filter((usage) => usage.variableId !== currentVariableId).length;

/**
 * Vrai si la liste de codes est référencée par au moins une autre variable que celle en cours
 * d'édition : modifier ses codes/son label impacterait alors toutes ces variables.
 */
export const isCodeListSharedWithOthers = (
  usages: CodeListUsage[],
  currentVariableId: string | undefined,
): boolean => countOtherUsers(usages, currentVariableId) > 0;
