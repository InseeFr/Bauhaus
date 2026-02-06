import Editor from "@uiw/react-md-editor";
import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { ExternalLink } from "@components/link";
import { Note } from "@components/note";
import { PublicationFemale } from "@components/status";

import { stringToDate } from "@utils/date-utils";
import { useSecondLang } from "@utils/hooks/second-lang";

import { Distribution } from "../../../../../model/Dataset";

export const ViewMainBlock = ({ distribution }: Readonly<{ distribution: Distribution }>) => {
  const { t } = useTranslation();

  const [secondLang] = useSecondLang();

  return (
    <>
      <Row>
        <Note
          text={
            <ul>
              <li>
                {t("distribution.creationDate")} : {stringToDate(distribution.created)}
              </li>
              <li>
                {t("distribution.updatingDate")} : {stringToDate(distribution.updated)}
              </li>
              <li>
                {t("distribution.validationStatus")} : <PublicationFemale object={distribution} />
              </li>
              <li>
                {t("distribution.language")} : {distribution.language}
              </li>
              <li>
                {t("distribution.format")} : {distribution.format}
              </li>
              <li>
                {t("distribution.mediaType")} : {distribution.mediaType}
              </li>
              <li>
                {t("distribution.compressFormat")} : {distribution.compressFormat}
              </li>
              <li>
                {t("distribution.size")} : {distribution.byteSize}
              </li>
              <li>
                {t("distribution.accessURL")} :{" "}
                <ExternalLink href={distribution.accessUrl}>{distribution.accessUrl}</ExternalLink>
              </li>
              <li>
                {t("distribution.downloadURL")} :{" "}
                <ExternalLink href={distribution.url}>{distribution.url}</ExternalLink>
              </li>
            </ul>
          }
          title={t("dataset.globalInformation.title")}
          alone={true}
        />
      </Row>
      <Row>
        <Note
          text={<Editor.Markdown source={distribution.descriptionLg1} />}
          title={t("distribution.description", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={<Editor.Markdown source={distribution.descriptionLg2} />}
            title={t("distribution.description", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
    </>
  );
};
