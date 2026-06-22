import { Link } from "react-router-dom";

import { Row } from "@components/layout";
import { Note } from "@components/note";

import { sortArray } from "@utils/array-utils";
import { useTranslation } from "@utils/hooks/useTranslation";

import "../../../../i18n";

interface CollectionMember {
  id: string;
  prefLabelLg1?: string;
  prefLabelLg2?: string;
}

const sortByLabelLg1 = sortArray("prefLabelLg1");

const renderMemberList = (
  sortedMembers: CollectionMember[],
  label: "prefLabelLg1" | "prefLabelLg2",
) =>
  sortedMembers.map(({ id, [label]: prefLabel }) => (
    <li key={id}>
      <Link to={`/concepts/${id}`}>{prefLabel}</Link>
    </li>
  ));

interface CollectionMembersProps {
  members: CollectionMember[];
  secondLang?: boolean;
}

function CollectionMembers({ members, secondLang }: Readonly<CollectionMembersProps>) {
  const { t, t2 } = useTranslation();
  const sortedMembers = sortByLabelLg1(members) as CollectionMember[];

  const memberListLg1 = renderMemberList(sortedMembers, "prefLabelLg1");
  const memberListLg2 = renderMemberList(sortedMembers, "prefLabelLg2");

  return (
    <Row>
      <Note
        text={memberListLg1}
        title={t("collection.membersPanelTitle", { size: memberListLg1.length })}
        alone={!secondLang}
      />
      {secondLang && (
        <Note
          text={memberListLg2}
          title={t2("collection.membersPanelTitle", { size: memberListLg2.length })}
          alone={false}
        />
      )}
    </Row>
  );
}

export default CollectionMembers;
