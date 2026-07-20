import { Link } from "react-router-dom";

import { Row } from "@components/layout";
import { Note } from "@components/note";

import { D1, D2 } from "../../../../../deprecated-locales";

interface Narrower {
  id: string;
  labelLg1: string;
  labelLg2?: string;
}

type Props = Readonly<{
  narrowers?: Narrower[];
  classificationId: string;
  secondLang: boolean;
}>;

const Narrowers = ({ narrowers, classificationId, secondLang }: Props) => {
  if (!narrowers || narrowers?.length === 0) {
    return null;
  }

  const narrowersLg1 = narrowers?.map((n, i) => (
    <li key={i}>
      <Link to={`/classifications/classification/${classificationId}/item/${n.id}`}>
        {`${n.id} - ${n.labelLg1}`}
      </Link>
    </li>
  ));
  let narrowersLg2: (JSX.Element | null)[] = [];
  if (secondLang)
    narrowersLg2 = narrowers?.map((n, i) =>
      n.labelLg2 ? (
        <li key={i}>
          <Link to={`/classifications/classification/${classificationId}/item/${n.id}`}>
            {`${n.id} - ${n.labelLg2}`}
          </Link>
        </li>
      ) : null,
    );
  const isMembersLg2 = narrowersLg2.filter((m) => m !== null).length !== 0;
  return (
    <Row>
      <Note
        text={<ul>{narrowersLg1}</ul>}
        title={D1.classificationsNarrowerItems}
        alone={!(secondLang && isMembersLg2)}
        allowEmpty={true}
      />
      {secondLang && isMembersLg2 && (
        <Note
          text={<ul>{narrowersLg2}</ul>}
          title={D2.classificationsNarrowerItems}
          alone={false}
          allowEmpty={true}
        />
      )}
    </Row>
  );
};

export default Narrowers;
