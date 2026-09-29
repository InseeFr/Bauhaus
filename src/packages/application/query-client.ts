import { MutationCache, QueryClient } from "@tanstack/react-query";

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

/**
 * Client de l'application. Toute mutation en échec que l'écran ne traite pas est notifiée au
 * toast global (ticket #1264-13).
 */
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
    mutationCache: new MutationCache({
      onError: (error, _variables, _onMutateResult, mutation) => {
        if (mutation.options.onError || mutation.meta?.globalErrorToast === false) return;

        notifyGlobalError(error);
      },
    }),
  });
