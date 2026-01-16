import { generateGenericApiEndpoints } from "../build-api";

const api = {
  ...generateGenericApiEndpoints("indicators", "indicator"),
  getIndicatorsListWithSims: () => ["indicators/withSims"],
};

export default api;
