import type {
  CodeRepresentation as CodeRepresentationType,
  CodeList,
  Code,
  Category,
  CategoryUsage,
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

/** Libellés distincts, dans l'ordre de première apparition ; repli sur l'identifiant. */
const distinctNames = <T>(
  items: T[],
  id: (item: T) => string,
  label: (item: T) => string | null,
) => [...new Map(items.map((item) => [id(item), label(item)?.trim() || id(item)])).values()];

/**
 * Noms des variables, AUTRES que celle en cours d'édition, qui réutilisent la même liste de codes.
 *
 * Ce sont elles — et elles seules — qu'une modification de la liste partagée impacterait : ce que
 * la popup de confirmation doit annoncer. Les usages arrivant à raison d'une ligne par
 * (variable × PhysicalInstance), une même variable est dédoublonnée.
 */
export const otherVariableNames = (
  usages: CodeListUsage[],
  currentVariableId: string | undefined,
): string[] =>
  distinctNames(
    usages.filter((usage) => usage.variableId !== currentVariableId),
    (usage) => usage.variableId,
    (usage) => usage.variableLabel,
  );

/**
 * Noms des listes de codes, AUTRES que celle en cours d'édition, qui réutilisent la même
 * catégorie. Pendant de {@link otherVariableNames} au niveau de la catégorie ; une même liste
 * apparaissant une fois par variable utilisatrice, elle est dédoublonnée.
 */
export const otherCodeListNames = (
  usages: CategoryUsage[],
  currentCodeListId: string | undefined,
): string[] =>
  distinctNames(
    usages.filter((usage) => usage.codeList.id !== currentCodeListId),
    (usage) => usage.codeList.id,
    (usage) => usage.codeList.label,
  );

/**
 * Vrai si la liste de codes est référencée par au moins une autre variable que celle en cours
 * d'édition : modifier ses codes/son label impacterait alors toutes ces variables.
 */
export const isCodeListSharedWithOthers = (
  usages: CodeListUsage[],
  currentVariableId: string | undefined,
): boolean => otherVariableNames(usages, currentVariableId).length > 0;

/**
 * Identité neuve d'un item forké : nouvel ID, version 1, et NI URN NI VersionDate.
 *
 * L'URN est une fonction de l'identité DDI et la VersionDate est stampée à l'écriture : les deux
 * appartiennent au back, qui les (re)produit à la sauvegarde. Les recopier de la source serait de
 * surcroît faux pour la variante, qui a une autre identité. Les champs sont donc explicitement
 * remis à `undefined`, l'objet source étant repris par étalement.
 *
 * Le schéma généré déclare `URN` requise sur tout Versionable : le `as string` assume ce trou,
 * comblé par le back à la sauvegarde.
 */
const freshIdentity = () => ({
  VersionDate: undefined,
  URN: undefined as unknown as string,
  ID: crypto.randomUUID(),
  Version: "1",
});

/**
 * Référence DDI vers l'item d'origine d'une variante. L'URN est celle que le back a renvoyée pour
 * la source ; le back sait la resynthétiser à partir de l'identité si elle manque.
 */
const basedOn = (
  type: "CodeList" | "Category",
  source: { URN?: string; Agency?: string; ID: string; Version?: string },
  agency: string,
) => ({
  $type: "BasedOnObjectType" as const,
  BasedOnReference: [
    {
      $type: type,
      // Requise par le schéma généré, mais absente d'une source pas encore sauvegardée.
      URN: source.URN as string,
      Agency: agency,
      ID: source.ID,
      Version: source.Version ?? "1",
    },
  ],
});

/**
 * Fork une liste de codes en variante : nouvel objet CodeList (ID et version neufs, codes
 * re-identifiés) au contenu identique, relié à la liste d'origine par l'attribut DDI
 * {@code BasedOnObject}. Les catégories restent les items partagés (cas 1 : seule la liste est
 * forkée) — les CategoryReferences des codes sont conservées telles quelles.
 */
export const createCodeListVariant = (source: CodeList, agencyId: string): CodeList => {
  const agency = source.Agency ?? agencyId;

  return {
    ...source,
    ...freshIdentity(),
    BasedOnObject: basedOn("CodeList", source, agency),
    Code: source.Code?.map((code) => ({ ...code, ...freshIdentity() })),
  };
};

/**
 * Fork une catégorie en variante : nouvel item Category (ID et version neufs) portant le libellé
 * édité, relié à la catégorie d'origine par l'attribut DDI {@code BasedOnObject}. Les listes qui
 * utilisaient la catégorie partagée continuent de pointer sur celle-ci ; seule la liste en cours
 * d'édition référencera la variante.
 */
export const createCategoryVariant = (source: Category, agencyId: string): Category => ({
  ...source,
  ...freshIdentity(),
  BasedOnObject: basedOn("Category", source, source.Agency ?? agencyId),
});

/**
 * Vrai si la catégorie est référencée par au moins une autre liste de codes que celle en cours
 * d'édition : modifier son libellé impacterait alors toutes ces listes.
 */
export const isCategorySharedWithOtherLists = (
  usages: CategoryUsage[],
  currentCodeListId: string | undefined,
): boolean => otherCodeListNames(usages, currentCodeListId).length > 0;
