import { ExplanatoryNote } from "@components/explanatory-note";
import { Row } from "@components/layout";

import { D1, D2 } from "../../../../../deprecated-locales";

interface ClassificationNotes {
  scopeNoteLg1?: string;
  scopeNoteLg2?: string;
  changeNoteLg1?: string;
  changeNoteLg2?: string;
  descriptionLg1?: string;
  descriptionLg2?: string;
}

type Props = Readonly<{
  notes: ClassificationNotes;
  secondLang: boolean;
}>;

const Notes = ({
  notes: {
    scopeNoteLg1,
    scopeNoteLg2,
    changeNoteLg1,
    changeNoteLg2,
    descriptionLg1,
    descriptionLg2,
  },
  secondLang,
}: Props) => (
  <div>
    <span>
      {descriptionLg1 && (
        <Row>
          <ExplanatoryNote
            text={descriptionLg1}
            title={D1.classificationsDescription}
            alone={!secondLang}
            md
          />
          {secondLang && (
            <ExplanatoryNote
              text={descriptionLg2}
              title={D2.classificationsDescription}
              alone={false}
              md
            />
          )}
        </Row>
      )}
    </span>
    <span>
      {scopeNoteLg1 && (
        <Row>
          <ExplanatoryNote
            text={scopeNoteLg1}
            title={D1.classificationsScopeNote}
            alone={!secondLang}
            md
          />
          {secondLang && (
            <ExplanatoryNote
              text={scopeNoteLg2}
              title={D2.classificationsScopeNote}
              alone={false}
              md
            />
          )}
        </Row>
      )}
    </span>
    <span>
      {changeNoteLg1 && (
        <Row>
          <ExplanatoryNote
            text={changeNoteLg1}
            title={D1.classificationsChangeNote()}
            alone={!secondLang}
            md
          />
          {secondLang && (
            <ExplanatoryNote
              text={changeNoteLg2}
              title={D2.classificationsChangeNote()}
              alone={false}
              md
            />
          )}
        </Row>
      )}
    </span>
  </div>
);

export default Notes;
