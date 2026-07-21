import { Link } from "react-router-dom";

import { Row } from "@components/layout";
import { Note } from "@components/note";

import D from "../../../../../deprecated-locales";

interface LevelGeneral {
  broaderLg1?: string;
  broaderLg2?: string;
  idBroader?: string;
  narrowerLg1?: string;
  narrowerLg2?: string;
  idNarrower?: string;
  notation?: string;
  depth?: string;
  notationPattern?: string;
  [key: string]: unknown;
}

type Props = Readonly<{
  general: LevelGeneral;
  classificationId: string;
  secondLang: boolean;
}>;

export const General = ({ general, classificationId, secondLang }: Props) => {
  const mapping: Record<string, string> = {
    broaderLg1: D.classificationsBroaderLevel,
    narrowerLg1: D.classificationsNarrowerLevel,
    notation: D.classificationsNotationTitle,
    depth: D.classificationsDepthTitle,
    notationPattern: D.classificationsNotationPatternTitle,
  };

  return (
    <Row>
      <Note
        text={
          <ul>
            {Object.keys(mapping).map((fieldName) => {
              if (Object.hasOwn(general, fieldName) && general[fieldName]) {
                if (fieldName === "broaderLg1") {
                  return (
                    <li key={fieldName}>
                      {mapping[fieldName]} :{" "}
                      <Link
                        to={`/classifications/classification/${classificationId}/level/${general.idBroader}`}
                      >
                        {general[fieldName]}
                      </Link>
                      {secondLang && general.broaderLg2 && (
                        <span>
                          {" ("}
                          <Link
                            to={`/classifications/classification/${classificationId}/level/${general.idBroader}`}
                          >
                            {general.broaderLg2}
                          </Link>
                          {")"}
                        </span>
                      )}
                    </li>
                  );
                }
                if (fieldName === "narrowerLg1") {
                  return (
                    <li key={fieldName}>
                      {mapping[fieldName]} :{" "}
                      <Link
                        to={`/classifications/classification/${classificationId}/level/${general.idNarrower}`}
                      >
                        {general[fieldName]}
                      </Link>
                      {secondLang && general.narrowerLg2 && (
                        <span>
                          {" ("}
                          <Link
                            to={`/classifications/classification/${classificationId}/level/${general.idNarrower}`}
                          >
                            {general.narrowerLg2}
                          </Link>
                          {")"}
                        </span>
                      )}
                    </li>
                  );
                } else {
                  return <li key={fieldName}>{`${mapping[fieldName]} : ${general[fieldName]}`}</li>;
                }
              } else return null;
            })}
          </ul>
        }
        title={D.globalInformationsTitle}
        alone={true}
        allowEmpty={true}
      />
    </Row>
  );
};
