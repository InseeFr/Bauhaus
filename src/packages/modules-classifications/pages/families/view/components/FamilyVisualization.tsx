import { CheckSecondLang } from "@components/check-second-lang";
import { PageTitle } from "@components/page-title";

import { useTitle } from "@utils/hooks/useTitle";

import D from "../../../../../deprecated-locales/build-dictionary";
import { FamilyControls } from "./FamilyControls";
import { Members } from "./Members";

interface FamilyGeneral {
  prefLabelLg1: string;
  [key: string]: unknown;
}

interface FamilyMember {
  id: string;
  labelLg1: string;
  labelLg2?: string;
  [key: string]: unknown;
}

type Props = Readonly<{
  family: { general: FamilyGeneral; members: FamilyMember[] };
  secondLang: boolean;
}>;

export const FamilyVisualization = ({
  family: {
    general: { prefLabelLg1 },
    members,
  },
  secondLang,
}: Props) => {
  useTitle(D.familiesTitle + " - " + D.classificationsTitle, prefLabelLg1);

  return (
    <div className="container">
      <PageTitle title={prefLabelLg1} />
      <FamilyControls />
      <CheckSecondLang />
      {members.length !== 0 && <Members members={members} secondLang={secondLang} />}
    </div>
  );
};
