import { useMemo } from "react";
import type {
  PhysicalInstanceResponse,
  LocalizedString,
  MultiLocalizedString,
} from "../physical-instances/types/api";

const toArray = (value: MultiLocalizedString | null | undefined): LocalizedString[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const primaryTag = (lang: string | undefined) => lang?.split("-")[0];

const pickLang = (
  value: MultiLocalizedString | null | undefined,
  lang: string,
): LocalizedString | undefined => {
  const entries = toArray(value).filter((e) => e["@xml:lang"]);
  return (
    entries.find((e) => e["@xml:lang"] === lang) ??
    entries.find((e) => primaryTag(e["@xml:lang"]) === primaryTag(lang))
  );
};

const normalizeLangs = (raw: Set<string>): Set<string> => {
  const best = new Map<string, string>();
  raw.forEach((lang) => {
    const primary = primaryTag(lang);
    const existing = best.get(primary);
    if (!existing || lang.length > existing.length) {
      best.set(primary, lang);
    }
  });
  return new Set(best.values());
};

const addLang = (raw: Set<string>, s: LocalizedString) => {
  if (s["@xml:lang"]) raw.add(s["@xml:lang"]);
};

const collectLangs = (data: PhysicalInstanceResponse): Set<string> => {
  const raw = new Set<string>();

  data.PhysicalInstance?.forEach((pi) => {
    toArray(pi.Citation?.Title?.String).forEach((s) => addLang(raw, s));
  });

  data.DataRelationship?.forEach((dr) => {
    toArray(dr.Label?.Content).forEach((s) => addLang(raw, s));
    toArray(dr.LogicalRecord?.Label?.Content).forEach((s) => addLang(raw, s));
  });

  data.Variable?.forEach((v) => {
    toArray(v.VariableName?.String).forEach((s) => addLang(raw, s));
    toArray(v.Label?.Content).forEach((s) => addLang(raw, s));
    toArray(v.Description?.Content).forEach((s) => addLang(raw, s));
  });

  data.CodeList?.forEach((cl) => {
    toArray(cl.Label?.Content).forEach((s) => addLang(raw, s));
  });

  data.Category?.forEach((cat) => {
    toArray(cat.Label?.Content).forEach((s) => addLang(raw, s));
  });

  return normalizeLangs(raw);
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
        String: pickLang(pi.Citation?.Title?.String, lang) ?? {
          "@xml:lang": lang,
          "#text": "",
        },
      },
    },
  })),
  DataRelationship: data.DataRelationship?.map((dr) => ({
    ...dr,
    ...(dr.Label && {
      Label: {
        Content: pickLang(dr.Label.Content, lang) ?? {
          "@xml:lang": lang,
          "#text": "",
        },
      },
    }),
    LogicalRecord: {
      ...dr.LogicalRecord,
      ...(dr.LogicalRecord?.Label && {
        Label: {
          Content: pickLang(dr.LogicalRecord.Label.Content, lang) ?? {
            "@xml:lang": lang,
            "#text": "",
          },
        },
      }),
    },
  })),
  Variable: data.Variable?.map((v) => ({
    ...v,
    VariableName: {
      String: pickLang(v.VariableName?.String, lang) ?? {
        "@xml:lang": lang,
        "#text": "",
      },
    },
    Label: {
      Content: pickLang(v.Label?.Content, lang) ?? {
        "@xml:lang": lang,
        "#text": "",
      },
    },
    ...(v.Description && {
      Description: {
        Content: pickLang(v.Description.Content, lang) ?? {
          "@xml:lang": lang,
          "#text": "",
        },
      },
    }),
  })),
  CodeList: data.CodeList?.map((cl) => ({
    ...cl,
    ...(cl.Label && {
      Label: {
        Content: pickLang(cl.Label.Content, lang) ?? {
          "@xml:lang": lang,
          "#text": "",
        },
      },
    }),
  })),
  Category: data.Category?.map((cat) => ({
    ...cat,
    Label: {
      Content: pickLang(cat.Label?.Content, lang) ?? {
        "@xml:lang": lang,
        "#text": "",
      },
    },
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
