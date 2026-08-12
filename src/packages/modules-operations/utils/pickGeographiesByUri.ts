import { GeographyOption } from "../hooks/useGeographiesOptions";

export const pickGeographiesByUri = (
  refs: { uri: string }[],
  allGeographies: GeographyOption[],
): (GeographyOption | undefined)[] => {
  const byUri = new Map(allGeographies.map((g) => [g.value, g]));

  return refs.map(({ uri }) => byUri.get(uri));
};
