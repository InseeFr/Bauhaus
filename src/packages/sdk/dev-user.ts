/**
 * Utilisateur simulé hors OpenID Connect : le back (`DevAuthenticationFilter`, absent en PROD)
 * remplace par ces valeurs les champs de son utilisateur fictif. Un champ vide garde la valeur
 * configurée côté back.
 */
export interface DevUser {
  roles: string[];
  stamps: string[];
  source: string;
}

const STORAGE_KEY = "bauhaus-dev-user";

export const loadDevUser = (): DevUser | undefined => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DevUser) : undefined;
  } catch {
    return undefined;
  }
};

export const saveDevUser = (user: DevUser) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Stockage indisponible : l'utilisateur configuré côté back s'applique.
  }
};

export const clearDevUser = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Rien à effacer.
  }
};

export const devUserHeaders = (): Record<string, string> => {
  const user = loadDevUser();
  if (!user) {
    return {};
  }
  const headers: Record<string, string> = {};
  if (user.roles.length > 0) headers["X-Dev-User-Roles"] = user.roles.join(",");
  if (user.stamps.length > 0) headers["X-Dev-User-Stamps"] = user.stamps.join(",");
  if (user.source) headers["X-Dev-User-Source"] = user.source;
  return headers;
};
