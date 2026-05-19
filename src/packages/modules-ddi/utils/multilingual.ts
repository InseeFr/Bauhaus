export interface MultilingualStringValue {
  LanguageTag: string;
  Value: string;
}

export interface MultilingualStringEntry {
  MultilingualStringValue: MultilingualStringValue;
}

const primaryTag = (lang: string | undefined) => lang?.split("-")[0];

export const pickLang = (
  entries: MultilingualStringEntry[] | undefined,
  lang: string,
): string | undefined => {
  if (!entries || entries.length === 0) return undefined;
  const exact = entries.find((e) => e.MultilingualStringValue.LanguageTag === lang);
  if (exact) return exact.MultilingualStringValue.Value;
  const target = primaryTag(lang);
  const fallback = entries.find(
    (e) => primaryTag(e.MultilingualStringValue.LanguageTag) === target,
  );
  return fallback?.MultilingualStringValue.Value;
};

export const pickLangEntry = (
  entries: MultilingualStringEntry[] | undefined,
  lang: string,
): MultilingualStringEntry | undefined => {
  if (!entries || entries.length === 0) return undefined;
  const exact = entries.find((e) => e.MultilingualStringValue.LanguageTag === lang);
  if (exact) return exact;
  const target = primaryTag(lang);
  return entries.find((e) => primaryTag(e.MultilingualStringValue.LanguageTag) === target);
};

export const makeEntry = (lang: string, value: string): MultilingualStringEntry => ({
  MultilingualStringValue: { LanguageTag: lang, Value: value },
});

export const singletonEntries = (lang: string, value: string): MultilingualStringEntry[] => [
  makeEntry(lang, value),
];
