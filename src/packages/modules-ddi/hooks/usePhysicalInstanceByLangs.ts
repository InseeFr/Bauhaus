import { useMemo } from "react";

import type { Ddi4Item, PhysicalInstanceResponse } from "../physical-instances/types/api";
import { type LangString, pickLangEntry, makeEntry } from "../utils/multilingual";

const primaryTag = (lang: string | undefined) => lang?.split("-")[0];

const normalizeLangs = (raw: Set<string>): Set<string> => {
  const best = new Map<string, string>();
  raw.forEach((lang) => {
    const primary = primaryTag(lang) ?? lang;
    const existing = best.get(primary);
    if (!existing || lang.length > existing.length) {
      best.set(primary, lang);
    }
  });
  return new Set(best.values());
};

const addLangsFrom = (raw: Set<string>, entries: LangString[] | undefined) => {
  entries?.forEach((e) => {
    const tag = e["@language"];
    if (tag) raw.add(tag);
  });
};

const collectLangs = (data: PhysicalInstanceResponse): Set<string> => {
  const raw = new Set<string>();

  (data.items ?? []).forEach((item) => {
    switch (item.$type) {
      case "PhysicalInstance":
        addLangsFrom(raw, item.Citation?.Title);
        break;
      case "DataRelationship":
        addLangsFrom(raw, item.Label);
        item.LogicalRecord?.forEach((lr) => addLangsFrom(raw, lr.Label));
        break;
      case "Variable":
        addLangsFrom(raw, item.VariableName);
        addLangsFrom(raw, item.Label);
        addLangsFrom(raw, item.Description);
        break;
      case "CodeList":
      case "Category":
        addLangsFrom(raw, item.Label);
        break;
      default:
        break;
    }
  });

  return normalizeLangs(raw);
};

const pickOrEmpty = (entries: LangString[] | undefined, lang: string): LangString[] => {
  const entry = pickLangEntry(entries, lang);
  return entry ? [entry] : [makeEntry(lang, "")];
};

/** Un item dont tous les champs multilingues sont réduits à la seule langue demandée. */
const filterItemByLang = (item: Ddi4Item, lang: string): Ddi4Item => {
  switch (item.$type) {
    case "PhysicalInstance":
      return {
        ...item,
        Citation: {
          ...item.Citation,
          Title: pickOrEmpty(item.Citation?.Title, lang),
        },
      };
    case "DataRelationship":
      return {
        ...item,
        ...(item.Label && { Label: pickOrEmpty(item.Label, lang) }),
        ...(item.LogicalRecord && {
          LogicalRecord: item.LogicalRecord.map((lr) => ({
            ...lr,
            ...(lr.Label && { Label: pickOrEmpty(lr.Label, lang) }),
          })),
        }),
      };
    case "Variable":
      return {
        ...item,
        VariableName: pickOrEmpty(item.VariableName, lang),
        Label: pickOrEmpty(item.Label, lang),
        ...(item.Description && { Description: pickOrEmpty(item.Description, lang) }),
      };
    case "CodeList":
      return {
        ...item,
        ...(item.Label && { Label: pickOrEmpty(item.Label, lang) }),
      };
    case "Category":
      return { ...item, Label: pickOrEmpty(item.Label, lang) };
    default:
      return item;
  }
};

const filterDataByLang = (
  data: PhysicalInstanceResponse,
  lang: string,
): PhysicalInstanceResponse => ({
  ...data,
  items: (data.items ?? []).map((item) => filterItemByLang(item, lang)),
});

export const usePhysicalInstanceByLangs = (
  data: PhysicalInstanceResponse | undefined,
): Map<string, PhysicalInstanceResponse> => {
  return useMemo(() => {
    if (!data) return new Map();

    const langs = collectLangs(data);
    const map = new Map<string, PhysicalInstanceResponse>();

    langs.forEach((lang) => {
      map.set(lang, filterDataByLang(data, lang));
    });

    return map;
  }, [data]);
};
