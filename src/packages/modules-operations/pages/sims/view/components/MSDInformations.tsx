import { Panel } from "@components/panel";

import { Organization } from "@model/organization";
import { Rubric } from "@model/Sims";

import { SimsFieldTitle } from "../../components/SimsFieldTitle";
import { hasLabelLg2 } from "../../utils/hasLabelLg2";
import { shouldDisplayTitleForPrimaryItem } from "../../utils/shouldDisplayTitleForPrimaryItem";
import { SimsBlock } from "./SimsBlock";

interface MSDInformationsTypes {
  msd: any;
  firstLevel?: boolean;
  rubrics: Record<string, Rubric>;
  secondLang: boolean;
  codelists?: any;
  organizations?: Organization[];
}

export function MSDInformations({
  msd,
  firstLevel = false,
  rubrics,
  secondLang,
  codelists,
  organizations,
}: Readonly<MSDInformationsTypes>) {
  return (
    <>
      {firstLevel && shouldDisplayTitleForPrimaryItem(msd) && (
        <h3 className="col-md-12 sims-title">
          {msd.idMas} - {msd.masLabelBasedOnCurrentLang}
        </h3>
      )}
      <div className="sims-row" key={msd.idMas} id={msd.idMas}>
        {!msd.isPresentational && (
          <Panel
            title={
              <SimsFieldTitle secondLang={false} msd={msd} currentSection={rubrics[msd.idMas]} />
            }
          >
            <SimsBlock
              msd={msd}
              isSecondLang={false}
              currentSection={rubrics[msd.idMas]}
              unbounded={msd.maxOccurs === "unbounded"}
              codelists={codelists}
              organizations={organizations}
            />
          </Panel>
        )}
        {!msd.isPresentational && hasLabelLg2(msd) && secondLang && (
          <Panel
            title={
              <SimsFieldTitle secondLang={true} msd={msd} currentSection={rubrics[msd.idMas]} />
            }
          >
            <SimsBlock
              msd={msd}
              isSecondLang={true}
              currentSection={rubrics[msd.idMas]}
              unbounded={msd.maxOccurs === "unbounded"}
              codelists={codelists}
              organizations={organizations}
            />
          </Panel>
        )}
      </div>
      {Object.values(msd.children).map((child: any) => (
        <MSDInformations
          key={child.idMas}
          msd={child}
          rubrics={rubrics}
          secondLang={secondLang}
          codelists={codelists}
          organizations={organizations}
        />
      ))}
    </>
  );
}
