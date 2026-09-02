import { useTranslation } from "react-i18next";

import { Organisation, Organisations } from "@components/business/organisations/organisations";
import { CodeDisplay } from "@components/code-display";
import { ConditionalDisplay } from "@components/data/conditional-display";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";
import { List } from "@components/ui/list";

import { Dataset } from "@model/Dataset";

import { stringToDate } from "@utils/date-utils";
import { useCodesList } from "@utils/hooks/codeslist";
import { useOrganizations } from "@utils/hooks/organizations";

import { CL_ACCESS_RIGHTS, CL_CONF_STATUS, CL_FREQ } from "../../../../../constants/code-lists";
import { useThemes } from "../../../../hooks/useThemes";
import { WasGeneratedByBlock } from "./WasGeneratedByBlock";

interface GlobalInformationBlockTypes {
  dataset: Dataset;
}

export const GlobalInformationBlock = ({ dataset }: Readonly<GlobalInformationBlockTypes>) => {
  const { t } = useTranslation();

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
              {t("dataset.globalInformation.creationDate")} :{" "}
              {stringToDate(dataset.catalogRecord?.created)}{" "}
            </li>
            <li>
              {t("dataset.globalInformation.updatingDate")} :{" "}
              {stringToDate(dataset.catalogRecord?.updated)}{" "}
            </li>
            <PublicationStatusItem
              label={t("dataset.globalInformation.validationStatus")}
              object={dataset}
            />
            <ConditionalDisplay data={dataset?.issued}>
              <li>
                {t("dataset.globalInformation.firstReleaseDate")} :{" "}
                {stringToDate(dataset.issued)}{" "}
              </li>
            </ConditionalDisplay>
            {dataset.accessRights && (
              <li>
                {t("dataset.internalManagement.accessRights")} :{" "}
                <CodeDisplay codesList={clAccessRights} value={dataset.accessRights}></CodeDisplay>
              </li>
            )}
            {dataset.accrualPeriodicity && (
              <li>
                {t("dataset.globalInformation.updateFrequency")} :{" "}
                <CodeDisplay codesList={clFreq} value={dataset.accrualPeriodicity} />
              </li>
            )}
            {dataset.confidentialityStatus && (
              <li>
                {t("dataset.internalManagement.confidentialityStatus")} :{" "}
                <CodeDisplay
                  codesList={clConfStatus}
                  value={dataset.confidentialityStatus}
                ></CodeDisplay>
              </li>
            )}
            <ConditionalDisplay data={dataset.creators}>
              <li>
                {t("dataset.globalInformation.dataProvider")} :
                <Organisations creators={dataset.creators} organizations={organisations} />
              </li>
            </ConditionalDisplay>
            {dataset.publisher && (
              <li>
                {t("dataset.globalInformation.publicationProvider")} :{" "}
                <Organisation creator={dataset.publisher} organizations={organisations} />
              </li>
            )}
            <li>
              {t("dataset.internalManagement.generatedBy")} :{" "}
              <WasGeneratedByBlock iris={dataset.wasGeneratedIRIs}></WasGeneratedByBlock>
            </li>
            <ConditionalDisplay data={dataset.themes}>
              <li>
                {t("dataset.globalInformation.theme")} :{" "}
                <List
                  items={dataset.themes}
                  getContent={(value) => themesOptions?.find((t) => t.value === value)?.label ?? ""}
                ></List>
              </li>
            </ConditionalDisplay>
            {dataset.keywords?.lg1?.length > 0 && (
              <li>
                {t("dataset.globalInformation.keywords", { lng: "fr" })} (fr) :{" "}
                <List items={dataset.keywords.lg1}></List>
              </li>
            )}
            {dataset.keywords?.lg2?.length > 0 && (
              <li>
                {t("dataset.globalInformation.keywords", { lng: "en" })} (en) :{" "}
                <List items={dataset.keywords.lg2}></List>
              </li>
            )}
          </ul>
        }
        title={t("dataset.globalInformation.title")}
        alone={true}
      />
    </Row>
  );
};
