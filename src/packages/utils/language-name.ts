/**
 * Nom d'une langue dans la langue de l'interface : `fr` devient « Français »
 * pour un utilisateur francophone, « French » pour un anglophone.
 *
 * Le code est rendu tel quel s'il ne désigne aucune langue : la configuration
 * de l'application (`lg1`, `lg2`) n'est pas garantie d'être un code BCP 47.
 */
export const languageName = (code: string, locale: string): string => {
  if (!code) return code;
  try {
    const name = new Intl.DisplayNames([locale], { type: "language" }).of(code);
    if (!name || name === code) return code;
    return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
  } catch {
    return code;
  }
};
