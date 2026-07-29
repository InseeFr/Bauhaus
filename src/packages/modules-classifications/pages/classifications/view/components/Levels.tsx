import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { Note } from "@components/note";

import { Level } from "../../../../types";

type Props = Readonly<{
  levels: Level[];
  classificationId: string;
  secondLang: boolean;
}>;

export const Levels = ({ levels, classificationId, secondLang }: Props) => {
  const { t } = useTranslation();

  const levelsLg1 = levels.map((m, i) => (
    <li key={i}>
      <Link to={`/classifications/classification/${classificationId}/level/${m.id}`}>
        {m.labelLg1}
      </Link>
    </li>
  ));

  let levelsLg2: (JSX.Element | null)[] = [];
  if (secondLang)
    levelsLg2 = levels.map((m, i) =>
      m.labelLg2 ? (
        <li key={i}>
          <Link to={`/classifications/classification/${classificationId}/level/${m.id}`}>
            {m.labelLg2}
          </Link>
        </li>
      ) : null,
    );

  const isMembersLg2 = levelsLg2.filter((m) => m !== null).length !== 0;

  return (
    <Row>
      <Note
        alone={!(secondLang && isMembersLg2)}
        title={t("classification.levelsTitle", { lng: "fr" })}
        text={levelsLg1}
      ></Note>
      {secondLang && isMembersLg2 && (
        <Note
          alone={false}
          title={t("classification.levelsTitle", { lng: "en" })}
          text={levelsLg2}
        ></Note>
      )}
    </Row>
  );
};
