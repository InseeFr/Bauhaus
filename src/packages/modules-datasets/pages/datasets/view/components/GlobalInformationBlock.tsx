import { useTranslation } from "react-i18next";

import { Organization, Organizations } from "@components/business/organizations/organizations";
import { CodeDisplay } from "@components/code-display";
import { ConditionalDisplay } from "@components/data/conditional-display";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";
import { List } from "@components/ui/list";

import { Dataset } from "@model/Dataset";

import { stringToDate } from "@utils/date-utils";
import { useCodelist } from "@utils/hooks/codelist";
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

  const { data: organizations } = useOrganizations();

  const clAccessRights = useCodelist(CL_ACCESS_RIGHTS);
  const clFreq = useCodelist(CL_FREQ);
  const clConfStatus = useCodelist(CL_CONF_STATUS);

  if (!organizations) {
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
                <CodeDisplay codelist={clAccessRights} value={dataset.accessRights}></CodeDisplay>
              </li>
            )}
            {dataset.accrualPeriodicity && (
              <li>
                {t("dataset.globalInformation.updateFrequency")} :{" "}
                <CodeDisplay codelist={clFreq} value={dataset.accrualPeriodicity} />
              </li>
            )}
            {dataset.confidentialityStatus && (
              <li>
                {t("dataset.internalManagement.confidentialityStatus")} :{" "}
                <CodeDisplay
                  codelist={clConfStatus}
                  value={dataset.confidentialityStatus}
                ></CodeDisplay>
              </li>
            )}
            <ConditionalDisplay data={dataset.creators}>
              <li>
                {t("dataset.globalInformation.dataProvider")} :
                <Organizations creators={dataset.creators} organizations={organizations} />
              </li>
            </ConditionalDisplay>
            {dataset.publisher && (
              <li>
                {t("dataset.globalInformation.publicationProvider")} :{" "}
                <Organization creator={dataset.publisher} organizations={organizations} />
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
