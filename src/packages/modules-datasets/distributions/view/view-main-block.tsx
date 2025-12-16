import Editor from "@uiw/react-md-editor";

import { Row } from "@components/layout";
import { ExternalLink } from "@components/link";
import { Note } from "@components/note";
import { PublicationFemale } from "@components/status";

import { stringToDate } from "@utils/date-utils";
import { useSecondLang } from "@utils/hooks/second-lang";

import D, { D1, D2 } from "../../../deprecated-locales/build-dictionary";
import { Distribution } from "../../../model/Dataset";

export const ViewMainBlock = ({ distribution }: Readonly<{ distribution: Distribution }>) => {
  const [secondLang] = useSecondLang();

  return (
    <>
      <Row>
        <Note
          text={
            <ul>
              <li>
                {D.createdDateTitle} : {stringToDate(distribution.created)}{" "}
              </li>
              <li>
                {D.modifiedDateTitle} : {stringToDate(distribution.updated)}{" "}
              </li>
              <li>
                {D.distributionStatus} :
                <PublicationFemale object={distribution} />
              </li>
              <li>
                {D.languageTitle} : {distribution.language}{" "}
              </li>
              <li>
                {D.formatTitle} : {distribution.format}{" "}
              </li>
              <li>
                {D.mediaTypeTitle} : {distribution.mediaType}{" "}
              </li>
              <li>
                {D.compressFormatTitle} : {distribution.compressFormat}{" "}
              </li>
              <li>
                {D.tailleTitle} : {distribution.byteSize}{" "}
              </li>
              <li>
                {D.accessUrlTitle} : {distribution.accessUrl}
                <ExternalLink href={distribution.accessUrl}>{distribution.accessUrl}</ExternalLink>
              </li>
              <li>
                {D.downloadUrlTitle} :{" "}
                <ExternalLink href={distribution.url}>{distribution.url}</ExternalLink>
              </li>
            </ul>
          }
          title={D1.globalInformationsTitle}
          alone={true}
        />
      </Row>
      <Row>
        <Note
          text={<Editor.Markdown source={distribution.descriptionLg1} />}
          title={D1.descriptionTitle}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={<Editor.Markdown source={distribution.descriptionLg2} />}
            title={D2.descriptionTitle}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
    </>
  );
};
