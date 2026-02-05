import { useTranslation } from "react-i18next";

import { NumberInput } from "@components/form/input";
import { Row } from "@components/layout";
import { Select } from "@components/select-rmes";

import { withCodesLists } from "@utils/hoc/withCodesLists";

import {
  CL_DATA_TYPES,
  CL_FREQ,
  CL_GEO,
  CL_STAT_UNIT,
  CL_TYPE_GEO,
} from "../../../../../constants/code-lists";
import { convertCodesListsToSelectOption } from "../../../../utils/codelist-to-select-options";
import { TemporalField } from "./temporalField";
import { DataStructure } from "./data-structure";

const StatisticalInformationTab = ({ editingDataset, setEditingDataset, ...props }) => {
  const { t } = useTranslation();

  const clDataTypes = convertCodesListsToSelectOption(props[CL_DATA_TYPES]);

  const clStatUnit = convertCodesListsToSelectOption(props[CL_STAT_UNIT]);

  const clFreqOptions = convertCodesListsToSelectOption(props[CL_FREQ]);

  const clGeo = convertCodesListsToSelectOption(props[CL_GEO]);

  const clGeoType = convertCodesListsToSelectOption(props[CL_TYPE_GEO]);

  return (
    <>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {t("dataset.statisticalInformation.type")}
            <Select
              value={editingDataset.type}
              options={clDataTypes}
              onChange={(value) => {
                setEditingDataset({
                  ...editingDataset,
                  type: value,
                });
              }}
            />
          </label>
        </div>
      </Row>
      <Row>
        <DataStructure
          value={editingDataset.dataStructure}
          onChange={(value) => {
            setEditingDataset({
              ...editingDataset,
              dataStructure: value,
            });
          }}
        />
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {t("dataset.statisticalInformation.statisticalUnits")}
            <Select
              value={editingDataset.statisticalUnit}
              multi
              options={clStatUnit}
              onChange={(values) => {
                setEditingDataset({
                  ...editingDataset,
                  statisticalUnit: values,
                });
              }}
            />
          </label>
        </div>
      </Row>
      <Row>
        <TemporalField
          temporalCoverageDataType={editingDataset.temporalCoverageDataType}
          temporalCoverageStartDate={editingDataset.temporalCoverageStartDate}
          temporalCoverageEndDate={editingDataset.temporalCoverageEndDate}
          updateTemporalCoverage={(temporalCoverage) => {
            setEditingDataset({
              ...editingDataset,
              ...temporalCoverage,
            });
          }}
        />
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {t("dataset.statisticalInformation.temporalResolution")}
            <Select
              value={editingDataset.temporalResolution}
              options={clFreqOptions}
              onChange={(value) => {
                setEditingDataset({
                  ...editingDataset,
                  temporalResolution: value,
                });
              }}
            />
          </label>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {t("dataset.statisticalInformation.spatialCoverage")}
            <Select
              value={editingDataset.spacialCoverage}
              options={clGeo}
              onChange={(value) => {
                setEditingDataset({
                  ...editingDataset,
                  spacialCoverage: value,
                });
              }}
            />
          </label>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {t("dataset.statisticalInformation.geographicalVintage")}
            <input
              type="date"
              className="form-control"
              value={editingDataset.spacialTemporal}
              onChange={(e) => {
                setEditingDataset({
                  ...editingDataset,
                  spacialTemporal: e.target.value,
                });
              }}
            />
          </label>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 form-group">
          <label className="w-100 wilco-label-required">
            {t("dataset.statisticalInformation.spatialResolution")}
            <Select
              value={editingDataset.spacialResolutions}
              options={clGeoType}
              multi
              onChange={(values) => {
                setEditingDataset({
                  ...editingDataset,
                  spacialResolutions: values,
                });
              }}
            />
          </label>
        </div>
      </Row>
      <Row>
        <div className="col-md-12 from-group ">
          <label htmlFor="observationNumber">
            {t("dataset.statisticalInformation.numberOfObservations")}
          </label>
          <NumberInput
            id="observationNumber"
            value={editingDataset.observationNumber}
            onChange={(e) => {
              setEditingDataset({
                ...editingDataset,
                observationNumber: e.target.value,
              });
            }}
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-12 from-group ">
          <label htmlFor="timeSeriesNumber">
            {t("dataset.statisticalInformation.numberOfTimeSeries")}
          </label>
          <NumberInput
            id="timeSeriesNumber"
            value={editingDataset.timeSeriesNumber}
            onChange={(e) => {
              setEditingDataset({
                ...editingDataset,
                timeSeriesNumber: e.target.value,
              });
            }}
          />
        </div>
      </Row>
    </>
  );
};

export const StatisticalInformation = withCodesLists([
  CL_DATA_TYPES,
  CL_STAT_UNIT,
  CL_FREQ,
  CL_GEO,
  CL_TYPE_GEO,
])(StatisticalInformationTab);
