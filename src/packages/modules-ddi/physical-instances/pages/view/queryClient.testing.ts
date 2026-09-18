import { QueryClient } from "@tanstack/react-query";

/** Client React Query neuf, sans retry, pour les chargements de listes de codes. */
export const newQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });
