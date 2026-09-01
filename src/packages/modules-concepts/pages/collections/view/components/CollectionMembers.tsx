import { Link } from "react-router-dom";

import { Row } from "@components/layout";
import { Note } from "@components/note";

import type { CollectionMember } from "@model/concepts/collection";
import { sortArray } from "@utils/array-utils";
import { useTranslation } from "react-i18next";

import "../../../../i18n";

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

export function CollectionMembers({ members, secondLang }: Readonly<CollectionMembersProps>) {
  const { t } = useTranslation();

  const sortedMembers = sortByLabelLg1(members) as CollectionMember[];

  const memberListLg1 = renderMemberList(sortedMembers, "prefLabelLg1");
  const memberListLg2 = renderMemberList(sortedMembers, "prefLabelLg2");

  return (
    <Row>
      <Note
        text={memberListLg1}
        title={t("collection.membersPanelTitle", {
          size: memberListLg1.length,
        })}
        alone={!secondLang}
      />
      {secondLang && (
        <Note
          text={memberListLg2}
          title={t("collection.membersPanelTitle", {
            size: memberListLg2.length,
            lng: "en",
          })}
          alone={false}
        />
      )}
    </Row>
  );
}
