import { useTranslation } from "@utils/hooks/useTranslation";
import { Link } from "react-router-dom";

import { Row } from "@components/layout";
import { Note } from "@components/note";

import { sortArray } from "@utils/array-utils";

import "../../../../i18n";

const sortByLabelLg1 = sortArray("prefLabelLg1");
const renderMemberList = (sortedMembers, label) =>
  sortedMembers.map(({ id, [label]: prefLabel }) => (
    <li key={id}>
      <Link to={`/concepts/${id}`}>{prefLabel}</Link>
    </li>
  ));

function CollectionMembers({ members, secondLang }) {
  const { t, t2 } = useTranslation();
  const sortedMembers = sortByLabelLg1(members);

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
