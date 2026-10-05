export type ErrorToastTiming = { sticky: true } | { life: number };

/**
 * Durée d'affichage des toasts d'erreur du module DDI.
 *
 * Par défaut une erreur reste affichée jusqu'à ce que l'utilisateur la ferme (×) : un message
 * serveur ne se lit pas en 3 s (WCAG 2.2.1). `VITE_ERROR_TOAST_DURATION` (ms, injectée au runtime
 * par vite-envs) permet de rétablir une disparition automatique ; vide, 0 ou invalide = persistant.
 */
export const errorToastTiming = (
  raw: string | undefined = import.meta.env.VITE_ERROR_TOAST_DURATION,
): ErrorToastTiming => {
  const duration = Number(raw);
  return Number.isInteger(duration) && duration > 0 ? { life: duration } : { sticky: true };
};
