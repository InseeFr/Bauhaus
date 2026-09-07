import { useSearchParams } from "react-router-dom";

const PARAM = "section";

/**
 * Retient dans l'URL la partie de formulaire affichée, pour qu'un lien la
 * rouvre telle quelle.
 *
 * L'entrée d'historique est remplacée plutôt qu'empilée : passer d'une partie à
 * l'autre ne doit pas s'interposer entre l'écran et celui d'où l'on vient.
 */
export const useUrlSection = (fallback: string): [string, (section: string) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const section = searchParams.get(PARAM) ?? fallback;

  const setSection = (next: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(PARAM, next);
    setSearchParams(params, { replace: true });
  };

  return [section, setSection];
};
