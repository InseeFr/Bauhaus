import { CheckSecondLang } from "@components/check-second-lang";
import { PageSubtitle } from "@components/page-sub-title";
import { PageTitle } from "@components/page-title";

import { useTitle } from "@utils/hooks/useTitle";

import D from "../../../../deprecated-locales/build-dictionary";
import Controls from "./components/Controls";
import General from "./components/General";
import Members from "./components/Members";
import Notes from "./components/Notes";

interface SeriesGeneral {
  prefLabelLg1: string;
  prefLabelLg2?: string;
  scopeNoteLg1?: string;
  scopeNoteLg2?: string;
  [key: string]: unknown;
}

interface SeriesMember {
  id: string;
  labelLg1: string;
  labelLg2?: string;
  [key: string]: unknown;
}

type Props = Readonly<{
  series: { general: SeriesGeneral; members: SeriesMember[] };
  secondLang: boolean;
}>;

const SeriesVisualization = ({ series: { general, members }, secondLang }: Props) => {
  useTitle(D.seriesTitle + " - " + D.classificationsTitle, general?.prefLabelLg1);

  const notes = {
    scopeNoteLg1: general.scopeNoteLg1,
    scopeNoteLg2: general.scopeNoteLg2,
  };
  return (
    <div className="container">
      <PageTitle title={general.prefLabelLg1} />
      {general.prefLabelLg2 && <PageSubtitle subTitle={general.prefLabelLg2} />}
      <Controls />
      <CheckSecondLang />
      <General general={general} secondLang={secondLang} />
      {notes.scopeNoteLg1 && <Notes notes={notes} secondLang={secondLang} />}
      {members.length !== 0 && <Members members={members} secondLang={secondLang} />}
    </div>
  );
};

export default SeriesVisualization;
