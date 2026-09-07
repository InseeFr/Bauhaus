import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { useAllMissingValuesRepresentations } from "../../../hooks/useAllMissingValuesRepresentations";
import { useDefaultLocale } from "../../../hooks/useDefaultLocale";
import { useMutualizedCodesList } from "../../../hooks/useMutualizedCodesList";
import type {
  Category,
  Ddi4Item,
  ManagedMissingValuesRepresentation,
  PartialMissingValuesRepresentation,
  PhysicalInstanceResponse,
} from "../../types/api";
import { itemsOfType, singleItemOfType } from "../../types/ddi4Items";
import {
  createDefaultRepresentation,
  createLabel,
} from "../CodeRepresentation/CodeRepresentation.utils";

/**
 * Item MMVR reconstruit depuis la vue partielle du groupe, pour une MMVR seulement réutilisée :
 * le formulaire ne la matérialise qu'à la première édition locale, mais l'aperçu doit la montrer.
 *
 * Sans `VersionDate` : le sélecteur ne la connaît pas, et en stamper une (`now()`) afficherait une
 * date que l'export ne produira jamais. Le convertisseur DDI 3 l'accepte absente.
 */
const reusedMmvrItem = (
  partial: PartialMissingValuesRepresentation,
  locale: string,
): ManagedMissingValuesRepresentation => ({
  $type: "ManagedMissingValuesRepresentation",
  URN: `urn:ddi:${partial.agency}:${partial.id}:${partial.version}`,
  Agency: partial.agency,
  ID: partial.id,
  Version: partial.version,
  Label: createLabel(partial.label ?? "", locale),
  ...(partial.codeListId
    ? {
        MissingCodeRepresentation: [
          createDefaultRepresentation(partial.codeListId, partial.agency),
        ],
      }
    : {}),
});

/** La liste de codes demandée et les seules catégories que ses codes référencent. */
const codeListItems = (
  content: PhysicalInstanceResponse | undefined,
  codeListId: string | undefined,
): Ddi4Item[] => {
  const codeList = itemsOfType(content, "CodeList").find((cl) => cl.ID === codeListId);
  if (!codeList) return [];

  const categoryIds = new Set((codeList.Code ?? []).map((code) => code.CategoryReference?.ID));
  const categories = itemsOfType(content, "Category").filter((cat: Category) =>
    categoryIds.has(cat.ID),
  );
  return [codeList, ...categories];
};

const itemKey = (item: { $type: string; ID?: string }) => `${item.$type}:${item.ID}`;

/**
 * Rend l'enveloppe de l'aperçu autoportante : un item seulement *référencé* par la variable
 * (liste de codes réutilisée en lecture seule, MMVR réutilisée non encore modifiée) n'existe pas
 * dans l'état du formulaire, et la conversion DDI 3 étant sans état, l'aperçu n'affichait alors
 * que la référence — là où le panneau de représentation, lui, montre les codes.
 *
 * Résolution d'AFFICHAGE uniquement : les items résolus ne rejoignent pas l'état du formulaire,
 * sans quoi une sauvegarde réécrirait une liste ou une MMVR partagée qu'on laisse volontairement
 * en lecture seule. Même intention que {@link enrichDataWithCodeLists} pour l'export.
 */
export const useSelfContainedPreview = (
  envelope: PhysicalInstanceResponse,
): PhysicalInstanceResponse => {
  const { id: physicalInstanceId = "", agencyId = "" } = useParams<{
    id: string;
    agencyId: string;
  }>();
  const defaultLocale = useDefaultLocale();

  const representation = singleItemOfType(envelope, "Variable")?.VariableRepresentation;

  const codeListReference = representation?.CodeRepresentation?.CodeListReference;
  const codeListMissing =
    Boolean(codeListReference?.ID) &&
    !itemsOfType(envelope, "CodeList").some((cl) => cl.ID === codeListReference?.ID);
  const { data: codeListContent } = useMutualizedCodesList(
    codeListMissing ? (codeListReference?.Agency ?? "") : "",
    codeListMissing ? (codeListReference?.ID ?? "") : "",
  );

  const mmvrReference = representation?.MissingValuesReference;
  const mmvrMissing =
    Boolean(mmvrReference?.ID) &&
    !itemsOfType(envelope, "ManagedMissingValuesRepresentation").some(
      (mmvr) => mmvr.ID === mmvrReference?.ID,
    );
  // Les MMVR du groupe portent le libellé et l'ID de la liste de sentinelles : même source que le
  // sélecteur de réutilisation, donc déjà en cache dès que la section a été affichée.
  const { data: reusableMmvrs } = useAllMissingValuesRepresentations(
    mmvrMissing ? agencyId : "",
    mmvrMissing ? physicalInstanceId : "",
  );
  const reusedMmvr = mmvrMissing
    ? reusableMmvrs.find(
        (item) => item.agency === mmvrReference?.Agency && item.id === mmvrReference?.ID,
      )
    : undefined;
  const { data: sentinelContent } = useMutualizedCodesList(
    reusedMmvr?.agency ?? "",
    reusedMmvr?.codeListId ?? "",
  );

  return useMemo(() => {
    const known = new Set((envelope.items ?? []).map(itemKey));
    const resolved = [
      ...(reusedMmvr ? [reusedMmvrItem(reusedMmvr, defaultLocale)] : []),
      ...codeListItems(codeListContent, codeListReference?.ID),
      ...codeListItems(sentinelContent, reusedMmvr?.codeListId ?? undefined),
    ].filter((item) => {
      if (known.has(itemKey(item))) return false;
      known.add(itemKey(item));
      return true;
    });

    if (resolved.length === 0) return envelope;
    return { ...envelope, items: [...(envelope.items ?? []), ...resolved] };
  }, [
    envelope,
    codeListContent,
    codeListReference?.ID,
    sentinelContent,
    reusedMmvr,
    defaultLocale,
  ]);
};
