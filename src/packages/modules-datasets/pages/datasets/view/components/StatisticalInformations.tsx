import { useTranslation } from "react-i18next";

import { CodeDisplay } from "@components/code-display";
import { ConditionalDisplay } from "@components/data/conditional-display";
import { Row } from "@components/layout";
import { Note } from "@components/note";

import { stringToDate } from "@utils/date-utils";
import { useCodesList } from "@utils/hooks/codeslist";

import { Dataset } from "../../../../../model/Dataset";
import {
  CL_DATA_TYPES,
  CL_FREQ,
  CL_GEO,
  CL_STAT_UNIT,
  CL_TYPE_GEO,
} from "../../../../../constants/code-lists";
import { DataStructure } from "./data-structure";

interface StatisticalInformationsTypes {
  dataset: Dataset;
}

export const StatisticalInformations = ({ dataset }: Readonly<StatisticalInformationsTypes>) => {
  const { t } = useTranslation();

  const clDataTypes = useCodesList(CL_DATA_TYPES);
  const clStatUnit = useCodesList(CL_STAT_UNIT);
  const clTypeGeo = useCodesList(CL_TYPE_GEO);
  const clGeo = useCodesList(CL_GEO);
  const clFreq = useCodesList(CL_FREQ);

  return (
    <Row>
      <Note
        text={
          <ul>
            {dataset.type && (
              <li>
                {t("dataset.statisticalInformation.type")} :{" "}
                <CodeDisplay codesList={clDataTypes} value={dataset.type}></CodeDisplay>
              </li>
            )}
            <ConditionalDisplay data={dataset.statisticalUnit}>
              <li>
                {t("dataset.statisticalInformation.statisticalUnits")} :{" "}
                <ul>
                  {dataset.statisticalUnit.map((unit) => (
                    <li key={unit}>
                      <CodeDisplay codesList={clStatUnit} value={unit}></CodeDisplay>
                    </li>
                  ))}
                </ul>
              </li>
            </ConditionalDisplay>
            {dataset.dataStructure && (
              <li>
                <DataStructure dataStructure={dataset.dataStructure} />
              </li>
            )}
            {dataset.temporalCoverageDataType && (
              <li>
                {t("dataset.statisticalInformation.temporalCoverage.title")} :{" "}
                {stringToDate(dataset.temporalCoverageStartDate)} -{" "}
                {stringToDate(dataset.temporalCoverageEndDate)}
              </li>
            )}
            {dataset.temporalResolution && (
              <li>
                {t("dataset.statisticalInformation.temporalResolution")} :{" "}
                <CodeDisplay codesList={clFreq} value={dataset.temporalResolution}></CodeDisplay>
              </li>
            )}
            {dataset.spacialCoverage && (
              <li>
                {t("dataset.statisticalInformation.spatialCoverage")} :{" "}
                <CodeDisplay codesList={clGeo} value={dataset.spacialCoverage}></CodeDisplay>
              </li>
            )}
            {dataset.spacialTemporal && (
              <li>
                {t("dataset.statisticalInformation.geographicalVintage")} :{" "}
                {stringToDate(dataset.spacialTemporal)}
              </li>
            )}
            <ConditionalDisplay data={dataset.spacialResolutions}>
              <li>
                {t("dataset.statisticalInformation.spatialResolution")} :{" "}
                <ul>
                  {dataset.spacialResolutions?.map((spacialResolution) => {
                    return (
                      <li key={spacialResolution}>
                        <CodeDisplay codesList={clTypeGeo} value={spacialResolution}></CodeDisplay>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ConditionalDisplay>
            {dataset.observationNumber > 0 && (
              <li>
                {t("dataset.statisticalInformation.numberOfObservations")} :{" "}
                {dataset.observationNumber}
              </li>
            )}
            {dataset.timeSeriesNumber > 0 && (
              <li>
                {t("dataset.statisticalInformation.numberOfTimeSeries")} :{" "}
                {dataset.timeSeriesNumber}
              </li>
            )}
          </ul>
        }
        title={t("dataset.statisticalInformation.title")}
        alone={true}
      />
    </Row>
  );
};
