import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { Row } from "@components/layout";
import { Note } from "@components/note";

type Member = {
  id: string;
  labelLg1: string;
  labelLg2?: string;
};

type Props = Readonly<{
  members: Member[];
  secondLang: boolean;
  linkBasePath: string;
  titleD1: string;
  titleD2: string;
}>;

export const ClassificationMembers = ({
  members,
  secondLang,
  linkBasePath,
  titleD1,
  titleD2,
}: Props) => {
  const membersLg1 = members.map((m) => (
    <li key={`${m.id}-1`}>
      <Link to={`${linkBasePath}/${m.id}`}>{m.labelLg1}</Link>
    </li>
  ));

  let membersLg2: (ReactElement | null)[] = [];
  if (secondLang)
    membersLg2 = members.map((m) =>
      m.labelLg2 ? (
        <li key={`${m.id}-2`}>
          <Link to={`${linkBasePath}/${m.id}`}>{m.labelLg2}</Link>
        </li>
      ) : null,
    );

  const isMembersLg2 = membersLg2.some((m) => m !== null);

  return (
    <Row>
      <Note title={titleD1} text={<ul>{membersLg1}</ul>} alone={!secondLang} />
      {secondLang && isMembersLg2 && (
        <Note title={titleD2} text={<ul>{membersLg2}</ul>} alone={false} />
      )}
    </Row>
  );
};
