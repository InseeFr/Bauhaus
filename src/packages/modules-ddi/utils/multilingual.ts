export interface LangString {
  "@language": string;
  "@value": string;
}

const primaryTag = (lang: string | undefined) => lang?.split("-")[0];

export const pickLang = (
  entries: LangString[] | undefined,
  lang: string,
): string | undefined => {
  if (!entries || entries.length === 0) return undefined;
  const exact = entries.find((e) => e["@language"] === lang);
  if (exact) return exact["@value"];
  const target = primaryTag(lang);
  const fallback = entries.find((e) => primaryTag(e["@language"]) === target);
  return fallback?.["@value"];
};

export const pickLangEntry = (
  entries: LangString[] | undefined,
  lang: string,
): LangString | undefined => {
  if (!entries || entries.length === 0) return undefined;
  const exact = entries.find((e) => e["@language"] === lang);
  if (exact) return exact;
  const target = primaryTag(lang);
  return entries.find((e) => primaryTag(e["@language"]) === target);
};

export const makeEntry = (lang: string, value: string): LangString => ({
  "@language": lang,
  "@value": value,
});

export const singletonEntries = (lang: string, value: string): LangString[] => [
  makeEntry(lang, value),
];
