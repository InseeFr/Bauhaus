import { CheckSecondLang } from "@components/check-second-lang";
import { PageTitle } from "@components/page-title";

import { General } from "../../../../components/General";
import { Controls } from "./Controls";
import { ItemNotesCompare } from "./ItemNotesCompare";

export const Compare = ({ classificationId, general, notes, secondLang }: any) => {
  const { prefLabelLg1, prefLabelLg2 } = general;

  return (
    <div>
      <div className="container">
        <PageTitle title={secondLang ? prefLabelLg2 : prefLabelLg1} />
        <Controls />
        <CheckSecondLang />
        <General general={general} classificationId={classificationId} secondLang={secondLang} />
        <ItemNotesCompare notes={notes} secondLang={secondLang} />
      </div>
    </div>
  );
};
