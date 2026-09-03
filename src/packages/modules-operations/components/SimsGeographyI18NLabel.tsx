import { Geography } from "./SimsGeographySelector";

export const SimsGeographyI18NLabel = ({ geography }: { geography: Geography }) => {
  const extra = geography.labelLg2
    ? geography.labelLg2 + " " + geography.typeTerritory
    : geography.typeTerritory;

  return (
    <>
      {geography.label} <i>({extra})</i>
    </>
  );
};
