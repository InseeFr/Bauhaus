import { Link } from "react-router-dom";

import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem, ValidationState } from "@components/status";

import D from "../../deprecated-locales";

interface ItemAltLabel {
  length: number;
  shortLabelLg1?: string;
  shortLabelLg2?: string;
}

interface ItemGeneral {
  broaderLg1?: string;
  broaderLg2?: string;
  idBroader?: string;
  itemId?: string;
  altLabelLg1?: string;
  altLabelLg2?: string;
  altLabels?: ItemAltLabel[];
  validationState?: string;
  conceptVersion?: string;
  [key: string]: unknown;
}

type Props = Readonly<{
  general: ItemGeneral;
  classificationId: string;
  secondLang: boolean;
}>;

export const General = ({ general, classificationId, secondLang }: Props) => {
  const mapping: Record<string, any> = {
    broaderLg1: D.classificationsBroaderLevel,
    itemId: D.classificationsNotationTitle,
    altLabelLg1: D.altLabelTitle,
    altLabelLg2: D.altLabelTitle,
    altLabels: (length: number) => D.classificationItemAltLabels(length),
    validationState: D.isClassificationItemValidTitle,
    conceptVersion: D.classificationConceptVersionTitle,
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
                        to={`/classifications/classification/${classificationId}/item/${general.idBroader}`}
                      >
                        {general.idBroader} - {general[fieldName]}
                      </Link>
                      {secondLang && general.broaderLg2 && (
                        <span>
                          {" ("}
                          <Link
                            to={`/classifications/classification/${classificationId}/item/${general.idBroader}`}
                          >
                            {general.idBroader} - {general.broaderLg2}
                          </Link>
                          {")"}
                        </span>
                      )}
                    </li>
                  );
                }
                if (fieldName === "altLabels") {
                  return general.altLabels!.map(({ length, shortLabelLg1, shortLabelLg2 }) => (
                    <li key={`${fieldName}-${length}`}>
                      {`${mapping[fieldName](length)} : ${shortLabelLg1} ${
                        shortLabelLg2
                          ? `(
														${shortLabelLg2}
													)`
                          : ""
                      }`}
                    </li>
                  ));
                }
                if (fieldName === "validationState") {
                  return (
                    <PublicationStatusItem
                      key={fieldName}
                      label={mapping[fieldName]}
                      object={{ validationState: general[fieldName] as ValidationState }}
                    />
                  );
                }
                if (fieldName === "altLabelLg1") {
                  return (
                    <li key={fieldName}>
                      {mapping[fieldName]} : {general.altLabelLg1}
                    </li>
                  );
                }
                if (fieldName === "altLabelLg2") {
                  return (
                    <li key={fieldName}>
                      {mapping[fieldName]} : {general.altLabelLg2}
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
