import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { NumberInput } from "@components/form/input";
import { Select } from "@components/select-rmes";

const datasetsTemporalCoverageOptions = [
  {
    value: "http://www.w3.org/2001/XMLSchema#gYear",
    label: i18next.t("dataset.statisticalInformation.temporalCoverage.year"),
  },
  {
    value: "http://www.w3.org/2001/XMLSchema#date",
    label: i18next.t("dataset.statisticalInformation.temporalCoverage.date"),
  },
];

const formatYearTypeValue = (year: number | string) => new Date(`${year}-01-01`);

interface TemporalField {
  temporalCoverageStartDate: string;
  temporalCoverageEndDate: string;
  temporalCoverageDataType: string;
  updateTemporalCoverage: (value: {
    temporalCoverageStartDate: Date | string;
    temporalCoverageEndDate: Date | string;
    temporalCoverageDataType: string;
  }) => void;
}

export const TemporalField = ({
  temporalCoverageStartDate,
  temporalCoverageEndDate,
  temporalCoverageDataType,
  updateTemporalCoverage,
}: Readonly<TemporalField>) => {
  const { t } = useTranslation();

  const getDefaultValueForYearCoverageType = () => {
    return new Date().getFullYear();
  };

  const onTemporalCoverageChange = (value: string) => {
    if (value?.endsWith("date")) {
      updateTemporalCoverage({
        temporalCoverageStartDate: "",
        temporalCoverageEndDate: "",
        temporalCoverageDataType: value,
      });
    } else {
      updateTemporalCoverage({
        temporalCoverageStartDate: formatYearTypeValue(getDefaultValueForYearCoverageType()),
        temporalCoverageEndDate: formatYearTypeValue(getDefaultValueForYearCoverageType()),
        temporalCoverageDataType: value,
      });
    }
  };

  return (
    <>
      <div className="col-md-4 form-group">
        <label className="w-100 wilco-label-required">
          {t("dataset.statisticalInformation.temporalCoverage.title")}
          <Select
            value={temporalCoverageDataType}
            options={datasetsTemporalCoverageOptions}
            onChange={onTemporalCoverageChange}
          />
        </label>
      </div>
      {temporalCoverageDataType?.endsWith("date") && (
        <>
          <div className="col-md-4 form-group">
            <label className="w-100 wilco-label-required">
              {t("dataset.statisticalInformation.temporalCoverage.startDate")}
              <input
                type="date"
                className="form-control"
                value={temporalCoverageStartDate}
                onChange={(e) => {
                  updateTemporalCoverage({
                    temporalCoverageStartDate: e.target.value,
                    temporalCoverageEndDate,
                    temporalCoverageDataType,
                  });
                }}
              />
            </label>
          </div>
          <div className="col-md-4 form-group">
            <label className="w-100 wilco-label-required">
              {t("dataset.statisticalInformation.temporalCoverage.endDate")}
              <input
                type="date"
                className="form-control"
                value={temporalCoverageEndDate}
                onChange={(e) => {
                  updateTemporalCoverage({
                    temporalCoverageStartDate,
                    temporalCoverageEndDate: e.target.value,
                    temporalCoverageDataType,
                  });
                }}
              />
            </label>
          </div>
        </>
      )}
      {temporalCoverageDataType?.endsWith("Year") && (
        <>
          <div className="col-md-4 form-group">
            <label className="w-100 wilco-label-required">
              {t("dataset.statisticalInformation.temporalCoverage.startDate")}
              <NumberInput
                value={
                  temporalCoverageStartDate
                    ? new Date(temporalCoverageStartDate).getFullYear()
                    : getDefaultValueForYearCoverageType()
                }
                onChange={(e) => {
                  updateTemporalCoverage({
                    temporalCoverageEndDate: formatYearTypeValue(e.target.value),
                    temporalCoverageDataType,
                    temporalCoverageStartDate: formatYearTypeValue(e.target.value),
                  });
                }}
              />
            </label>
          </div>
          <div className="col-md-4 form-group">
            <label className="w-100 wilco-label-required">
              {t("dataset.statisticalInformation.temporalCoverage.endDate")}
              <NumberInput
                value={
                  temporalCoverageEndDate
                    ? new Date(temporalCoverageEndDate).getFullYear()
                    : getDefaultValueForYearCoverageType()
                }
                onChange={(e) => {
                  updateTemporalCoverage({
                    temporalCoverageStartDate: formatYearTypeValue(e.target.value),
                    temporalCoverageDataType,
                    temporalCoverageEndDate: formatYearTypeValue(e.target.value),
                  });
                }}
              />
            </label>
          </div>
        </>
      )}
    </>
  );
};
