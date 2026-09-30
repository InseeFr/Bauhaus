import { MutationCache, QueryClient } from "@tanstack/react-query";

import { isNotFound } from "../utils/api-errors";
import { notifyGlobalError } from "./global-error-toast/notifier";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      /**
       * `false` pour une mutation dont l'écran affiche lui-même l'échec (via `error`) : le toast
       * global ne le répète pas. Une mutation qui déclare `onError` est déjà considérée traitée.
       */
      globalErrorToast?: boolean;
    };
  }
}

/** Nombre de nouvelles tentatives par défaut de TanStack Query. */
const MAX_RETRIES = 3;

/**
 * Une lecture en 404 porte sur un élément qui n'existe pas : la relancer ne changera rien et
 * retarde d'autant le message « introuvable ».
 */
const shouldRetry = (failureCount: number, error: unknown) =>
  !isNotFound(error) && failureCount < MAX_RETRIES;

/**
 * Client de l'application. Toute mutation en échec que l'écran ne traite pas est notifiée au
 * toast global (ticket #1264-13).
 */
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: shouldRetry,
      },
    },
    mutationCache: new MutationCache({
      onError: (error, _variables, _onMutateResult, mutation) => {
        if (mutation.options.onError || mutation.meta?.globalErrorToast === false) return;

        notifyGlobalError(error);
      },
    }),
  });
