import { CheckSecondLang } from "@components/check-second-lang";
import { CompareNotes } from "@components/note-compare";
import { PageTitle } from "@components/page-title";

import {
  ConceptGeneral as ConceptGeneralType,
  ConceptNotes,
} from "../../../../../model/concepts/concept";
import { buildNotes } from "../../../../utils/buildNotes";
import { ConceptGeneral } from "../../view/components/ConceptGeneral";
import { Controls } from "./Controls";

interface ConceptCompare {
  conceptGeneral: ConceptGeneralType;
  notes: Record<number, ConceptNotes>;
  secondLang: boolean;
}

export const ConceptCompare = ({ conceptGeneral, notes, secondLang }: Readonly<ConceptCompare>) => {
  const { prefLabelLg1, prefLabelLg2 } = conceptGeneral;

  const version = Number(conceptGeneral.conceptVersion);

  return (
    <div>
      <div className="container">
        <PageTitle title={(secondLang ? prefLabelLg2 : prefLabelLg1) ?? ""} />
        <Controls />
        <CheckSecondLang />
        <ConceptGeneral concept={conceptGeneral} secondLang={secondLang} />
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
