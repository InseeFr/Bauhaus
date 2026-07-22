import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getDisseminationStatus } from "@components/dissemination-status/disseminationStatus";
import { Row } from "@components/layout";
import { ExternalLink } from "@components/link";
import { Note } from "@components/note";
import { PublicationStatusItem, ValidationState } from "@components/status";

import { stringToDate } from "@utils/date-utils";
import { renderMarkdownElement } from "@utils/html-utils";

import { InseeOrganisation } from "@components/business/organisations/organisations";
import { Classification } from "../../../../types";

type Props = Readonly<{
  general: Classification;
  secondLang: boolean;
}>;

export const General = ({ general, secondLang }: Props) => {
  const { t } = useTranslation();

  let mapping: Record<string, any> = {};

  mapping = {
    ...mapping,
    seriesLg1: t("classification.motherSeries"),
    afterLg1: t("classification.previousClassification"),
    beforeLg1: t("classification.followingClassification"),
    variantLg1: t("classification.variant"),
  };

  if (general.altLabelLg1) {
    mapping = {
      ...mapping,
      altLabelLg1: `${t("classification.altLabelTitle")}`,
    };
  }

  if (general.altLabelLg2) {
    mapping = {
      ...mapping,
      altLabelLg2: `${t("classification.altLabelTitle")}`,
    };
  }

  mapping = {
    ...mapping,
    issued: t("classification.issuedDate"),
    valid: t("classification.validDate"),
    lastRefreshedOn: t("classification.lastRefreshedOnDate"),
    creator: t("classification.creator"),
    contributor: t("classification.contributor"),
    disseminationStatus: t("classification.disseminationStatus"),
    validationState: t("classification.validationStatus"),
    rights: t("classification.rights"),
    additionalMaterial: t("classification.additionalMaterial"),
    legalMaterial: t("classification.legalMaterial"),
    homepage: t("classification.homepage"),
  };

  return (
    <>
      <Row>
        <Note
          title={t("classification.globalInformation")}
          alone={true}
          text={
            <ul>
              {Object.keys(mapping).map((fieldName) => {
                if (Object.hasOwn(general, fieldName) && (general as any)[fieldName]) {
                  if (fieldName === "seriesLg1") {
                    return (
                      <li key={fieldName}>
                        {mapping[fieldName]} :{" "}
                        <Link to={`/classifications/series/${general.idSeries}`}>
                          {(general as any)[fieldName]}
                        </Link>
                        {secondLang && (general as any).seriesLg2 && (
                          <span>
                            {" ("}
                            <Link to={`/classifications/series/${general.idSeries}`}>
                              {(general as any).seriesLg2}
                            </Link>
                            {")"}
                          </span>
                        )}
                      </li>
                    );
                  }
                  if (fieldName === "afterLg1") {
                    return (
                      <li key={fieldName}>
                        {mapping[fieldName]} :{" "}
                        <Link to={`/classifications/classification/${general.idAfter}`}>
                          {(general as any)[fieldName]}
                        </Link>
                        {secondLang && (general as any).afterLg2 && (
                          <span>
                            {" ("}
                            <Link to={`/classifications/classification/${general.idAfter}`}>
                              {(general as any).afterLg2}
                            </Link>
                            {")"}
                          </span>
                        )}
                      </li>
                    );
                  }
                  if (fieldName === "beforeLg1") {
                    return (
                      <li key={fieldName}>
                        {mapping[fieldName]} :{" "}
                        <Link to={`/classifications/classification/${general.idBefore}`}>
                          {(general as any)[fieldName]}
                        </Link>
                        {secondLang && (general as any).beforeLg2 && (
                          <span>
                            {" ("}
                            <Link to={`/classifications/classification/${general.idBefore}`}>
                              {(general as any).beforeLg2}
                            </Link>
                            {")"}
                          </span>
                        )}
                      </li>
                    );
                  }
                  if (fieldName === "variantLg1") {
                    return (
                      <li key={fieldName}>
                        {mapping[fieldName]} :{" "}
                        <Link to={`/classifications/classification/${general.idVariant}`}>
                          {(general as any)[fieldName]}
                        </Link>
                        {secondLang && (general as any).variantLg2 && (
                          <span>
                            {" ("}
                            <Link to={`/classifications/classification/${general.idVariant}`}>
                              {(general as any).variantLg2}
                            </Link>
                            {")"}
                          </span>
                        )}
                      </li>
                    );
                  }
                  if (["additionalMaterial", "legalMaterial"].includes(fieldName)) {
                    return (
                      <li key={fieldName}>
                        {`${mapping[fieldName]} : `}
                        <ExternalLink
                          href={(general as any)[fieldName]}
                        >{`${(general as any)[fieldName]}`}</ExternalLink>
                      </li>
                    );
                  }
                  if (fieldName === "disseminationStatus") {
                    return (
                      <li key={fieldName}>
                        {`${mapping[fieldName]} : ${getDisseminationStatus((general as any)[fieldName])}`}
                      </li>
                    );
                  }
                  if (fieldName === "validationState") {
                    return (
                      <PublicationStatusItem
                        key={fieldName}
                        label={mapping[fieldName]}
                        object={{
                          validationState: (general as any)[fieldName] as ValidationState,
                        }}
                        gender="female"
                      />
                    );
                  }
                  if (fieldName === "altLabelLg2" && !secondLang) {
                    return null;
                  }
                  if (fieldName.includes("altLabel")) {
                    return (
                      <li key={fieldName}>
                        {`${mapping[fieldName]} : ${(general as any)[fieldName].split(" || ").join(" - ")}`}
                      </li>
                    );
                  }
                  if (["issued", "valid", "lastRefreshedOn"].includes(fieldName)) {
                    return (
                      <li key={fieldName}>
                        {`${mapping[fieldName]} : ${stringToDate((general as any)[fieldName])}`}
                      </li>
                    );
                  } else if (["creator", "contributor"].includes(fieldName)) {
                    return (
                      <li key={fieldName}>
                        {`${mapping[fieldName]} : `}{" "}
                        <InseeOrganisation creator={(general as any)[fieldName]} />
                      </li>
                    );
                  } else {
                    return (
                      <li
                        key={fieldName}
                      >{`${mapping[fieldName]} : ${(general as any)[fieldName]}`}</li>
                    );
                  }
                } else return null;
              })}
            </ul>
          }
        ></Note>
      </Row>
      <Row>
        <Note
          title={t("classification.descriptionTitle", { lng: "fr" })}
          text={renderMarkdownElement(general.descriptionLg1)}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            title={t("classification.descriptionTitle", { lng: "en" })}
            text={renderMarkdownElement(general.descriptionLg2)}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
    </>
  );
};
