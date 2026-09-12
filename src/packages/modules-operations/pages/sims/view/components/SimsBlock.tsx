import { Organization } from "@model/organization";
import { Rubric } from "@model/Sims";

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

// `Rubric` (cf. `@model/Sims`) ne modélise pas encore `value`/`uri`/`codeList` : ce sont
// pourtant de vrais champs JSON renvoyés par le back pour une rubrique de SIMS.
export type SimsBlockRubric = Rubric & { value?: any; uri?: string; codeList?: string };

interface SimsBlockTypes {
  msd: any;
  isSecondLang?: boolean;
  currentSection?: SimsBlockRubric;
  unbounded?: boolean;
  codelists?: any;
  /** Non consommé ici : `SimsBlockOrganization` lit les organisations via son propre hook.
   * Transmis tel quel par certains appelants (comportement historique inchangé). */
  organizations?: Organization[];
}

export const SimsBlock = ({
  msd,
  isSecondLang = false,
  currentSection = {} as SimsBlockRubric,
  unbounded = false,
  codelists,
}: Readonly<SimsBlockTypes>) => {
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
        {currentSection.rangeType === CODE_LIST &&
          currentSection.codeList &&
          codelists[currentSection.codeList] && (
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
