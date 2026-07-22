import { useTranslation } from "react-i18next";

import { Note } from "@components/note";
import { SearchableList } from "@components/searchable-list";

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
  const { t } = useTranslation();

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
        title={t("level.childrenItems", { lng: "fr" })}
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
          title={t("level.childrenItems", { lng: "en" })}
          alone={!secondLang}
          allowEmpty={true}
        />
      )}
    </div>
  );
};
