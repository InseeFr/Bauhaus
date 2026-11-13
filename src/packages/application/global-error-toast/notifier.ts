/**
 * Canal des échecs qu'aucun écran n'a affichés, vers le toast global.
 *
 * Un même rejet peut arriver deux fois (une mutation en échec dont la promesse de `mutateAsync`
 * n'est pas non plus rattrapée) : il n'est notifié qu'une fois.
 */

type Listener = (error: unknown) => void;

const listeners = new Set<Listener>();
const notified = new WeakSet<object>();

export const notifyGlobalError = (error: unknown) => {
  if (typeof error === "object" && error !== null) {
    if (notified.has(error)) return;
    notified.add(error);
  }

  listeners.forEach((listener) => listener(error));
};

export const subscribeToGlobalErrors = (listener: Listener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};
