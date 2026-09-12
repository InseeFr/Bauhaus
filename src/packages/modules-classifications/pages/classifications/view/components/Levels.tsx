import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Row } from "@components/layout";
import { Note } from "@components/note";
import { List } from "@components/ui/list-group";

import { Level } from "../../../../types";

type Props = Readonly<{
  levels: Level[];
  classificationId: string;
  secondLang: boolean;
}>;

type LevelLabel = Readonly<{ id: string; label: string }>;

/**
 * Même liste Bootstrap que celle des postes d'un niveau (`SearchableList`),
 * sans le champ de recherche ni la pagination : une nomenclature a une poignée
 * de niveaux, il n'y a rien à filtrer ni à paginer.
 */
const LevelsList = ({
  levels,
  classificationId,
}: Readonly<{ levels: LevelLabel[]; classificationId: string }>) => (
  <List.Container>
    {levels.map(({ id, label }) => (
      <List.Item key={id}>
        <Link to={`/classifications/classification/${classificationId}/level/${id}`}>{label}</Link>
      </List.Item>
    ))}
  </List.Container>
);

export const Levels = ({ levels, classificationId, secondLang }: Props) => {
  const { t } = useTranslation();

  const levelsLg1: LevelLabel[] = levels.map(({ id, labelLg1 }) => ({ id, label: labelLg1 }));

  const levelsLg2: LevelLabel[] = secondLang
    ? levels
        .filter(({ labelLg2 }) => labelLg2)
        .map(({ id, labelLg2 }) => ({ id, label: labelLg2 as string }))
    : [];

  return (
    <Row>
      <Note
        alone={!(secondLang && levelsLg2.length !== 0)}
        title={t("classification.levelsTitle", { lng: "fr" })}
        allowEmpty={true}
        text={<LevelsList levels={levelsLg1} classificationId={classificationId} />}
      ></Note>
      {secondLang && levelsLg2.length !== 0 && (
        <Note
          alone={false}
          title={t("classification.levelsTitle", { lng: "en" })}
          allowEmpty={true}
          text={<LevelsList levels={levelsLg2} classificationId={classificationId} />}
        ></Note>
      )}
    </Row>
  );
};
