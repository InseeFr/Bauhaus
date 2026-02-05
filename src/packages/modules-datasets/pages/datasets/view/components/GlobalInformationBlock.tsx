import { useTranslation } from "react-i18next";

import { CodeDisplay } from "@components/code-display";
import { ConditionalDisplay } from "@components/data/conditional-display";
import { Organisation, Organisations } from "@components/business/organisations/organisations";
import { Row } from "@components/layout";
import { List } from "@components/ui/list";
import { Note } from "@components/note";
import { PublicationMale } from "@components/status";

import { stringToDate } from "@utils/date-utils";
import { useCodesList } from "@utils/hooks/codeslist";
import { useOrganizations } from "@utils/hooks/organizations";

import { Dataset } from "../../../../../model/Dataset";
import { CL_ACCESS_RIGHTS, CL_CONF_STATUS, CL_FREQ } from "../../../../../constants/code-lists";
import { WasGeneratedByBlock } from "./wasGeneratedByBlock";
import { useThemes } from "../../../../hooks/useThemes";

interface GlobalInformationBlockTypes {
  dataset: Dataset;
}

export const GlobalInformationBlock = ({ dataset }: Readonly<GlobalInformationBlockTypes>) => {
  const { i18n } = useTranslation();
  const tFr = i18n.getFixedT("fr");
  const tEn = i18n.getFixedT("en");

  const { data: themesOptions = [] } = useThemes();
  const { data: organisations } = useOrganizations();

  const clAccessRights = useCodesList(CL_ACCESS_RIGHTS);
  const clFreq = useCodesList(CL_FREQ);
  const clConfStatus = useCodesList(CL_CONF_STATUS);

  if (!organisations) {
    return null;
  }

  return (
    <Row>
      <Note
        text={
          <ul>
            <li>
              {tFr("dataset.globalInformation.creationDate")} :{" "}
              {stringToDate(dataset.catalogRecord?.created)}{" "}
            </li>
            <li>
              {tFr("dataset.globalInformation.updatingDate")} :{" "}
              {stringToDate(dataset.catalogRecord?.updated)}{" "}
            </li>
            <li>
              {tFr("dataset.globalInformation.validationStatus")} :{" "}
              <PublicationMale object={dataset} />
            </li>
            <ConditionalDisplay data={dataset?.issued}>
              <li>
                {tFr("dataset.globalInformation.firstReleaseDate")} :{" "}
                {stringToDate(dataset.issued)}{" "}
              </li>
            </ConditionalDisplay>
            {dataset.accessRights && (
              <li>
                {tFr("dataset.internalManagement.accessRights")} :{" "}
                <CodeDisplay codesList={clAccessRights} value={dataset.accessRights}></CodeDisplay>
              </li>
            )}
            {dataset.accrualPeriodicity && (
              <li>
                {tFr("dataset.globalInformation.updateFrequency")} :{" "}
                <CodeDisplay codesList={clFreq} value={dataset.accrualPeriodicity} />
              </li>
            )}
            {dataset.confidentialityStatus && (
              <li>
                {tFr("dataset.internalManagement.confidentialityStatus")} :{" "}
                <CodeDisplay
                  codesList={clConfStatus}
                  value={dataset.confidentialityStatus}
                ></CodeDisplay>
              </li>
            )}
            <ConditionalDisplay data={dataset.creators}>
              <li>
                {tFr("dataset.globalInformation.dataProvider")} :
                <Organisations creators={dataset.creators} organizations={organisations} />
              </li>
            </ConditionalDisplay>
            {dataset.publisher && (
              <li>
                {tFr("dataset.globalInformation.publicationProvider")} :{" "}
                <Organisation creator={dataset.publisher} organizations={organisations} />
              </li>
            )}
            <li>
              {tFr("dataset.internalManagement.generatedBy")} :{" "}
              <WasGeneratedByBlock iris={dataset.wasGeneratedIRIs}></WasGeneratedByBlock>
            </li>
            <ConditionalDisplay data={dataset.themes}>
              <li>
                {tFr("dataset.globalInformation.theme")} :{" "}
                <List
                  items={dataset.themes}
                  getContent={(value) => themesOptions?.find((t) => t.value === value)?.label ?? ""}
                ></List>
              </li>
            </ConditionalDisplay>
            {dataset.keywords?.lg1?.length > 0 && (
              <li>
                {tFr("dataset.globalInformation.keywords")} (fr) :{" "}
                <List items={dataset.keywords.lg1}></List>
              </li>
            )}
            {dataset.keywords?.lg2?.length > 0 && (
              <li>
                {tEn("dataset.globalInformation.keywords")} (en) :{" "}
                <List items={dataset.keywords.lg2}></List>
              </li>
            )}
          </ul>
        }
        title={tFr("dataset.globalInformation.title")}
        alone={true}
      />
    </Row>
  );
};
