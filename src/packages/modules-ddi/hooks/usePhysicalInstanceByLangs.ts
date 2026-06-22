import { useMemo } from "react";
import type { PhysicalInstanceResponse } from "../physical-instances/types/api";
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

  data.PhysicalInstance?.forEach((pi) => {
    addLangsFrom(raw, pi.Citation?.Title);
  });

  data.DataRelationship?.forEach((dr) => {
    addLangsFrom(raw, dr.Label);
    dr.LogicalRecord?.forEach((lr) => addLangsFrom(raw, lr.Label));
  });

  data.Variable?.forEach((v) => {
    addLangsFrom(raw, v.VariableName);
    addLangsFrom(raw, v.Label);
    addLangsFrom(raw, v.Description);
  });

  data.CodeList?.forEach((cl) => {
    addLangsFrom(raw, cl.Label);
  });

  data.Category?.forEach((cat) => {
    addLangsFrom(raw, cat.Label);
  });

  return normalizeLangs(raw);
};

const pickOrEmpty = (entries: LangString[] | undefined, lang: string): LangString[] => {
  const entry = pickLangEntry(entries, lang);
  return entry ? [entry] : [makeEntry(lang, "")];
};

const filterDataByLang = (
  data: PhysicalInstanceResponse,
  lang: string,
): PhysicalInstanceResponse => ({
  ...data,
  PhysicalInstance: data.PhysicalInstance?.map((pi) => ({
    ...pi,
    Citation: {
      ...pi.Citation,
      Title: pickOrEmpty(pi.Citation?.Title, lang),
    },
  })),
  DataRelationship: data.DataRelationship?.map((dr) => ({
    ...dr,
    ...(dr.Label && {
      Label: pickOrEmpty(dr.Label, lang),
    }),
    ...(dr.LogicalRecord && {
      LogicalRecord: dr.LogicalRecord.map((lr) => ({
        ...lr,
        ...(lr.Label && { Label: pickOrEmpty(lr.Label, lang) }),
      })),
    }),
  })),
  Variable: data.Variable?.map((v) => ({
    ...v,
    VariableName: pickOrEmpty(v.VariableName, lang),
    Label: pickOrEmpty(v.Label, lang),
    ...(v.Description && {
      Description: pickOrEmpty(v.Description, lang),
    }),
  })),
  CodeList: data.CodeList?.map((cl) => ({
    ...cl,
    ...(cl.Label && {
      Label: pickOrEmpty(cl.Label, lang),
    }),
  })),
  Category: data.Category?.map((cat) => ({
    ...cat,
    Label: pickOrEmpty(cat.Label, lang),
  })),
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
