import { CheckSecondLang } from "@components/check-second-lang";
import { PageSubtitle } from "@components/page-sub-title";
import { PageTitle } from "@components/page-title";

import Controls from "./components/Controls";
import General from "./components/General";
import Members from "./components/Members";

const LevelVisualization = ({ level: { general, members }, secondLang }: any) => {
  const { classificationId } = general;
  return (
    <div className="container">
      <PageTitle title={general.prefLabelLg1} />
      {general.prefLabelLg2 && <PageSubtitle subTitle={general.prefLabelLg2} />}
      <Controls id={classificationId} />
      <CheckSecondLang />
      <General general={general} classificationId={classificationId} secondLang={secondLang} />
      {members.length !== 0 && (
        <Members members={members} classificationId={classificationId} secondLang={secondLang} />
      )}
    </div>
  );
};

export default LevelVisualization;
