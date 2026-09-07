import { generateGenericApiEndpoints } from "../build-api";

const api = {
  // Pas de recherche avancée pour les indicateurs : aucun écran ne l'utilise et le back
  // n'expose plus /indicators/advanced-search.
  ...generateGenericApiEndpoints("indicators", "indicator", { advancedSearch: false }),
  getIndicatorsListWithSims: () => ["indicators/withSims"],
};

export default api;
