import { nbResults } from "../../utils/array-utils";
import { createAllDictionary } from "../../utils/dictionnary";

const { D } = createAllDictionary({
  result: {
    fr: "résultat",
    en: "result",
  },
  results: {
    fr: "résultats",
    en: "results",
  },
});

const { result, results } = D;

export const NumberResults = ({ results: data }: Readonly<{ results: any[] }>) =>
  nbResults(data, results, result);
