import { useAppContext } from "../../application/app-context";

const FALLBACK_LANGS: readonly string[] = ["fr-FR"];

export const useColecticaLangs = (): readonly string[] => {
  const { properties } = useAppContext();
  const langs = properties.colecticaLangs;
  return langs && langs.length > 0 ? langs : FALLBACK_LANGS;
};
