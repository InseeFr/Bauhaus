import { Link } from "react-router-dom";

import { Row } from "@components/layout";
import { Note } from "@components/note";

import D from "../../../../../deprecated-locales";

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
  let mapping: Record<string, string> = {};

  if (general.familyLg1) {
    mapping = {
      ...mapping,
      familyLg1: `${D.motherFamily}`,
    };
  }

  if (general.altLabelLg1) {
    mapping = {
      ...mapping,
      altLabelLg1: `${D.altLabelTitle}`,
    };
  }

  if (general.altLabelLg2) {
    mapping = {
      ...mapping,
      altLabelLg2: `${D.altLabelTitle}`,
    };
  }

  if (general.subject) {
    mapping = {
      ...mapping,
      subject: `${D.classificationsSubjectTitle}`,
    };
  }

  if (general.covers) {
    mapping = {
      ...mapping,
      covers: `${D.classificationsCoversTitle}`,
    };
  }

  if (general.publisher) {
    mapping = {
      ...mapping,
      publisher: `${D.classificationsPublisherTitle}`,
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
      <Note title={D.globalInformationsTitle} alone={true} text={<ul>{lis}</ul>}></Note>
    </Row>
  );
};
