import { CheckSecondLang } from "@components/check-second-lang";
import { PageTitle } from "@components/page-title";

import { useTitle } from "@utils/hooks/useTitle";

import D from "../../../deprecated-locales/build-dictionary";
import Controls from "./controls";
import Members from "./members";

const FamilyVisualization = ({
  family: {
    general: { prefLabelLg1 },
    members,
  },
  secondLang,
}) => {
  useTitle(D.familiesTitle + " - " + D.classificationsTitle, prefLabelLg1);

  return (
    <div className="container">
      <PageTitle title={prefLabelLg1} context="classifications" />
      <Controls />
      <CheckSecondLang />
      {members.length !== 0 && <Members members={members} secondLang={secondLang} />}
    </div>
  );
};

export default FamilyVisualization;
