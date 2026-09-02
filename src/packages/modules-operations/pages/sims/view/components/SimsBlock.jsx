import { rangeType } from "../../../../constants/rangeType";
import { SimsBlockCodelist } from "./SimsBlockCodelist";
import { SimsBlockDate } from "./SimsBlockDate";
import { SimsBlockGeography } from "./SimsBlockGeography";
import { SimsBlockOrganization } from "./SimsBlockOrganization";
import { SimsBlockRichText } from "./SimsBlockRichText";
import { SimsBlockText } from "./SimsBlockText";
import { SimsBlockWithoutObject } from "./SimsBlockWithoutObject";

const { RICH_TEXT, TEXT, DATE, CODE_LIST, ORGANIZATION, GEOGRAPHY, RUBRIQUE_SANS_OBJECT } =
  rangeType;

export const SimsBlock = ({
  msd,
  isSecondLang = false,
  currentSection = {},
  unbounded = false,
  codelists,
}) => {
  if (!msd.masLabelLg1) {
    return null;
  }

  return (
    !msd.isPresentational && (
      <>
        {currentSection.rangeType === TEXT && (
          <SimsBlockText currentSection={currentSection} isSecondLang={isSecondLang} />
        )}
        {currentSection.value && currentSection.rangeType === DATE && (
          <SimsBlockDate currentSection={currentSection} />
        )}
        {currentSection.rangeType === RICH_TEXT && (
          <SimsBlockRichText currentSection={currentSection} isSecondLang={isSecondLang} />
        )}
        {currentSection.rangeType === CODE_LIST && codelists[currentSection.codeList] && (
          <SimsBlockCodelist
            codelists={codelists}
            currentSection={currentSection}
            multi={unbounded}
            isSecondLang={isSecondLang}
          />
        )}
        {currentSection.rangeType === ORGANIZATION && (
          <SimsBlockOrganization currentSection={currentSection} />
        )}
        {currentSection.rangeType === GEOGRAPHY && (
          <SimsBlockGeography currentSection={currentSection} isSecondLang={isSecondLang} />
        )}
        {currentSection.rangeType === RUBRIQUE_SANS_OBJECT && <SimsBlockWithoutObject />}
      </>
    )
  );
};
