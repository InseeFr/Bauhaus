import { generateGenericApiEndpoints } from "../build-api";

export const indicatorApi = {
  // Pas de recherche avancée pour les indicateurs : aucun écran ne l'utilise et le back
  // n'expose plus /indicators/advanced-search.
  ...generateGenericApiEndpoints("indicators", "indicator", { advancedSearch: false }),
  getIndicatorsListWithSims: () => ["indicators/withSims"],
};
