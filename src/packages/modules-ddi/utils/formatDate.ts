/**
 * Formate une date ISO (versionDate Colectica) en JJ/MM/AAAA (locale fr-FR).
 * Renvoie une chaîne vide si la date est absente, et la valeur brute si elle est illisible.
 */
export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("fr-FR");
  } catch {
    return dateString;
  }
};
