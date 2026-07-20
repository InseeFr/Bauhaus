import { CheckSecondLang } from "@components/check-second-lang";
import { CompareNotes } from "@components/note-compare";
import { PageTitle } from "@components/page-title";

import { buildNotes } from "../../../utils/classification/notes";
import General from "../components/General";
import Controls from "./components/Controls";

const Compare = ({ classificationId, general, notes, secondLang }: any) => {
  const { prefLabelLg1, prefLabelLg2 } = general;
  const version = Number(general.conceptVersion);
  return (
    <div>
      <div className="container">
        <PageTitle title={secondLang ? prefLabelLg2 : prefLabelLg1} />
        <Controls />
        <CheckSecondLang />

        <General general={general} classificationId={classificationId} secondLang={secondLang} />
        <CompareNotes
          secondLang={secondLang}
          notes={notes}
          version={version}
          buildNotes={buildNotes}
        />
      </div>
    </div>
  );
};

export default Compare;
