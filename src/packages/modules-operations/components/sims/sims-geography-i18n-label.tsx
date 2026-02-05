import { Geography } from "./sims-geography-selector";

const SimsGeographyI18NLabel = ({ geography }: { geography: Geography }) => {
  const extra = geography.labelLg2
    ? geography.labelLg2 + " " + geography.typeTerritory
    : geography.typeTerritory;
  return (
    <>
      {geography.label} <i>({extra})</i>
    </>
  );
};

export default SimsGeographyI18NLabel;
