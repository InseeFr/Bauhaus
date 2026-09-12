import { CheckSecondLang } from "@components/check-second-lang";
import { PageSubtitle } from "@components/page-sub-title";
import { PageTitle } from "@components/page-title";

import { General } from "./General";
import { LevelControls } from "./LevelControls";
import { Members } from "./Members";

export const LevelVisualization = ({ level: { general, members }, secondLang }: any) => {
  const { classificationId } = general;

  return (
    <div className="container">
      <PageTitle title={general.prefLabelLg1} />
      {general.prefLabelLg2 && <PageSubtitle subTitle={general.prefLabelLg2} />}
      <LevelControls id={classificationId} />
      <CheckSecondLang />
      <General general={general} classificationId={classificationId} secondLang={secondLang} />
      {members.length !== 0 && (
        <Members members={members} classificationId={classificationId} secondLang={secondLang} />
      )}
    </div>
  );
};
