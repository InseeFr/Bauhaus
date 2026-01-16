import { Link } from "react-router-dom";

import { Row } from "@components/layout";
import { Note } from "@components/note";

import { D1, D2 } from "../../../deprecated-locales";

const Members = ({ members, secondLang }) => {
  const membersLg1 = members.map((m) => (
    <li key={m.id}>
      <Link to={`/classifications/series/${m.id}`}>{m.labelLg1}</Link>
    </li>
  ));
  let membersLg2 = [];
  if (secondLang)
    membersLg2 = members.map((m) =>
      m.labelLg2 ? (
        <li key={m.id}>
          <Link to={`/classifications/series/${m.id}`}>{m.labelLg2}</Link>
        </li>
      ) : null,
    );
  const isMembersLg2 = membersLg2.filter((m) => m !== null).length !== 0;
  return (
    <Row>
      <Note title={D1.childrenSeries} text={<ul>{membersLg1}</ul>} alone={!secondLang} />
      {secondLang && isMembersLg2 && (
        <Note title={D2.childrenSeries} text={<ul>{membersLg2}</ul>} alone={false} />
      )}
    </Row>
  );
};

export default Members;
