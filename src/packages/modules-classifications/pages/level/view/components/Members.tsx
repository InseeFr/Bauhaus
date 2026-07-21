import { Note } from "@components/note";
import { SearchableList } from "@components/searchable-list";

import { D1, D2 } from "../../../../../deprecated-locales";

interface LevelMember {
  id: string;
  labelLg1: string;
  labelLg2?: string;
  [key: string]: unknown;
}

type Props = Readonly<{
  members: LevelMember[];
  classificationId: string;
  secondLang: boolean;
}>;

export const Members = ({ members, classificationId, secondLang }: Props) => {
  const membersLg1 = members.map(({ id, labelLg1 }) => ({
    id,
    label: `${id} - ${labelLg1}`,
  }));

  let membersLg2: { id: string; label: string }[] = [];
  if (secondLang && members[0].labelLg2 !== undefined) {
    membersLg2 = members.map(({ id, labelLg2 }) => ({
      id,
      label: `${id} - ${labelLg2}`,
    }));
  }

  return (
    <div className="row text-center">
      <Note
        text={
          <SearchableList
            items={membersLg1}
            childPath={`classifications/classification/${classificationId}/item`}
          />
        }
        title={D1.childrenClassificationItems}
        alone={!secondLang}
        allowEmpty={true}
      />
      {secondLang && (
        <Note
          text={
            <SearchableList
              items={membersLg2}
              childPath={`classifications/classification/${classificationId}/item`}
              col={12}
              colOff={0}
            />
          }
          title={D2.childrenClassificationItems}
          alone={!secondLang}
          allowEmpty={true}
        />
      )}
    </div>
  );
};
