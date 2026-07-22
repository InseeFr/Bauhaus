import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { Note } from "@components/note";

interface SeriesGeneral {
  familyLg1?: string;
  familyLg2?: string;
  idFamily?: string;
  altLabelLg1?: string;
  altLabelLg2?: string;
  subject?: string;
  covers?: string;
  publisher?: string;
  [key: string]: unknown;
}

type Props = Readonly<{
  general: SeriesGeneral;
  secondLang: boolean;
}>;

export const General = ({ general, secondLang }: Props) => {
  const { t } = useTranslation();

  let mapping: Record<string, string> = {};

  if (general.familyLg1) {
    mapping = {
      ...mapping,
      familyLg1: `${t("serie.motherFamily")}`,
    };
  }

  if (general.altLabelLg1) {
    mapping = {
      ...mapping,
      altLabelLg1: `${t("serie.altLabelTitle")}`,
    };
  }

  if (general.altLabelLg2) {
    mapping = {
      ...mapping,
      altLabelLg2: `${t("serie.altLabelTitle")}`,
    };
  }

  if (general.subject) {
    mapping = {
      ...mapping,
      subject: `${t("serie.subject")}`,
    };
  }

  if (general.covers) {
    mapping = {
      ...mapping,
      covers: `${t("serie.covers")}`,
    };
  }

  if (general.publisher) {
    mapping = {
      ...mapping,
      publisher: `${t("serie.publisher")}`,
    };
  }

  const lis = Object.keys(mapping).map((fieldName) => {
    if (Object.hasOwn(general, fieldName)) {
      if (fieldName === "familyLg1") {
        return (
          <li key={fieldName}>
            {mapping[fieldName]} :{" "}
            <Link to={`/classifications/family/${general.idFamily}`}>{general[fieldName]}</Link>
            {secondLang && general.familyLg2 && (
              <span>
                {" ("}
                <Link to={`/classifications/family/${general.idFamily}`}>{general.familyLg2}</Link>
                {")"}
              </span>
            )}
          </li>
        );
      }
      if (fieldName === "altLabelLg2" && !secondLang) {
        return null;
      }
      if (fieldName.includes("altLabel")) {
        return (
          <li key={fieldName}>
            {`${mapping[fieldName]} : ${(general[fieldName] as string).split(" || ").join(" - ")}`}
          </li>
        );
      } else {
        return <li key={fieldName}>{`${mapping[fieldName]} : ${general[fieldName]}`}</li>;
      }
    } else return null;
  });

  return (
    <Row>
      <Note title={t("serie.globalInformation")} alone={true} text={<ul>{lis}</ul>}></Note>
    </Row>
  );
};
