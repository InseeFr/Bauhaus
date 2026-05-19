import { useMemo } from "react";
import type { PhysicalInstanceResponse } from "../physical-instances/types/api";
import { type MultilingualStringEntry, pickLangEntry, makeEntry } from "../utils/multilingual";

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

const addLangsFrom = (raw: Set<string>, entries: MultilingualStringEntry[] | undefined) => {
  entries?.forEach((e) => {
    const tag = e.MultilingualStringValue?.LanguageTag;
    if (tag) raw.add(tag);
  });
};

const collectLangs = (data: PhysicalInstanceResponse): Set<string> => {
  const raw = new Set<string>();

  data.PhysicalInstance?.forEach((pi) => {
    addLangsFrom(raw, pi.Citation?.Title?.String);
  });

  data.DataRelationship?.forEach((dr) => {
    addLangsFrom(raw, dr.Label?.Content);
    addLangsFrom(raw, dr.LogicalRecord?.Label?.Content);
  });

  data.Variable?.forEach((v) => {
    addLangsFrom(raw, v.VariableName?.String);
    addLangsFrom(raw, v.Label?.Content);
    addLangsFrom(raw, v.Description?.Content);
  });

  data.CodeList?.forEach((cl) => {
    addLangsFrom(raw, cl.Label?.Content);
  });

  data.Category?.forEach((cat) => {
    addLangsFrom(raw, cat.Label?.Content);
  });

  return normalizeLangs(raw);
};

const pickOrEmpty = (
  entries: MultilingualStringEntry[] | undefined,
  lang: string,
): MultilingualStringEntry[] => {
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
      Title: {
        String: pickOrEmpty(pi.Citation?.Title?.String, lang),
      },
    },
  })),
  DataRelationship: data.DataRelationship?.map((dr) => ({
    ...dr,
    ...(dr.Label && {
      Label: { Content: pickOrEmpty(dr.Label.Content, lang) },
    }),
    LogicalRecord: {
      ...dr.LogicalRecord,
      ...(dr.LogicalRecord?.Label && {
        Label: { Content: pickOrEmpty(dr.LogicalRecord.Label.Content, lang) },
      }),
    },
  })),
  Variable: data.Variable?.map((v) => ({
    ...v,
    VariableName: { String: pickOrEmpty(v.VariableName?.String, lang) },
    Label: { Content: pickOrEmpty(v.Label?.Content, lang) },
    ...(v.Description && {
      Description: { Content: pickOrEmpty(v.Description.Content, lang) },
    }),
  })),
  CodeList: data.CodeList?.map((cl) => ({
    ...cl,
    ...(cl.Label && {
      Label: { Content: pickOrEmpty(cl.Label.Content, lang) },
    }),
  })),
  Category: data.Category?.map((cat) => ({
    ...cat,
    Label: { Content: pickOrEmpty(cat.Label?.Content, lang) },
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
