/**
 * Une URI absolue : un schéma, suivi de quelque chose. Les concepts d'un autre
 * référentiel sont désignés aussi bien par une URL (`https://…`) que par une
 * URN (`urn:…`), d'où l'appui sur `URL` plutôt que sur les seuls protocoles web.
 */
export const isAbsoluteUri = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return false;
  try {
    const { protocol, href } = new URL(trimmed);
    // `new URL("urn:")` passe : il faut vérifier qu'il reste une partie utile.
    return href.length > protocol.length + (href.startsWith(`${protocol}//`) ? 2 : 0);
  } catch {
    return false;
  }
};
