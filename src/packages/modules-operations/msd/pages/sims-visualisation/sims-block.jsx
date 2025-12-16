import { rangeType } from "../../../utils/msd";
import SimsBlockCodeList from "./sims-block-codelist";
import SimsBlockDate from "./sims-block-date";
import SimsBlockGeography from "./sims-block-geography";
import SimsBlockOrganisation from "./sims-block-organisation";
import SimsBlockRichText from "./sims-block-richtext";
import SimsBlockText from "./sims-block-text";
import SimsBlockWithoutObject from "./sims-block-without-object";

const { RICH_TEXT, TEXT, DATE, CODE_LIST, ORGANIZATION, GEOGRAPHY, RUBRIQUE_SANS_OBJECT } =
  rangeType;

const SimsBlock = ({
  msd,
  isSecondLang = false,
  currentSection = {},
  unbounded = false,
  codesLists,
  organisations,
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
        {currentSection.rangeType === CODE_LIST && codesLists[currentSection.codeList] && (
          <SimsBlockCodeList
            codesLists={codesLists}
            currentSection={currentSection}
            multi={unbounded}
            isSecondLang={isSecondLang}
          />
        )}
        {currentSection.rangeType === ORGANIZATION && (
          <SimsBlockOrganisation
            organisations={organisations}
            currentSection={currentSection}
            isSecondLang={isSecondLang}
          />
        )}
        {currentSection.rangeType === GEOGRAPHY && (
          <SimsBlockGeography currentSection={currentSection} isSecondLang={isSecondLang} />
        )}
        {currentSection.rangeType === RUBRIQUE_SANS_OBJECT && <SimsBlockWithoutObject />}
      </>
    )
  );
};

export default SimsBlock;
